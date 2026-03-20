import * as React from "react";
import {
    Card,
    CardPreview,
    CardHeader,
    CardFooter,
    Button,
    Caption1,
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    Spinner,
    Skeleton,
    SkeletonItem,
} from "@fluentui/react-components";
import { EditRegular, MoreHorizontal20Regular, Dismiss24Regular } from "@fluentui/react-icons";
import type { TemplateCardProps } from "../../types";
import { buildEmbedUrl } from "../../services/api";
import pptxIcon from "../../assets/pptx_icon.svg";


export function TemplateCard({ slide, onEdit, isLoading }: TemplateCardProps) {
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [isIframeLoading, setIsIframeLoading] = React.useState(true);

    const handleOpenPreview = () => {
        if (isLoading) return;
        setIsIframeLoading(true);
        setPreviewOpen(true);
    };

    const cardContent = (
        <Card
            className={`bg-white border border-[#E2E3E3] transition-colors duration-200 template-card ${isLoading ? 'cursor-default' : 'hover:border-[#808080] cursor-pointer'}`}
            onClick={handleOpenPreview}
        >
            <CardPreview className="border-b border-[#E2E3E3] template-card-preview">
                {isLoading ? (
                    <SkeletonItem shape="rectangle" style={{ width: '100%', height: '180px' }} />
                ) : (
                    <img src={slide.thumbnail} alt={slide.title} />
                )}
            </CardPreview>
            <CardHeader
                image={
                    <img
                        src={pptxIcon}
                        width="32"
                        height="32"
                        alt="Microsoft PowerPoint logo"
                        className="template-card-header-icon"
                    />
                }
                header={
                    <div className="min-w-0 w-full overflow-hidden">
                        {isLoading ? (
                            <SkeletonItem shape="rectangle" style={{ width: '80%', height: '20px', marginTop: '4px' }} />
                        ) : (
                            <h5
                                className="text-[#1C1F2A] template-card-header-title m-0 text-base"
                                title={slide.title}
                            >
                                {slide.title}
                            </h5>
                        )}
                    </div>
                }
                description={<Caption1 className="text-[#808080]">{slide.type}</Caption1>}
                action={
                    <Button
                        appearance="transparent"
                        icon={<MoreHorizontal20Regular />}
                        aria-label="More options"
                        disabled={isLoading}
                        onClick={(e) => e.stopPropagation()}
                    />
                }
            />

            <CardFooter className="flex items-center justify-between gap-4 pt-2 overflow-hidden">
                <Button
                    appearance="primary"
                    icon={<EditRegular />}
                    className="flex-shrink-0"
                    disabled={isLoading}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(slide);
                    }}
                >
                    Edit
                </Button>
                {isLoading ? (
                    <div className="template-card-filename-container">
                        <SkeletonItem shape="rectangle" style={{ width: '100px', height: '12px' }} />
                    </div>
                ) : slide.fileName && (
                    <div className="template-card-filename-container">
                        <span
                            className="text-[#9b9da8] block truncate text-xs"
                            title={slide.fileName}
                        >
                            {slide.fileName.split('/').pop()}
                        </span>
                    </div>
                )}
            </CardFooter>
        </Card>
    );

    return (
        <>
            {isLoading ? (
                <Skeleton aria-label="Loading">
                    {cardContent}
                </Skeleton>
            ) : cardContent}

            <Dialog open={previewOpen} onOpenChange={(_, data) => setPreviewOpen(data.open)}>
                <DialogSurface className="preview-dialog-surface">
                    <DialogBody>
                        <DialogTitle
                            action={
                                <div className="preview-dialog-actions">
                                    {slide.embedUrl && (
                                        <Button
                                            appearance="transparent"
                                            aria-label="Open in new tab"
                                            icon={<span className="text-xl">↗️</span>}
                                            onClick={() => window.open(slide.embedUrl, '_blank')}
                                        />
                                    )}
                                    <DialogTrigger action="close">
                                        <Button
                                            appearance="transparent"
                                            aria-label="close"
                                            icon={<Dismiss24Regular />}
                                        />
                                    </DialogTrigger>
                                </div>
                            }
                        >
                            {slide.title}
                        </DialogTitle>
                        <DialogContent>
                            <CardPreview className="preview-card-container">
                                {isIframeLoading && (
                                    <div className="preview-iframe-loader">
                                        <Spinner size="large" appearance="primary" />
                                        <Caption1 className="text-[#808080]">Fetching presentation...</Caption1>
                                    </div>
                                )}
                                <iframe
                                    src={import.meta.env.VITE_USE_MOCK === "true" && slide.embedUrl 
                                        ? slide.embedUrl 
                                        : (slide.token ? buildEmbedUrl(slide.token) : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(new URL(`../../assets/pptx-docs/${slide.fileName}`, import.meta.url).href)}`)}
                                    className="preview-iframe"
                                    style={{
                                        opacity: isIframeLoading ? 0 : 1,
                                    }}
                                    onLoad={() => setIsIframeLoading(false)}
                                    allowFullScreen
                                    title={slide.title}
                                />
                            </CardPreview>
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
}

