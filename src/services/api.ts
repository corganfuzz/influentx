import type { TemplatePayload, LambdaResponse, ApiTemplateResponse, Slide } from "../types";
import { makePlaceholder } from "../config/constants";

const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL as string | undefined;
const TEMPLATES_API_URL = import.meta.env.VITE_TEMPLATES_API_URL as string | undefined;
const TEMPLATES_API_KEY = import.meta.env.VITE_TEMPLATES_API_KEY as string | undefined;

export async function fetchAvailableTemplates(): Promise<Slide[]> {
    if (!TEMPLATES_API_URL || !TEMPLATES_API_KEY) {
        throw new Error("Templates API URL or Key is not configured in .env");
    }

    // Solve CORS in development by using the local Vite proxy
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

    // Nice titles to match previous hardcoded state
    const displayTitles = [
        "Q3 Financial Overview",
        "Marketing Strategy 2026",
        "Engineering Roadmap"
    ];

    // Map the raw API response to the Application's Slide interface
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

function generateRequestId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function submitTemplate(params: {
    template: { id: string; fileName: string };
    painPoint: string;
    revenue: number;
    technicians: number;
    reportingDate: string;
}): Promise<LambdaResponse> {
    if (!LAMBDA_URL) {
        throw new Error("Lambda URL is not configured. Add VITE_LAMBDA_URL to your .env file.");
    }

    const payload: TemplatePayload = {
        requestId: generateRequestId(),
        submittedAt: new Date().toISOString(),
        template: params.template,
        businessData: {
            painPoint: params.painPoint,
            revenue: params.revenue,
            technicians: params.technicians,
            reportingDate: params.reportingDate,
        },
    };

    const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Lambda returned ${response.status}: ${errorText}`);
    }

    return (await response.json()) as LambdaResponse;
}
