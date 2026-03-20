import type { Slide } from "../types";
import { makePlaceholder } from "../config/constants";
import spConfig from "../../sharepoint.config.json";

const { tenantDomain, sitePath, mockSourceListPath } = spConfig;

/**
 * Builds an absolute SharePoint embed URL using the configured domain.
 */
const buildRelativeSpLink = (fileName: string) => {
    // Construct path ensuring single slashes (e.g. /sites/MySite/Library/File.pptx)
    const filePath = `${sitePath}/${mockSourceListPath}/${fileName}`.replace(/\/+/g, '/');
    return `${tenantDomain}${sitePath}/_layouts/15/Doc.aspx?sourcedoc=${encodeURIComponent(filePath)}&action=embedview`;
};

export const MOCK_SLIDES: Slide[] = [
    {
        id: "m1",
        title: "Capability Assessment",
        type: "Assessment",
        thumbnail: makePlaceholder("Capability Assessment", 0),
        fileName: "Capability Assessment.pptx",
        embedUrl: buildRelativeSpLink("Capability Assessment.pptx")
    },
    {
        id: "m2",
        title: "RFP Sample",
        type: "Proposal",
        thumbnail: makePlaceholder("RFP Sample", 1),
        fileName: "RFP Sample.pptx",
        embedUrl: buildRelativeSpLink("RFP Sample.pptx")
    },
    {
        id: "m3",
        title: "Tech Optimisation Template",
        type: "Template",
        thumbnail: makePlaceholder("Tech Template", 2),
        fileName: "Tech PPT Template.pptx",
        embedUrl: buildRelativeSpLink("Tech PPT Template.pptx")
    },
    {
        id: "m4",
        title: "Internship Module 1",
        type: "Training",
        thumbnail: makePlaceholder("Internship", 3),
        fileName: "Internship -Module-1.pptx",
        embedUrl: buildRelativeSpLink("Internship -Module-1.pptx")
    },
    {
        id: "m5",
        title: "ipro-sec23",
        type: "Internal",
        thumbnail: makePlaceholder("ipro-sec23", 4),
        fileName: "ipro-sec23.pptx",
        embedUrl: buildRelativeSpLink("ipro-sec23.pptx")
    },
    {
        id: "m6",
        title: "ipro-sec45",
        type: "Internal",
        thumbnail: makePlaceholder("ipro-sec45", 5),
        fileName: "ipro-sec45.pptx",
        embedUrl: buildRelativeSpLink("ipro-sec45.pptx")
    }
];

export const DISPLAY_TITLES = [
    "Capability Assessment",
    "RFP Sample",
    "Tech Optimisation",
    "Internship Module 1",
    "ipro-sec23",
    "ipro-sec45"
];
