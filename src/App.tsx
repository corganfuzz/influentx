import { useState } from "react";
import {
  FluentProvider,
  Button,
  Card,
  CardHeader,
  CardPreview,
  Text,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Image,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  DialogTrigger,
  Field,
  Input,
  Dropdown,
  Option,
} from "@fluentui/react-components";
import { EditRegular, DocumentArrowDownRegular, ArrowLeftRegular } from "@fluentui/react-icons";
import { appTheme } from "./theme";

// Inline SVG placeholder — no external HTTP request, safe behind corporate firewalls
function makePlaceholder(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
    <rect width="400" height="225" fill="#E2E3E3"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Segoe UI, sans-serif" font-size="18" font-weight="600" fill="#1C1F2A">${label}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Mock data for PPT slides available for retrieval
const SLIDES = [
  { id: "s1", title: "Q3 Financial Overview", type: "Financial", thumbnail: makePlaceholder("Financial Overview") },
  { id: "s2", title: "Marketing Strategy 2026", type: "Marketing", thumbnail: makePlaceholder("Marketing Strategy") },
  { id: "s3", title: "Engineering Roadmap", type: "Engineering", thumbnail: makePlaceholder("Eng Roadmap") },
];

export default function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [painPoint, setPainPoint] = useState<string>("Financial");
  const [revenue, setRevenue] = useState<string>("");
  const [technicians, setTechnicians] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleEditClick = (slide: any) => {
    setSelectedSlide(slide);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
    setShowSuccess(true);
  };

  // Calculate 93% of revenue, handling empty strings safely
  const revNum = parseFloat(revenue);
  const calculatedRevenue = !isNaN(revNum) ? (revNum * 0.93).toFixed(2) : "";

  return (
    <FluentProvider theme={appTheme}>
      <div className="min-h-screen bg-white text-[#1C1F2A] font-sans">
        {/* Flat SharePoint-style Hero Header with i-PRO Blue */}
        <header className="bg-[#6464e6] px-8 py-10 lg:px-12 w-full text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-light mb-2">
              PPT Template Customizer
            </h1>
            <p className="text-lg font-normal opacity-90">
              Select a master slide and edit its business data to generate your custom presentation.
            </p>
          </div>
        </header>

        <main className="px-8 py-10 lg:px-12 max-w-6xl mx-auto">
          {showSuccess ? (
            /* SUCCESS VIEW */
            <div className="animate-in fade-in duration-300">
              <MessageBar intent="success" className="mb-8 p-4 bg-white border border-[#E2E3E3]">
                <MessageBarBody>
                  <MessageBarTitle className="text-lg text-[#1C1F2A]">Completed successfully</MessageBarTitle>
                  <Text size={400} className="text-[#808080]">Thank you. Your custom ppt template is now available for download.</Text>
                </MessageBarBody>
              </MessageBar>

              <div className="flex items-center gap-4 border-t border-[#E2E3E3] pt-8">
                <Button
                  appearance="secondary"
                  size="large"
                  icon={<ArrowLeftRegular />}
                  onClick={() => setShowSuccess(false)}
                >
                  Back to Starts
                </Button>
                <Button
                  appearance="primary"
                  size="large"
                  icon={<DocumentArrowDownRegular />}
                >
                  Download Template
                </Button>
              </div>
            </div>
          ) : (
            /* SELECTION VIEW */
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-[#1C1F2A]">Available Templates</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {SLIDES.map(slide => (
                  <Card
                    key={slide.id}
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
                          onClick={() => handleEditClick(slide)}
                          aria-label={`Edit ${slide.title}`}
                        >
                          Edit
                        </Button>
                      }
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT MODAL DIALOG */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(_e, data) => setIsDialogOpen(data.open)}
      >
        <DialogSurface aria-describedby={undefined}>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <DialogTitle>Business Changes</DialogTitle>
              <DialogContent className="flex flex-col gap-5 py-4">
                <Text>Editing data for: <span className="font-semibold">{selectedSlide?.title}</span></Text>

                <Field label="Pain Points" required>
                  <Dropdown
                    placeholder="Select a pain point..."
                    value={painPoint}
                    onOptionSelect={(_e, data) => setPainPoint(data.optionValue as string)}
                  >
                    <Option value="Financial">Financial</Option>
                    <Option value="Productivity">Productivity</Option>
                    <Option value="Support">Support</Option>
                  </Dropdown>
                </Field>

                <Field label="Revenue ($)" required>
                  <Input
                    type="number"
                    value={revenue}
                    onChange={(_e, data) => setRevenue(data.value)}
                    placeholder="0.00"
                  />
                </Field>

                <Field label="Number of Technicians" required>
                  <Input
                    type="number"
                    value={technicians}
                    onChange={(_e, data) => setTechnicians(data.value)}
                    placeholder="e.g. 50"
                  />
                </Field>

                <Field label="Date" required>
                  <Input
                    type="date"
                    value={date}
                    onChange={(_e, data) => setDate(data.value)}
                  />
                </Field>

                <Field
                  label="Adjusted Target (93% of Revenue)"
                  validationState="none"
                  validationMessage="This value is calculated automatically."
                >
                  <Input
                    value={calculatedRevenue}
                    readOnly
                    appearance="filled-darker"
                    placeholder="0.00"
                    contentBefore="$"
                  />
                </Field>

              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <Button type="submit" appearance="primary" disabled={!revenue || !technicians || !date}>
                  Submit
                </Button>
              </DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>
    </FluentProvider>
  );
}