
export interface RiskRule {
  id: string;
  name: string;
  category1: string;
  category2: string;
  category3: string;
  status: boolean;
  ruleStartDate: string;
  ruleEndDate: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  version: string;
}

export const mockRiskRules: RiskRule[] = [
  {
    id: "R001",
    name: "High Value Claims",
    category1: "Financial",
    category2: "Claims",
    category3: "Amount",
    status: true,
    ruleStartDate: "2024-01-01",
    ruleEndDate: "2024-12-31",
    createdBy: "John Doe",
    createdDate: "2024-01-01",
    modifiedBy: "Jane Smith",
    modifiedDate: "2024-03-15",
    version: "1.0"
  },
  {
    id: "R002",
    name: "Duplicate Claims Check",
    category1: "Validation",
    category2: "Claims",
    category3: "Duplicates",
    status: false,
    ruleStartDate: "2024-02-01",
    ruleEndDate: "2024-12-31",
    createdBy: "Jane Smith",
    createdDate: "2024-02-01",
    modifiedBy: "John Doe",
    modifiedDate: "2024-03-20",
    version: "1.1"
  },
  {
    id: "R003",
    name: "Provider Verification",
    category1: "Compliance",
    category2: "Provider",
    category3: "Verification",
    status: true,
    ruleStartDate: "2024-03-01",
    ruleEndDate: "2024-12-31",
    createdBy: "Mike Johnson",
    createdDate: "2024-03-01",
    modifiedBy: "Sarah Williams",
    modifiedDate: "2024-03-25",
    version: "1.0"
  }
];
