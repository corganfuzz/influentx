# Influent: React inside Sharepoint

TLDR;

Run a React app inside SharePoint Online , this app allows you to view and edit powerpoint presentations.
<br/><br/>
![editpro4k](https://github.com/user-attachments/assets/77dac586-3b01-44f3-bd4f-dcc724e6ccdb)

## Use Case: Your PPTX files are stored in a SharePoint Document Library
If your PowerPoint templates are stored directly in a SharePoint document library, follow these steps to re-use this app in your own tenant:

1.  **Configure**: Modify the [sharepoint.config.json](./sharepoint.config.json) file with your specific tenant details:
    ```json
    {
      "tenantDomain": "https://your-tenant.sharepoint.com",
      "sitePath": "/sites/your-site",
      "targetFolder": "SiteAssets/SitePages/influent", // A custom folder you create inside your SharePoint "Site Assets" library
      "mockSourceListTitle": "Documents",
      "mockSourceListPath": "Shared Documents"
    }
    ```
2.  **Permissions**: Ensure you have performed the **two PowerShell commands** located at the bottom of this README before attempting the next step.
3.  **Build**: Run the SharePoint mock build command:
    ```bash
    bun run build:spmock
    ```
4.  **Deploy**: Copy the generated **dist** folder contents into the custom folder you created inside your SharePoint **Site Assets** library.
5.  **Launch**: Click on the `index.aspx` file within that library folder to launch the application.

> [!IMPORTANT]
> For this use case, the form cannot be used to edit the presentation. It can only be used to view it. Since the pptx files live inside a sharepoint list and there is no aws lambda middleware to perform this operation.

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


## Configuration

The project uses a two-tier configuration system to balance security and reusability:

- **[sharepoint.config.json](./sharepoint.config.json)** (*Committed*): Stores non-sensitive SharePoint site structure (e.g., `sitePath`, `targetFolder`). This allows the entire team to share the same deployment target.
- **`.env`** (*Gitignored*): Stores sensitive credentials and API keys (e.g., `VITE_TEMPLATES_API_KEY`, SharePoint Client Secrets).

### Updating the Deployment Target
To point the app to a different SharePoint site or library, simply update the values in `sharepoint.config.json`:

```json
{
  "tenantDomain": "https://your-tenant.sharepoint.com",
  "sitePath": "/sites/YourSite",
  "targetFolder": "SiteAssets/YourFolder", // Folder you create inside Site Assets
  "mockSourceListTitle": "Documents",
  "mockSourceListPath": "Shared Documents"
}
```

## Technical Foundation

The Influent frontend is built using **Fluent UI React v2**, the exact same framework utilized by Microsoft to build SharePoint Online and Microsoft 365. This ensures total visual harmony and behavioral consistency within the host environment.

### SharePoint-Specific Delivery Pipeline
Standard Single Page Applications (SPAs) are incompatible with the legacy requirements of SharePoint Classic pages. Influent resolves this through a specialized build pipeline:

1. **Vite Synthesis**: High-performance bundling of the React 19 / TypeScript application.
2. **ASPX Encapsulation**: A post-build script (`scripts/create-aspx-loader.js`) wraps the application in an `.aspx` container. It dynamically reads your site path from `sharepoint.config.json` and rewrites all asset pointers to point to your SharePoint library.
3. **Mock Mode**: Running `bun run build:spmock` generates a version of the app that uses local mock data, perfect for UI/UX validation within SharePoint without live API dependencies.

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

# Generates a SharePoint-ready build using local mock data
bun run build:spmock
```

> [!IMPORTANT]
> To make this work with SharePoint Online, you need to ensure "Custom Script" is enabled for your site. Run the following PnP PowerShell commands:

```powershell
Connect-PnPOnline -Url "https://your-tenant.sharepoint.com/sites/your-site" -Interactive
Set-PnPTenantSite -Url "https://your-tenant.sharepoint.com/sites/your-site" -DenyAddAndCustomizePages $false
```
