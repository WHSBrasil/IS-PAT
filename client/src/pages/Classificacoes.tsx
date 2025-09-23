import { useState, useMemo } from "react";
import { useClassificacoes, useDeleteClassificacao } from "@/hooks/usePatrimonio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ClassificacaoModal from "@/components/modals/ClassificacaoModal";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

export default function Classificacoes() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: classificacoes = [], isLoading } = useClassificacoes();
  const deleteClassificacao = useDeleteClassificacao();

  const filteredClassificacoes = classificacoes.filter((item: any) =>
    item.classificacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta classificação?")) {
      deleteClassificacao.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Classificações de Bens</h2>
            <p className="text-muted-foreground">Carregando classificações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="classificacoes-page">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Classificações de Bens</h2>
            <p className="text-muted-foreground">Gerencie as categorias de classificação do patrimônio</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2"
            data-testid="button-new-classification"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Classificação</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Classificações</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar classificações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="search-classifications"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Classificação</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Criado em</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredClassificacoes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                        {searchTerm ? "Nenhuma classificação encontrada" : "Nenhuma classificação cadastrada"}
                      </td>
                    </tr>
                  ) : (
                    filteredClassificacoes.map((item: any) => (
                      <tr key={item.pkclassificacao} data-testid={`classification-row-${item.pkclassificacao}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {item.pkclassificacao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{item.classificacao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={item.ativo ? "default" : "secondary"}>
                            {item.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              data-testid={`button-edit-${item.pkclassificacao}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.pkclassificacao)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-${item.pkclassificacao}`}
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

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium">1</span> a{" "}
                <span className="font-medium">{filteredClassificacoes.length}</span> de{" "}
                <span className="font-medium">{filteredClassificacoes.length}</span> resultados
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <ClassificacaoModal
          isOpen={showModal}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}