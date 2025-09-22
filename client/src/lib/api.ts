import { apiRequest } from "./queryClient";

// API endpoints for patrimonio system
export const api = {
  // Dashboard
  getDashboardStats: () => apiRequest("GET", "/api/dashboard/stats"),

  // Classificacoes
  getClassificacoes: () => apiRequest("GET", "/api/classificacoes"),
  getClassificacao: (id: number) => apiRequest("GET", `/api/classificacoes/${id}`),
  createClassificacao: (data: any) => apiRequest("POST", "/api/classificacoes", data),
  updateClassificacao: (id: number, data: any) => apiRequest("PUT", `/api/classificacoes/${id}`, data),
  deleteClassificacao: (id: number) => apiRequest("DELETE", `/api/classificacoes/${id}`),

  // Produtos
  getProdutos: () => apiRequest("GET", "/api/produtos"),

  // Tombamentos
  getTombamentos: () => apiRequest("GET", "/api/tombamentos"),
  getTombamento: (id: number) => apiRequest("GET", `/api/tombamentos/${id}`),
  createTombamento: (formData: FormData) => {
    return fetch("/api/tombamentos", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  },
  updateTombamento: (id: number, formData: FormData) => {
    return fetch(`/api/tombamentos/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
  },
  deleteTombamento: (id: number) => apiRequest("DELETE", `/api/tombamentos/${id}`),

  // Alocacoes
  getAlocacoes: () => apiRequest("GET", "/api/alocacoes"),
  createAlocacao: (formData: FormData) => {
    return fetch("/api/alocacoes", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  },

  // Transferencias
  getTransferencias: () => apiRequest("GET", "/api/transferencias"),
  createTransferencia: (data: any) => apiRequest("POST", "/api/transferencias", data),

  // Manutencoes
  getManutencoes: () => apiRequest("GET", "/api/manutencoes"),
  createManutencao: (data: any) => apiRequest("POST", "/api/manutencoes", data),

  // Support data
  getUnidadesSaude: () => apiRequest("GET", "/api/unidades-saude"),
  getSetores: () => apiRequest("GET", "/api/setores"),
};
