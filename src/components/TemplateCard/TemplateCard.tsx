import {
    Card,
    CardPreview,
    Image,
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
            className="bg-white border border-[#E2E3E3] hover:border-[#808080] transition-colors duration-200"
            onClick={() => onEdit(slide)}
            style={{ width: "100%", height: "fit-content", cursor: "pointer" }}
        >
            <CardPreview className="border-b border-[#E2E3E3]">
                <Image src={slide.thumbnail} alt={slide.title} />
            </CardPreview>
            <CardHeader
                image={
                    <img
                        src={pptxIcon}
                        width="32"
                        height="32"
                        alt="Microsoft PowerPoint logo"
                        style={{ display: 'block', minWidth: '32px', minHeight: '32px' }}
                    />
                }
                header={
                    <Body1 as="h5" style={{ margin: 0, fontWeight: "bold" }} className="text-[#1C1F2A]">
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
                {slide.fileName && (
                    <div style={{ minWidth: 0, flex: "1 1 auto" }}>
                        <Caption1
                            style={{
                                display: 'block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            className="text-[#BDBDBD]"
                            title={slide.fileName}
                        >
                            {slide.fileName.split('/').pop()}
                        </Caption1>
                    </div>
                )}
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
            </CardFooter>
        </Card>
    );
}
