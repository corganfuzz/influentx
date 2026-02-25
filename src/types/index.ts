export interface Slide {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
}

export interface TemplatePayload {
  requestId: string;
  submittedAt: string;
  template: {
    id: string;
    title: string;
    type: string;
  };
  businessData: {
    painPoint: string;
    revenue: number;
    adjustedTarget: number;
    technicians: number;
    reportingDate: string;
  };
}

export interface LambdaResponse {
  success: boolean;
  message?: string;
  downloadUrl?: string;
}
