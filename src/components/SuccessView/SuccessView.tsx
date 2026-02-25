import { MessageBar, MessageBarBody, MessageBarTitle, Text, Button, Link } from "@fluentui/react-components";
import { ArrowLeftRegular, DocumentArrowDownRegular } from "@fluentui/react-icons";
import type { LambdaResponse } from "../../types";

interface SuccessViewProps {
    lambdaResult: LambdaResponse | null;
    onBackToStart: () => void;
}

export function SuccessView({ lambdaResult, onBackToStart }: SuccessViewProps) {
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

            <div className="flex items-center gap-4 border-t border-[#E2E3E3] pt-8">
                <Button
                    appearance="secondary"
                    size="large"
                    icon={<ArrowLeftRegular />}
                    onClick={onBackToStart}
                >
                    Back to Start
                </Button>
                {lambdaResult?.downloadUrl ? (
                    <Link href={lambdaResult.downloadUrl} target="_blank">
                        <Button appearance="primary" size="large" icon={<DocumentArrowDownRegular />}>
                            Download Template
                        </Button>
                    </Link>
                ) : (
                    <Button appearance="primary" size="large" icon={<DocumentArrowDownRegular />} disabled>
                        Download Template
                    </Button>
                )}
            </div>
        </div>
    );
}
