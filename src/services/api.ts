import type { TemplatePayload, LambdaResponse } from "../types";

const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL as string | undefined;

function generateRequestId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function submitTemplate(params: {
    template: { id: string; title: string; type: string };
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
            adjustedTarget: parseFloat((params.revenue * 0.93).toFixed(2)),
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
