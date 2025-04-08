
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

// Updated AuditData to match the DeskAuditItem interface structure from API
interface AuditData {
  id: string;
  claimNumber: string;
  claimDate: string;
  hospitalName: string;
  hospitalLocation: string;
  htpaLocation: string;
  dateOfAdmission: string;
  dateOfDischarge: string;
  fraudTriggers: string;
  fieldInvestigationDate: string;
  claimStatus: string;
  status: string;
  deskAuditReferralDate: string;
  taTCompliance: string;
  claimIntimationAging: string;
  aiManualTrigger: string;
  allocation?: string;
  fieldReport: string;
}

const Dashboard: React.FC = () => {
  const { role } = useParams<{ role: string }>() as { role: UserRole };
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<AuditData[]>([]);
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
      
      // Map API response to AuditData format
      const mappedData: AuditData[] = response.data.map(item => ({
        id: item.id,
        claimNumber: item.claim_number,
        claimDate: item.created_at.split('T')[0], // Assuming created_at contains claim date
        hospitalName: item.hospital_name,
        hospitalLocation: '', // Not available in API response
        htpaLocation: '', // Not available in API response
        dateOfAdmission: item.admission_date,
        dateOfDischarge: item.discharge_date,
        fraudTriggers: '', // Not available in API response
        fieldInvestigationDate: '', // Not available in API response
        claimStatus: '', // Not available in API response
        status: item.status,
        deskAuditReferralDate: '', // Not available in API response
        taTCompliance: '', // Not available in API response
        claimIntimationAging: '', // Not available in API response
        aiManualTrigger: item.trigger_type,
        allocation: '', // Will be populated from another API call if needed
        fieldReport: '' // Not available in API response
      }));
      
      setData(mappedData);
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
