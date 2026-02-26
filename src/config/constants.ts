// Inline SVG placeholder
export function makePlaceholder(label: string): string {
    // Escape special characters for SVG text node (especially ampersands in Deloitte names)
    const escapedLabel = label
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
    <rect width="400" height="225" fill="#E2E3E3"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Segoe UI, sans-serif" font-size="18" font-weight="600" fill="#1C1F2A">${escapedLabel}</text>
  </svg>`;

    // Use a Unicode-safe base64 conversion
    const utf8Bytes = new TextEncoder().encode(svg);
    const binaryString = Array.from(utf8Bytes).map(b => String.fromCharCode(b)).join('');
    return `data:image/svg+xml;base64,${btoa(binaryString)}`;
}
