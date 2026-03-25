import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/drafts/generate", async (req, res) => {
    try {
      const payload = req.body;
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      console.log('Backend processing draft generation. Webhook:', webhookUrl, payload);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate response
      res.json({
        id: `d${Date.now()}`,
        prompt: payload.prompt,
        caption: `Legenda gerada para: ${payload.prompt}\n\n#Automação #IA #MultiPost`,
        imageUrl: 'https://picsum.photos/seed/generated/800/1000',
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
        tone: payload.tone,
        hashtags: payload.hashtags
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate draft' });
    }
  });

  app.post("/api/drafts/approve", async (req, res) => {
    try {
      const { draftId, caption } = req.body;
      console.log('Backend approving draft:', process.env.N8N_WEBHOOK_URL, { draftId, caption });
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to approve draft' });
    }
  });

  app.post("/api/drafts/reject", async (req, res) => {
    try {
      const { draftId, feedback } = req.body;
      console.log('Backend rejecting draft:', process.env.N8N_WEBHOOK_URL, { draftId, feedback });
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to reject draft' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
