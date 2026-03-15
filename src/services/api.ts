import type { TemplatePayload, LambdaResponse, ApiTemplateResponse, Slide, SubmitTemplateParams } from "../types";
import { makePlaceholder } from "../config/constants";
import { MOCK_SLIDES, DISPLAY_TITLES } from "./mockData";

const TEMPLATES_API_URL = import.meta.env.VITE_TEMPLATES_API_URL as string | undefined;
const TEMPLATES_API_KEY = import.meta.env.VITE_TEMPLATES_API_KEY as string | undefined;
const MODIFY_API_URL = import.meta.env.VITE_MODIFY_API_URL as string | undefined;
const DOWNLOAD_API_URL = import.meta.env.VITE_DOWNLOAD_API_URL as string | undefined;
const PREVIEW_API_URL = import.meta.env.VITE_PREVIEW_API_URL as string | undefined;

export async function fetchAvailableTemplates(): Promise<Slide[]> {
    // Check if we should use mock data
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_SLIDES), 500); // Simulate network delay
        });
    }

    if (!TEMPLATES_API_URL || !TEMPLATES_API_KEY) {
        throw new Error("Templates API URL or Key is not configured in .env");
    }

    const isDev = import.meta.env.DEV;
    const fetchUrl = isDev ? "/api-templates" : TEMPLATES_API_URL;

    const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
            "x-api-key": TEMPLATES_API_KEY,
            "Accept": "application/json"
        },
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Failed to fetch templates (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as ApiTemplateResponse[];

    return data.map((item, index) => {
        const title = DISPLAY_TITLES[index] || item.fileName.split('/').pop()?.replace('.pptx', '') || item.fileName;

        return {
            id: `api-slide-${index}`,
            title: title,
            type: "Presentation",
            thumbnail: makePlaceholder(title, index),
            fileName: item.fileName,
            token: item.token
        };
    });
}

export async function submitTemplate(params: SubmitTemplateParams): Promise<LambdaResponse> {
    if (!MODIFY_API_URL || !TEMPLATES_API_KEY) {
        throw new Error("Modify API URL or Key is not configured in .env");
    }

    const payload: TemplatePayload = {
        template: {
            fileName: params.template.fileName
        },
        businessData: {
            painPoint: params.painPoint,
            revenue: params.revenue,
            technicians: params.technicians,
            reportingDate: params.reportingDate,
        },
    };

    const isDev = import.meta.env.DEV;
    const fetchUrl = isDev ? "/api-modify" : MODIFY_API_URL;

    const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": TEMPLATES_API_KEY
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    return (await response.json()) as LambdaResponse;
}

export async function fetchDownloadUrl(fileName: string): Promise<string> {
    if (!DOWNLOAD_API_URL || !TEMPLATES_API_KEY) {
        throw new Error("Download API URL or Key is not configured in .env");
    }

    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? "/api-download" : DOWNLOAD_API_URL;

    const url = `${baseUrl}?fileName=${encodeURIComponent(fileName)}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "x-api-key": TEMPLATES_API_KEY,
            "Accept": "application/json"
        },
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Download API returned ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as { downloadUrl: string };
    return data.downloadUrl;
}

/**
 * Builds the view.officeapps.live.com embed URL.
 * Office Online fetches GET /preview?token=<token> which returns a 302 redirect to S3.
 * The token is HMAC-signed by your Lambda and expires in 5 minutes.
 */
export function buildEmbedUrl(previewToken: string): string {
    if (!PREVIEW_API_URL) {
        throw new Error("Preview API URL is not configured in .env");
    }
    // Added &.pptx hint for Office Online to recognize the file type
    const proxyUrl = `${PREVIEW_API_URL}?token=${encodeURIComponent(previewToken)}&.pptx`;
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(proxyUrl)}`;
}
