
import apiClient from './apiClient';

export interface DeskAuditParams {
  start_date: string;
  end_date: string;
  trigger_type?: string;
  page_no?: number;
  page_size?: number;
}

export interface DeskAuditItem {
  Id: number;
  ClaimId: string;
  ClaimedDate: string;
  HitpaLocation: string | null;
  DateOfAdmission: string;
  DateOfDischarge: string;
  FraudTrigger: string;
  FraudInvestigationDate: string | null;
  ClaimStatus: string | null;
  DeskAuditReferralDate: string | null;
  TatCompliance: string | null;
  ClaimIntimationAging: string | null;
  TriggerType: string;
  HospitalId: string;
}

export interface DeskAuditResponse {
  data: DeskAuditItem[];
  message: string;
  status: boolean;
  total_rec: number;
}

export const fetchDeskAudits = async (params: DeskAuditParams): Promise<DeskAuditResponse> => {
  try {
    const response = await apiClient.get<DeskAuditResponse>('/desk-audit/', { 
      params: {
        start_date: params.start_date,
        end_date: params.end_date,
        page_no: params.page_no || 1,
        page_size: params.page_size || 10
      } 
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching desk audits:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch audit data');
  }
};
