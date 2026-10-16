import appPromise from "./app.bundle.js";

export default async function handler(req, res) {
  try {
    const app = await appPromise;
    if (!app) {
      res.status(500).json({ error: "API server failed to initialize" });
      return;
    }
    return app(req, res);
  } catch (err) {
    res.status(500).json({ error: "Serverless function error", detail: err?.message || String(err) });
  }
}
