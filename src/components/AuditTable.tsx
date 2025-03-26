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
  
  const handleAllocationChange = (id: string, value: string) => {
    console.log(`Allocation changed for ${id} to ${value}`);
    // In a real app, you'd update this in your state or backend
  };

  const renderPaginationNumbers = () => {
    let pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) {
        pages.push(-1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push(-2);
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

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
  
  return (
    <div className="w-full overflow-auto">
      {loading ? (
        <div className="flex justify-center items-center h-36">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-navy"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className="whitespace-nowrap font-semibold text-xs py-2">
                      {column.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item) => (
                  <TableRow key={item.id} className="h-9">
                    {columns.map((column) => {
                      if (column.key === 'allocation' && (role === 'ro_admin' || role === 'ho_admin')) {
                        return (
                          <TableCell key={`${item.id}-${column.key}`} className="py-1">
                            <Select 
                              defaultValue={item.allocation} 
                              onValueChange={(value) => handleAllocationChange(item.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-7 text-xs">
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
                          <TableCell key={`${item.id}-${column.key}`} className="py-1">
                            <Button 
                              size="sm" 
                              className={cn(
                                "text-white text-xs px-2 py-0 h-7",
                                item.status === 'Pending' ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
                              )}
                            >
                              Download
                            </Button>
                          </TableCell>
                        );
                      }
                      
                      return (
                        <TableCell key={`${item.id}-${column.key}`} className="text-xs whitespace-nowrap py-1">
                          {item[column.key as keyof AuditData]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="py-2 px-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                
                {renderPaginationNumbers().map((pageNum, index) => {
                  if (pageNum < 0) {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
