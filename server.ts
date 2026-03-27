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
      let webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      // Auto-fix test URLs to production URLs to prevent 404s if the secret is stuck
      if (webhookUrl && webhookUrl.includes('/webhook-test/')) {
        webhookUrl = webhookUrl.replace('/webhook-test/', '/webhook/');
      }
      
      console.log('Backend processing draft generation. Webhook:', webhookUrl, payload);
      
      let caption = `Legenda gerada para: ${payload.prompt}\n\n#Automação #IA #MultiPost`;
      let imageUrl = 'https://picsum.photos/seed/generated/800/1000';
      let webhookStatus = 'not_called';
      let webhookError = null;
      let webhookResponseText = '';

      if (webhookUrl) {
        try {
          console.log(`Calling n8n webhook at ${webhookUrl}...`);
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'generate',
              data: payload
            })
          });
          
          webhookStatus = response.status.toString();
          webhookResponseText = await response.text();
          
          if (response.ok) {
            try {
              const result = JSON.parse(webhookResponseText);
              console.log('n8n webhook response:', result);
              
              // Handle n8n's default response format or custom format
              let responseData = result;
              if (Array.isArray(result) && result.length > 0) {
                responseData = result[0];
              }

              if (responseData.post_legenda) {
                caption = responseData.post_legenda;
              } else if (responseData.caption) {
                caption = responseData.caption;
              } else if (responseData.data && responseData.data.caption) {
                caption = responseData.data.caption;
              }
              
              if (responseData.post_imagem_url) {
                imageUrl = responseData.post_imagem_url;
              } else if (responseData.imageUrl) {
                imageUrl = responseData.imageUrl;
              } else if (responseData.data && responseData.data.imageUrl) {
                imageUrl = responseData.data.imageUrl;
              }
            } catch (e) {
              console.log('n8n webhook response was not JSON:', webhookResponseText);
              // If n8n just returns a success message, we keep the default simulated values
            }
          } else {
            console.error('n8n webhook failed with status:', response.status, response.statusText);
            webhookError = `HTTP ${response.status} ${response.statusText} - ${webhookResponseText.substring(0, 100)}`;
          }
        } catch (err: any) {
          console.error('Error calling n8n webhook:', err);
          webhookStatus = 'error';
          webhookError = err.message || String(err);
        }
      } else {
        console.log('No N8N_WEBHOOK_URL configured. Simulating response.');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      res.json({
        id: `d${Date.now()}`,
        prompt: payload.prompt,
        caption,
        imageUrl,
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
        tone: payload.tone,
        hashtags: payload.hashtags,
        _debug: {
          webhookUrl,
          webhookStatus,
          webhookError,
          webhookResponseText: webhookResponseText.substring(0, 200)
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate draft' });
    }
  });

  app.post("/api/drafts/approve", async (req, res) => {
    try {
      const { draftId, caption } = req.body;
      let webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      if (webhookUrl && webhookUrl.includes('/webhook-test/')) {
        webhookUrl = webhookUrl.replace('/webhook-test/', '/webhook/');
      }
      
      console.log('Backend approving draft:', webhookUrl, { draftId, caption });

      if (webhookUrl) {
        try {
          console.log(`Calling n8n webhook for APPROVAL at ${webhookUrl}...`);
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'approve',
              data: { draftId, caption }
            })
          });
        } catch (err) {
          console.error('Error calling n8n webhook:', err);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to approve draft' });
    }
  });

  app.post("/api/drafts/reject", async (req, res) => {
    try {
      const { draftId, feedback, caption: oldCaption } = req.body;
      let webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      if (webhookUrl && webhookUrl.includes('/webhook-test/')) {
        webhookUrl = webhookUrl.replace('/webhook-test/', '/webhook/');
      }
      
      console.log('Backend rejecting draft:', webhookUrl, { draftId, feedback });

      let newCaption = oldCaption;
      let newImageUrl = '';
      let webhookStatus = 'not_called';
      let webhookError = null;
      let webhookResponseText = '';

      if (webhookUrl) {
        try {
          console.log(`Calling n8n webhook for REJECTION at ${webhookUrl}...`);
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'reject',
              data: { draftId, feedback, caption: oldCaption }
            })
          });
          
          webhookStatus = response.status.toString();
          webhookResponseText = await response.text();
          
          if (response.ok) {
            try {
              const result = JSON.parse(webhookResponseText);
              console.log('n8n webhook response (reject):', result);
              
              let responseData = result;
              if (Array.isArray(result) && result.length > 0) {
                responseData = result[0];
              }

              if (responseData.post_legenda) {
                newCaption = responseData.post_legenda;
              } else if (responseData.caption) {
                newCaption = responseData.caption;
              } else if (responseData.data && responseData.data.caption) {
                newCaption = responseData.data.caption;
              }
              
              if (responseData.post_imagem_url) {
                newImageUrl = responseData.post_imagem_url;
              } else if (responseData.imageUrl) {
                newImageUrl = responseData.imageUrl;
              } else if (responseData.data && responseData.data.imageUrl) {
                newImageUrl = responseData.data.imageUrl;
              }
            } catch (e) {
              console.log('n8n webhook response was not JSON:', webhookResponseText);
            }
          } else {
            console.error('n8n webhook failed with status:', response.status, response.statusText);
            webhookError = `HTTP ${response.status} ${response.statusText} - ${webhookResponseText.substring(0, 100)}`;
          }
        } catch (err: any) {
          console.error('Error calling n8n webhook:', err);
          webhookStatus = 'error';
          webhookError = err.message || String(err);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        newCaption = `[REVISADO] ${oldCaption}\n\nFeedback aplicado: ${feedback}`;
        newImageUrl = 'https://picsum.photos/seed/revised/800/1000';
      }
      
      res.json({ 
        success: true,
        caption: newCaption,
        imageUrl: newImageUrl,
        _debug: {
          webhookUrl,
          webhookStatus,
          webhookError,
          webhookResponseText: webhookResponseText.substring(0, 200)
        }
      });
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
