import { useState } from "react";
import { useTombamentos } from "@/hooks/usePatrimonio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import TombamentoModal from "@/components/modals/TombamentoModal";
import { Plus, Search, Eye, Pencil, Trash2, Image } from "lucide-react";

export default function Tombamento() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tombamentos = [], isLoading } = useTombamentos();

  const filteredTombamentos = tombamentos.filter((item: any) => {
    const matchesSearch = 
      item.tombamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.serial && item.serial.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.produto?.nome && item.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel":
        return <Badge className="bg-accent/20 text-accent">Disponível</Badge>;
      case "alocado":
        return <Badge className="bg-secondary/20 text-secondary">Alocado</Badge>;
      case "manutencao":
        return <Badge className="bg-destructive/20 text-destructive">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tombamento de Bens</h2>
            <p className="text-muted-foreground">Carregando tombamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="tombamento-page">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tombamento de Bens</h2>
            <p className="text-muted-foreground">Registre novos itens com número de tombamento e fotos</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2"
            data-testid="button-new-tombamento"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Tombamento</span>
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            <button
              onClick={() => setStatusFilter("all")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-all"
            >
              Todos ({tombamentos.length})
            </button>
            <button
              onClick={() => setStatusFilter("disponivel")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "disponivel"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-disponivel"
            >
              Disponíveis ({tombamentos.filter((t: any) => t.status === "disponivel").length})
            </button>
            <button
              onClick={() => setStatusFilter("alocado")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "alocado"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-alocado"
            >
              Alocados ({tombamentos.filter((t: any) => t.status === "alocado").length})
            </button>
            <button
              onClick={() => setStatusFilter("manutencao")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${
                statusFilter === "manutencao"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid="filter-manutencao"
            >
              Manutenção ({tombamentos.filter((t: any) => t.status === "manutencao").length})
            </button>
          </nav>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Tombamentos</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por tombamento ou serial..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="search-tombamentos"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="alocado">Alocado</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nº Serial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fotos</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredTombamentos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                        {searchTerm || statusFilter !== "all" ? "Nenhum tombamento encontrado" : "Nenhum tombamento cadastrado"}
                      </td>
                    </tr>
                  ) : (
                    filteredTombamentos.map((item: any) => (
                      <tr key={item.pktombamento} data-testid={`tombamento-row-${item.pktombamento}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{item.tombamento}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">
                            {item.produto?.nome || "Produto não encontrado"}
                          </div>
                          {item.produto?.descricao && (
                            <div className="text-sm text-muted-foreground">{item.produto.descricao}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {item.serial || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {item.responsavel || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">
                              {item.photos ? JSON.parse(item.photos).length : 0} fotos
                            </span>
                            {item.photos && (
                              <Button variant="ghost" size="sm" title="Ver fotos">
                                <Image className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" title="Ver detalhes" data-testid={`button-view-${item.pktombamento}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              title="Editar"
                              data-testid={`button-edit-${item.pktombamento}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              title="Excluir"
                              data-testid={`button-delete-${item.pktombamento}`}
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
        <TombamentoModal
          isOpen={showModal}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
