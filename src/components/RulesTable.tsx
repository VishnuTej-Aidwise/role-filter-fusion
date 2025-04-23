
import React, { useState } from 'react';
import { RiskRule } from '../utils/mockRiskData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RulesTableProps {
  data: RiskRule[];
  loading: boolean;
  selectedRules: string[];
  onRuleSelection: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onStatusToggle: (id: string) => void;
  onDateChange: (id: string, field: 'ruleStartDate' | 'ruleEndDate', value: string) => void;
  paginationProps: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Inactive':
      return 'bg-red-100 text-red-800';
    case 'Review':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RulesTable: React.FC<RulesTableProps> = ({ 
  data, 
  loading, 
  selectedRules, 
  onRuleSelection, 
  onSelectAll, 
  onStatusToggle,
  onDateChange,
  paginationProps 
}) => {
  const [ruleToToggle, setRuleToToggle] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const isAllSelected = data.length > 0 && data.every(rule => selectedRules.includes(rule.id));

  const handleToggleStatus = (id: string) => {
    setRuleToToggle(id);
    setConfirmDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (ruleToToggle) {
      onStatusToggle(ruleToToggle);
      setRuleToToggle(null);
    }
    setConfirmDialogOpen(false);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(paginationProps.total / paginationProps.pageSize);
    const currentPage = paginationProps.page;
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis1');
    }
    
    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis2');
    }
    
    // Add last page if it exists
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-500">No rules found</div>;
  }

  return (
    <>
      <div className="h-[calc(100vh-180px)] w-full">
        <ScrollArea className="h-full w-full">
          <div className="w-full overflow-x-auto min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 sticky top-0 bg-blue-500 text-white text-xs">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
                    />
                  </TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Trigger</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Rule Name</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Rule Description</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Category</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Sub Category</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Status</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Rule Start Date</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Rule End Date</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Activation Date</TableHead>
                  <TableHead className="sticky top-0 bg-blue-500 text-white text-xs">Deactivation Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-gray-50">
                    <TableCell className="text-center py-1">
                      <Checkbox 
                        checked={selectedRules.includes(rule.id)}
                        onCheckedChange={(checked) => onRuleSelection(rule.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-xs py-1">{rule.trigger}</TableCell>
                    <TableCell className="text-xs py-1">{rule.name}</TableCell>
                    <TableCell className="text-xs py-1">{rule.description}</TableCell>
                    <TableCell className="text-xs py-1">{rule.category}</TableCell>
                    <TableCell className="text-xs py-1">{rule.subCategory}</TableCell>
                    <TableCell className="text-center py-1">
                      <div className="flex items-center justify-center space-x-2">
                        <Switch 
                          checked={rule.status === 'Active'} 
                          onCheckedChange={() => handleToggleStatus(rule.id)}
                        />
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(rule.status)}`}>
                          {rule.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-1">
                      <input 
                        type="date" 
                        className="border rounded px-1 py-0.5 text-xs w-28"
                        value={rule.ruleStartDate}
                        onChange={(e) => onDateChange(rule.id, 'ruleStartDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center py-1">
                      <input 
                        type="date" 
                        className="border rounded px-1 py-0.5 text-xs w-28"
                        value={rule.ruleEndDate}
                        onChange={(e) => onDateChange(rule.id, 'ruleEndDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-xs py-1">{rule.activationDate}</TableCell>
                    <TableCell className="text-xs py-1">{rule.deactivationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => paginationProps.page > 1 && paginationProps.onPageChange(paginationProps.page - 1)} 
                className={paginationProps.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {generatePageNumbers().map((pageNum, i) => {
              if (pageNum === 'ellipsis1' || pageNum === 'ellipsis2') {
                return (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    isActive={paginationProps.page === pageNum}
                    onClick={() => paginationProps.onPageChange(Number(pageNum))}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => {
                  const totalPages = Math.ceil(paginationProps.total / paginationProps.pageSize);
                  if (paginationProps.page < totalPages) {
                    paginationProps.onPageChange(paginationProps.page + 1);
                  }
                }} 
                className={paginationProps.page >= Math.ceil(paginationProps.total / paginationProps.pageSize) ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="max-w-[350px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to change the status of this rule?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-8">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus} className="text-xs h-8">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RulesTable;
