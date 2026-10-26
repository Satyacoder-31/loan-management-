import appPromise, { createApp } from "./app.bundle.js";

let cachedApp = null;

async function resolveApp() {
  if (cachedApp) return cachedApp;
  if (appPromise) {
    cachedApp = await appPromise;
    if (cachedApp) return cachedApp;
  }
  if (typeof createApp === "function") {
    cachedApp = await createApp();
    return cachedApp;
  }
  return null;
}

export default async function handler(req, res) {
  try {
    const app = await resolveApp();
    if (!app) {
      res.status(500).json({ error: "API server failed to initialize" });
      return;
    }

    // When rewritten by Vercel from /api/... to /api, x-matched-path contains the original path
    const matchedPath = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"] || req.headers["x-forwarded-uri"];
    if (matchedPath && matchedPath.startsWith("/api")) {
      const qIndex = (req.url || "").indexOf("?");
      const query = qIndex !== -1 ? req.url.slice(qIndex) : "";
      req.url = matchedPath.split("?")[0] + query;
    }

    return app(req, res);
  } catch (err) {
    res.status(500).json({ error: "Serverless function error", detail: err?.message || String(err) });
  }
}

