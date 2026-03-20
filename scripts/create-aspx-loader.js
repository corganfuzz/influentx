import fs from "fs";
import path from "path";

// ── SharePoint target configuration ──
// We load this from a dedicated JSON file so it can be committed to Git
// while being easily updated for different sites/folders.
const configPath = path.resolve("./sharepoint.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Construct the base path (ensuring proper trailing slash)
const SP_BASE = `${config.sitePath}/${config.targetFolder}/`.replace(/\/+/g, '/');

const distDir = path.resolve("./dist");
const htmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(htmlPath)) {
    console.error("ERROR: dist/index.html not found. Run the Vite build first.");
    process.exit(1);
}

// Read Vite's built index.html (which uses relative './' paths)
let builtHtml = fs.readFileSync(htmlPath, "utf-8");

// Rewrite relative paths (./) to the absolute SharePoint base path
const spHtml = builtHtml.replaceAll('./', SP_BASE);

// Wrap in the SharePoint ASPX structure
const aspxContent =
    `<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="~site/_catalogs/masterpage/seattle.master" MainContentID="PlaceHolderMain" meta:progid="SharePoint.WebPartPage.Document" %>\r\n` +
    `\r\n` +
    `<asp:Content ContentPlaceholderID="PlaceHolderPageTitleInTitleArea" runat="server"></asp:Content>\r\n` +
    `<asp:Content ContentPlaceholderID="PlaceHolderLeftNavBar" runat="server"></asp:Content>\r\n` +
    `<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">\r\n` +
    spHtml.trim() + `\r\n` +
    `</asp:Content>\r\n`;

fs.writeFileSync(path.join(distDir, "index.aspx"), aspxContent);
console.log("✓ index.aspx generated using configuration from sharepoint.config.json");
console.log("  Target SharePoint Base: " + SP_BASE);

