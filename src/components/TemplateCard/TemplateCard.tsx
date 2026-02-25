import { Card, CardPreview, Image, CardHeader, Text, Button } from "@fluentui/react-components";
import { EditRegular } from "@fluentui/react-icons";
import type { Slide } from "../../types";

interface TemplateCardProps {
    slide: Slide;
    onEdit: (slide: Slide) => void;
}

export function TemplateCard({ slide, onEdit }: TemplateCardProps) {
    return (
        <Card
            className="bg-white border border-[#E2E3E3] hover:border-[#808080] transition-colors duration-200"
        >
            <CardPreview className="border-b border-[#E2E3E3]">
                <Image src={slide.thumbnail} alt={slide.title} />
            </CardPreview>
            <CardHeader
                header={<Text weight="semibold" className="text-[#1C1F2A]">{slide.title}</Text>}
                description={<Text size={200} className="text-[#808080] pt-1">{slide.type}</Text>}
                action={
                    <Button
                        icon={<EditRegular />}
                        appearance="primary"
                        onClick={() => onEdit(slide)}
                        aria-label={`Edit ${slide.title}`}
                    >
                        Edit
                    </Button>
                }
            />
        </Card>
    );
}
