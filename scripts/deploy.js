import fs from "fs-extra";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Use file path resolution so it can run correctly from npm scripts
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
    SP_TENANT_ID,
    SP_CLIENT_ID,
    SP_CLIENT_SECRET,
    SP_SITE_HOSTNAME,
    SP_SITE_PATH,
    SP_TARGET_FOLDER
} = process.env;

async function getAccessToken() {
    const res = await fetch(`https://login.microsoftonline.com/${SP_TENANT_ID}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: SP_CLIENT_ID,
            scope: "https://graph.microsoft.com/.default",
            client_secret: SP_CLIENT_SECRET,
            grant_type: "client_credentials"
        })
    });
    return (await res.json()).access_token;
}

async function getSiteId(token) {
    const res = await fetch(`https://graph.microsoft.com/v1.0/sites/${SP_SITE_HOSTNAME}:${SP_SITE_PATH}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return (await res.json()).id;
}

async function getDriveId(token, siteId) {
    const res = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const drives = (await res.json()).value;
    return drives.find(d => d.name === "Site Assets").id;
}

async function uploadRecursive(token, siteId, driveId, dir, base = "") {
    const entries = await fs.readdir(dir);

    for (const entry of entries) {
        const full = path.join(dir, entry);
        const relative = path.join(SP_TARGET_FOLDER, base, entry).replace(/\\/g, "/");

        if ((await fs.stat(full)).isDirectory()) {
            await uploadRecursive(token, siteId, driveId, full, path.join(base, entry));
        } else {
            const content = await fs.readFile(full);
            await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${relative}:/content`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/octet-stream"
                },
                body: content
            });
            console.log("Uploaded:", relative);
        }
    }
}

async function deploy() {
    try {
        const token = await getAccessToken();
        const siteId = await getSiteId(token);
        const driveId = await getDriveId(token, siteId);
        await uploadRecursive(token, siteId, driveId, path.resolve(__dirname, "../dist"));
        console.log("Deployment Complete.");
    } catch (error) {
        console.error("Deployment Failed:", error);
    }
}

deploy();
