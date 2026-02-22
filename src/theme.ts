import { createLightTheme } from "@fluentui/react-components";
import type { Theme } from "@fluentui/react-components";

// Custom brand colors provided by user
export const brandBlue = {
    10: "#060617",
    20: "#13132e",
    30: "#1f1f45",
    40: "#2a2a5c",
    50: "#363673",
    60: "#42428a",
    70: "#4e4ea1",
    80: "#5a5ab8",
    90: "#6464e6", // Base user primary blue
    100: "#7373e9",
    110: "#8282eb",
    120: "#9191ee",
    130: "#a0a0f0",
    140: "#afaff3",
    150: "#bebef5",
    160: "#cdcdf8",
};

export const appTheme: Theme = {
    ...createLightTheme(brandBlue),
    // Override neutral ramps with user custom grays if needed, 
    // but Fluent defaults are highly tuned. We'll map the primary
    // brand to the requested Blue: #6464e6
    colorBrandBackground: brandBlue[90],
    colorBrandBackgroundHover: brandBlue[80],
    colorBrandBackgroundPressed: brandBlue[70],
    colorCompoundBrandBackground: brandBlue[90],
    colorCompoundBrandBackgroundHover: brandBlue[80],
    colorCompoundBrandBackgroundPressed: brandBlue[70],
    colorBrandForeground1: brandBlue[90],
    colorBrandForeground2: brandBlue[100],
    colorBrandForeground2Hover: brandBlue[90], // Fixed typo
    colorBrandForeground2Pressed: brandBlue[80],
    colorBrandStroke1: brandBlue[90],
    colorBrandStroke2: brandBlue[100],
    colorBrandStroke2Hover: brandBlue[90],
    colorBrandStroke2Pressed: brandBlue[80],

    // Custom Grays requested:
    // Black: #000000, Gray1: #1C1F2A, Gray2: #808080, Gray3: #BDC0BF, Gray4: #E2E3E3
    colorNeutralBackground1: "#ffffff",
    colorNeutralBackground2: "#E2E3E3", // Gray4 for subtle backgrounds
    colorNeutralForeground1: "#1C1F2A", // Gray1 for primary text
    colorNeutralForeground2: "#808080", // Gray2 for secondary text
    colorNeutralForeground3: "#BDC0BF", // Gray3 for tertiary text
    colorNeutralStroke1: "#E2E3E3",     // Gray4 for borders
};
