import React, { useState } from 'react';
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

  const handlePrint = () => {
    setIsGenerating(true);

    try {
      // Coletando dados reais
      const intervenienteNome = alocacao?.interveniente_nome || alocacao?.responsavel_unidade;
      const intervenienteCns = alocacao?.interveniente_cns;
      const intervenienteCpf = alocacao?.interveniente_cpf;
      const unidadeNome = alocacao?.unidade_nome;
      const unidadeCnes = alocacao?.cnes;
      const mantenedoraNome = alocacao?.mantenedora;
      const mantenedoraCnpj = alocacao?.cnpj;
      const produtoNome = alocacao?.produto_nome;
      const produtoCodigo = alocacao?.produto_codigo;
      const equipamentoImei = alocacao?.imei;
      const equipamentoSerial = alocacao?.serial;
      const equipamentoMac = alocacao?.mac;

      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Termo de Responsabilidade - ${alocacao?.tombamento}</title>
              <meta charset="utf-8">
              <style>
                @page {
                  size: A4;
                  margin: 0;
                }

                * {
                  box-sizing: border-box;
                }

                body {
                  font-family: Arial, sans-serif;
                  font-size: 11px;
                  line-height: 1.4;
                  margin: 0;
                  padding: 0;
                  color: #000;
                  width: 210mm;
                  height: 297mm;
                  position: relative;
                  background-color: #ffffff;
                  overflow: hidden;
                }

                .background-container {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 1;
                }

                .background-container iframe {
                  width: 100%;
                  height: 100%;
                  border: none;
                  pointer-events: none;
                  opacity: 1;
                }

                .content-wrapper {
                  position: relative;
                  z-index: 2;
                  padding: 120px 30px 40px 30px;
                  min-height: 100%;
                  background: transparent;
                }

                .title-section {
                  text-align: center;
                  margin-bottom: 25px;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 8px;
                  border-radius: 4px;
                }

                .title-section h1 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0 0 6px 0;
                  text-transform: uppercase;
                  color: #000;
                }

                .title-section h2 {
                  font-size: 12px;
                  font-weight: bold;
                  margin: 0;
                  text-transform: uppercase;
                  color: #000;
                }

                .main-text {
                  text-align: justify;
                  margin-bottom: 15px;
                  line-height: 1.4;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 12px;
                  border-radius: 4px;
                  color: #000;
                }

                .equipment-info {
                  margin: 15px 0;
                  line-height: 1.5;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 12px;
                  border-radius: 4px;
                  color: #000;
                }

                .equipment-info p {
                  margin: 4px 0;
                  font-size: 10px;
                }

                .conditions {
                  margin: 15px 0;
                  text-align: justify;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 12px;
                  border-radius: 4px;
                  color: #000;
                }

                .conditions p {
                  margin-bottom: 8px;
                  font-weight: bold;
                  font-size: 10px;
                }

                .conditions ol {
                  padding-left: 20px;
                  margin: 10px 0;
                }

                .conditions li {
                  margin: 6px 0;
                  text-align: justify;
                  line-height: 1.3;
                  font-size: 9px;
                }

                .signatures {
                  margin-top: 30px;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 12px;
                  border-radius: 4px;
                  color: #000;
                }

                .signature-section {
                  margin: 20px 0;
                }

                .signature-line {
                  width: 300px;
                  height: 1px;
                  background: #000;
                  margin: 25px auto 8px auto;
                }

                .signature-text {
                  text-align: center;
                  margin-top: 8px;
                  font-size: 10px;
                }

                @media print {
                  body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }

                  .background-container {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    z-index: 1 !important;
                  }

                  .background-container iframe {
                    width: 100% !important;
                    height: 100% !important;
                    opacity: 1 !important;
                  }

                  .content-wrapper {
                    position: relative !important;
                    z-index: 2 !important;
                    padding: 120px 30px 40px 30px !important;
                  }

                  .no-print {
                    display: none !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="background-container">
                <iframe src="/Timbre.pdf"></iframe>
              </div>

              <div class="content-wrapper">
                <div class="title-section">
                  <h1>TERMO DE RESPONSABILIDADE</h1>
                  <h2>GUARDA E USO DE EQUIPAMENTOS</h2>
                </div>

                <div class="main-text">
                  <p>
                    Eu, <strong>${String(intervenienteNome || '________________')}</strong>${intervenienteCns ? `, Portador do CNS <strong>${String(intervenienteCns)}</strong>` : ''}, lotado na unidade de saúde <strong>${String(unidadeNome || '________________')}</strong>${unidadeCnes ? `, CNES <strong>${String(unidadeCnes)}</strong>` : ''}, declaro que recebi do <strong>${String(mantenedoraNome || '________________')}</strong>${mantenedoraCnpj ? `, CNPJ <strong>${String(mantenedoraCnpj)}</strong>` : ''} a título de guarda, transporte e conservação, para uso exclusivo nos sistemas determinados pela SMS – Secretaria Municipal de Saúde, e a trabalho conforme meu cargo acima declarado, o equipamento abaixo especificado neste termo:</p>
                </div>

                ${(produtoNome || produtoCodigo || equipamentoImei || equipamentoSerial || equipamentoMac) ? `
                <div class="equipment-info">
                  ${produtoNome ? `<p><strong>Equipamento:</strong> ${produtoNome}${produtoCodigo ? ' - ' + produtoCodigo : ''}</p>` : ''}
                  ${equipamentoImei ? `<p><strong>IMEI:</strong> ${equipamentoImei}</p>` : ''}
                  ${equipamentoSerial ? `<p><strong>Serial:</strong> ${equipamentoSerial}</p>` : ''}
                  ${equipamentoMac ? `<p><strong>MAC:</strong> ${equipamentoMac}</p>` : ''}
                </div>
                ` : ''}

                <div class="conditions">
                  <p>Pelo qual declaro estar ciente de que:</p>
                  <ol>
                    <li>Se o equipamento for danificado ou inutilizado por emergência, manutenção, mau uso ou negligência, deverá comunicar o ocorrido ao responsável da Secretaria Municipal da Saúde, ficando sujeito às responsabilidades respectivas de cada conduta;</li>
                    <li>No caso de extravio, furto ou roubo deverá notificar crimes, deverá se apresentar boletim de ocorrência imediatamente;</li>
                    <li>Em caso de troca por dano, furto ou roubo, o novo equipamento acarretará custos não previstos para a Instituição, visto que a Instituição não tem obrigação de substituir equipamentos danificados nos casos acima citados;</li>
                    <li>Em caso de troca por dano, furto ou roubo, poderei vir a receber equipamentos de qualidade inferior, inclusive usados, resultados de outras marcas;</li>
                    <li>Em caso de troca por contrato entre a Instituição IGM e o município de Cascavel (PR) ou outros ente dos contratos firmados, deverá responsável pela devolução, sem direito a completo e em perfeito estado os equipamentos, constituindo-se o tempo de uso dos mesmo, no Instituto IGM/Empresa;</li>
                    <li>O equipamento em minha posse não é protegido, devendo ter apenas dados de trabalho nele, ou seja, todos os dados, programas e demais informações estão sendo salvos pelo usuário por sua conta e risco;</li>
                    <li>Estando os equipamentos em minha posse, estarei sujeito a inspeções sem prévio aviso;</li>
                  </ol>
                </div>

                <div class="signatures">
                  <div class="signature-section">
                    <p>Cliente:</p>
                    <div class="signature-line"></div>
                  </div>

                  <div class="signature-section">
                    <p><strong>Termo de responsabilidade instrumental:</strong></p>
                    <div style="margin-top: 20px;">
                      ${intervenienteNome ? `<p><strong>${intervenienteNome}</strong></p>` : ''}
                      ${intervenienteCpf ? `<p>CPF: ${intervenienteCpf}</p>` : ''}
                    </div>
                  </div>
                </div>
              </div>

              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 1000);
                };
              </script>
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
      const intervenienteNome = alocacao?.interveniente_nome || alocacao?.responsavel_unidade;
      const intervenienteCns = alocacao?.interveniente_cns;
      const intervenienteCpf = alocacao?.interveniente_cpf;
      const unidadeNome = alocacao?.unidade_nome;
      const unidadeCnes = alocacao?.cnes;
      const mantenedoraNome = alocacao?.mantenedora;
      const mantenedoraCnpj = alocacao?.cnpj;
      const produtoNome = alocacao?.produto_nome;
      const produtoCodigo = alocacao?.produto_codigo;
      const equipamentoImei = alocacao?.imei;
      const equipamentoSerial = alocacao?.serial;
      const equipamentoMac = alocacao?.mac;

      const content = `
TERMO DE RESPONSABILIDADE
GUARDA E USO DE EQUIPAMENTOS

Eu, ${intervenienteNome || '________________'}${intervenienteCns ? `, Portador do CNS ${intervenienteCns}` : ''}, lotado na unidade de saúde ${unidadeNome || '________________'}${unidadeCnes ? `, CNES ${unidadeCnes}` : ''}, declaro que recebi do ${mantenedoraNome || '________________'}${mantenedoraCnpj ? `, CNPJ ${mantenedoraCnpj}` : ''} a título de guarda, transporte e conservação, para uso exclusivo nos sistemas determinados pela SMS – Secretaria Municipal de Saúde, e a trabalho conforme meu cargo acima declarado, o equipamento abaixo especificado neste termo:

${produtoNome ? `Equipamento: ${produtoNome}${produtoCodigo ? ' - ' + produtoCodigo : ''}` : ''}
${equipamentoImei ? `IMEI: ${equipamentoImei}` : ''}
${equipamentoSerial ? `Serial: ${equipamentoSerial}` : ''}
${equipamentoMac ? `MAC: ${equipamentoMac}` : ''}

Pelo qual declaro estar ciente de que:

1. Se o equipamento for danificado ou inutilizado por emergência, manutenção, mau uso ou negligência, deverá comunicar o ocorrido ao responsável da Secretaria Municipal da Saúde, ficando sujeito às responsabilidades respectivas de cada conduta;

2. No caso de extravio, furto ou roubo deverá notificar crimes, deverá se apresentar boletim de ocorrência imediatamente;

3. Em caso de troca por dano, furto ou roubo, o novo equipamento acarretará custos não previstos para a Instituição, visto que a Instituição não tem obrigação de substituir equipamentos danificados nos casos acima citados;

4. Em caso de troca por dano, furto ou roubo, poderei vir a receber equipamentos de qualidade inferior, inclusive usados, resultados de outras marcas;

5. Em caso de troca por contrato entre a Instituição IGM e o município de Cascavel (PR) ou outros ente dos contratos firmados, deverá responsável pela devolução, sem direito a completo e em perfeito estado os equipamentos, constituindo-se o tempo de uso dos mesmo, no Instituto IGM/Empresa;

6. O equipamento em minha posse não é protegido, devendo ter apenas dados de trabalho nele, ou seja, todos os dados, programas e demais informações estão sendo salvos pelo usuário por sua conta e risco;

7. Estando os equipamentos em minha posse, estarei sujeito a inspeções sem prévio aviso;

Cliente: _____________________________________

Termo de responsabilidade instrumental:

${intervenienteNome || '________________'}
${intervenienteCpf ? `CPF: ${intervenienteCpf}` : 'CPF: ________________'}
`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `termo-responsabilidade-${alocacao?.tombamento || 'alocacao'}-${formatDate(new Date()).replace(/\//g, '-')}.txt`;
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Termo de Responsabilidade - {alocacao?.tombamento}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Clique em "Imprimir" para gerar e imprimir o termo diretamente.</p>
            <p>O documento será aberto em uma nova janela com o timbre de fundo.</p>
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
              <span>Baixar TXT</span>
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