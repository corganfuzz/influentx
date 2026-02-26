import type { Slide } from "../types";
import { makePlaceholder } from "../config/constants";

export const MOCK_SLIDES: Slide[] = [
    {
        id: "s1",
        title: "Q3 Financial Overview",
        type: "Financial",
        thumbnail: makePlaceholder("Financial Overview", 0),
        fileName: "Q3_Financial_Overview.pptx"
    },
    {
        id: "s2",
        title: "Marketing Strategy 2026",
        type: "Marketing",
        thumbnail: makePlaceholder("Marketing Strategy", 1),
        fileName: "Marketing_Strategy_2026.pptx"
    },
    {
        id: "s3",
        title: "Engineering Roadmap",
        type: "Engineering",
        thumbnail: makePlaceholder("Eng Roadmap", 2),
        fileName: "Engineering_Roadmap.pptx"
    },
    {
        id: "s4",
        title: "Q3 Financial Overview",
        type: "Financial",
        thumbnail: makePlaceholder("Financial Overview", 3),
        fileName: "Q3_Financial_Overview.pptx"
    },
    {
        id: "s5",
        title: "Marketing Strategy 2026",
        type: "Marketing",
        thumbnail: makePlaceholder("Marketing Strategy", 4),
        fileName: "Marketing_Strategy_2026.pptx"
    },
    {
        id: "s6",
        title: "Engineering Roadmap",
        type: "Engineering",
        thumbnail: makePlaceholder("Eng Roadmap", 5),
        fileName: "Engineering_Roadmap.pptx"
    }
];
