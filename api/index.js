import http from "node:http";
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

function proxyToVps(req, res, targetPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "201.18.198.110",
      port: 8787,
      path: targetPath,
      method: req.method,
      headers: {
        ...req.headers,
        host: "201.18.198.110:8787",
        "x-forwarded-for": req.headers["x-forwarded-for"] || req.socket?.remoteAddress || ""
      },
      timeout: 15000
    };

    let bodyBuffer = null;
    if (req.body) {
      if (Buffer.isBuffer(req.body)) {
        bodyBuffer = req.body;
      } else if (typeof req.body === "object") {
        bodyBuffer = Buffer.from(JSON.stringify(req.body));
      } else if (typeof req.body === "string") {
        bodyBuffer = Buffer.from(req.body);
      }
      if (bodyBuffer) {
        options.headers["content-length"] = bodyBuffer.length;
      }
    }

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
      proxyRes.on("end", () => resolve(true));
    });

    proxyReq.on("timeout", () => {
      proxyReq.destroy();
      reject(new Error("VPS proxy timeout"));
    });

    proxyReq.on("error", (err) => {
      reject(err);
    });

    if (bodyBuffer) {
      proxyReq.write(bodyBuffer);
      proxyReq.end();
    } else {
      req.pipe(proxyReq);
    }
  });
}

export default async function handler(req, res) {
  // When rewritten by Vercel from /api/... to /api, x-matched-path contains the original path
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"] || req.headers["x-forwarded-uri"];
  let targetPath = req.url || "/";
  if (matchedPath && matchedPath.startsWith("/api")) {
    const qIndex = (req.url || "").indexOf("?");
    const query = qIndex !== -1 ? req.url.slice(qIndex) : "";
    targetPath = matchedPath.split("?")[0] + query;
    req.url = targetPath;
  }

  // 1. Attempt proxy to Hostinger VPS (whitelisted egress IP 201.18.198.110 for live Digitap APIs)
  try {
    await proxyToVps(req, res, targetPath);
    return;
  } catch (proxyErr) {
    console.warn("[Vercel Proxy to VPS fallback]", proxyErr?.message);
  }

  // 2. Fallback to local serverless express bundle if VPS is unreachable
  try {
    const app = await resolveApp();
    if (!app) {
      res.status(500).json({ error: "API server failed to initialize" });
      return;
    }

    return app(req, res);
  } catch (err) {
    res.status(500).json({ error: "Serverless function error", detail: err?.message || String(err) });
  }
}
