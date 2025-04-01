import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Search, Download } from 'lucide-react';
import ColumnVisibilityDropdown from './ColumnVisibilityDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
type SortDirectionType = 'asc' | 'desc' | null;
const AuditTable: React.FC<AuditTableProps> = ({
  data,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('claimNumber');
  const [sortDirection, setSortDirection] = useState<SortDirectionType>('asc');
  const {
    user
  } = useAuth();
  const role = user?.role as UserRole;
  const itemsPerPage = 10;

  // Get all possible columns based on role
  const allColumns = useMemo(() => {
    const commonColumns = [{
      key: 'claimNumber',
      title: 'Claim Number'
    }, {
      key: 'claimDate',
      title: 'Claim Date'
    }, {
      key: 'hospitalName',
      title: 'Hospital Name'
    }, {
      key: 'hospitalLocation',
      title: 'Hospital Location'
    }, {
      key: 'htpaLocation',
      title: 'HTPA Location'
    }, {
      key: 'dateOfAdmission',
      title: 'Date of Admission'
    }, {
      key: 'dateOfDischarge',
      title: 'Date of Discharge'
    }, {
      key: 'fraudTriggers',
      title: 'Fraud Triggers'
    }, {
      key: 'fieldInvestigationDate',
      title: 'Field Investigation Date'
    }, {
      key: 'claimStatus',
      title: 'Claim Status'
    }, {
      key: 'status',
      title: 'Status'
    }, {
      key: 'deskAuditReferralDate',
      title: 'Desk Audit Referral Date'
    }, {
      key: 'taTCompliance',
      title: 'TA T Compliance'
    }, {
      key: 'claimIntimationAging',
      title: 'Claim Intimation Aging'
    }, {
      key: 'aiManualTrigger',
      title: 'AI/Manual Trigger'
    }];
    if (role === 'ro_admin' || role === 'ho_admin') {
      return [...commonColumns, {
        key: 'allocation',
        title: 'Allocation'
      }, {
        key: 'fieldReport',
        title: 'Field Report'
      }];
    }
    return [...commonColumns, {
      key: 'fieldReport',
      title: 'Field Report'
    }];
  }, [role]);

  // Default visible columns - show a subset initially to reduce horizontal scrolling
  const defaultVisibleColumns = useMemo(() => {
    const initialVisible = {
      claimNumber: true,
      claimDate: true,
      hospitalName: true,
      status: true,
      fieldReport: true
    };
    if (role === 'ro_admin' || role === 'ho_admin') {
      initialVisible['allocation'] = true;
    }
    return Object.fromEntries(allColumns.map(col => [col.key, initialVisible[col.key as keyof typeof initialVisible] || false]));
  }, [allColumns, role]);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(defaultVisibleColumns);

  // Reset table state when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Apply search filter to data
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const searchTerm = search.toLowerCase();
    return data.filter(item => item.claimNumber.toLowerCase().includes(searchTerm) || item.hospitalName.toLowerCase().includes(searchTerm) || item.status.toLowerCase().includes(searchTerm));
  }, [data, search]);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (!a[sortColumn as keyof AuditData] || !b[sortColumn as keyof AuditData]) return 0;
      const valueA = a[sortColumn as keyof AuditData].toString().toLowerCase();
      const valueB = b[sortColumn as keyof AuditData].toString().toLowerCase();
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null -> asc
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
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

  // Get only the visible columns to display
  const displayColumns = allColumns.filter(col => visibleColumns[col.key]);

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) {
      return <div className="opacity-40 ml-1 inline-flex flex-col">
        <ArrowUp size={10} className="mb-[-3px]" />
        <ArrowDown size={10} className="mt-[-3px]" />
      </div>;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp size={14} className="ml-1 inline text-blue-600" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown size={14} className="ml-1 inline text-blue-600" />;
    }
    return <div className="opacity-50 ml-1 inline-flex flex-col">
      <ArrowUp size={10} className="mb-[-3px]" />
      <ArrowDown size={10} className="mt-[-3px]" />
    </div>;
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-status-completed text-status-completed-text";
      case 'pending':
        return "bg-status-pending text-status-pending-text";
      case 'desk audit':
        return "bg-status-desk-audit text-status-desk-audit-text";
      case 'claim processing':
        return "bg-status-claim-processing text-status-claim-processing-text";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return <div className="w-full">
      {loading ? <div className="flex justify-center items-center h-28">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
        </div> : <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 pb-3 gap-2 border-b">
            <div className="relative w-full sm:w-[240px]">
              <Search size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input type="text" placeholder="Search claims..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs w-full" />
            </div>
            <ColumnVisibilityDropdown columns={allColumns} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
          </div>
          
          <div className="overflow-x-auto">
            <Table className="text-xs border-collapse table-auto w-full font-inter">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {displayColumns.map(column => <TableHead key={column.key} onClick={() => handleSortChange(column.key)} className="whitespace-nowrap font-semibold text-xs py-2 cursor-pointer mx-[3px] my-[3px] bg-gray-400 rounded-lg">
                      <div className="flex items-center">
                        {column.title}
                        {renderSortIndicator(column.key)}
                      </div>
                    </TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? currentItems.map(item => <TableRow key={item.id} className="h-8 hover:bg-gray-50">
                      {displayColumns.map(column => {
                if (column.key === 'allocation' && (role === 'ro_admin' || role === 'ho_admin')) {
                  return <TableCell key={`${item.id}-${column.key}`} className="py-1">
                              <Select defaultValue={item.allocation} onValueChange={value => handleAllocationChange(item.id, value)}>
                                <SelectTrigger className="w-[120px] h-6 text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ro_admin_1">RO Admin 1</SelectItem>
                                  <SelectItem value="ro_admin_2">RO Admin 2</SelectItem>
                                  <SelectItem value="ro_admin_3">RO Admin 3</SelectItem>
                                  <SelectItem value="desk_auditor_1">Desk Auditor 1</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>;
                }
                if (column.key === 'fieldReport') {
                  return <TableCell key={`${item.id}-${column.key}`} className="py-1">
                              <Button size="sm" className={cn("text-white text-xs px-2 py-0 h-6 gap-1", item.status === 'Pending' ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500")}>
                                <Download size={12} />
                                Download
                              </Button>
                            </TableCell>;
                }
                if (column.key === 'status') {
                  return <TableCell key={`${item.id}-${column.key}`} className="py-1">
                              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getStatusBadgeClass(item.status))}>
                                {item.status}
                              </span>
                            </TableCell>;
                }
                if (column.key === 'claimNumber') {
                  return <TableCell key={`${item.id}-${column.key}`} className="text-xs whitespace-nowrap py-1 text-blue-600 font-medium">
                              {item[column.key as keyof AuditData]}
                            </TableCell>;
                }
                return <TableCell key={`${item.id}-${column.key}`} className="text-xs whitespace-nowrap py-1">
                            {item[column.key as keyof AuditData]}
                          </TableCell>;
              })}
                    </TableRow>) : <TableRow>
                    <TableCell colSpan={displayColumns.length} className="h-32 text-center">
                      No results found
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 0 && <div className="py-2 px-2 flex justify-between items-center border-t">
              <div className="text-xs text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className={cn(currentPage === 1 && "pointer-events-none opacity-50", "text-xs h-7")} />
                  </PaginationItem>
                  
                  {renderPaginationNumbers().map((pageNum, index) => {
              if (pageNum < 0) {
                return <PaginationItem key={`ellipsis-${index}`}>
                          <span className="px-1 text-xs">...</span>
                        </PaginationItem>;
              }
              return <PaginationItem key={pageNum}>
                        <PaginationLink isActive={currentPage === pageNum} onClick={() => handlePageChange(pageNum)} className="text-xs h-7 w-7">
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>;
            })}
                  
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className={cn(currentPage === totalPages && "pointer-events-none opacity-50", "text-xs h-7")} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </>}
    </div>;
};
export default AuditTable;