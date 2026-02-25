import type { Slide } from "../types";

// Inline SVG placeholder
function makePlaceholder(label: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
    <rect width="400" height="225" fill="#E2E3E3"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Segoe UI, sans-serif" font-size="18" font-weight="600" fill="#1C1F2A">${label}</text>
  </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const SLIDES: Slide[] = [
    { id: "s1", title: "Q3 Financial Overview", type: "Financial", thumbnail: makePlaceholder("Financial Overview") },
    { id: "s2", title: "Marketing Strategy 2026", type: "Marketing", thumbnail: makePlaceholder("Marketing Strategy") },
    { id: "s3", title: "Engineering Roadmap", type: "Engineering", thumbnail: makePlaceholder("Eng Roadmap") },
];
