import { useState, useEffect } from "react";
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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}/tomb/publico/${tombamento.pktombamento}`;

  useEffect(() => {
    if (isOpen && tombamento) {
      generateQRCodeForPreview();
    }
  }, [isOpen, tombamento]);

  const generateQRCodeForPreview = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 120,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code for preview:', error);
    }
  };

  const generateQRCode = async (data: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(data, {
        width: 120,
        margin: 1,
        errorCorrectionLevel: 'H',
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
      // Dados para a etiqueta
      const tombamentoNum = tombamento.tombamento || 'N/A';
      const descricao = tombamento.produto?.nome || 'Produto não informado';
      const empresaNome = empresa?.mantenedora || 'Nome da empresa não informado';

      // Limitar tamanho do texto para caber na etiqueta 50mm x 25mm
      const descricaoTruncada = descricao.length > 45 ? descricao.substring(0, 42) + '...' : descricao;
      const empresaTruncada = empresaNome.length > 30 ? empresaNome.substring(0, 27) + '...' : empresaNome;

      // Código ZPL para impressora Zebra
      // Etiqueta 50mm x 25mm (400 x 200 dots a 8 dots/mm)
      const zplCode = `
^XA
^MMT
^PW400
^LL200

^FO5,5^A0N,20,15^FB390,1,0,L,0^FD${descricaoTruncada}^FS

^FO5,35^BQN,2,4^FDMM,A${qrUrl}^FS

^FO110,35^A0N,18,12^FD${tombamentoNum}^FS

^FO110,60^A0N,14,10^FDDe propriedade de:^FS

^FO110,80^A0N,14,10^FB285,3,0,L,0^FD${empresaTruncada}^FS

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
      // Esta parte foi removida pois causa erro em ambiente web
      // try {
      //   await fetch('http://localhost:9100', {
      //     method: 'POST',
      //     body: zplCode,
      //     headers: {
      //       'Content-Type': 'application/x-zpl'
      //     }
      //   });
      //   alert('Etiqueta enviada para impressora!');
      // } catch (fetchError) {
      //   console.log('Tentativa de impressão via rede falhou (normal se não houver serviço configurado)');
      // }

    } catch (error) {
      console.error('Erro ao imprimir:', error);
      alert('Erro ao imprimir. Verifique se o driver da impressora está instalado e se ela está conectada.');
    }
  };

  const previewEtiqueta = () => {
    const descricao = tombamento.produto?.nome || 'Produto não informado';
    const descricaoTruncada = descricao.length > 45 ? descricao.substring(0, 42) + '...' : descricao;
    const empresaNome = empresa?.mantenedora || 'Nome da empresa não informado';
    const empresaTruncada = empresaNome.length > 30 ? empresaNome.substring(0, 27) + '...' : empresaNome;

    return (
      <div className="border border-gray-300 bg-white p-2 rounded" style={{ width: '200px', height: '100px', fontSize: '8px' }}>
        {/* Primeira linha - Descrição do bem */}
        <div className="text-xs font-medium mb-1 leading-tight">
          {descricaoTruncada}
        </div>

        {/* Segunda parte - QR Code e informações */}
        <div className="flex h-full">
          {/* QR Code - 25% da largura */}
          <div className="flex-shrink-0 mr-2" style={{ width: '48px' }}>
            {qrCodeDataUrl && (
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                className="w-full h-auto"
                style={{ maxHeight: '70px' }}
              />
            )}
          </div>

          {/* Informações ao lado do QR Code */}
          <div className="flex-1 space-y-1 text-xs">
            <div className="font-bold">{tombamento.tombamento}</div>
            <div className="text-xs">De propriedade de:</div>
            <div className="font-medium leading-tight">
              {empresaTruncada}
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
            <h4 className="text-sm font-medium mb-2">Preview da Etiqueta (50mm x 25mm)</h4>
            <div className="flex justify-center">
              {previewEtiqueta()}
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Tombamento:</strong> {tombamento.tombamento}</div>
            <div><strong>Produto:</strong> {tombamento.produto?.nome || 'Não informado'}</div>
            <div><strong>QR Code URL:</strong> {qrUrl}</div>
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