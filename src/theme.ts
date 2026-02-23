import { createLightTheme } from "@fluentui/react-components";
import type { Theme } from "@fluentui/react-components";

// Custom brand colors (i-PRO Blue)
export const brandBlue = {
    10: "#060617",
    20: "#13132e",
    30: "#1f1f45",
    40: "#2a2a5c",
    50: "#363673",
    60: "#42428a",
    70: "#4e4ea1",
    80: "#5a5ab8",
    90: "#6464e6", // i-PRO Blue
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

    // Page Background
    colorNeutralBackground2: "#f3f4f6", // Very light off-white/gray for full page

    // Card/Form Surface
    colorNeutralBackground1: "#ffffff", // Pure white for cards

    // Borders
    colorNeutralStroke1: "#E2E3E3",     // Gray4: Soft borders
    colorNeutralStroke2: "#BDC0BF",     // Gray3: Hovered/stronger borders

    // Text hierarchy
    colorNeutralForeground1: "#1C1F2A", // Gray1: Primary text — headings, labels
    colorNeutralForeground2: "#808080", // Gray2: Secondary/helper text, subtitles
    colorNeutralForeground3: "#BDC0BF", // Gray3: Metadata

    // Brand Overrides
    colorBrandBackground: "#6464e6",
    colorBrandBackgroundHover: "#5a5ab8",
    colorBrandBackgroundPressed: "#4e4ea1",
    colorCompoundBrandBackground: "#6464e6",
};
