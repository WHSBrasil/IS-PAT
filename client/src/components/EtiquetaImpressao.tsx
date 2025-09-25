
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, QrCode } from "lucide-react";
import QRCode from 'qrcode';

interface EtiquetaImpressaoProps {
  tombamento: any;
  empresa: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EtiquetaImpressao({ tombamento, empresa, isOpen, onClose }: EtiquetaImpressaoProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (data: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(data, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const generateZPL = async () => {
    setIsGenerating(true);

    try {
      // URL do QR Code
      const baseUrl = window.location.origin;
      const qrUrl = `${baseUrl}/tomb/publico/${tombamento.pktombamento}`;
      
      // Gerar QR Code como base64
      const qrCodeDataUrl = await generateQRCode(qrUrl);
      
      // Dados para a etiqueta
      const tombamentoNum = tombamento.tombamento || 'N/A';
      const descricao = tombamento.produto?.nome || 'Produto não informado';
      const empresaNome = empresa?.mantenedora || 'Nome da empresa não informado';
      
      // Limitar tamanho do texto para caber na etiqueta
      const descricaoTruncada = descricao.length > 40 ? descricao.substring(0, 37) + '...' : descricao;
      const empresaTruncada = empresaNome.length > 35 ? empresaNome.substring(0, 32) + '...' : empresaNome;

      // Código ZPL para impressora Zebra ZD220
      // Etiqueta 58mm x 32mm (464 x 256 dots a 8 dots/mm)
      const zplCode = `
^XA
^MMT
^PW464
^LL256

^FO10,10^BQN,2,4^FDMM,A${qrUrl}^FS

^FO170,10^APN,18,10^FD${tombamentoNum}^FS

^FO170,35^APN,12,8^FB280,3,0,L,0^FD${descricaoTruncada}^FS

^FO10,180^APN,10,6^FDEquipamento de propriedade de:^FS
^FO10,200^APN,12,8^FB440,2,0,L,0^FD${empresaTruncada}^FS

^FO10,240^APN,8,5^FD${new Date().toLocaleDateString('pt-BR')}^FS

^XZ
      `.trim();

      // Enviar para impressora
      await printZPL(zplCode);

    } catch (error) {
      console.error('Erro ao gerar etiqueta:', error);
      alert('Erro ao gerar etiqueta. Verifique se a impressora está conectada.');
    } finally {
      setIsGenerating(false);
    }
  };

  const printZPL = async (zplCode: string) => {
    try {
      // Tentar imprimir via USB (requer driver da Zebra ou software ZebraDesigner)
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Etiqueta</title>
            </head>
            <body>
              <h3>Código ZPL para Impressora Zebra</h3>
              <p>Copie o código abaixo e cole no ZebraDesigner ou envie direto para a impressora:</p>
              <textarea style="width: 100%; height: 300px; font-family: monospace;">${zplCode}</textarea>
              <br><br>
              <button onclick="navigator.clipboard.writeText('${zplCode.replace(/'/g, "\\'")}').then(() => alert('Código copiado para a área de transferência!'))">
                Copiar Código ZPL
              </button>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      // Alternativa: tentar enviar via fetch para endpoint local (se houver serviço rodando)
      try {
        await fetch('http://localhost:9100', {
          method: 'POST',
          body: zplCode,
          headers: {
            'Content-Type': 'application/x-zpl'
          }
        });
        alert('Etiqueta enviada para impressora!');
      } catch (fetchError) {
        console.log('Tentativa de impressão via rede falhou (normal se não houver serviço configurado)');
      }

    } catch (error) {
      console.error('Erro ao imprimir:', error);
    }
  };

  const previewEtiqueta = () => {
    const baseUrl = window.location.origin;
    const qrUrl = `${baseUrl}/tomb/publico/${tombamento.pktombamento}`;
    
    return (
      <div className="border border-gray-300 bg-white p-4 rounded" style={{ width: '232px', height: '128px', fontSize: '10px' }}>
        <div className="flex h-full">
          <div className="flex-shrink-0 mr-3">
            <QrCode size={80} className="text-gray-400" />
            <div className="text-xs text-center mt-1">QR Code</div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-bold text-sm">{tombamento.tombamento}</div>
            <div className="text-xs leading-tight">
              {(tombamento.produto?.nome || 'Produto não informado').substring(0, 35)}
              {(tombamento.produto?.nome || '').length > 35 && '...'}
            </div>
            <div className="mt-2 text-xs">
              <div>Equipamento de propriedade de:</div>
              <div className="font-semibold">
                {(empresa?.mantenedora || 'Nome da empresa').substring(0, 30)}
                {(empresa?.mantenedora || '').length > 30 && '...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>Imprimir Etiqueta</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Preview da Etiqueta (58mm x 32mm)</h4>
            <div className="flex justify-center">
              {previewEtiqueta()}
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Tombamento:</strong> {tombamento.tombamento}</div>
            <div><strong>Produto:</strong> {tombamento.produto?.nome || 'Não informado'}</div>
            <div><strong>QR Code URL:</strong> {`${window.location.origin}/tomb/publico/${tombamento.pktombamento}`}</div>
            <div><strong>Empresa:</strong> {empresa?.mantenedora || 'Não informado'}</div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={generateZPL} 
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>{isGenerating ? 'Gerando...' : 'Imprimir Etiqueta'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
