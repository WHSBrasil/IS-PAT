import { useState } from "react";
import { useAlocacoes, useDeleteAlocacao } from "@/hooks/usePatrimonio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AlocacaoModal from "@/components/modals/AlocacaoModal";
import TransferenciaModal from "@/components/modals/TransferenciaModal";
import HistoricoModal from "@/components/modals/HistoricoModal";
import { Plus, Search, Eye, ArrowRightLeft, Pencil, Trash2, History } from "lucide-react";

export default function Alocacao() {
  const [showModal, setShowModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedTombamento, setSelectedTombamento] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unidadeFilter, setUnidadeFilter] = useState("all");

  const { data: alocacoes = [], isLoading } = useAlocacoes();
  const deleteAlocacao = useDeleteAlocacao();

  const filteredAlocacoes = alocacoes.filter((item: any) => {
    const matchesSearch = 
      (item.tombamento?.tombamento && item.tombamento.tombamento.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tombamento?.produto?.nome && item.tombamento.produto.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.unidadesaude?.nome && item.unidadesaude.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUnidade = unidadeFilter === "all" || 
      (item.unidadesaude?.nome && item.unidadesaude.nome === unidadeFilter);
    
    return matchesSearch && matchesUnidade;
  });

  // Get unique unidades for filter
  const unidades = Array.from(new Set(alocacoes.map((item: any) => item.unidadesaude?.nome).filter(Boolean))) as string[];

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
    setSelectedTombamento(null);
  };

  const handleCloseHistoricoModal = () => {
    setShowHistoricoModal(false);
    setSelectedTombamento(null);
  };

  const handleTransfer = (item: any) => {
    setSelectedTombamento(item);
    setShowTransferModal(true);
  };

  const handleShowHistory = (item: any) => {
    setSelectedTombamento(item);
    setShowHistoricoModal(true);
  };

  const handleDelete = async (item: any) => {
    if (window.confirm(`Tem certeza que deseja excluir a alocação do tombamento ${item.tombamento?.tombamento}?`)) {
      try {
        await deleteAlocacao.mutateAsync(item.pkalocacao);
      } catch (error) {
        console.error('Erro ao excluir alocação:', error);
      }
    }
  };

  // Calculate statistics
  const stats = alocacoes.reduce((acc: any, item: any) => {
    const unidadeName = item.unidadesaude?.nome;
    if (unidadeName) {
      acc[unidadeName] = (acc[unidadeName] || 0) + 1;
    }
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Alocação de Bens</h2>
            <p className="text-muted-foreground">Carregando alocações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="alocacao-page">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Alocação de Bens</h2>
            <p className="text-muted-foreground">Controle onde cada item tombado está alocado nas unidades</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2"
            data-testid="button-new-alocacao"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Alocação</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(stats).slice(0, 3).map(([unidade, count], index) => (
            <Card key={unidade}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{unidade}</p>
                    <p className="text-2xl font-bold text-foreground" data-testid={`stat-${unidade.toLowerCase().replace(/\s+/g, '-')}`}>
                      {count as number}
                    </p>
                    <p className="text-xs text-muted-foreground">itens alocados</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-primary/10' : 
                    index === 1 ? 'bg-accent/10' : 
                    'bg-secondary/10'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      index === 0 ? 'text-primary' : 
                      index === 1 ? 'text-accent' : 
                      'text-secondary'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alocações Ativas</CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as unidades</SelectItem>
                    {unidades.map((unidade: string) => (
                      <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por tombamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                    data-testid="search-alocacoes"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tombamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Setor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Alocação</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredAlocacoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                        {searchTerm || unidadeFilter !== "all" ? "Nenhuma alocação encontrada" : "Nenhuma alocação cadastrada"}
                      </td>
                    </tr>
                  ) : (
                    filteredAlocacoes.map((item: any) => (
                      <tr key={item.pkalocacao} data-testid={`alocacao-row-${item.pkalocacao}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">
                            {item.tombamento?.tombamento || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">
                            {item.tombamento?.produto?.nome || "Produto não encontrado"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {item.unidadesaude?.nome || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {item.setor?.nome || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {item.responsavel_unidade || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(item.dataalocacao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Ver detalhes"
                              data-testid={`button-view-${item.pkalocacao}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShowHistory(item)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Histórico de movimentação"
                              data-testid={`button-history-${item.pkalocacao}`}
                            >
                              <History className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTransfer(item)}
                              className="text-accent hover:text-accent"
                              title="Transferir"
                              data-testid={`button-transfer-${item.pkalocacao}`}
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              title="Editar"
                              data-testid={`button-edit-${item.pkalocacao}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item)}
                              className="text-destructive hover:text-destructive"
                              title="Excluir"
                              data-testid={`button-delete-${item.pkalocacao}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <AlocacaoModal
          isOpen={showModal}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
      )}

      {showTransferModal && selectedTombamento && (
        <TransferenciaModal
          isOpen={showTransferModal}
          onClose={handleCloseTransferModal}
          editingItem={{
            fktombamento: selectedTombamento.fktombamento,
            fkunidadesaude_origem: selectedTombamento.fkunidadesaude,
            fksetor_origem: selectedTombamento.fksetor
          }}
        />
      )}

      {showHistoricoModal && selectedTombamento && (
        <HistoricoModal
          isOpen={showHistoricoModal}
          onClose={handleCloseHistoricoModal}
          fktombamento={selectedTombamento.fktombamento}
          tombamento={selectedTombamento.tombamento?.tombamento}
        />
      )}
    </div>
  );
}
