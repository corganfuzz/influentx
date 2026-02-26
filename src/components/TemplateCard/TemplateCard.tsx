import {
    Card,
    CardPreview,
    CardHeader,
    CardFooter,
    Button,
    Body1,
    Caption1
} from "@fluentui/react-components";
import { EditRegular, MoreHorizontal20Regular } from "@fluentui/react-icons";
import type { Slide } from "../../types";
import pptxIcon from "../../assets/pptx_icon.svg";

interface TemplateCardProps {
    slide: Slide;
    onEdit: (slide: Slide) => void;
}

export function TemplateCard({ slide, onEdit }: TemplateCardProps) {
    return (
        <Card
            className="bg-white border border-[#E2E3E3] hover:border-[#808080] transition-colors duration-200 template-card"
            onClick={() => onEdit(slide)}
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
                    <Body1 as="h5" className="text-[#1C1F2A] template-card-header-title">
                        {slide.title}
                    </Body1>
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
    );
}
