
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth, UserRole } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import HeaderFilters from '../components/HeaderFilters';
import AuditTable from '../components/AuditTable';
import { fetchDeskAudits, DeskAuditParams, DeskAuditItem } from '../services/api/auditService';
import { format } from 'date-fns';

interface DashboardParams {
  role: UserRole;
}

const Dashboard: React.FC = () => {
  const { role } = useParams<{ role: string }>() as { role: UserRole };
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DeskAuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    triggerType: string;
  }>({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    triggerType: 'Ai', // Default trigger type
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params: DeskAuditParams = {
        start_date: filters.startDate,
        end_date: filters.endDate,
        trigger_type: filters.triggerType,
        page_no: pagination.page,
        page_size: pagination.pageSize
      };
      
      const response = await fetchDeskAudits(params);
      
      setData(response.data);
      setTotalItems(response.total || response.data.length);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch audit data');
      setLoading(false);
      setData([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [pagination.page, pagination.pageSize, isAuthenticated]);

  useEffect(() => {
    // Listen for sidebar expansion/collapse
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('[class*="w-64"]');
      setSidebarExpanded(!!sidebar);
    };
    
    // Create a MutationObserver to detect class changes on the sidebar
    const observer = new MutationObserver(handleSidebarChange);
    const sidebarElement = document.querySelector('div[class*="flex flex-col h-screen fixed"]');
    
    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => observer.disconnect();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Make sure user can only access their role's dashboard
  if (user?.role !== role) {
    toast.error(`You don't have permission to access the ${role} dashboard`);
    return <Navigate to={`/dashboard/${user?.role}`} />;
  }

  const handleFilter = (filters: any) => {
    setLoading(true);
    
    // Update filters state with the new values
    setFilters({
      startDate: filters.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: filters.endDate || format(new Date(), 'yyyy-MM-dd'),
      triggerType: filters.triggerType || 'Ai'
    });
    
    // Reset pagination to first page
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    // Fetch data with updated filters
    fetchData();
  };

  const handleExport = () => {
    toast.success('Exporting data to Excel...');
    // In a real app, you would generate and download an Excel file
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({
      page: 1, // Reset to first page when changing page size
      pageSize
    });
  };

  // Generate title based on role
  const getDashboardTitle = () => {
    switch (role) {
      case 'ro_admin':
        return 'Desk Audit Module - RO Admin';
      case 'ho_admin':
        return 'Desk Audit Module - HO Admin';
      case 'desk_auditor':
        return 'Desk Audit Module - Desk Audit';
      default:
        return 'Desk Audit Module';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex-1 overflow-hidden transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-[50px]'}`}>
        <div className="p-2 h-full flex flex-col">
          <div className="bg-white rounded-lg shadow-sm p-2 mb-2">
            <h1 className="text-lg font-bold text-gray-800 mb-1">
              {getDashboardTitle()}
            </h1>
            
            <HeaderFilters 
              onFilter={handleFilter} 
              onExport={handleExport}
              defaultFilters={{
                startDate: filters.startDate,
                endDate: filters.endDate,
                triggerType: filters.triggerType
              }}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
            <AuditTable 
              data={data} 
              loading={loading} 
              pagination={{
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: totalItems,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
