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

  // Auto print when modal opens
  React.useEffect(() => {
    if (isOpen) {
      handlePrint();
    }
  }, [isOpen]);

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
    const empresaNome = empresa?.mantenedora || '[NOME_DA_EMPRESA]';
    const tombamento = alocacao?.tombamento?.tombamento || '[CODIGO_TOMBAMENTO]';
    const produto = alocacao?.tombamento?.produto?.nome || '[DESCRICAO_PRODUTO]';
    const produtoCodigo = alocacao?.tombamento?.observacao || '[CODIGO_PRODUTO]';
    const serial = alocacao?.tombamento?.serial || '[NUMERO_SERIE]';
    const imei = alocacao?.tombamento?.imei || '[IMEI_EQUIPAMENTO]';
    const mac = alocacao?.tombamento?.mac || '[ENDERECO_MAC]';
    const unidade = alocacao?.unidadesaude?.nome || '[UNIDADE_DE_SAUDE]';
    const unidadeCnes = alocacao?.unidadesaude?.cnes || '[CNES_UNIDADE]';
    const setor = alocacao?.setor?.nome || '[SETOR]';
    const responsavelUnidade = alocacao?.responsavel_unidade || '[RESPONSAVEL_UNIDADE]';
    const intervenienteNome = alocacao?.interveniente?.nome || '[NOME_INTERVENIENTE]';
    const intervenienteCns = alocacao?.interveniente?.cnscnes || '[CNS_INTERVENIENTE]';
    const intervenienteCpf = alocacao?.interveniente?.cpfcnpj || '[CPF_INTERVENIENTE]';
    const mantenedoraNome = alocacao?.mantenedora?.nome || empresa?.mantenedora || '[NOME_MANTENEDORA]';
    const mantenedoraCnpj = alocacao?.mantenedora?.cnpj || empresa?.cnpj || '[CNPJ_MANTENEDORA]';
    const dataAlocacao = formatDate(alocacao?.dataalocacao) || '[DATA_ALOCACAO]';
    const dataAtual = formatDate(new Date());

    return `
                                    TERMO DE RESPONSABILIDADE
                                  GUARDA E USO DE EQUIPAMENTOS

Eu, [${intervenienteNome || responsavelUnidade}], Portador do CNS [${intervenienteCns}],
lotado na unidade de saúde [${unidade}] CNES [${unidadeCnes}], declaro que recebi do
[${mantenedoraNome}], CNPJ [${mantenedoraCnpj}] a título de
guarda, responsabilizando-me pelo uso adequado e os cuidados devidos, conforme
Secretaria Municipal de Saúde, e o assumo conforme meu cargo abaixo descrito, o equipamento
abaixo especificado neste termo:

Equipamento: [${produto}] [${produtoCodigo}]
IMEI: [${imei}]
Serial: [${serial}]
MAC: [${mac}]

Pelo qual declaro estar ciente de que:

1. Se o equipamento for danificado ou inutilizado por emergência manutencão, mau uso ou
   negligência, deverá comunicar o ocorrido ao responsável da Secretaria Municipal da
   Saúde, ficando sujeito às responsabilidades respectivas de cada conduta;

2. No caso de extravio, furto ou roubo deverá notificar crimes, deverá se apresentar
   boletim de ocorrência imediatamente;

3. Em caso de troca por dano, furto ou roubo, o nome equipamento acarretará custos não
   previstos para a Instituição, visto que a Instituição não tem obrigação de substituir
   equipamentos danificados nos casos acima citados;

4. Em caso de troca por dano, furto ou roubo, poderei vir a receber equipamentos de
   qualidade inferior, inclusive usados, resultados de outras marcas;

5. Em caso de troca por contrato entre a Instituição IGM e o município de Cascavel (PR) ou
   outros ente dos contratos firmados, deverá responsável pela devolução, sem direito a
   completo e em perfeito estado os equipamentos, constituindo-se o tempo de uso dos
   mesmo, no Instituto IGM/Empresa;

6. O equipamento em minha posse não é protegido, devendo-ter apenas dados de trabalho
   nele, ou seja, todos os dados, programas e demais informações estão sendo
   salvos pelo usuário por sua conta e risco;

7. Estando os equipamentos em minha posse, estarei sujeito a inspeções sem prévio aviso;

Cliente: _____________________________________


Termo de responsabilidade instrumental:

[${intervenienteNome || responsavelUnidade}]
CPF [cpf_do_responsavel_unidade]

                                            Grupo IS
                                       SWITCH ® SYSCOM`;
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

                body {
                  font-family: Arial, sans-serif;
                  font-size: 12px;
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
                  width: 210mm;
                  height: 297mm;
                  z-index: 0;
                  overflow: hidden;
                }

                .background-container iframe {
                  width: 210mm;
                  height: 297mm;
                  border: none;
                  pointer-events: none;
                  opacity: 0.3;
                  transform: scale(1);
                  transform-origin: top left;
                  display: block;
                }

                .content-wrapper {
                  padding: 140px 35px 50px 35px;
                  position: relative;
                  z-index: 2;
                  min-height: calc(297mm - 190px);
                  background: transparent;
                  page-break-inside: avoid;
                }

                .header-section {
                  margin-bottom: 30px;
                }

                .logos-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                }

                .logo-left, .logo-center, .logo-right {
                  text-align: center;
                  flex: 1;
                }

                .title-section {
                  text-align: center;
                  margin-bottom: 30px;
                  background: rgba(255, 255, 255, 0.9);
                  padding: 10px;
                  border-radius: 4px;
                }

                .title-section h1 {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 0 0 8px 0;
                  text-transform: uppercase;
                  color: #000;
                }

                .title-section h2 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0;
                  text-transform: uppercase;
                  color: #000;
                }

                .main-text {
                  text-align: justify;
                  margin-bottom: 20px;
                  line-height: 1.5;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 15px;
                  border-radius: 4px;
                  color: #000;
                }

                .equipment-info {
                  margin: 20px 0;
                  line-height: 1.6;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 15px;
                  border-radius: 4px;
                  color: #000;
                }

                .equipment-info p {
                  margin: 5px 0;
                }

                .conditions {
                  margin: 20px 0;
                  text-align: justify;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 15px;
                  border-radius: 4px;
                  color: #000;
                }

                .conditions p {
                  margin-bottom: 10px;
                  font-weight: bold;
                }

                .conditions ol {
                  padding-left: 25px;
                  margin: 15px 0;
                }

                .conditions li {
                  margin: 10px 0;
                  text-align: justify;
                  line-height: 1.5;
                }

                .signatures {
                  margin-top: 50px;
                  background: rgba(255, 255, 255, 0.95);
                  padding: 15px;
                  border-radius: 4px;
                  color: #000;
                }

                .signature-section {
                  margin: 30px 0;
                }

                .signature-line {
                  width: 400px;
                  height: 1px;
                  background: #000;
                  margin: 40px auto 10px auto;
                }

                .signature-text {
                  text-align: center;
                  margin-top: 10px;
                }

                @media print {
                  @page {
                    size: A4;
                    margin: 0;
                  }

                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    width: 210mm !important;
                    height: 297mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }

                  .background-container {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    z-index: 0 !important;
                  }

                  .background-container iframe {
                    width: 210mm !important;
                    height: 297mm !important;
                    transform: scale(1) !important;
                    opacity: 0.3 !important;
                  }

                  .content-wrapper {
                    position: relative !important;
                    z-index: 2 !important;
                    padding: 140px 35px 50px 35px !important;
                  }

                  .no-print {
                    display: none !important;
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
                  position: fixed;
                  top: 10px;
                  z-index: 1000;
                }

                .print-button:hover {
                  background: #0056b3;
                }

                .print-button:first-child {
                  left: 10px;
                }

                .print-button:last-child {
                  left: 150px;
                }
              </style>
            </head>
            <body>
              <div class="no-print">
                <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
                <button class="print-button" onclick="window.close()">❌ Fechar</button>
              </div>

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
                    <div style="margin-top: 30px;">
                      ${intervenienteNome ? `<p><strong>${intervenienteNome}</strong></p>` : ''}
                      ${intervenienteCpf ? `<p>CPF: ${intervenienteCpf}</p>` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        
        // Auto print when window loads
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            setTimeout(() => {
              printWindow.close();
              onClose(); // Close the modal after printing
            }, 1000);
          }, 500);
        };
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

  // Extracting data for conditional rendering in the preview
  const intervenienteNome = alocacao?.interveniente?.nome;
  const intervenienteCns = alocacao?.interveniente?.cnscnes;
  const unidade = alocacao?.unidadesaude?.nome;
  const unidadeCnes = alocacao?.unidadesaude?.cnes;
  const mantenedoraNome = alocacao?.mantenedora?.nome || empresa?.mantenedora;
  const mantenedoraCnpj = alocacao?.mantenedora?.cnpj || empresa?.cnpj;
  const produto = alocacao?.tombamento?.produto?.nome;
  const produtoCodigo = alocacao?.tombamento?.observacao;
  const imei = alocacao?.tombamento?.imei;
  const serial = alocacao?.tombamento?.serial;
  const mac = alocacao?.tombamento?.mac;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Preparando Termo de Responsabilidade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {isGenerating ? 'Gerando documento para impressão...' : 'Preparando impressão...'}
          </p>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
            className="mt-4"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}