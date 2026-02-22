import { useState } from "react";
import {
  FluentProvider,
  Button,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Checkbox,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Image,
} from "@fluentui/react-components";
import { DocumentCopyRegular, CheckmarkCircleRegular, ArrowLeftRegular } from "@fluentui/react-icons";
import { appTheme } from "./theme";

// Mock data for PPT slides available for retrieval
const SLIDES = [
  { id: "s1", title: "Q3 Financial Overview", type: "Financial", thumbnail: "https://via.placeholder.com/400x225/E2E3E3/1C1F2A?text=Financial+Overview" },
  { id: "s2", title: "Marketing Strategy 2026", type: "Marketing", thumbnail: "https://via.placeholder.com/400x225/E2E3E3/1C1F2A?text=Marketing+Strategy" },
  { id: "s3", title: "Engineering Roadmap", type: "Engineering", thumbnail: "https://via.placeholder.com/400x225/E2E3E3/1C1F2A?text=Eng+Roadmap" },
  { id: "s4", title: "Executive Summary", type: "Leadership", thumbnail: "https://via.placeholder.com/400x225/E2E3E3/1C1F2A?text=Exec+Summary" },
  { id: "s5", title: "Customer Success Metrics", type: "Support", thumbnail: "https://via.placeholder.com/400x225/E2E3E3/1C1F2A?text=CS+Metrics" },
  { id: "s6", title: "Q4 Key Objectives", type: "Leadership", thumbnail: "https://via.placeholder.com/400x225/E2E3E3/1C1F2A?text=Q4+Objectives" },
];

export default function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      if (selectedIds.length < 3) setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(s => s !== id));
    }
  };

  const selectedSlides = SLIDES.filter(s => selectedIds.includes(s.id));

  return (
    <FluentProvider theme={appTheme}>
      <div className="min-h-screen bg-white text-[#1C1F2A] font-sans">

        {/* Header */}
        <header className="px-8 py-10 lg:px-12 max-w-6xl mx-auto border-b border-[#E2E3E3]">
          <h1 className="text-4xl font-light tracking-tight text-black mb-2">
            PPT Presentation Retrieval
          </h1>
          <p className="text-lg font-normal text-[#808080]">
            Select up to 3 master slides to compile into your new presentation deck.
          </p>
        </header>

        <main className="px-8 py-8 lg:px-12 max-w-6xl mx-auto">
          {showResults ? (
            /* RESULTS VIEW */
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center gap-4 mb-8">
                <Button
                  appearance="transparent"
                  icon={<ArrowLeftRegular />}
                  onClick={() => setShowResults(false)}
                >
                  Back to Selection
                </Button>
                <h2 className="text-2xl font-semibold text-[#1C1F2A]">Ready for Retrieval</h2>
              </div>

              <MessageBar intent="success" className="mb-8">
                <MessageBarBody>
                  <MessageBarTitle>Success</MessageBarTitle>
                  Your selection of {selectedSlides.length} slide(s) has been finalized and is ready for download.
                </MessageBarBody>
              </MessageBar>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedSlides.map(slide => (
                  <Card key={slide.id} className="border border-[#BDC0BF]">
                    <CardPreview>
                      <Image src={slide.thumbnail} alt={slide.title} />
                    </CardPreview>
                    <CardHeader
                      header={<Text weight="semibold">{slide.title}</Text>}
                      description={<Text size={200} className="text-[#808080]">{slide.type}</Text>}
                    />
                  </Card>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-end gap-3 pt-6 border-t border-[#E2E3E3]">
                <Button appearance="secondary" size="large" onClick={() => setShowResults(false)}>Revise Selection</Button>
                <Button appearance="primary" size="large" icon={<DocumentCopyRegular />}>
                  Download Compilation
                </Button>
              </div>
            </div>
          ) : (
            /* SELECTION VIEW */
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1C1F2A]">Available Templates</h2>
                <Text className="text-[#808080] font-medium bg-[#E2E3E3] px-3 py-1 rounded-full">
                  {selectedIds.length} / 3 Selected
                </Text>
              </div>

              {selectedIds.length === 3 && (
                <MessageBar intent="warning" className="mb-6 rounded-md">
                  <MessageBarBody>
                    You have reached the maximum limit of 3 slides for this compilation.
                  </MessageBarBody>
                </MessageBar>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SLIDES.map(slide => {
                  const isSelected = selectedIds.includes(slide.id);
                  const isDisabled = !isSelected && selectedIds.length >= 3;

                  return (
                    <Card
                      key={slide.id}
                      className={`cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'border-[#6464e6] bg-[#f0f0fd]' : 'border-[#E2E3E3] hover:border-[#BDC0BF]'}`}
                      onClick={() => !isDisabled && handleToggle(slide.id, !isSelected)}
                    >
                      <CardPreview>
                        <Image src={slide.thumbnail} alt={slide.title} className={isDisabled ? 'opacity-50' : ''} />
                      </CardPreview>
                      <CardHeader
                        header={<Text weight="semibold" className={isDisabled ? 'text-[#808080]' : 'text-[#1C1F2A]'}>{slide.title}</Text>}
                        description={<Text size={200} className="text-[#808080]">{slide.type}</Text>}
                        action={
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={(e, data) => {
                              e.stopPropagation(); // prevent card click double-fire
                              handleToggle(slide.id, !!data.checked);
                            }}
                          />
                        }
                      />
                    </Card>
                  );
                })}
              </div>

              <div className="mt-12 pt-6 border-t border-[#E2E3E3] flex justify-end">
                <Button
                  appearance="primary"
                  size="large"
                  disabled={selectedIds.length === 0}
                  icon={<CheckmarkCircleRegular />}
                  onClick={() => setShowResults(true)}
                >
                  Retrieve {selectedIds.length} Slide{selectedIds.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}