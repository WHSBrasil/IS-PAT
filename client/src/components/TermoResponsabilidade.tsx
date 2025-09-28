
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface TermoResponsabilidadeProps {
  isOpen: boolean;
  onClose: () => void;
  alocacao: any;
  empresa: any;
}

export default function TermoResponsabilidade({ isOpen, onClose, alocacao, empresa }: TermoResponsabilidadeProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generateTermoContent = () => {
    const empresaNome = empresa?.mantenedora || '[NOME DA EMPRESA]';
    const tombamento = alocacao?.tombamento?.tombamento || '[TOMBAMENTO]';
    const produto = alocacao?.tombamento?.produto?.nome || '[PRODUTO]';
    const serial = alocacao?.tombamento?.serial || '[SERIAL]';
    const unidade = alocacao?.unidadesaude?.nome || '[UNIDADE DE SAÚDE]';
    const setor = alocacao?.setor?.nome || '[SETOR]';
    const responsavelUnidade = alocacao?.responsavel_unidade || '[RESPONSÁVEL NA UNIDADE]';
    const responsavelAlocacao = alocacao?.responsavel || '[RESPONSÁVEL PELA ALOCAÇÃO]';
    const dataAlocacao = formatDate(alocacao?.dataalocacao) || '[DATA DA ALOCAÇÃO]';
    const profissional = alocacao?.profissional?.nome || '[PROFISSIONAL RESPONSÁVEL]';
    const dataAtual = formatDate(new Date());

    return `
TERMO DE RESPONSABILIDADE DE PATRIMÔNIO

${empresaNome}

Por meio deste termo, declaro que recebi em perfeito estado de conservação e funcionamento o(s) bem(ns) patrimonial(is) relacionado(s) abaixo, comprometendo-me a:

1. Utilizar o bem exclusivamente para atividades relacionadas ao serviço;
2. Manter o bem em perfeito estado de conservação;
3. Comunicar imediatamente qualquer defeito, dano ou extravio;
4. Não emprestar, ceder ou transferir o bem sem autorização prévia;
5. Devolver o bem quando solicitado ou ao término do vínculo;
6. Ressarcir eventuais danos causados por uso inadequado ou negligência.

DADOS DO BEM:
Tombamento: ${tombamento}
Descrição: ${produto}
Número de Série: ${serial}

LOCALIZAÇÃO:
Unidade: ${unidade}
Setor: ${setor}

RESPONSÁVEIS:
Responsável na Unidade: ${responsavelUnidade}
Responsável pelo Bem: ${profissional}
Responsável pela Alocação: ${responsavelAlocacao}

Data da Alocação: ${dataAlocacao}

Declaro estar ciente das responsabilidades assumidas e concordo com todos os termos estabelecidos.

Local e Data: ________________________, ${dataAtual}


_____________________________________________
Assinatura do Responsável na Unidade
${responsavelUnidade}


_____________________________________________
Assinatura do Responsável pelo Bem
${profissional}


_____________________________________________
Assinatura do Responsável pela Alocação
${responsavelAlocacao}


_____________________________________________
Testemunha
Nome: _________________________________
RG: ___________________________________
    `.trim();
  };

  const handlePrint = () => {
    setIsGenerating(true);
    
    try {
      const content = generateTermoContent();
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Termo de Responsabilidade - ${alocacao?.tombamento?.tombamento}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  line-height: 1.4;
                  margin: 20px;
                  color: #000;
                  background: white;
                }
                
                h1 {
                  text-align: center;
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                
                .empresa {
                  text-align: center;
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 20px;
                }
                
                .content {
                  text-align: justify;
                  margin-bottom: 20px;
                }
                
                .dados {
                  margin: 15px 0;
                  padding: 10px;
                  border: 1px solid #ccc;
                  background-color: #f9f9f9;
                }
                
                .assinaturas {
                  margin-top: 40px;
                }
                
                .assinatura {
                  margin: 30px 0;
                }
                
                .linha-assinatura {
                  border-top: 1px solid #000;
                  margin-top: 20px;
                  padding-top: 5px;
                }
                
                @media print {
                  body {
                    margin: 0;
                    -webkit-print-color-adjust: exact;
                  }
                  
                  .no-print {
                    display: none;
                  }
                }
                
                .print-button {
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  margin: 10px;
                  cursor: pointer;
                  border-radius: 4px;
                }
                
                .print-button:hover {
                  background: #0056b3;
                }
              </style>
            </head>
            <body>
              <div class="no-print">
                <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
                <button class="print-button" onclick="window.close()">❌ Fechar</button>
              </div>
              
              <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${content}</pre>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
      }
    } catch (error) {
      console.error('Erro ao gerar termo:', error);
      alert('Erro ao gerar o termo de responsabilidade.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    setIsGenerating(true);
    
    try {
      const content = generateTermoContent();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `termo-responsabilidade-${alocacao?.tombamento?.tombamento || 'alocacao'}-${formatDate(new Date()).replace(/\//g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar termo:', error);
      alert('Erro ao baixar o termo de responsabilidade.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Termo de Responsabilidade - {alocacao?.tombamento?.tombamento}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded border text-sm">
            <pre className="whitespace-pre-wrap font-sans">
              {generateTermoContent()}
            </pre>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Fechar
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar</span>
            </Button>
            <Button
              onClick={handlePrint}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>{isGenerating ? 'Gerando...' : 'Imprimir'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
