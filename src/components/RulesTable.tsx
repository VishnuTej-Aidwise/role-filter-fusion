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

  const generatePageNumbers = () => {
    const totalPages = Math.ceil(paginationProps.total / paginationProps.pageSize);
    const currentPage = paginationProps.page;
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
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
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full rounded-md border border-gray-200">
          <div className="w-full min-w-[1200px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-500 sticky top-0 z-10">
                  <TableHead className="w-10 text-center sticky left-0 bg-blue-500 text-white text-xs z-20">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
                    />
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[120px]">Trigger</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[150px]">Rule Name</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[250px]">Rule Description</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[120px]">Category</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[150px]">Sub Category</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[100px] text-center">Status</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[150px]">Rule Start Date</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[150px]">Rule End Date</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[150px]">Activation Date</TableHead>
                  <TableHead className="text-white text-xs font-semibold min-w-[150px]">Deactivation Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-gray-50">
                    <TableCell className="sticky left-0 bg-white z-10 text-center">
                      <Checkbox 
                        checked={selectedRules.includes(rule.id)}
                        onCheckedChange={(checked) => onRuleSelection(rule.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-xs">{rule.trigger}</TableCell>
                    <TableCell className="text-xs font-medium">{rule.name}</TableCell>
                    <TableCell className="text-xs">{rule.description}</TableCell>
                    <TableCell className="text-xs">{rule.category}</TableCell>
                    <TableCell className="text-xs">{rule.subCategory}</TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={rule.status === 'Active'} 
                        onCheckedChange={() => handleToggleStatus(rule.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input 
                        type="date" 
                        className="border rounded px-2 py-1 text-xs w-32"
                        value={rule.ruleStartDate}
                        onChange={(e) => onDateChange(rule.id, 'ruleStartDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input 
                        type="date" 
                        className="border rounded px-2 py-1 text-xs w-32"
                        value={rule.ruleEndDate}
                        onChange={(e) => onDateChange(rule.id, 'ruleEndDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-xs">{rule.activationDate}</TableCell>
                    <TableCell className="text-xs">{rule.deactivationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      <div className="mt-4 border-t pt-4 bg-white">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => paginationProps.page > 1 && paginationProps.onPageChange(paginationProps.page - 1)}
                className={paginationProps.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {generatePageNumbers().map((pageNum, i) => (
              <PaginationItem key={i}>
                {pageNum === '...' ? (
                  <span className="px-3 py-2">...</span>
                ) : (
                  <PaginationLink
                    onClick={() => paginationProps.onPageChange(Number(pageNum))}
                    isActive={paginationProps.page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
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
    </div>
  );
};

export default RulesTable;
