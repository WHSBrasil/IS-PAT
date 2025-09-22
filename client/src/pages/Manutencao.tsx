import { useState } from "react";
import { useManutencoes } from "@/hooks/usePatrimonio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ManutencaoModal from "@/components/modals/ManutencaoModal";
import { Plus, Search, CheckCircle, Pencil, Eye, AlertTriangle, Clock, BarChart3 } from "lucide-react";

export default function Manutencao() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("em-andamento");
  const [motivoFilter, setMotivoFilter] = useState("all");

  const { data: manutencoes = [], isLoading } = useManutencoes();

  const filteredManutencoes = manutencoes.filter((item: any) => {
    const matchesSearch = 
      (item.tombamento?.tombamento && item.tombamento.tombamento.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tombamento?.produto?.nome && item.tombamento.produto.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.motivo && item.motivo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const isActive = !item.dataretorno; // Se não tem data de retorno, está em andamento
    const isDelayed = isActive && new Date(item.dataretirada).getTime() < Date.now() - (15 * 24 * 60 * 60 * 1000); // 15 dias
    const isCompleted = !!item.dataretorno;
    
    let matchesStatus = false;
    switch (statusFilter) {
      case "em-andamento":
        matchesStatus = isActive && !isDelayed;
        break;
      case "atrasadas":
        matchesStatus = isDelayed;
        break;
      case "concluidas":
        matchesStatus = isCompleted;
        break;
      case "historico":
        matchesStatus = true;
        break;
    }
    
    const matchesMotivo = motivoFilter === "all" || item.motivo.toLowerCase().includes(motivoFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesMotivo;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // Calculate maintenance statistics
  const stats = {
    active: manutencoes.filter((m: any) => !m.dataretorno).length,
    delayed: manutencoes.filter((m: any) => 
      !m.dataretorno && new Date(m.dataretirada).getTime() < Date.now() - (15 * 24 * 60 * 60 * 1000)
    ).length,
    completed: manutencoes.filter((m: any) => {
      const returnDate = m.dataretorno ? new Date(m.dataretorno) : null;
      const thisMonth = new Date();
      thisMonth.setDate(1); // First day of current month
      return returnDate && returnDate >= thisMonth;
    }).length,
    averageTime: 12 // This would be calculated from actual data
  };

  const getStatusBadge = (item: any) => {
    const isActive = !item.dataretorno;
    const isDelayed = isActive && new Date(item.dataretirada).getTime() < Date.now() - (15 * 24 * 60 * 60 * 1000);
    
    if (item.dataretorno) {
      return <Badge className="bg-accent/20 text-accent">Concluída</Badge>;
    } else if (isDelayed) {
      return <Badge className="bg-destructive/20 text-destructive">Atrasada</Badge>;
    } else {
      return <Badge className="bg-secondary/20 text-secondary">Em Andamento</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Controle de Manutenção</h2>
            <p className="text-muted-foreground">Carregando manutenções...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="manutencao-page">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Controle de Manutenção</h2>
            <p className="text-muted-foreground">Gerencie itens em manutenção externa com datas e motivos</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2"
            data-testid="button-new-manutencao"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Manutenção</span>
          </Button>
        </div>

        {/* Maintenance Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Manutenção</p>
                  <p className="text-2xl font-bold text-destructive" data-testid="active-maintenance">
                    {stats.active}
                  </p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Atrasadas</p>
                  <p className="text-2xl font-bold text-destructive" data-testid="delayed-maintenance">
                    {stats.delayed}
                  </p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Clock className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídas (mês)</p>
                  <p className="text-2xl font-bold text-accent" data-testid="completed-maintenance">
                    {stats.completed}
                  </p>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold text-secondary" data-testid="average-time">
                    {stats.averageTime}
                  </p>
                  <p className="text-xs text-muted-foreground">dias</p>
                </div>
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            <button
              onClick={() => setStatusFilter("em-andamento")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "em-andamento"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-em-andamento"
            >
              Em Andamento ({stats.active - stats.delayed})
            </button>
            <button
              onClick={() => setStatusFilter("atrasadas")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "atrasadas"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-atrasadas"
            >
              Atrasadas ({stats.delayed})
            </button>
            <button
              onClick={() => setStatusFilter("concluidas")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "concluidas"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-concluidas"
            >
              Concluídas ({stats.completed})
            </button>
            <button
              onClick={() => setStatusFilter("historico")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "historico"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-historico"
            >
              Histórico
            </button>
          </nav>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {statusFilter === "em-andamento" && "Manutenções em Andamento"}
                {statusFilter === "atrasadas" && "Manutenções Atrasadas"}
                {statusFilter === "concluidas" && "Manutenções Concluídas"}
                {statusFilter === "historico" && "Histórico de Manutenções"}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={motivoFilter} onValueChange={setMotivoFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os motivos</SelectItem>
                    <SelectItem value="defeito">Defeito técnico</SelectItem>
                    <SelectItem value="preventiva">Manutenção preventiva</SelectItem>
                    <SelectItem value="calibração">Calibração</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar manutenção..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                    data-testid="search-manutencoes"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Retirada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Motivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Previsão Retorno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredManutencoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                        {searchTerm || motivoFilter !== "all" ? "Nenhuma manutenção encontrada" : "Nenhuma manutenção cadastrada"}
                      </td>
                    </tr>
                  ) : (
                    filteredManutencoes.map((item: any) => (
                      <tr key={item.pkmanutencao} data-testid={`manutencao-row-${item.pkmanutencao}`}>
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
                          {new Date(item.dataretirada).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">{item.motivo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {item.dataretorno 
                            ? new Date(item.dataretorno).toLocaleDateString('pt-BR')
                            : "Em aberto"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {!item.dataretorno && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-accent hover:text-accent"
                                title="Finalizar manutenção"
                                data-testid={`button-return-${item.pkmanutencao}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              title="Editar"
                              data-testid={`button-edit-${item.pkmanutencao}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Ver detalhes"
                              data-testid={`button-view-${item.pkmanutencao}`}
                            >
                              <Eye className="w-4 h-4" />
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
        <ManutencaoModal
          isOpen={showModal}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
