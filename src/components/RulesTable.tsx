
import React, { useState } from 'react';
import { RiskRule } from '../utils/mockRiskData';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const { page, pageSize, total, onPageChange, onPageSizeChange } = paginationProps;
  const [ruleToToggle, setRuleToToggle] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const totalPages = Math.ceil(total / pageSize);
  const isAllSelected = data.length > 0 && data.every(rule => selectedRules.includes(rule.id));
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than max, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for showing current, previous, and next pages with ellipsis
      let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

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

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8">No rules found</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-500 text-white">
            <TableRow>
              <TableHead className="text-center w-10 bg-blue-500 text-white border-r border-blue-400">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
                />
              </TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Name</TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Category 1</TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Category 2</TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Category 3</TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Status</TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Rule Start Date</TableHead>
              <TableHead className="text-center bg-blue-500 text-white">Rule End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((rule) => (
              <TableRow key={rule.id} className="hover:bg-gray-50">
                <TableCell className="text-center">
                  <Checkbox 
                    checked={selectedRules.includes(rule.id)}
                    onCheckedChange={(checked) => onRuleSelection(rule.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="text-left">{rule.name}</TableCell>
                <TableCell className="text-center">{rule.category1}</TableCell>
                <TableCell className="text-center">{rule.category2}</TableCell>
                <TableCell className="text-center">{rule.category3}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={rule.status}
                    onCheckedChange={() => handleToggleStatus(rule.id)}
                    className="ml-auto"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <input 
                    type="date" 
                    className="border rounded px-2 py-1 text-sm w-full"
                    value={rule.ruleStartDate || ''}
                    onChange={(e) => onDateChange(rule.id, 'ruleStartDate', e.target.value)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <input 
                    type="date" 
                    className="border rounded px-2 py-1 text-sm w-full"
                    value={rule.ruleEndDate || ''}
                    onChange={(e) => onDateChange(rule.id, 'ruleEndDate', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} entries
          </span>
          <select 
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => page > 1 && onPageChange(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === page}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => page < totalPages && onPageChange(page + 1)}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of this rule?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RulesTable;
