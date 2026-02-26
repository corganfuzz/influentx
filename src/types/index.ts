export interface Slide {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  fileName: string; // Path to the actual .pptx file
}

export interface TemplatePayload {
  template: {
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
  success?: boolean;
  message?: string;
  downloadUrl?: string;
  outputKey?: string;
}

export interface ApiTemplateResponse {
  fileName: string;
  size: number;
  lastModified: string;
}

export interface DownloadResponse {
  downloadUrl: string;
}
