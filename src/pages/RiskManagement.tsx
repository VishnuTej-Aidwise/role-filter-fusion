
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth, UserRole } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import RulesTable from '../components/RulesTable';
import RulesFilter from '../components/RulesFilter';
import { mockRiskRules, RiskRule, categories } from '../utils/mockRiskData';

interface RiskManagementParams {
  role: UserRole;
}

// Create more mock data for pagination
const generateMoreMockData = () => {
  const additionalData: RiskRule[] = [];
  const baseData = [...mockRiskRules];
  
  // Generate 90 more items for a total of ~100 items
  for (let i = 0; i < 90; i++) {
    const baseItem = baseData[i % baseData.length];
    additionalData.push({
      ...baseItem,
      id: `extra-${i + 1}`,
      name: `${baseItem.name} (Copy ${i + 1})`,
      description: `${baseItem.description} - Additional item ${i + 1}`
    });
  }
  
  return [...baseData, ...additionalData];
};

const extendedMockData = generateMoreMockData();

const RiskManagement: React.FC = () => {
  const { role } = useParams<{ role: string }>() as { role: UserRole };
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(extendedMockData);
  const [filteredData, setFilteredData] = useState<RiskRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(extendedMockData.length);

  // Listen for sidebar expansion/collapse
  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('[class*="w-64"]');
      setSidebarExpanded(!!sidebar);
    };
    
    const observer = new MutationObserver(handleSidebarChange);
    const sidebarElement = document.querySelector('div[class*="flex flex-col h-screen fixed"]');
    
    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => observer.disconnect();
  }, []);

  // Apply pagination
  useEffect(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setFilteredData(data.slice(start, end));
  }, [pagination.page, pagination.pageSize, data]);

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
    
    // Reset to first page
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    // Apply filters
    let filtered = [...extendedMockData];
    
    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    if (filters.subCategory && filters.subCategory !== 'All') {
      filtered = filtered.filter(item => item.subCategory === filters.subCategory);
    }
    
    if (filters.trigger && filters.trigger !== 'All') {
      filtered = filtered.filter(item => item.trigger === filters.trigger);
    }
    
    setData(filtered);
    setTotalItems(filtered.length);
    setLoading(false);
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

  const handleRuleSelection = (id: string, isChecked: boolean) => {
    setSelectedRules(prev => 
      isChecked 
        ? [...prev, id] 
        : prev.filter(ruleId => ruleId !== id)
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedRules(isChecked ? filteredData.map(rule => rule.id) : []);
  };

  const handleSetActive = () => {
    if (selectedRules.length === 0) {
      toast.warning("Please select at least one rule");
      return;
    }
    
    // Fix: Use proper type for status
    const updatedData = data.map(rule => 
      selectedRules.includes(rule.id) 
        ? { ...rule, status: "Active" as const } 
        : rule
    );
    
    setData(updatedData);
    toast.success(`${selectedRules.length} rules set to active`);
    setSelectedRules([]);
  };

  const handleSetInactive = () => {
    if (selectedRules.length === 0) {
      toast.warning("Please select at least one rule");
      return;
    }
    
    // Fix: Use proper type for status
    const updatedData = data.map(rule => 
      selectedRules.includes(rule.id) 
        ? { ...rule, status: "Inactive" as const } 
        : rule
    );
    
    setData(updatedData);
    toast.success(`${selectedRules.length} rules set to inactive`);
    setSelectedRules([]);
  };

  const handleExport = () => {
    toast.success("Exporting data...");
    // In a real app, this would generate and download a CSV/Excel
  };

  const handleDateChange = (id: string, field: 'ruleStartDate' | 'ruleEndDate', value: string) => {
    const updatedData = data.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    );
    setData(updatedData);
  };

  const handleStatusToggle = (id: string) => {
    const ruleToUpdate = data.find(rule => rule.id === id);
    if (!ruleToUpdate) return;

    // Fix: Use proper type for status
    const newStatus: "Active" | "Inactive" | "Review" = ruleToUpdate.status === "Active" ? "Inactive" : "Active";
    
    const updatedData = data.map(rule =>
      rule.id === id ? { ...rule, status: newStatus } : rule
    );
    
    setData(updatedData);
    toast.success(`Rule "${ruleToUpdate.name}" status updated to ${newStatus}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className={`flex-1 overflow-hidden transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-[50px]'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
            <h1 className="text-base font-semibold text-gray-800 mb-3">
              Rules Management
            </h1>
            
            <RulesFilter onFilter={handleFilter} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden">
            <div className="p-3">
              <div className="flex justify-end space-x-2 mb-3">
                <button 
                  onClick={handleSetActive}
                  disabled={selectedRules.length === 0}
                  className={`flex items-center px-2 py-1 rounded-md text-white text-xs ${selectedRules.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  <span className="flex h-3 w-3 mr-1 bg-green-300 rounded-full"></span> Set Active
                </button>
                <button 
                  onClick={handleSetInactive}
                  disabled={selectedRules.length === 0}
                  className={`flex items-center px-2 py-1 rounded-md text-white text-xs ${selectedRules.length > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  <span className="flex h-3 w-3 mr-1 bg-red-300 rounded-full"></span> Set Inactive
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center px-2 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600 text-xs"
                >
                  <span className="mr-1">↓</span> Export As
                </button>
              </div>
              
              <RulesTable 
                data={filteredData}
                loading={loading}
                selectedRules={selectedRules}
                onRuleSelection={handleRuleSelection}
                onSelectAll={handleSelectAll}
                onStatusToggle={handleStatusToggle}
                onDateChange={handleDateChange}
                paginationProps={{
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
    </div>
  );
};

export default RiskManagement;
