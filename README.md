# Influent: React inside Sharepoint

TLDR;

Run a React app inside SharePoint Online , this app allows you to view and edit dynamic powerpoint presentations.

## Functional Scope

Influent provides an end-to-end pipeline for the lifecycle management of dynamic presentations within the SharePoint environment:

- **Template Retrieval**: The system interfaces with centralized AWS S3 repositories to catalog and surface PPTX templates.
- **Dynamic Synthesis**: A declarative form captures business logic and telemetry, which is then injected into the selected template's XML structure via a serverless execution environment.
- **Secure Preview**: High-fidelity, in-browser rendering of presentations prior to final generation.

## Secure Preview Architecture: A Zero-Trust Approach

The preview mechanism is designed with a defense-in-depth philosophy to ensure that document streams are never exposed to unauthorized entities.

### The Security Handshake
1.  **Tokenized Identity**: When a template is surfaced, the backend mists a short-lived, **HMAC-SHA256 signed JWT**. This token encapsulates the specific file identity and is signed using a 64-character secret managed in AWS SSM.
2.  **Request Proxied Authorization**: The frontend never communicates directly with the storage layer for previews. Instead, it calls a secure `/preview` gateway. This gateway performs a cryptographic validation of the JWT signature and expiration before any further action is taken.
3.  **Ephemeral Presigning**: Upon successful authorization, the system generates a **temporary S3 presigned URL** with a strictly limited TTL (Time-to-Live).
4.  **Controlled Redirection**: The backend issues a `302 Found` redirect. This instructs the Microsoft Office Online WOPI proxy to fetch the document stream directly from the presigned S3 endpoint.

### Why this is Secure
-   **No Persistent Access**: No part of the frontend or the public internet has persistent ACL (Access Control List) permissions to the S3 buckets. 
-   **Stateless Integrity**: The JWT ensures that neither the filename nor the request parameters can be tampered with in transit.
-   **Limited Radius**: Even if a presigned URL were intercepted, it is valid only for seconds, and the JWT that generated it is valid only for minutes, making the window for exploitation negligible.
-   **Isolation**: The document bytes are streamed directly from AWS to Microsoft's secure viewing servers, ensuring your enterprise infrastructure is never burdened with heavy binary traffic.


## Technical Foundation

The Influent frontend is built using **Fluent UI React v2**, the exact same framework utilized by Microsoft to build SharePoint Online and Microsoft 365. This ensures total visual harmony and behavioral consistency within the host environment.

### SharePoint-Specific Delivery Pipeline
Standard Single Page Applications (SPAs) are incompatible with the legacy requirements of SharePoint Classic pages. Influent resolves this through a specialized build pipeline:

1. **Vite Synthesis**: High-performance bundling of the React 19 / TypeScript application.
2. **ASPX Encapsulation**: A post-build script (`scripts/create-aspx-loader.js`) wraps the application in an `.aspx` container, mapping critical JS/CSS assets to the SharePoint directory: `/sites/Experiments/SiteAssets/SitePages/influent/`.

## Architectural Highlight: Proxy-Based Previews

The `TemplateCard` component leverages a secure integration with Microsoft Office Online for in-browser presentation rendering:

- **Embed Interface**: `https://view.officeapps.live.com/op/embed.aspx`
- **Identity Proxy**: Requests are routed through a secure backend `/preview` gateway using ephemeral HMAC-signed JWTs.
- **Protocol Optimization**: A `.pptx` extension hint is injected into the query string to satisfy the Office Online viewer's strict file-type detection logic.

## Development Workflow

### Dependency Management
```bash
bun install
```

### Production Package Generation
```bash
# Triggers the dedicated SharePoint .aspx loader build
bun run build:sp
```

> [!IMPORTANT]
> To make this work with sharepoint online you need to run a couple of Powershell Commands to interact to your O365 tenant

```powershell
Connect-PnPOnline -Url "https://your_tenant.sharepoint.com/sites/your_site" -Interactive -ClientId "your_entra_id"
set-pnpTenantSite -Url "https://your_tenant.sharepoint.com/sites/your_site" -DenyAddAndCustomizePages: $false
```

