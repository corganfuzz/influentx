export interface Slide {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  fileName: string; // Path to the actual .pptx file
}

export interface TemplatePayload {
  requestId: string;
  submittedAt: string;
  template: {
    id: string;
    fileName: string;
  };
  businessData: {
    painPoint: string;
    revenue: number;
    technicians: number;
    reportingDate: string;
  };
}

export interface LambdaResponse {
  success: boolean;
  message?: string;
  downloadUrl?: string;
}

export interface ApiTemplateResponse {
  fileName: string;
  size: number;
  lastModified: string;
}
