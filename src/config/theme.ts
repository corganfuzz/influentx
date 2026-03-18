import { createLightTheme, makeStyles, tokens } from "@fluentui/react-components";
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

    // Page Background - Slightly off-white for contrast against pure white cards
    colorNeutralBackground2: "#f9fafb",

    // Card/Form Surface
    colorNeutralBackground1: "#ffffff",

    // Borders
    colorNeutralStroke1: "#E2E3E3",     // Gray4
    colorNeutralStroke2: "#BDC0BF",     // Gray3

    // Text hierarchy
    colorNeutralForeground1: "#1C1F2A", // Gray1
    colorNeutralForeground2: "#808080", // Gray2
    colorNeutralForeground3: "#BDC0BF", // Gray3

    // Brand Overrides
    colorBrandBackground: "#6464e6",
    colorBrandBackgroundHover: "#5a5ab8",
    colorBrandBackgroundPressed: "#4e4ea1",
    colorCompoundBrandBackground: "#6464e6",
};

// Global Component Styles (Griffel)
export const useSharedStyles = makeStyles({
    // Preview Dialog Layouts
    dialogSurface: {
        maxWidth: '1400px',
        width: '90vw',
    },
    dialogActions: {
        display: 'flex',
        gap: '8px',
    },
    previewContainer: {
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: tokens.colorNeutralBackground1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    iframeLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        backgroundColor: tokens.colorNeutralBackground1,
    },
    iframe: {
        width: '100%',
        height: '100%',
        border: 'none',
        transition: 'opacity 0.3s ease',
    }
});
