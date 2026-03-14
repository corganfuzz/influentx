export interface Slide {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  fileName: string; // The original filename
  embedUrl?: string; // The SharePoint contextual embed URL
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

export interface BusinessFormProps {
  isOpen: boolean;
  slide: Slide | null;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: (result: LambdaResponse) => void;
}

export interface SuccessViewProps {
  lambdaResult: LambdaResponse | null;
  onBackToStart: () => void;
}

export interface TemplateCardProps {
  slide: Slide;
  onEdit: (slide: Slide) => void;
}

export interface SubmitTemplateParams {
  template: { id: string; fileName: string };
  painPoint: string;
  revenue: number;
  technicians: number;
  reportingDate: string;
}
