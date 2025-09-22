// Schema definitions for patrimonio system
export interface Classificacao {
  pkclassificacao: number;
  classificacao: string;
  fkuser: number;
  version: number;
  ativo: boolean;
  uuid: string;
  created_at: Date;
}

export interface InsertClassificacao {
  classificacao: string;
  fkuser?: number;
  ativo?: boolean;
}

export interface Produto {
  pkproduto: number;
  nome: string;
  descricao?: string;
  pkclassificacao?: number;
  ativo: boolean;
  created_at: Date;
}

export interface Tombamento {
  pktombamento: number;
  fkproduto: number;
  tombamento: string;
  serial?: string;
  photos?: any; // JSONB
  responsavel?: string;
  status: 'disponivel' | 'alocado' | 'manutencao';
  fkuser: number;
  version: number;
  ativo: boolean;
  uuid: string;
  created_at: Date;
  produto?: Produto;
}

export interface InsertTombamento {
  fkproduto: number;
  tombamento: string;
  serial?: string;
  photos?: any;
  responsavel?: string;
  status?: 'disponivel' | 'alocado' | 'manutencao';
  fkuser?: number;
}

export interface UnidadeSaude {
  pkunidadesaude: number;
  nome: string;
  endereco?: string;
  ativo: boolean;
  created_at: Date;
}

export interface Setor {
  pksetor: number;
  nome: string;
  fkunidadesaude?: number;
  ativo: boolean;
  created_at: Date;
}

export interface Alocacao {
  pkalocacao: number;
  fktombamento: number;
  fkunidadesaude: number;
  fksetor?: number;
  responsavel_unidade: string;
  dataalocacao: Date;
  photos?: any;
  termo?: string;
  responsavel?: string;
  fkuser: number;
  version: number;
  ativo: boolean;
  uuid: string;
  created_at: Date;
  tombamento?: Tombamento;
  unidadesaude?: UnidadeSaude;
  setor?: Setor;
}

export interface InsertAlocacao {
  fktombamento: number;
  fkunidadesaude: number;
  fksetor?: number;
  responsavel_unidade: string;
  dataalocacao: Date;
  photos?: any;
  termo?: string;
  responsavel?: string;
  fkuser?: number;
}

export interface Transferencia {
  pktransferencia: number;
  fktombamento: number;
  fkunidadesaude_origem?: number;
  fkunidadesaude_destino?: number;
  fksetor_origem?: number;
  fksetor_destino?: string;
  responsavel_destino?: string;
  datatasnferencia: Date;
  responsavel?: string;
  fkuser: number;
  version: number;
  ativo: boolean;
  uuid: string;
  created_at: Date;
  tombamento?: Tombamento;
  unidade_origem?: UnidadeSaude;
  unidade_destino?: UnidadeSaude;
}

export interface InsertTransferencia {
  fktombamento: number;
  fkunidadesaude_origem?: number;
  fkunidadesaude_destino?: number;
  fksetor_origem?: number;
  fksetor_destino?: string;
  responsavel_destino?: string;
  datatasnferencia: Date;
  responsavel?: string;
  fkuser?: number;
}

export interface Manutencao {
  pkmanutencao: number;
  fktombamento: number;
  dataretirada: Date;
  motivo: string;
  responsavel?: string;
  dataretorno?: Date;
  fkuser: number;
  version: number;
  ativo: boolean;
  uuid: string;
  created_at: Date;
  tombamento?: Tombamento;
}

export interface InsertManutencao {
  fktombamento: number;
  dataretirada: Date;
  motivo: string;
  responsavel?: string;
  dataretorno?: Date;
  fkuser?: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalItems: number;
  available: number;
  allocated: number;
  maintenance: number;
}
