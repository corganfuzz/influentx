import { MessageBar, MessageBarBody, MessageBarTitle, Text, Button, Spinner } from "@fluentui/react-components";
import { ArrowLeftRegular, DocumentArrowDownRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { LambdaResponse } from "../../types";
import { fetchDownloadUrl } from "../../services/api";

interface SuccessViewProps {
    lambdaResult: LambdaResponse | null;
    onBackToStart: () => void;
}

export function SuccessView({ lambdaResult, onBackToStart }: SuccessViewProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!lambdaResult?.outputKey) return;

        try {
            setIsDownloading(true);
            const downloadUrl = await fetchDownloadUrl(lambdaResult.outputKey);

            // Hidden anchor tag technique for direct download
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.style.display = "none";
            // The S3 signed URL usually handles the filename, but we can hint it
            link.setAttribute("download", lambdaResult.outputKey);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to get download URL:", error);
            alert("Error downloading file. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <MessageBar intent="success" className="mb-8 p-4 bg-white border border-[#E2E3E3]">
                <MessageBarBody>
                    <MessageBarTitle className="text-lg text-[#1C1F2A]">Completed successfully</MessageBarTitle>
                    <Text size={400} className="text-[#808080]">
                        Thank you. Your custom ppt template is now available for download.
                    </Text>
                </MessageBarBody>
            </MessageBar>

            <div className="flex flex-col gap-6 border-t border-[#E2E3E3] pt-8">
                {lambdaResult?.outputKey && (
                    <div className="p-4 rounded-md border border-[#E2E3E3] success-view-generated-container">
                        <Text size={200} className="text-[#808080] success-view-generated-label uppercase tracking-wider">File Generated:</Text>
                        <Text size={400} className="text-[#1C1F2A] truncate block success-view-generated-filename" title={lambdaResult.outputKey}>
                            {lambdaResult.outputKey}
                        </Text>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button
                        appearance="secondary"
                        size="large"
                        icon={<ArrowLeftRegular />}
                        onClick={onBackToStart}
                        disabled={isDownloading}
                    >
                        Back to Start
                    </Button>
                    <Button
                        appearance="primary"
                        size="large"
                        icon={isDownloading ? <Spinner size="tiny" /> : <DocumentArrowDownRegular />}
                        disabled={!lambdaResult?.outputKey || isDownloading}
                        onClick={handleDownload}
                    >
                        {isDownloading ? "Downloading..." : (lambdaResult?.outputKey ? "Download PPTX" : "Download Template")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
