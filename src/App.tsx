import { useState, useEffect } from "react";
import { FluentProvider, Spinner, MessageBar, MessageBarBody, MessageBarTitle } from "@fluentui/react-components";
import { appTheme } from "./config/theme";
import type { Slide, LambdaResponse } from "./types";
import { fetchAvailableTemplates } from "./services/api";
import { TemplateCard } from "./components/TemplateCard/TemplateCard";
import { BusinessForm } from "./components/BusinessForm/BusinessForm";
import { SuccessView } from "./components/SuccessView/SuccessView";

export default function App() {
  const [templates, setTemplates] = useState<Slide[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [lambdaResult, setLambdaResult] = useState<LambdaResponse | null>(null);

  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoadingTemplates(true);
        const data = await fetchAvailableTemplates();
        setTemplates(data);
      } catch (err: any) {
        setFetchError(err.message || "Failed to load templates.");
      } finally {
        setIsLoadingTemplates(false);
      }
    }
    loadTemplates();
  }, []);

  const handleEditClick = (slide: Slide) => {
    setSelectedSlide(slide);
    setIsDialogOpen(true);
  };

  const handleSuccess = (result: LambdaResponse) => {
    setLambdaResult(result);
    setIsDialogOpen(false);
    setShowSuccess(true);
  };

  const handleBackToStart = () => {
    setShowSuccess(false);
    setLambdaResult(null);
  };

  return (
    <FluentProvider theme={appTheme}>
      <div className="min-h-screen bg-[#f9fafb] text-[#1C1F2A] font-sans">
        {/* Modern Clean Header with subtle brand accent */}
        <header className="bg-[#1C1F2A] border-b border-[#E2E3E3] px-8 py-10 lg:px-12 w-full relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#6464e6]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-semibold text-[#FFFFFF] mb-2">
              PRO Template Customizer
            </h1>
            <p className="text-lg font-medium text-[#808080]">
              Select a master slide and edit its business data to generate your custom presentation.
            </p>
          </div>
        </header>

        <main className="px-8 py-10 lg:px-12 max-w-6xl mx-auto">
          {showSuccess ? (
            <SuccessView
              lambdaResult={lambdaResult}
              onBackToStart={handleBackToStart}
            />
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-[#1C1F2A]">Available Templates</h2>
              </div>

              {isLoadingTemplates ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Spinner size="large" appearance="primary" />
                  <p className="text-[#808080]">Loading available templates...</p>
                </div>
              ) : fetchError ? (
                <MessageBar intent="error">
                  <MessageBarBody>
                    <MessageBarTitle>Error Loading Templates</MessageBarTitle>
                    {fetchError}
                  </MessageBarBody>
                </MessageBar>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {templates.map(slide => (
                    <TemplateCard
                      key={slide.id}
                      slide={slide}
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <BusinessForm
        isOpen={isDialogOpen}
        slide={selectedSlide}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
    </FluentProvider>
  );
}