
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  
  const itemsPerPage = 10;
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
    <div className="w-full overflow-auto">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-navy"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className="whitespace-nowrap font-semibold text-sm">
                      {column.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => {
                      if (column.key === 'allocation' && (role === 'ro_admin' || role === 'ho_admin')) {
                        return (
                          <TableCell key={`${item.id}-${column.key}`}>
                            <Select 
                              defaultValue={item.allocation} 
                              onValueChange={(value) => handleAllocationChange(item.id, value)}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ro_admin_1">RO Admin 1</SelectItem>
                                <SelectItem value="ro_admin_2">RO Admin 2</SelectItem>
                                <SelectItem value="ro_admin_3">RO Admin 3</SelectItem>
                                <SelectItem value="desk_auditor_1">Desk Auditor 1</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        );
                      }
                      
                      if (column.key === 'fieldReport') {
                        return (
                          <TableCell key={`${item.id}-${column.key}`}>
                            <Button 
                              size="sm" 
                              className={cn(
                                "text-white text-xs px-3 py-1 h-8",
                                item.status === 'Pending' ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
                              )}
                            >
                              Download Report
                            </Button>
                          </TableCell>
                        );
                      }
                      
                      return (
                        <TableCell key={`${item.id}-${column.key}`} className="text-sm whitespace-nowrap">
                          {item[column.key as keyof AuditData]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="py-4 px-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  // Only show 5 page numbers at most
                  if (
                    i === 0 || // First page
                    i === totalPages - 1 || // Last page
                    (i >= currentPage - 2 && i <= currentPage + 0) // Current page and 2 before, 0 after
                  ) {
                    return (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditTable;
