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
} from "@fluentui/react-components";
import { EditRegular, MoreHorizontal20Regular, Dismiss24Regular } from "@fluentui/react-icons";
import type { TemplateCardProps } from "../../types";
import { buildEmbedUrl } from "../../services/api";
import pptxIcon from "../../assets/pptx_icon.svg";


export function TemplateCard({ slide, onEdit }: TemplateCardProps) {
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [isIframeLoading, setIsIframeLoading] = React.useState(true);

    const handleOpenPreview = () => {
        setIsIframeLoading(true);
        setPreviewOpen(true);
    };

    return (
        <>
            <Card
                className="bg-white border border-[#E2E3E3] hover:border-[#808080] transition-colors duration-200 template-card"
                onClick={handleOpenPreview}
            >
                <CardPreview className="border-b border-[#E2E3E3] template-card-preview">
                    <img src={slide.thumbnail} alt={slide.title} />
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
                            <h5
                                className="text-[#1C1F2A] template-card-header-title m-0 text-base"
                                title={slide.title}
                            >
                                {slide.title}
                            </h5>
                        </div>
                    }
                    description={<Caption1 className="text-[#808080]">{slide.type}</Caption1>}
                    action={
                        <Button
                            appearance="transparent"
                            icon={<MoreHorizontal20Regular />}
                            aria-label="More options"
                            onClick={(e) => e.stopPropagation()} // don't open form when clicking options
                        />
                    }
                />

                <CardFooter className="flex items-center justify-between gap-4 pt-2 overflow-hidden">
                    <Button
                        appearance="primary"
                        icon={<EditRegular />}
                        className="flex-shrink-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(slide);
                        }}
                    >
                        Edit
                    </Button>
                    {slide.fileName && (
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

            <Dialog open={previewOpen} onOpenChange={(_, data) => setPreviewOpen(data.open)}>
                <DialogSurface style={{ maxWidth: '1400px', width: '90vw' }}>
                    <DialogBody>
                        <DialogTitle
                            action={
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {slide.embedUrl && (
                                        <Button
                                            appearance="transparent"
                                            aria-label="Open in new tab"
                                            icon={<span style={{ fontSize: '20px' }}>↗️</span>}
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
                            <CardPreview
                                style={{
                                    aspectRatio: '16 / 9',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {isIframeLoading && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        <Spinner size="large" appearance="primary" />
                                        <Caption1 className="text-[#808080]">Fetching presentation...</Caption1>
                                    </div>
                                )}
                                <iframe
                                    src={slide.token ? buildEmbedUrl(slide.token) : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(new URL(`../../assets/pptx-docs/${slide.fileName}`, import.meta.url).href)}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        opacity: isIframeLoading ? 0 : 1,
                                        transition: 'opacity 0.3s ease'
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
