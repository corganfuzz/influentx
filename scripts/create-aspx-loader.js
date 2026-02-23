import fs from "fs";
import path from "path";

// ── SharePoint target path (edit this to match your site) ──
const SP_BASE = "/sites/Experiments/SiteAssets/SitePages/influent/";

const distDir = path.resolve("./dist");
const htmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(htmlPath)) {
    console.error("ERROR: dist/index.html not found. Run the Vite build first.");
    process.exit(1);
}

// Read Vite's built index.html (which uses relative './' paths)
let builtHtml = fs.readFileSync(htmlPath, "utf-8");

// Rewrite relative paths (./) to the absolute SharePoint base path
// e.g. "./assets/index-xxx.js" → "/sites/Experiments/SiteAssets/influent/assets/index-xxx.js"
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
console.log("✓ index.aspx generated with SharePoint paths: " + SP_BASE);
console.log("  index.html is unchanged and still works locally.");
