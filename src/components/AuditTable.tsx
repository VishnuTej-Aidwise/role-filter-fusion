import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/contexts/AuthContext';
import ColumnVisibilityDropdown from './ColumnVisibilityDropdown';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface AuditTableProps {
  data: any[];
  loading: boolean;
  paginationProps: PaginationProps;
  subUsers?: any[];
  userRole?: UserRole;
}

const AuditTable: React.FC<AuditTableProps> = ({
  data,
  loading,
  paginationProps,
  subUsers = [],
  userRole
}) => {
  const { page, pageSize, total, onPageChange, onPageSizeChange } = paginationProps;
  const [columnVisibility, setColumnVisibility] = useState({
    claimNumber: true,
    claimDate: true,
    hospitalName: true,
    hospitalLocation: true,
    htpaLocation: true,
    dateOfAdmission: true,
    dateOfDischarge: true,
    fraudTriggers: true,
    fieldInvestigationDate: true,
    claimStatus: true,
    status: true,
    deskAuditReferralDate: true,
    taTCompliance: true,
    claimIntimationAging: true,
    aiManualTrigger: true,
    allocation: true,
    fieldReport: true,
  });

  const toggleColumnVisibility = (columnKey: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const renderTableCell = (columnKey: string, row: any) => {
    if (!columnVisibility[columnKey]) {
      return null;
    }

    let content = row[columnKey];

    if (columnKey === 'status') {
      let badgeVariant = 'secondary';
      if (content === 'Approved') {
        badgeVariant = 'success';
      } else if (content === 'Rejected') {
        badgeVariant = 'destructive';
      }

      content = <Badge variant={badgeVariant}>{content}</Badge>;
    }

    return <TableCell>{content}</TableCell>;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-semibold">Audit Records</h2>
        <ColumnVisibilityDropdown columnVisibility={columnVisibility} toggleColumnVisibility={toggleColumnVisibility} />
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.claimNumber && <TableHead>Claim Number</TableHead>}
              {columnVisibility.claimDate && <TableHead>Claim Date</TableHead>}
              {columnVisibility.hospitalName && <TableHead>Hospital Name</TableHead>}
              {columnVisibility.hospitalLocation && <TableHead>Hospital Location</TableHead>}
              {columnVisibility.htpaLocation && <TableHead>HTPA Location</TableHead>}
              {columnVisibility.dateOfAdmission && <TableHead>Admission Date</TableHead>}
              {columnVisibility.dateOfDischarge && <TableHead>Discharge Date</TableHead>}
              {columnVisibility.fraudTriggers && <TableHead>Fraud Triggers</TableHead>}
              {columnVisibility.fieldInvestigationDate && <TableHead>Field Investigation Date</TableHead>}
              {columnVisibility.claimStatus && <TableHead>Claim Status</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              {columnVisibility.deskAuditReferralDate && <TableHead>Desk Audit Referral Date</TableHead>}
              {columnVisibility.taTCompliance && <TableHead>TAT Compliance</TableHead>}
              {columnVisibility.claimIntimationAging && <TableHead>Claim Intimation Aging</TableHead>}
              {columnVisibility.aiManualTrigger && <TableHead>AI/Manual Trigger</TableHead>}
              {columnVisibility.allocation && <TableHead>Allocation</TableHead>}
              {columnVisibility.fieldReport && <TableHead>Field Report</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {Object.keys(columnVisibility).filter(key => columnVisibility[key]).map((key, index) => (
                      <TableCell key={index}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : data.length > 0 ? (
              <>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    {renderTableCell('claimNumber', row)}
                    {renderTableCell('claimDate', row)}
                    {renderTableCell('hospitalName', row)}
                    {renderTableCell('hospitalLocation', row)}
                    {renderTableCell('htpaLocation', row)}
                    {renderTableCell('dateOfAdmission', row)}
                    {renderTableCell('dateOfDischarge', row)}
                    {renderTableCell('fraudTriggers', row)}
                    {renderTableCell('fieldInvestigationDate', row)}
                    {renderTableCell('claimStatus', row)}
                    {renderTableCell('status', row)}
                    {renderTableCell('deskAuditReferralDate', row)}
                    {renderTableCell('taTCompliance', row)}
                    {renderTableCell('claimIntimationAging', row)}
                    {renderTableCell('aiManualTrigger', row)}
                    {renderTableCell('allocation', row)}
                    {renderTableCell('fieldReport', row)}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={Object.keys(columnVisibility).length} className="text-center">No records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            Showing {data.length > 0 ? ((page - 1) * pageSize + 1) : 0} to {Math.min(page * pageSize, total)} of {total}
          </p>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={page * pageSize >= total}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditTable;
