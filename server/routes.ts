import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { bulkUpdateFixedExtensionsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get fixed extensions
  app.get('/api/blocklist/fixed', async (req, res) => {
    try {
      const extensions = await storage.getFixedExtensions();
      res.json({
        items: extensions.map(ext => ({
          ext: ext.extension,
          blocked: ext.blocked,
          category: ext.category
        })),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching fixed extensions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update fixed extensions
  app.patch('/api/blocklist/fixed', async (req, res) => {
    try {
      const validation = bulkUpdateFixedExtensionsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      await storage.updateFixedExtensions(validation.data.updates);
      res.json({ ok: true });
    } catch (error) {
      console.error('Error updating fixed extensions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get custom extensions
  app.get('/api/blocklist/custom', async (req, res) => {
    try {
      const result = await storage.getCustomExtensions();
      res.json(result);
    } catch (error) {
      console.error('Error fetching custom extensions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Add custom extension
  app.post('/api/blocklist/custom', async (req, res) => {
    try {
      const { ext } = req.body;
      if (!ext || typeof ext !== 'string') {
        return res.status(400).json({ message: 'Extension is required' });
      }

      const result = await storage.addCustomExtension(ext);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error adding custom extension:', error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Delete custom extension
  app.delete('/api/blocklist/custom/:ext', async (req, res) => {
    try {
      const { ext } = req.params;
      await storage.deleteCustomExtension(ext);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting custom extension:', error);
      if (error instanceof Error && error.message === 'Extension not found') {
        res.status(404).json({ message: 'Extension not found' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
