import { useState, useEffect } from "react";
import { useCreateAlocacao, useTombamentos, useUnidadesSaude, useSetores } from "@/hooks/usePatrimonio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";

interface AlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
}

export default function AlocacaoModal({ isOpen, onClose, editingItem }: AlocacaoModalProps) {
  const [formData, setFormData] = useState({
    fktombamento: "",
    fkunidadesaude: "",
    fksetor: "",
    responsavel_unidade: "",
    dataalocacao: "",
    termo: "",
    responsavel: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { data: tombamentos = [] } = useTombamentos();
  const { data: unidades = [] } = useUnidadesSaude();
  const { data: setores = [] } = useSetores();
  const createAlocacao = useCreateAlocacao();

  // Filter available tombamentos (only disponivel status)
  const availableTombamentos = tombamentos.filter((t: any) => t.status === "disponivel");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        fktombamento: editingItem.fktombamento?.toString() || "",
        fkunidadesaude: editingItem.fkunidadesaude?.toString() || "",
        fksetor: editingItem.fksetor?.toString() || "",
        responsavel_unidade: editingItem.responsavel_unidade || "",
        dataalocacao: editingItem.dataalocacao ? new Date(editingItem.dataalocacao).toISOString().split('T')[0] : "",
        termo: editingItem.termo || "",
        responsavel: editingItem.responsavel || "",
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        fktombamento: "",
        fkunidadesaude: "",
        fksetor: "",
        responsavel_unidade: "",
        dataalocacao: today,
        termo: "",
        responsavel: "",
      });
    }
  }, [editingItem]);

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
    
    if (!formData.fktombamento || !formData.fkunidadesaude || !formData.responsavel_unidade || !formData.dataalocacao) {
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

      await createAlocacao.mutateAsync(submitFormData);
      onClose();
      
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error saving alocacao:", error);
    }
  };

  const isLoading = createAlocacao.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="alocacao-modal">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Editar Alocação" : "Nova Alocação"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fktombamento" className="text-sm font-medium text-foreground">
                Tombamento *
              </Label>
              <Select
                value={formData.fktombamento}
                onValueChange={(value) => setFormData({ ...formData, fktombamento: value })}
                required
              >
                <SelectTrigger data-testid="select-tombamento">
                  <SelectValue placeholder="Selecione um tombamento" />
                </SelectTrigger>
                <SelectContent>
                  {availableTombamentos.map((tombamento: any) => (
                    <SelectItem key={tombamento.pktombamento} value={tombamento.pktombamento.toString()}>
                      {tombamento.tombamento} - {tombamento.produto?.nome || "Produto"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fkunidadesaude" className="text-sm font-medium text-foreground">
                Unidade de Saúde *
              </Label>
              <Select
                value={formData.fkunidadesaude}
                onValueChange={(value) => setFormData({ ...formData, fkunidadesaude: value })}
                required
              >
                <SelectTrigger data-testid="select-unidade">
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((unidade: any) => (
                    <SelectItem key={unidade.pkunidadesaude} value={unidade.pkunidadesaude.toString()}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fksetor" className="text-sm font-medium text-foreground">
                Setor
              </Label>
              <Select
                value={formData.fksetor}
                onValueChange={(value) => setFormData({ ...formData, fksetor: value })}
              >
                <SelectTrigger data-testid="select-setor">
                  <SelectValue placeholder="Selecione um setor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor: any) => (
                    <SelectItem key={setor.pksetor} value={setor.pksetor.toString()}>
                      {setor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataalocacao" className="text-sm font-medium text-foreground">
                Data de Alocação *
              </Label>
              <Input
                id="dataalocacao"
                type="date"
                value={formData.dataalocacao}
                onChange={(e) => setFormData({ ...formData, dataalocacao: e.target.value })}
                required
                data-testid="input-data-alocacao"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsavel_unidade" className="text-sm font-medium text-foreground">
                Responsável na Unidade *
              </Label>
              <Input
                id="responsavel_unidade"
                type="text"
                value={formData.responsavel_unidade}
                onChange={(e) => setFormData({ ...formData, responsavel_unidade: e.target.value })}
                placeholder="Nome do responsável"
                required
                data-testid="input-responsavel-unidade"
              />
            </div>

            <div>
              <Label htmlFor="responsavel" className="text-sm font-medium text-foreground">
                Responsável pela Alocação
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
          </div>

          <div>
            <Label htmlFor="termo" className="text-sm font-medium text-foreground">
              Termo de Responsabilidade
            </Label>
            <Textarea
              id="termo"
              value={formData.termo}
              onChange={(e) => setFormData({ ...formData, termo: e.target.value })}
              placeholder="Detalhes do termo de responsabilidade..."
              rows={3}
              data-testid="textarea-termo"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Fotos da Alocação
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

            {/* Photo Previews */}
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
              onClick={onClose}
              disabled={isLoading}
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.fktombamento || !formData.fkunidadesaude || !formData.responsavel_unidade || !formData.dataalocacao}
              data-testid="button-save"
            >
              {isLoading ? "Salvando..." : "Criar Alocação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
