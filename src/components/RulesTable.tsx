
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="h-[calc(100vh-280px)] flex flex-col">
        <ScrollArea className="flex-grow">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-blue-500 text-white sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-center w-10 bg-blue-500 text-white border-r border-blue-400 py-2">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
                    />
                  </TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Rule ID</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Name</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Category 1</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Category 2</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Category 3</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Status</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Rule Start Date</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Rule End Date</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Created By</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Created Date</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Modified By</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Modified Date</TableHead>
                  <TableHead className="text-center bg-blue-500 text-white text-xs py-2">Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-gray-50">
                    <TableCell className="text-center py-1.5">
                      <Checkbox 
                        checked={selectedRules.includes(rule.id)}
                        onCheckedChange={(checked) => onRuleSelection(rule.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-left text-xs py-1.5">{rule.id}</TableCell>
                    <TableCell className="text-left text-xs py-1.5">{rule.name}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.category1}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.category2}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.category3}</TableCell>
                    <TableCell className="text-center py-1.5">
                      <Switch
                        checked={rule.status}
                        onCheckedChange={() => handleToggleStatus(rule.id)}
                        className="ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center py-1.5">
                      <input 
                        type="date" 
                        className="border rounded px-1 py-0.5 text-xs w-full"
                        value={rule.ruleStartDate || ''}
                        onChange={(e) => onDateChange(rule.id, 'ruleStartDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center py-1.5">
                      <input 
                        type="date" 
                        className="border rounded px-1 py-0.5 text-xs w-full"
                        value={rule.ruleEndDate || ''}
                        onChange={(e) => onDateChange(rule.id, 'ruleEndDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.createdBy}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.createdDate}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.modifiedBy}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.modifiedDate}</TableCell>
                    <TableCell className="text-center text-xs py-1.5">{rule.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
        
        <div className="flex items-center justify-between px-2 mt-2 border-t pt-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-700">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} entries
            </span>
            <select 
              className="border rounded px-1 py-0.5 text-xs"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-700">per page</span>
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
                    className="text-xs h-8 w-8"
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
      </div>

      {/* Confirmation Dialog */}
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
