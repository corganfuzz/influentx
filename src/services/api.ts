import type { TemplatePayload, LambdaResponse, ApiTemplateResponse, Slide, SubmitTemplateParams } from "../types";
import { makePlaceholder } from "../config/constants";
import { MOCK_SLIDES, DISPLAY_TITLES } from "./mockData";
import spConfig from "../../sharepoint.config.json";

const TEMPLATES_API_URL = import.meta.env.VITE_TEMPLATES_API_URL as string | undefined;
const TEMPLATES_API_KEY = import.meta.env.VITE_TEMPLATES_API_KEY as string | undefined;
const MODIFY_API_URL = import.meta.env.VITE_MODIFY_API_URL as string | undefined;
const DOWNLOAD_API_URL = import.meta.env.VITE_DOWNLOAD_API_URL as string | undefined;
const PREVIEW_API_URL = import.meta.env.VITE_PREVIEW_API_URL as string | undefined;

/**
 * Define generic titles often stored in PowerPoint metadata that we want to ignore.
 */
const TRASH_TITLES = [
    "powerpoint presentation", 
    "microsoft powerpoint presentation", 
    "headline verdana bold", 
    "presentation1",
    "presentation"
];

/**
 * Transforms a robotic filename into a beautiful, human-readable title.
 * Example: "capability-assessment_v2.pptx" -> "Capability Assessment"
 */
function prettifyFileName(fileName: string): string {
    return fileName
        .split('/')
        .pop()!                         // Get just the filename if it's a path
        .replace(/\.pptx$/i, '')        // Remove extension
        .replace(/[_-]/g, ' ')          // Replace hyphens/underscores with spaces
        .replace(/\b[vV]\d+.*$/g, '')   // Remove versioning like _v1, v2
        .trim()
        .toLowerCase()
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase()); // Capitalize words
}

export async function fetchAvailableTemplates(): Promise<Slide[]> {
    // HYBRID MOCK: Dynamically pull template metadata from a real SharePoint Documents Library
    // bypassing AWS, but ensuring the Gallery is always synced with what's actually in SharePoint.
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const { sitePath, mockSourceListTitle } = spConfig;
        
        // SharePoint REST API URL - using root-relative path ensures authentication 
        // works correctly when the app is uploaded to SharePoint.
        // For the REST API, we use the List Title (e.g., 'Documents').
        const fetchUrl = `${sitePath}/_api/web/lists/getbytitle('${mockSourceListTitle}')/items?$select=ID,Title,FileLeafRef,FileRef,UniqueId&$filter=substringof('.pptx',FileLeafRef)`;
        
        try {
            const response = await fetch(fetchUrl, {
                headers: { "Accept": "application/json; odata=nometadata" }
            });

            if (!response.ok) throw new Error(`SP REST API error: ${response.status} (Likely Auth/CORS or List Title mismatch)`);

            const data = await response.json();
            const results = data.value || [];

            return results.map((item: any, index: number) => {
                // If the Title is generic/trash, force a fallback to the prettified filename.
                const isTrashTitle = item.Title && TRASH_TITLES.includes(item.Title.toLowerCase().trim());
                const title = (item.Title && !isTrashTitle) ? item.Title : prettifyFileName(item.FileLeafRef);
                
                return {
                    id: `sp-${item.ID}`,
                    title: title,
                    type: "Presentation",
                    thumbnail: makePlaceholder(title, index),
                    fileName: item.FileLeafRef,
                    // Official SharePoint iframe embed syntax using the file's GUID ({UniqueId})
                    embedUrl: `${sitePath}/_layouts/15/Doc.aspx?sourcedoc=%7B${item.UniqueId}%7D&action=embedview`
                };
            });
        } catch (error) {
            // Note: This will ALWAYS trigger when running locally via 'bun dev:mock' 
            // since localhost cannot authenticate with SharePoint's REST API.
            console.warn("Running locally or offline: Falling back to static MOCK_SLIDES.");
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
        // Useprettified filename as a fallback for the live API as well
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
