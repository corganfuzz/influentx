import type { TemplatePayload, LambdaResponse, ApiTemplateResponse, Slide, SubmitTemplateParams } from "../types";
import { makePlaceholder } from "../config/constants";
import { MOCK_SLIDES, DISPLAY_TITLES } from "./mockData";
import spConfig from "../../sharepoint.config.json";

const TEMPLATES_API_URL = import.meta.env.VITE_TEMPLATES_API_URL as string | undefined;
const TEMPLATES_API_KEY = import.meta.env.VITE_TEMPLATES_API_KEY as string | undefined;
const MODIFY_API_URL = import.meta.env.VITE_MODIFY_API_URL as string | undefined;
const DOWNLOAD_API_URL = import.meta.env.VITE_DOWNLOAD_API_URL as string | undefined;
const PREVIEW_API_URL = import.meta.env.VITE_PREVIEW_API_URL as string | undefined;

const TRASH_TITLES = [
    "powerpoint presentation", 
    "microsoft powerpoint presentation", 
    "headline verdana bold", 
    "presentation1",
    "presentation"
];

function prettifyFileName(fileName: string): string {
    return fileName
        .split('/')
        .pop()!
        .replace(/\.pptx$/i, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b[vV]\d+.*$/g, '')
        .trim()
        .toLowerCase()
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}

export async function fetchAvailableTemplates(): Promise<Slide[]> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const { sitePath, mockSourceListTitle } = spConfig;
        const fetchUrl = `${sitePath}/_api/web/lists/getbytitle('${mockSourceListTitle}')/items?$select=ID,Title,FileLeafRef,FileRef,UniqueId&$filter=substringof('.pptx',FileLeafRef)`;
        
        try {
            const response = await fetch(fetchUrl, {
                headers: { "Accept": "application/json; odata=nometadata" }
            });

            if (!response.ok) throw new Error(`SP REST API error: ${response.status}`);

            const data = await response.json();
            const results = data.value || [];

            return results.map((item: any, index: number) => {
                const isTrashTitle = item.Title && TRASH_TITLES.includes(item.Title.toLowerCase().trim());
                const title = (item.Title && !isTrashTitle) ? item.Title : prettifyFileName(item.FileLeafRef);
                
                return {
                    id: `sp-${item.ID}`,
                    title: title,
                    type: "Presentation",
                    thumbnail: makePlaceholder(title, index),
                    fileName: item.FileLeafRef,
                    embedUrl: `${sitePath}/_layouts/15/Doc.aspx?sourcedoc=%7B${item.UniqueId}%7D&action=embedview`
                };
            });
        } catch (error) {
            console.warn("Falling back to static MOCK_SLIDES:", error);
            return MOCK_SLIDES; 
        }
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
        const title = DISPLAY_TITLES[index] || prettifyFileName(item.fileName);
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
        template: { fileName: params.template.fileName },
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

export function buildEmbedUrl(previewToken: string): string {
    if (!PREVIEW_API_URL) {
        throw new Error("Preview API URL is not configured in .env");
    }
    const proxyUrl = `${PREVIEW_API_URL}?token=${encodeURIComponent(previewToken)}&.pptx`;
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(proxyUrl)}`;
}
