
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

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

interface AuditTableProps {
  data: AuditData[];
  loading?: boolean;
}

const AuditTable: React.FC<AuditTableProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const role = user?.role as UserRole;
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);
  
  const getColumnsByRole = () => {
    const commonColumns = [
      { key: 'claimNumber', title: 'Claim Number' },
      { key: 'claimDate', title: 'Claim Date' },
      { key: 'hospitalName', title: 'Hospital Name' },
      { key: 'hospitalLocation', title: 'Hospital Location' },
      { key: 'htpaLocation', title: 'HTPA Location' },
      { key: 'dateOfAdmission', title: 'Date of Admission' },
      { key: 'dateOfDischarge', title: 'Date of Discharge' },
      { key: 'fraudTriggers', title: 'Fraud Triggers' },
      { key: 'fieldInvestigationDate', title: 'Field Investigation Date' },
      { key: 'claimStatus', title: 'Claim Status' },
      { key: 'status', title: 'Status' },
      { key: 'deskAuditReferralDate', title: 'Desk Audit Referral Date' },
      { key: 'taTCompliance', title: 'TA T Compliance (Days/Hours)' },
      { key: 'claimIntimationAging', title: 'Claim Intimation Aging (Days/Hours)' },
      { key: 'aiManualTrigger', title: 'AI/ Manual Trigger' }
    ];
    
    if (role === 'ro_admin' || role === 'ho_admin') {
      return [
        ...commonColumns,
        { key: 'allocation', title: 'Allocation' },
        { key: 'fieldReport', title: 'Field Report' }
      ];
    }
    
    return [
      ...commonColumns,
      { key: 'fieldReport', title: 'Field Report' }
    ];
  };
  
  const columns = getColumnsByRole();
  
  const handleAllocationChange = (id: string, value: string) => {
    console.log(`Allocation changed for ${id} to ${value}`);
    // In a real app, you'd update this in your state or backend
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
        </div>
      ) : (
        <>
          <table className="audit-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => {
                    if (column.key === 'allocation' && (role === 'ro_admin' || role === 'ho_admin')) {
                      return (
                        <td key={`${item.id}-${column.key}`}>
                          <Select 
                            defaultValue={item.allocation} 
                            onValueChange={(value) => handleAllocationChange(item.id, value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ro_admin_1">RO Admin 1</SelectItem>
                              <SelectItem value="ro_admin_2">RO Admin 2</SelectItem>
                              <SelectItem value="ro_admin_3">RO Admin 3</SelectItem>
                              <SelectItem value="desk_auditor_1">Desk Auditor 1</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      );
                    }
                    
                    if (column.key === 'fieldReport') {
                      return (
                        <td key={`${item.id}-${column.key}`}>
                          <Button className={cn(
                            "text-white text-sm px-3 py-1",
                            item.status === 'Pending' ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
                          )}>
                            Download Report
                          </Button>
                        </td>
                      );
                    }
                    
                    return (
                      <td key={`${item.id}-${column.key}`}>
                        {item[column.key as keyof AuditData]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="table-pagination mt-4">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <div
                  key={i + 1}
                  className={cn(
                    "pagination-number",
                    currentPage === i + 1 ? "active" : "hover:bg-gray-100"
                  )}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </div>
              ))}
              
              {totalPages > 5 && (
                <>
                  <div className="pagination-number">...</div>
                  <div 
                    className="pagination-number hover:bg-gray-100"
                    onClick={() => handlePageChange(8)}
                  >
                    8
                  </div>
                  <div 
                    className="pagination-number hover:bg-gray-100"
                    onClick={() => handlePageChange(9)}
                  >
                    9
                  </div>
                  <div 
                    className="pagination-number hover:bg-gray-100"
                    onClick={() => handlePageChange(10)}
                  >
                    10
                  </div>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditTable;
