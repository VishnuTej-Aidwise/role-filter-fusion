
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Columns } from 'lucide-react';
import { ColumnVisibility } from './AuditTable';

export interface ColumnVisibilityDropdownProps {
  columnVisibility: ColumnVisibility;
  toggleColumnVisibility: (columnKey: keyof ColumnVisibility) => void;
}

const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columnVisibility,
  toggleColumnVisibility
}) => {
  // Display names for column keys
  const columnDisplayName: Record<string, string> = {
    claimNumber: 'Claim Number',
    claimDate: 'Claim Date',
    hospitalName: 'Hospital Name',
    hospitalLocation: 'Hospital Location',
    htpaLocation: 'HTPA Location',
    dateOfAdmission: 'Date of Admission',
    dateOfDischarge: 'Date of Discharge',
    fraudTriggers: 'Fraud Triggers',
    fieldInvestigationDate: 'Field Investigation Date',
    claimStatus: 'Claim Status',
    status: 'Status',
    deskAuditReferralDate: 'Desk Audit Referral Date',
    taTCompliance: 'TAT Compliance',
    claimIntimationAging: 'Claim Intimation Aging',
    aiManualTrigger: 'AI/Manual Trigger',
    allocation: 'Allocation',
    fieldReport: 'Field Report'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Columns className="h-4 w-4 mr-1" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {Object.keys(columnVisibility).map((key) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={columnVisibility[key as keyof ColumnVisibility]}
            onCheckedChange={() => toggleColumnVisibility(key as keyof ColumnVisibility)}
          >
            {columnDisplayName[key] || key}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityDropdown;
