import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Classificacao routes
  app.get("/api/classificacoes", async (req, res) => {
    try {
      const classificacoes = await storage.getClassificacoes();
      res.json(classificacoes);
    } catch (error) {
      console.error('Error fetching classificacoes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get("/api/classificacoes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const classificacao = await storage.getClassificacao(id);
      
      if (!classificacao) {
        return res.status(404).json({ error: 'Classificação não encontrada' });
      }
      
      res.json(classificacao);
    } catch (error) {
      console.error('Error fetching classificacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post("/api/classificacoes", async (req, res) => {
    try {
      const { classificacao, ativo = true } = req.body;
      
      if (!classificacao) {
        return res.status(400).json({ error: 'Nome da classificação é obrigatório' });
      }

      const newClassificacao = await storage.createClassificacao({
        classificacao,
        ativo,
        fkuser: 0 // Default user
      });
      
      res.status(201).json(newClassificacao);
    } catch (error) {
      console.error('Error creating classificacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put("/api/classificacoes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const classificacao = await storage.updateClassificacao(id, updates);
      res.json(classificacao);
    } catch (error) {
      console.error('Error updating classificacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete("/api/classificacoes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClassificacao(id);
      
      if (success) {
        res.json({ message: 'Classificação excluída com sucesso' });
      } else {
        res.status(404).json({ error: 'Classificação não encontrada' });
      }
    } catch (error) {
      console.error('Error deleting classificacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Produto routes
  app.get("/api/produtos", async (req, res) => {
    try {
      const produtos = await storage.getProdutos();
      res.json(produtos);
    } catch (error) {
      console.error('Error fetching produtos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Tombamento routes
  app.get("/api/tombamentos", async (req, res) => {
    try {
      const tombamentos = await storage.getTombamentos();
      res.json(tombamentos);
    } catch (error) {
      console.error('Error fetching tombamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get("/api/tombamentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tombamento = await storage.getTombamento(id);
      
      if (!tombamento) {
        return res.status(404).json({ error: 'Tombamento não encontrado' });
      }
      
      res.json(tombamento);
    } catch (error) {
      console.error('Error fetching tombamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post("/api/tombamentos", upload.array('photos'), async (req, res) => {
    try {
      const { fkproduto, tombamento, serial, responsavel, status = 'disponivel' } = req.body;
      
      if (!fkproduto || !tombamento) {
        return res.status(400).json({ error: 'Produto e número de tombamento são obrigatórios' });
      }

      // Handle uploaded photos
      let photos = null;
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        photos = (req.files as Express.Multer.File[]).map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }));
      }

      const newTombamento = await storage.createTombamento({
        fkproduto: parseInt(fkproduto),
        tombamento,
        serial,
        photos,
        responsavel,
        status,
        fkuser: 0
      });
      
      res.status(201).json(newTombamento);
    } catch (error) {
      console.error('Error creating tombamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put("/api/tombamentos/:id", upload.array('photos'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = { ...req.body };
      
      // Handle uploaded photos
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        updates.photos = (req.files as Express.Multer.File[]).map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }));
      }

      if (updates.fkproduto) {
        updates.fkproduto = parseInt(updates.fkproduto);
      }
      
      const tombamento = await storage.updateTombamento(id, updates);
      res.json(tombamento);
    } catch (error) {
      console.error('Error updating tombamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete("/api/tombamentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTombamento(id);
      
      if (success) {
        res.json({ message: 'Tombamento excluído com sucesso' });
      } else {
        res.status(404).json({ error: 'Tombamento não encontrado' });
      }
    } catch (error) {
      console.error('Error deleting tombamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Alocacao routes
  app.get("/api/alocacoes", async (req, res) => {
    try {
      const alocacoes = await storage.getAlocacoes();
      res.json(alocacoes);
    } catch (error) {
      console.error('Error fetching alocacoes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post("/api/alocacoes", upload.array('photos'), async (req, res) => {
    try {
      const { fktombamento, fkunidadesaude, fksetor, responsavel_unidade, dataalocacao, termo, responsavel } = req.body;
      
      if (!fktombamento || !fkunidadesaude || !responsavel_unidade || !dataalocacao) {
        return res.status(400).json({ error: 'Tombamento, unidade, responsável e data são obrigatórios' });
      }

      // Handle uploaded photos
      let photos = null;
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        photos = (req.files as Express.Multer.File[]).map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }));
      }

      const newAlocacao = await storage.createAlocacao({
        fktombamento: parseInt(fktombamento),
        fkunidadesaude: parseInt(fkunidadesaude),
        fksetor: fksetor ? parseInt(fksetor) : undefined,
        responsavel_unidade,
        dataalocacao: new Date(dataalocacao),
        photos,
        termo,
        responsavel,
        fkuser: 0
      });
      
      res.status(201).json(newAlocacao);
    } catch (error) {
      console.error('Error creating alocacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put("/api/alocacoes/:id", upload.array('photos'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = { ...req.body };
      
      // Handle uploaded photos
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        updates.photos = (req.files as Express.Multer.File[]).map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }));
      }

      // Convert string fields to proper types
      if (updates.fktombamento) updates.fktombamento = parseInt(updates.fktombamento);
      if (updates.fkunidadesaude) updates.fkunidadesaude = parseInt(updates.fkunidadesaude);
      if (updates.fksetor) updates.fksetor = parseInt(updates.fksetor);
      if (updates.dataalocacao) updates.dataalocacao = new Date(updates.dataalocacao);

      const updatedAlocacao = await storage.updateAlocacao(id, updates);
      res.json(updatedAlocacao);
    } catch (error) {
      console.error('Error updating alocacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete("/api/alocacoes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAlocacao(id);
      
      if (success) {
        res.json({ message: 'Alocação excluída com sucesso' });
      } else {
        res.status(404).json({ error: 'Alocação não encontrada' });
      }
    } catch (error) {
      console.error('Error deleting alocacao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Transferencia routes
  app.get("/api/transferencias", async (req, res) => {
    try {
      const transferencias = await storage.getTransferencias();
      res.json(transferencias);
    } catch (error) {
      console.error('Error fetching transferencias:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post("/api/transferencias", async (req, res) => {
    try {
      const { fktombamento, fkunidadesaude_origem, fkunidadesaude_destino, fksetor_origem, fksetor_destino, responsavel_destino, datatasnferencia, responsavel } = req.body;
      
      if (!fktombamento || !fkunidadesaude_destino || !datatasnferencia) {
        return res.status(400).json({ error: 'Tombamento, unidade destino e data são obrigatórios' });
      }

      const newTransferencia = await storage.createTransferencia({
        fktombamento: parseInt(fktombamento),
        fkunidadesaude_origem: fkunidadesaude_origem ? parseInt(fkunidadesaude_origem) : undefined,
        fkunidadesaude_destino: parseInt(fkunidadesaude_destino),
        fksetor_origem: fksetor_origem ? parseInt(fksetor_origem) : undefined,
        fksetor_destino,
        responsavel_destino,
        datatasnferencia: new Date(datatasnferencia),
        responsavel,
        fkuser: 0
      });
      
      res.status(201).json(newTransferencia);
    } catch (error) {
      console.error('Error creating transferencia:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Manutencao routes
  app.get("/api/manutencoes", async (req, res) => {
    try {
      const manutencoes = await storage.getManutencoes();
      res.json(manutencoes);
    } catch (error) {
      console.error('Error fetching manutencoes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post("/api/manutencoes", async (req, res) => {
    try {
      const { fktombamento, dataretirada, motivo, responsavel, dataretorno } = req.body;
      
      if (!fktombamento || !dataretirada || !motivo) {
        return res.status(400).json({ error: 'Tombamento, data de retirada e motivo são obrigatórios' });
      }

      const newManutencao = await storage.createManutencao({
        fktombamento: parseInt(fktombamento),
        dataretirada: new Date(dataretirada),
        motivo,
        responsavel,
        dataretorno: dataretorno ? new Date(dataretorno) : undefined,
        fkuser: 0
      });
      
      res.status(201).json(newManutencao);
    } catch (error) {
      console.error('Error creating manutencao:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Support data routes
  app.get("/api/unidades-saude", async (req, res) => {
    try {
      const unidades = await storage.getUnidadesSaude();
      res.json(unidades);
    } catch (error) {
      console.error('Error fetching unidades:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get("/api/setores", async (req, res) => {
    try {
      const setores = await storage.getSetores();
      res.json(setores);
    } catch (error) {
      console.error('Error fetching setores:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
