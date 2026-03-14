import type { Slide } from "../types";
import { makePlaceholder } from "../config/constants";

export const MOCK_SLIDES: Slide[] = [
    {
        id: "s1",
        title: "Capability Assessment",
        type: "Assessment",
        thumbnail: makePlaceholder("Capability Assessment", 0),
        fileName: "Deloitte Optimisation & Delivery - Task 2 - Capability Assessment.pptx",
        embedUrl: "https://cirtep.sharepoint.com/sites/Experiments/_layouts/15/Doc.aspx?sourcedoc=%7B89204BC4-8C57-46A8-87BF-393270E432F5%7D&action=embedview"
    },
    {
        id: "s2",
        title: "RFP Sample",
        type: "Proposal",
        thumbnail: makePlaceholder("RFP Sample", 1),
        fileName: "Deloitte Optimisation and Delivery - Task 3 - RFP Sample.pptx",
        embedUrl: "https://cirtep.sharepoint.com/sites/Experiments/_layouts/15/Doc.aspx?sourcedoc=%2Fsites%2FExperiments%2FShared%20Documents%2FDeloitte%20Optimisation%20and%20Delivery%20%2D%20Task%203%20%2D%20RFP%20Sample%2Epptx&action=embedview"
    },
    {
        id: "s3",
        title: "Tech Optimisation Template",
        type: "Template",
        thumbnail: makePlaceholder("Tech Template", 2),
        fileName: "Deloitte Tech Optimisation and Delivery PPT Template.pptx",
        embedUrl: "https://cirtep.sharepoint.com/sites/Experiments/_layouts/15/Doc.aspx?sourcedoc=%2Fsites%2FExperiments%2FShared%20Documents%2FDeloitte%20Tech%20Optimisation%20and%20Delivery%20PPT%20Template%2Epptx&action=embedview"
    },
    {
        id: "s4",
        title: "Virtual Internship Module 1",
        type: "Training",
        thumbnail: makePlaceholder("Virtual Internship", 3),
        fileName: "Deloitte TSI - Virtual Internship -Module-1.pptx",
        embedUrl: "https://cirtep.sharepoint.com/sites/Experiments/_layouts/15/Doc.aspx?sourcedoc=%2Fsites%2FExperiments%2FShared%20Documents%2FDeloitte%20TSI%20%2D%20Virtual%20Internship%20%2DModule%2D1%2Epptx&action=embedview"
    },
    {
        id: "s5",
        title: "ipro-sec23",
        type: "Internal",
        thumbnail: makePlaceholder("ipro-sec23", 4),
        fileName: "ipro-sec23.pptx",
        embedUrl: "https://cirtep.sharepoint.com/sites/Experiments/_layouts/15/Doc.aspx?sourcedoc=%2Fsites%2FExperiments%2FShared%20Documents%2Fipro%2Dsec23%2Epptx&action=embedview"
    },
    {
        id: "s6",
        title: "ipro-sec45",
        type: "Internal",
        thumbnail: makePlaceholder("ipro-sec45", 5),
        fileName: "ipro-sec45.pptx",
        embedUrl: "https://cirtep.sharepoint.com/sites/Experiments/_layouts/15/Doc.aspx?sourcedoc=%2Fsites%2FExperiments%2FShared%20Documents%2Fipro%2Dsec45%2Epptx&action=embedview"
    }
];

export const DISPLAY_TITLES = [
    "Q3 Financial Overview",
    "Marketing Strategy 2026",
    "Engineering Roadmap"
];
