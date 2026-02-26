import iproLogoRaw from "../assets/ipro-logo.svg?raw";

// Inline SVG placeholder with i-PRO branding
export function makePlaceholder(_label: string, index: number = 0): string {
    // Branded color palette - scrambled and filtered (No Gray3/4)
    const backgrounds = [
        "#E2E3E3"
    ];

    const bgColor = backgrounds[index % backgrounds.length];

    // Clean up the raw SVG to embed it easily (extracting the content within the svg tag)
    const logoContent = iproLogoRaw
        .replace(/<svg[^>]*>/, "")
        .replace(/<\/svg>/, "");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
    <rect width="400" height="225" fill="${bgColor}"/>
    
    <!-- Decorative subtle gradient overlay -->
    <defs>
        <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:white;stop-opacity:0.05" />
            <stop offset="100%" style="stop-color:black;stop-opacity:0.1" />
        </linearGradient>
    </defs>
    <rect width="400" height="225" fill="url(#overlay)"/>

    <!-- Branded Logo injected from assets/ipro-logo.svg -->
    <g transform="translate(98, 89) scale(0.825)" fill-opacity="0.25">
        ${logoContent}
    </g>
  </svg>`;

    // Use a Unicode-safe base64 conversion
    const utf8Bytes = new TextEncoder().encode(svg);
    const binaryString = Array.from(utf8Bytes).map(b => String.fromCharCode(b)).join('');
    return `data:image/svg+xml;base64,${btoa(binaryString)}`;
}
