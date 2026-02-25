import { useState } from "react";
import {
    Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent, DialogTrigger,
    Field, Input, Dropdown, Option, Button, Text, Spinner, MessageBar, MessageBarBody
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { submitTemplate } from "../../services/api";
import type { Slide, LambdaResponse } from "../../types";

interface BusinessFormProps {
    isOpen: boolean;
    slide: Slide | null;
    onOpenChange: (isOpen: boolean) => void;
    onSuccess: (result: LambdaResponse) => void;
}

export function BusinessForm({ isOpen, slide, onOpenChange, onSuccess }: BusinessFormProps) {
    const [painPoint, setPainPoint] = useState<string>("Financial");
    const [revenue, setRevenue] = useState<string>("");
    const [technicians, setTechnicians] = useState<string>("");
    const [date, setDate] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slide) return;

        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const result = await submitTemplate({
                template: {
                    id: slide.id,
                    title: slide.title,
                    type: slide.type,
                },
                painPoint,
                revenue: parseFloat(revenue),
                technicians: parseInt(technicians, 10),
                reportingDate: date,
            });
            // Reset state for future
            setPainPoint("Financial");
            setRevenue("");
            setTechnicians("");
            setDate("");
            onSuccess(result);
        } catch (err: any) {
            setSubmitError(err?.message ?? "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) { // When closing, reset error
            setSubmitError(null);
        }
        onOpenChange(isOpen);
    };

    const revNum = parseFloat(revenue);
    const calculatedRevenue = !isNaN(revNum) ? (revNum * 0.93).toFixed(2) : "";

    return (
        <Dialog open={isOpen} onOpenChange={(_e, data) => handleOpenChange(data.open)}>
            <DialogSurface aria-describedby={undefined}>
                <form onSubmit={handleSubmit}>
                    <DialogBody>
                        <DialogTitle
                            action={
                                <DialogTrigger action="close">
                                    <Button
                                        appearance="subtle"
                                        aria-label="close"
                                        icon={<DismissRegular />}
                                    />
                                </DialogTrigger>
                            }
                        >
                            Business Changes
                        </DialogTitle>
                        <DialogContent className="flex flex-col gap-5 py-4">
                            <Text>Editing data for: <span className="font-semibold">{slide?.title}</span></Text>

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
                        {submitError && (
                            <MessageBar intent="error" className="mx-4 mb-2">
                                <MessageBarBody>
                                    <Text size={200}>{submitError}</Text>
                                </MessageBarBody>
                            </MessageBar>
                        )}
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary" disabled={isSubmitting}>Cancel</Button>
                            </DialogTrigger>
                            <Button
                                type="submit"
                                appearance="primary"
                                disabled={!revenue || !technicians || !date || isSubmitting}
                                icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
                            >
                                {isSubmitting ? "Submitting…" : "Submit"}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </form>
            </DialogSurface>
        </Dialog>
    );
}
