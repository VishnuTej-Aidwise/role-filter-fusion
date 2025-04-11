
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth, UserRole } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import HeaderFilters from '../components/HeaderFilters';
import AuditTable from '../components/AuditTable';
import FilterPanel from '../components/FilterPanel';
import { mockAuditData } from '../utils/mockData';

interface DashboardParams {
  role: UserRole;
}

const Dashboard: React.FC = () => {
  const { role } = useParams<{ role: string }>() as { role: UserRole };
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(mockAuditData);
  const [loading, setLoading] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [totalItems, setTotalItems] = useState(mockAuditData.length);
  const [subUsers, setSubUsers] = useState<any[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    triggerType: string;
  }>({
    startDate: '2023-01-01', 
    endDate: '2024-01-01',
    triggerType: 'Ai',
  });

  // Mock fetch sub-users
  const fetchUsersByRole = async () => {
    if (role === 'ro_admin' || role === 'ho_admin') {
      const mockSubUsers = [
        { id: 1, name: 'User 1', role: 'desk_auditor' },
        { id: 2, name: 'User 2', role: 'desk_auditor' },
        { id: 3, name: 'User 3', role: 'desk_auditor' }
      ];
      setSubUsers(mockSubUsers);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsersByRole();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Simulate pagination
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setData(mockAuditData.slice(start, end));
  }, [pagination.page, pagination.pageSize]);

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
      startDate: filters.startDate || '2023-01-01',
      endDate: filters.endDate || '2024-01-01',
      triggerType: filters.triggerType || 'Ai'
    });
    
    // Reset pagination to first page
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    // Mock filtering - in a real app this would filter the data
    setTimeout(() => {
      // Filter by trigger type if applicable
      let filtered = [...mockAuditData];
      if (filters.triggerType && filters.triggerType !== 'All') {
        filtered = filtered.filter(item => 
          item.aiManualTrigger.toLowerCase() === filters.triggerType.toLowerCase()
        );
      }
      
      setData(filtered.slice(0, pagination.pageSize));
      setTotalItems(filtered.length);
      setLoading(false);
    }, 500);
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
  
  const handleAdvancedFilter = () => {
    setIsFilterPanelOpen(true);
  };

  const handleApplyAdvancedFilters = (advancedFilters: any) => {
    // Apply advanced filters here
    toast.success('Applied advanced filters');
    setIsFilterPanelOpen(false);
    // In a real app, you would update the fetch params with these filters
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
              onAdvancedFilter={handleAdvancedFilter}
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
              paginationProps={{
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: totalItems,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange
              }}
              subUsers={subUsers}
              userRole={role}
            />
          </div>
        </div>
      </div>
      
      <FilterPanel 
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyAdvancedFilters}
      />
    </div>
  );
};

export default Dashboard;
