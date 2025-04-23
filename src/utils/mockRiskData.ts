
export interface RiskRule {
  id: string;
  name: string;
  description?: string;
  category1: string;
  category2: string;
  category3: string;
  status: boolean;
  trigger?: string;
  ruleStartDate?: string;
  ruleEndDate?: string;
  activationDate?: string;
  deactivationDate?: string;
}

export const mockRiskRules: RiskRule[] = [
  {
    id: "1",
    name: "Gender Mismatch Diagnosis - MALE",
    category1: "Clinical",
    category2: "Claims Related",
    category3: "Clinical Adjudication Related",
    status: true,
    trigger: "Transactional",
    ruleStartDate: "2024-01-01",
    ruleEndDate: "2024-12-31",
    activationDate: "2024-01-05",
    deactivationDate: "2024-11-30"
  },
  {
    id: "2",
    name: "Gender Mismatch Diagnosis - FEMALE",
    category1: "Clinical",
    category2: "Claims Related",
    category3: "Clinical Adjudication Related",
    status: false,
    trigger: "Batch",
    ruleStartDate: "2024-03-01",
    ruleEndDate: "2024-09-30",
    activationDate: "2024-03-15",
    deactivationDate: "2024-09-15"
  },
  {
    id: "3",
    name: "Pregnancy Below 18 over 45 age",
    category1: "Clinical",
    category2: "Claims Related",
    category3: "Clinical Adjudication Related",
    status: false,
    trigger: "Transactional",
    ruleStartDate: "2024-02-01",
    ruleEndDate: "2024-08-31",
    activationDate: "2024-02-10",
    deactivationDate: "2024-08-20"
  },
  {
    id: "4",
    name: "Age Mismatch Diagnosis",
    category1: "Clinical",
    category2: "Claims Related",
    category3: "Clinical Adjudication Related",
    status: true,
    trigger: "Batch",
    ruleStartDate: "2024-01-01",
    ruleEndDate: "2024-06-30",
    activationDate: "2024-01-15",
    deactivationDate: "2024-06-20"
  },
  {
    id: "5",
    name: "Admission within month of policy expiry",
    category1: "Non Clinical",
    category2: "Claims Related",
    category3: "Beneficiary Related (Insured/Dependent) Claims",
    status: false,
    trigger: "Transactional",
    ruleStartDate: "2024-04-01",
    ruleEndDate: "2024-10-31",
    activationDate: "2024-04-10",
    deactivationDate: "2024-10-20"
  },
  {
    id: "6",
    name: "Claim more than 50000 INR for medical claims",
    category1: "Non Clinical",
    category2: "Claims Related",
    category3: "Service Provider Related",
    status: false,
    trigger: "Batch",
    ruleStartDate: "2024-02-01",
    ruleEndDate: "2024-12-31",
    activationDate: "2024-02-15",
    deactivationDate: "2024-11-30"
  },
  {
    id: "7",
    name: "Condition can not be planned",
    category1: "Clinical",
    category2: "Claims Related",
    category3: "Clinical Adjudication Related",
    status: false,
    trigger: "Transactional",
    ruleStartDate: "2024-05-01",
    ruleEndDate: "2024-11-30",
    activationDate: "2024-05-10",
    deactivationDate: "2024-11-20"
  },
  {
    id: "8",
    name: "Single family members in different hospitals during same period (Reimbursement claim)",
    category1: "Non Clinical",
    category2: "Claims Related",
    category3: "Beneficiary Related (Insured/Dependent) Claims",
    status: false,
    trigger: "Batch",
    ruleStartDate: "2024-06-01",
    ruleEndDate: "2024-12-31",
    activationDate: "2024-06-15",
    deactivationDate: "2024-12-15"
  },
  {
    id: "9",
    name: "Accidental claim within month of policy inception date",
    category1: "Non Clinical",
    category2: "Policy Related",
    category3: "Policy T C Validity",
    status: false,
    trigger: "Transactional",
    ruleStartDate: "2024-07-01",
    ruleEndDate: "2024-12-31",
    activationDate: "2024-07-10",
    deactivationDate: "2024-12-20"
  },
  {
    id: "10",
    name: "Rule 1",
    description: "This rule handles transactional workflows.",
    category1: "Clinical",
    category2: "Claims Related",
    category3: "Clinical Adjudication Related",
    status: true,
    trigger: "Batch",
    ruleStartDate: "2024-08-01",
    ruleEndDate: "2024-11-30",
    activationDate: "2024-08-15",
    deactivationDate: "2024-11-15"
  },
  {
    id: "11",
    name: "Rule 2",
    description: "This rule is applied during batch processing.",
    category1: "Non Clinical",
    category2: "Policy Related",
    category3: "Policy T C Validity",
    status: false,
    trigger: "Transactional",
    ruleStartDate: "2024-01-01",
    ruleEndDate: "2024-12-31",
    activationDate: "2024-01-05",
    deactivationDate: "2024-11-30"
  },
];

export const categories = {
  category1: ["Clinical", "Non Clinical"],
  category2: ["Claims Related", "Policy Related", "Entity Related"],
  category3: [
    "Clinical Adjudication Related", 
    "Beneficiary Related (Insured/Dependent) Claims",
    "Service Provider Related",
    "Policy T C Validity"
  ],
  status: ["Active", "Inactive", "All"]
};
