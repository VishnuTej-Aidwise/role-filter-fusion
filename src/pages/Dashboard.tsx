
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth, UserRole } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import HeaderFilters from '../components/HeaderFilters';
import AuditTable from '../components/AuditTable';
import { mockAuditData } from '../utils/mockData';

interface DashboardParams {
  role: UserRole;
}

const Dashboard: React.FC = () => {
  const { role } = useParams<{ role: string }>() as { role: UserRole };
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(mockAuditData);
  const [filteredData, setFilteredData] = useState(mockAuditData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setData(mockAuditData);
      setFilteredData(mockAuditData);
      setLoading(false);
    }, 500);
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
    
    // Simulate filtering data
    setTimeout(() => {
      console.log('Applied filters:', filters);
      // In a real app, you would filter the data based on the filters
      // For demo purposes, we'll just show all data
      setFilteredData(data);
      setLoading(false);
    }, 500);
  };

  const handleExport = () => {
    toast.success('Exporting data to Excel...');
    // In a real app, you would generate and download an Excel file
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
      
      <div className="flex-1 overflow-hidden transition-all duration-300 ml-[50px] md:ml-64">
        <div className="p-3 md:p-4 h-full flex flex-col">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h1 className="text-xl font-bold text-gray-800 mb-4">
              {getDashboardTitle()}
            </h1>
            
            <HeaderFilters onFilter={handleFilter} onExport={handleExport} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
            <AuditTable data={filteredData} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
