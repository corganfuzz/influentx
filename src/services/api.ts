import type { TemplatePayload, LambdaResponse, ApiTemplateResponse, Slide } from "../types";
import { makePlaceholder } from "../config/constants";

const TEMPLATES_API_URL = import.meta.env.VITE_TEMPLATES_API_URL as string | undefined;
const TEMPLATES_API_KEY = import.meta.env.VITE_TEMPLATES_API_KEY as string | undefined;
const MODIFY_API_URL = import.meta.env.VITE_MODIFY_API_URL as string | undefined;
const DOWNLOAD_API_URL = import.meta.env.VITE_DOWNLOAD_API_URL as string | undefined;

export async function fetchAvailableTemplates(): Promise<Slide[]> {
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

    const displayTitles = [
        "Q3 Financial Overview",
        "Marketing Strategy 2026",
        "Engineering Roadmap"
    ];

    return data.map((item, index) => {
        const title = displayTitles[index] || item.fileName.split('/').pop()?.replace('.pptx', '') || item.fileName;

        return {
            id: `api-slide-${index}`,
            title: title,
            type: "Presentation",
            thumbnail: makePlaceholder(title),
            fileName: item.fileName
        };
    });
}

export async function submitTemplate(params: {
    template: { id: string; fileName: string };
    painPoint: string;
    revenue: number;
    technicians: number;
    reportingDate: string;
}): Promise<LambdaResponse> {
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
