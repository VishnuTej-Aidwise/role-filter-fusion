
export interface RiskRule {
  id: string;
  trigger: 'Transactional' | 'Batch';
  name: string;
  description: string;
  category: 'Clinical' | 'Non-Clinical';
  subCategory: 'Claims Related' | 'Policy Related' | 'Entity Related';
  status: 'Active' | 'Inactive' | 'Review';
  ruleStartDate: string;
  ruleEndDate: string;
  activationDate: string;
  deactivationDate: string;
}

// Export categories for filters
export const categories = {
  category: ["Clinical", "Non-Clinical"],
  subCategory: ["Claims Related", "Policy Related", "Entity Related"],
  trigger: ["Transactional", "Batch"]
};

export const mockRiskRules: RiskRule[] = [
  {
    id: "Rule 1",
    trigger: "Transactional",
    name: "Rule 1",
    description: "This rule handles transactional workflows.",
    category: "Clinical",
    subCategory: "Claims Related",
    status: "Active",
    ruleStartDate: "2024-01-01",
    ruleEndDate: "2024-12-31",
    activationDate: "2024-01-05",
    deactivationDate: "2024-11-30"
  },
  {
    id: "Rule 2",
    trigger: "Batch",
    name: "Rule 2",
    description: "This rule is applied during batch processing.",
    category: "Non-Clinical",
    subCategory: "Policy Related",
    status: "Inactive",
    ruleStartDate: "2024-03-01",
    ruleEndDate: "2024-09-30",
    activationDate: "2024-03-15",
    deactivationDate: "2024-09-15"
  },
  {
    id: "Rule 3",
    trigger: "Transactional",
    name: "Rule 3",
    description: "Handles specific transaction cases.",
    category: "Clinical",
    subCategory: "Entity Related",
    status: "Active",
    ruleStartDate: "2024-02-01",
    ruleEndDate: "2024-08-31",
    activationDate: "2024-02-10",
    deactivationDate: "2024-08-20"
  }
];
