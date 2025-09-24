import { useState, useMemo } from "react";
import { useTombamentos, useCreateTombamento, useUpdateTombamento, useProdutos, useProdutoEntradas } from "@/hooks/usePatrimonio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Pencil, Trash2, Image, ArrowLeft, Upload, X } from "lucide-react";

export default function Tombamento() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchProduto, setSearchProduto] = useState("");
  const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
  const [selectedPedidoitem, setSelectedPedidoitem] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fkproduto: "",
    tombamento: "",
    serial: "",
    responsavel: "",
    status: "disponivel",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { data: tombamentos = [], isLoading: isLoadingTombamentos } = useTombamentos();
  const { data: produtos = [] } = useProdutos();
  const { data: produtoEntradas = [], isLoading: isLoadingEntradas, error: errorEntradas } = useProdutoEntradas(selectedProdutoId);

  // Debug logs
  console.log('Selected product ID:', selectedProdutoId);
  console.log('Product entries data:', produtoEntradas);
  console.log('Is loading entries:', isLoadingEntradas);
  console.log('Entries error:', errorEntradas);
  const createTombamento = useCreateTombamento();
  const updateTombamento = useUpdateTombamento();

  const filteredTombamentos = useMemo(() => {
    if (!searchTerm.trim()) return tombamentos;
    return tombamentos.filter((item: any) =>
      item.tombamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.produto?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tombamentos, searchTerm]);

  const filteredProdutos = useMemo(() => {
    if (!searchProduto.trim()) return produtos;
    return produtos.filter((produto: any) =>
      produto.produto?.toLowerCase().includes(searchProduto.toLowerCase())
    );
  }, [produtos, searchProduto]);

  const handleNewTombamento = () => {
    setEditingItem(null);
    setFormData({
      fkproduto: "",
      fkpedidoitem: "",
      tombamento: "",
      serial: "",
      responsavel: "",
      status: "disponivel",
    });
    setSelectedProdutoId(null);
    setSelectedPedidoitem(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setViewMode("form");
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      fkproduto: item.fkproduto?.toString() || "",
      fkpedidoitem: item.fkpedidoitem?.toString() || "",
      tombamento: item.tombamento || "",
      serial: item.serial || "",
      responsavel: item.responsavel || "",
      status: item.status || "disponivel",
    });
    setSelectedProdutoId(item.fkproduto || null);
    setSelectedPedidoitem(item.fkpedidoitem || null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setViewMode("form");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingItem(null);
    setFormData({
      fkproduto: "",
      fkpedidoitem: "",
      tombamento: "",
      serial: "",
      responsavel: "",
      status: "disponivel",
    });
    setSelectedProdutoId(null);
    setSelectedPedidoitem(null);
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fkproduto || !formData.tombamento) {
      return;
    }

    try {
      const submitFormData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          submitFormData.append(key, value);
        }
      });

      selectedFiles.forEach(file => {
        submitFormData.append('photos', file);
      });

      if (editingItem) {
        await updateTombamento.mutateAsync({ id: editingItem.pktombamento, formData: submitFormData });
        handleBackToList();
      } else {
        await createTombamento.mutateAsync(submitFormData);

        // Clear form but stay on screen for new entries
        setFormData({
          fkproduto: formData.fkproduto, // Keep selected product
          fkpedidoitem: formData.fkpedidoitem, // Keep selected entry
          tombamento: "",
          serial: "",
          responsavel: "",
          status: "disponivel",
        });
        setSelectedFiles([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
      }
    } catch (error) {
      console.error("Error saving tombamento:", error);
    }
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

  const isLoading = createTombamento.isPending || updateTombamento.isPending;

  if (viewMode === "form") {
    return (
      <div className="p-6" data-testid="tombamento-form">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToList}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {editingItem ? "Editar Tombamento" : "Novo Tombamento"}
                </h2>
                <p className="text-muted-foreground">
                  {editingItem ? "Edite as informações do tombamento" : "Registre um novo item com número de tombamento e fotos"}
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Tombamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fkproduto" className="text-sm font-medium text-foreground">
                      Bem *
                    </Label>
                    <Select
                        value={formData.fkproduto}
                        onValueChange={(value) => {
                          console.log('Product selected:', value);
                          setFormData({ ...formData, fkproduto: value, fkpedidoitem: "" });
                          setSelectedProdutoId(parseInt(value));
                          setSelectedPedidoitem(null);
                          console.log('Selected product ID set to:', parseInt(value));
                        }}
                        required
                      >
                      <SelectTrigger data-testid="select-produto">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <div className="sticky top-0 bg-background p-2 border-b">
                          <SearchInput
                            value={searchProduto}
                            onChange={setSearchProduto}
                            placeholder="Pesquisar produto..."
                            data-testid="search-produto"
                            className="h-8"
                          />
                        </div>
                        {filteredProdutos.length > 0 ? (
                          filteredProdutos.map((produto: any) => (
                            <SelectItem key={produto.pkproduto} value={produto.pkproduto.toString()}>
                              {produto.produto}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            {searchProduto ? "Nenhum produto encontrado" : "Carregando produtos..."}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProdutoId && (
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        Entradas do Bem
                      </Label>
                      <div className="border rounded-lg max-h-64 overflow-y-auto">
                        {produtoEntradas.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {produtoEntradas.length > 1 && (
                                  <TableHead className="text-xs w-12">Selecionar</TableHead>
                                )}
                                <TableHead className="text-xs">Código Pedido</TableHead>
                                <TableHead className="text-xs">Data Pedido</TableHead>
                                <TableHead className="text-xs">Qtd Entrada</TableHead>
                                <TableHead className="text-xs">Qtd Tombada</TableHead>
                                <TableHead className="text-xs">Qtd Disponível</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {produtoEntradas.map((entrada: any, index: number) => {
                                // Auto-select if there's only one entry
                                if (produtoEntradas.length === 1 && !selectedPedidoitem) {
                                  setTimeout(() => {
                                    setSelectedPedidoitem(entrada.pkpedidoitem);
                                    setFormData(prev => ({ ...prev, fkpedidoitem: entrada.pkpedidoitem.toString() }));
                                  }, 0);
                                }

                                return (
                                  <TableRow 
                                    key={index}
                                    className={`${
                                      produtoEntradas.length === 1 || selectedPedidoitem === entrada.pkpedidoitem 
                                        ? 'bg-accent/20' 
                                        : 'cursor-pointer hover:bg-muted/50'
                                    }`}
                                    onClick={() => {
                                      if (produtoEntradas.length > 1) {
                                        setSelectedPedidoitem(entrada.pkpedidoitem);
                                        setFormData({ ...formData, fkpedidoitem: entrada.pkpedidoitem.toString() });
                                      }
                                    }}
                                  >
                                    {produtoEntradas.length > 1 && (
                                      <TableCell className="text-xs">
                                        <input
                                          type="radio"
                                          name="pedidoitem"
                                          checked={selectedPedidoitem === entrada.pkpedidoitem}
                                          onChange={() => {
                                            setSelectedPedidoitem(entrada.pkpedidoitem);
                                            setFormData({ ...formData, fkpedidoitem: entrada.pkpedidoitem.toString() });
                                          }}
                                          className="h-3 w-3"
                                        />
                                      </TableCell>
                                    )}
                                    <TableCell className="text-xs">{entrada.pkpedido}</TableCell>
                                    <TableCell className="text-xs">
                                      {entrada.datapedido ? new Date(entrada.datapedido).toLocaleDateString('pt-BR') : '-'}
                                    </TableCell>
                                    <TableCell className="text-xs">{parseFloat(entrada.quantidadeentrada).toFixed(0)}</TableCell>
                                    <TableCell className="text-xs">{entrada.quantidade_tombada || 0}</TableCell>
                                    <TableCell className="text-xs font-medium text-primary">
                                      {entrada.quantidade_disponivel}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Não foram encontradas entradas disponíveis para o Bem selecionado
                          </div>
                        )}
                      </div>

                      {produtoEntradas.length > 1 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          * Selecione a entrada da qual será feito o tombamento
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tombamento" className="text-sm font-medium text-foreground">
                      Número de Tombamento *
                    </Label>
                    <Input
                      id="tombamento"
                      type="text"
                      value={formData.tombamento}
                      onChange={(e) => setFormData({ ...formData, tombamento: e.target.value })}
                      placeholder="Ex: TB-001234"
                      required
                      data-testid="input-tombamento"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serial" className="text-sm font-medium text-foreground">
                      Número Serial
                    </Label>
                    <Input
                      id="serial"
                      type="text"
                      value={formData.serial}
                      onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                      placeholder="Ex: LG24MK430H-B"
                      data-testid="input-serial"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsavel" className="text-sm font-medium text-foreground">
                      Responsável
                    </Label>
                    <Input
                      id="responsavel"
                      type="text"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                      placeholder="Nome do responsável"
                      data-testid="input-responsavel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-foreground">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="alocado">Alocado</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Fotos do Item
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                      data-testid="file-input"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary hover:text-primary/80">Clique para fazer upload</span> ou arraste as fotos aqui
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 10MB cada</p>
                    </label>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeFile(index)}
                            data-testid={`remove-photo-${index}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToList}
                    disabled={isLoading}
                    data-testid="button-cancel"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.fkproduto || !formData.tombamento}
                    data-testid="button-save"
                  >
                    {isLoading ? "Salvando..." : editingItem ? "Atualizar Tombamento" : "Criar Tombamento"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoadingTombamentos) {
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
            onClick={handleNewTombamento}
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTombamentos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter !== "all" ? "Nenhum tombamento encontrado" : "Nenhum tombamento cadastrado"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTombamentos.map((item: any) => (
                  <Card key={item.pktombamento} data-testid={`tombamento-row-${item.pktombamento}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* First line: Tombamento number and status */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-foreground">{item.tombamento}</div>
                          {getStatusBadge(item.status)}
                        </div>
                        
                        {/* Second line: Product name and serial */}
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {item.produto?.nome || "Bem não encontrado"}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Serial: {item.serial || "Não informado"}</span>
                            <span>{item.photos ? JSON.parse(item.photos).length : 0} fotos</span>
                          </div>
                        </div>
                        
                        {/* Responsible and actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            {item.responsavel || "Sem responsável"}
                          </div>
                          <div className="flex space-x-1">
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}