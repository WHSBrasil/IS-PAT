import { query } from './db';
import { 
  User, 
  InsertUser, 
  Classificacao, 
  InsertClassificacao,
  Tombamento,
  InsertTombamento,
  Alocacao,
  InsertAlocacao,
  Transferencia,
  InsertTransferencia,
  Manutencao,
  InsertManutencao,
  Produto,
  UnidadeSaude,
  Setor,
  DashboardStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Classificacao methods
  getClassificacoes(): Promise<Classificacao[]>;
  getClassificacao(id: number): Promise<Classificacao | undefined>;
  createClassificacao(classificacao: InsertClassificacao): Promise<Classificacao>;
  updateClassificacao(id: number, classificacao: Partial<InsertClassificacao>): Promise<Classificacao>;
  deleteClassificacao(id: number): Promise<boolean>;

  // Produto methods
  getProdutos(): Promise<Produto[]>;
  getProduto(id: number): Promise<Produto | undefined>;

  // Tombamento methods
  getTombamentos(): Promise<Tombamento[]>;
  getTombamento(id: number): Promise<Tombamento | undefined>;
  createTombamento(tombamento: InsertTombamento): Promise<Tombamento>;
  updateTombamento(id: number, tombamento: Partial<InsertTombamento>): Promise<Tombamento>;
  deleteTombamento(id: number): Promise<boolean>;

  // Alocacao methods
  getAlocacoes(): Promise<Alocacao[]>;
  getAlocacao(id: number): Promise<Alocacao | undefined>;
  createAlocacao(alocacao: InsertAlocacao): Promise<Alocacao>;
  updateAlocacao(id: number, alocacao: Partial<InsertAlocacao>): Promise<Alocacao>;
  deleteAlocacao(id: number): Promise<boolean>;

  // Transferencia methods
  getTransferencias(): Promise<Transferencia[]>;
  getTransferencia(id: number): Promise<Transferencia | undefined>;
  createTransferencia(transferencia: InsertTransferencia): Promise<Transferencia>;
  updateTransferencia(id: number, transferencia: Partial<InsertTransferencia>): Promise<Transferencia>;
  deleteTransferencia(id: number): Promise<boolean>;

  // Manutencao methods
  getManutencoes(): Promise<Manutencao[]>;
  getManutencao(id: number): Promise<Manutencao | undefined>;
  createManutencao(manutencao: InsertManutencao): Promise<Manutencao>;
  updateManutencao(id: number, manutencao: Partial<InsertManutencao>): Promise<Manutencao>;
  deleteManutencao(id: number): Promise<boolean>;

  // Support data methods
  getUnidadesSaude(): Promise<UnidadeSaude[]>;
  getSetores(): Promise<Setor[]>;

  // Dashboard methods
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [insertUser.username, insertUser.password]
    );
    return result.rows[0];
  }

  // Classificacao methods
  async getClassificacoes(): Promise<Classificacao[]> {
    const result = await query('SELECT * FROM sotech.pat_classificacao WHERE ativo = true ORDER BY classificacao');
    return result.rows;
  }

  async getClassificacao(id: number): Promise<Classificacao | undefined> {
    const result = await query('SELECT * FROM sotech.pat_classificacao WHERE pkclassificacao = $1', [id]);
    return result.rows[0] || undefined;
  }

  async createClassificacao(classificacao: InsertClassificacao): Promise<Classificacao> {
    const result = await query(
      'INSERT INTO sotech.pat_classificacao (classificacao, fkuser, ativo) VALUES ($1, $2, $3) RETURNING *',
      [classificacao.classificacao, classificacao.fkuser || 0, classificacao.ativo ?? true]
    );
    return result.rows[0];
  }

  async updateClassificacao(id: number, classificacao: Partial<InsertClassificacao>): Promise<Classificacao> {
    const setClause = Object.keys(classificacao).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(classificacao);
    
    const result = await query(
      `UPDATE sotech.pat_classificacao SET ${setClause}, version = version + 1 WHERE pkclassificacao = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  async deleteClassificacao(id: number): Promise<boolean> {
    const result = await query('UPDATE sotech.pat_classificacao SET ativo = false WHERE pkclassificacao = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Produto methods
  async getProdutos(): Promise<Produto[]> {
    const result = await query('SELECT * FROM sotech.est_produto WHERE ativo = true ORDER BY nome');
    return result.rows;
  }

  async getProduto(id: number): Promise<Produto | undefined> {
    const result = await query('SELECT * FROM sotech.est_produto WHERE pkproduto = $1', [id]);
    return result.rows[0] || undefined;
  }

  // Tombamento methods
  async getTombamentos(): Promise<Tombamento[]> {
    const result = await query(`
      SELECT t.*, p.nome as produto_nome, p.descricao as produto_descricao
      FROM sotech.pat_tombamento t
      LEFT JOIN sotech.est_produto p ON t.fkproduto = p.pkproduto
      WHERE t.ativo = true 
      ORDER BY t.created_at DESC
    `);
    
    return result.rows.map(row => ({
      ...row,
      produto: row.produto_nome ? {
        pkproduto: row.fkproduto,
        nome: row.produto_nome,
        descricao: row.produto_descricao
      } : undefined
    }));
  }

  async getTombamento(id: number): Promise<Tombamento | undefined> {
    const result = await query(`
      SELECT t.*, p.nome as produto_nome, p.descricao as produto_descricao
      FROM sotech.pat_tombamento t
      LEFT JOIN sotech.est_produto p ON t.fkproduto = p.pkproduto
      WHERE t.pktombamento = $1
    `, [id]);
    
    if (!result.rows[0]) return undefined;
    
    const row = result.rows[0];
    return {
      ...row,
      produto: row.produto_nome ? {
        pkproduto: row.fkproduto,
        nome: row.produto_nome,
        descricao: row.produto_descricao
      } : undefined
    };
  }

  async createTombamento(tombamento: InsertTombamento): Promise<Tombamento> {
    const result = await query(`
      INSERT INTO sotech.pat_tombamento 
      (fkproduto, tombamento, serial, photos, responsavel, status, fkuser) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [
      tombamento.fkproduto,
      tombamento.tombamento,
      tombamento.serial,
      tombamento.photos ? JSON.stringify(tombamento.photos) : null,
      tombamento.responsavel,
      tombamento.status || 'disponivel',
      tombamento.fkuser || 0
    ]);
    return result.rows[0];
  }

  async updateTombamento(id: number, tombamento: Partial<InsertTombamento>): Promise<Tombamento> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(tombamento).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        values.push(key === 'photos' && value ? JSON.stringify(value) : value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const result = await query(`
      UPDATE sotech.pat_tombamento 
      SET ${fields.join(', ')}, version = version + 1 
      WHERE pktombamento = $1 
      RETURNING *
    `, [id, ...values]);
    
    return result.rows[0];
  }

  async deleteTombamento(id: number): Promise<boolean> {
    const result = await query('UPDATE sotech.pat_tombamento SET ativo = false WHERE pktombamento = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Alocacao methods
  async getAlocacoes(): Promise<Alocacao[]> {
    const result = await query(`
      SELECT a.*, 
             t.tombamento, t.serial,
             p.nome as produto_nome,
             u.nome as unidade_nome,
             s.nome as setor_nome
      FROM sotech.pat_alocacao a
      LEFT JOIN sotech.pat_tombamento t ON a.fktombamento = t.pktombamento
      LEFT JOIN sotech.est_produto p ON t.fkproduto = p.pkproduto
      LEFT JOIN sotech.cdg_unidadesaude u ON a.fkunidadesaude = u.pkunidadesaude
      LEFT JOIN sotech.cdg_setor s ON a.fksetor = s.pksetor
      WHERE a.ativo = true 
      ORDER BY a.created_at DESC
    `);
    
    return result.rows.map(row => ({
      ...row,
      tombamento: row.tombamento ? {
        pktombamento: row.fktombamento,
        tombamento: row.tombamento,
        serial: row.serial,
        produto: row.produto_nome ? { nome: row.produto_nome } : undefined
      } : undefined,
      unidadesaude: row.unidade_nome ? { nome: row.unidade_nome } : undefined,
      setor: row.setor_nome ? { nome: row.setor_nome } : undefined
    }));
  }

  async getAlocacao(id: number): Promise<Alocacao | undefined> {
    const result = await query('SELECT * FROM sotech.pat_alocacao WHERE pkalocacao = $1', [id]);
    return result.rows[0] || undefined;
  }

  async createAlocacao(alocacao: InsertAlocacao): Promise<Alocacao> {
    const result = await query(`
      INSERT INTO sotech.pat_alocacao 
      (fktombamento, fkunidadesaude, fksetor, responsavel_unidade, dataalocacao, photos, termo, responsavel, fkuser) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `, [
      alocacao.fktombamento,
      alocacao.fkunidadesaude,
      alocacao.fksetor,
      alocacao.responsavel_unidade,
      alocacao.dataalocacao,
      alocacao.photos ? JSON.stringify(alocacao.photos) : null,
      alocacao.termo,
      alocacao.responsavel,
      alocacao.fkuser || 0
    ]);

    // Update tombamento status to 'alocado'
    await query('UPDATE sotech.pat_tombamento SET status = $1 WHERE pktombamento = $2', ['alocado', alocacao.fktombamento]);

    return result.rows[0];
  }

  async updateAlocacao(id: number, alocacao: Partial<InsertAlocacao>): Promise<Alocacao> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(alocacao).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        values.push(key === 'photos' && value ? JSON.stringify(value) : value);
      }
    });

    const result = await query(`
      UPDATE sotech.pat_alocacao 
      SET ${fields.join(', ')}, version = version + 1 
      WHERE pkalocacao = $1 
      RETURNING *
    `, [id, ...values]);
    
    return result.rows[0];
  }

  async deleteAlocacao(id: number): Promise<boolean> {
    // Get the tombamento ID before deleting
    const alocacao = await this.getAlocacao(id);
    if (alocacao) {
      // Update tombamento status back to 'disponivel'
      await query('UPDATE sotech.pat_tombamento SET status = $1 WHERE pktombamento = $2', ['disponivel', alocacao.fktombamento]);
    }

    const result = await query('UPDATE sotech.pat_alocacao SET ativo = false WHERE pkalocacao = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Transferencia methods
  async getTransferencias(): Promise<Transferencia[]> {
    const result = await query(`
      SELECT tr.*, 
             t.tombamento,
             p.nome as produto_nome,
             uo.nome as unidade_origem_nome,
             ud.nome as unidade_destino_nome
      FROM sotech.pat_transferencia tr
      LEFT JOIN sotech.pat_tombamento t ON tr.fktombamento = t.pktombamento
      LEFT JOIN sotech.est_produto p ON t.fkproduto = p.pkproduto
      LEFT JOIN sotech.cdg_unidadesaude uo ON tr.fkunidadesaude_origem = uo.pkunidadesaude
      LEFT JOIN sotech.cdg_unidadesaude ud ON tr.fkunidadesaude_destino = ud.pkunidadesaude
      WHERE tr.ativo = true 
      ORDER BY tr.created_at DESC
    `);
    
    return result.rows.map(row => ({
      ...row,
      tombamento: row.tombamento ? {
        tombamento: row.tombamento,
        produto: row.produto_nome ? { nome: row.produto_nome } : undefined
      } : undefined,
      unidade_origem: row.unidade_origem_nome ? { nome: row.unidade_origem_nome } : undefined,
      unidade_destino: row.unidade_destino_nome ? { nome: row.unidade_destino_nome } : undefined
    }));
  }

  async getTransferencia(id: number): Promise<Transferencia | undefined> {
    const result = await query('SELECT * FROM sotech.pat_transferencia WHERE pktransferencia = $1', [id]);
    return result.rows[0] || undefined;
  }

  async createTransferencia(transferencia: InsertTransferencia): Promise<Transferencia> {
    const result = await query(`
      INSERT INTO sotech.pat_transferencia 
      (fktombamento, fkunidadesaude_origem, fkunidadesaude_destino, fksetor_origem, fksetor_destino, responsavel_destino, datatasnferencia, responsavel, fkuser) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `, [
      transferencia.fktombamento,
      transferencia.fkunidadesaude_origem,
      transferencia.fkunidadesaude_destino,
      transferencia.fksetor_origem,
      transferencia.fksetor_destino,
      transferencia.responsavel_destino,
      transferencia.datatasnferencia,
      transferencia.responsavel,
      transferencia.fkuser || 0
    ]);

    return result.rows[0];
  }

  async updateTransferencia(id: number, transferencia: Partial<InsertTransferencia>): Promise<Transferencia> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(transferencia).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        values.push(value);
      }
    });

    const result = await query(`
      UPDATE sotech.pat_transferencia 
      SET ${fields.join(', ')}, version = version + 1 
      WHERE pktransferencia = $1 
      RETURNING *
    `, [id, ...values]);
    
    return result.rows[0];
  }

  async deleteTransferencia(id: number): Promise<boolean> {
    const result = await query('UPDATE sotech.pat_transferencia SET ativo = false WHERE pktransferencia = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Manutencao methods
  async getManutencoes(): Promise<Manutencao[]> {
    const result = await query(`
      SELECT m.*, 
             t.tombamento,
             p.nome as produto_nome
      FROM sotech.pat_manutencao m
      LEFT JOIN sotech.pat_tombamento t ON m.fktombamento = t.pktombamento
      LEFT JOIN sotech.est_produto p ON t.fkproduto = p.pkproduto
      WHERE m.ativo = true 
      ORDER BY m.created_at DESC
    `);
    
    return result.rows.map(row => ({
      ...row,
      tombamento: row.tombamento ? {
        tombamento: row.tombamento,
        produto: row.produto_nome ? { nome: row.produto_nome } : undefined
      } : undefined
    }));
  }

  async getManutencao(id: number): Promise<Manutencao | undefined> {
    const result = await query('SELECT * FROM sotech.pat_manutencao WHERE pkmanutencao = $1', [id]);
    return result.rows[0] || undefined;
  }

  async createManutencao(manutencao: InsertManutencao): Promise<Manutencao> {
    const result = await query(`
      INSERT INTO sotech.pat_manutencao 
      (fktombamento, dataretirada, motivo, responsavel, dataretorno, fkuser) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [
      manutencao.fktombamento,
      manutencao.dataretirada,
      manutencao.motivo,
      manutencao.responsavel,
      manutencao.dataretorno,
      manutencao.fkuser || 0
    ]);

    // Update tombamento status to 'manutencao'
    await query('UPDATE sotech.pat_tombamento SET status = $1 WHERE pktombamento = $2', ['manutencao', manutencao.fktombamento]);

    return result.rows[0];
  }

  async updateManutencao(id: number, manutencao: Partial<InsertManutencao>): Promise<Manutencao> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(manutencao).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        values.push(value);
      }
    });

    const result = await query(`
      UPDATE sotech.pat_manutencao 
      SET ${fields.join(', ')}, version = version + 1 
      WHERE pkmanutencao = $1 
      RETURNING *
    `, [id, ...values]);
    
    return result.rows[0];
  }

  async deleteManutencao(id: number): Promise<boolean> {
    // Get the tombamento ID before deleting
    const manutencao = await this.getManutencao(id);
    if (manutencao) {
      // Update tombamento status back to 'disponivel'
      await query('UPDATE sotech.pat_tombamento SET status = $1 WHERE pktombamento = $2', ['disponivel', manutencao.fktombamento]);
    }

    const result = await query('UPDATE sotech.pat_manutencao SET ativo = false WHERE pkmanutencao = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Support data methods
  async getUnidadesSaude(): Promise<UnidadeSaude[]> {
    const result = await query('SELECT * FROM sotech.cdg_unidadesaude WHERE ativo = true ORDER BY nome');
    return result.rows;
  }

  async getSetores(): Promise<Setor[]> {
    const result = await query('SELECT * FROM sotech.cdg_setor WHERE ativo = true ORDER BY nome');
    return result.rows;
  }

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    const totalResult = await query('SELECT COUNT(*) as total FROM sotech.pat_tombamento WHERE ativo = true');
    const availableResult = await query('SELECT COUNT(*) as total FROM sotech.pat_tombamento WHERE ativo = true AND status = $1', ['disponivel']);
    const allocatedResult = await query('SELECT COUNT(*) as total FROM sotech.pat_tombamento WHERE ativo = true AND status = $1', ['alocado']);
    const maintenanceResult = await query('SELECT COUNT(*) as total FROM sotech.pat_tombamento WHERE ativo = true AND status = $1', ['manutencao']);

    return {
      totalItems: parseInt(totalResult.rows[0].total),
      available: parseInt(availableResult.rows[0].total),
      allocated: parseInt(allocatedResult.rows[0].total),
      maintenance: parseInt(maintenanceResult.rows[0].total)
    };
  }
}

export const storage = new DatabaseStorage();
