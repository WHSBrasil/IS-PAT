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
                  background-image: url('/Timbre.pdf');
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                }

                .background-container {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: -1;
                  background-image: url('/Timbre.pdf');
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                }

                .content-wrapper {
                  padding: 120px 60px 80px 60px;
                  position: relative;
                  z-index: 1;
                  min-height: calc(100vh - 200px);
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
                }

                .title-section h1 {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 0 0 8px 0;
                  text-transform: uppercase;
                }

                .title-section h2 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0;
                  text-transform: uppercase;
                }

                .main-text {
                  text-align: justify;
                  margin-bottom: 20px;
                  line-height: 1.5;
                }

                .equipment-info {
                  margin: 20px 0;
                  line-height: 1.6;
                }

                .equipment-info p {
                  margin: 5px 0;
                }

                .conditions {
                  margin: 20px 0;
                  text-align: justify;
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
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
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

              <div class="background-container"></div>

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
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Termo de Responsabilidade - {alocacao?.tombamento?.tombamento}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview do termo */}
          <div className="bg-gray-50 border rounded-lg p-6 shadow-sm" style={{ minHeight: '600px' }}>
            {/* Cabeçalho do termo */}
            <div className="text-center mb-6 border-b pb-4">
              <h2 className="text-lg font-bold uppercase">TERMO DE RESPONSABILIDADE</h2>
              <h3 className="text-md font-semibold uppercase">GUARDA E USO DE EQUIPAMENTOS</h3>
            </div>

            {/* Conteúdo do termo */}
            <div className="text-sm leading-relaxed space-y-4">
              {/* Texto principal do termo */}
              <div className="text-justify mb-4">
                <p>
                  Eu, <strong>{alocacao?.interveniente_nome || alocacao?.responsavel_unidade || '________________'}</strong>{alocacao?.interveniente_cns ? `, Portador do CNS ${alocacao.interveniente_cns}` : ''}, lotado na unidade de saúde <strong>{alocacao?.unidade_nome || '________________'}</strong>{alocacao?.cnes ? `, CNES ${alocacao.cnes}` : ''}, declaro que recebi do <strong>{alocacao?.mantenedora || '________________'}</strong>{alocacao?.cnpj ? `, CNPJ ${alocacao.cnpj}` : ''} a título de guarda, transporte e conservação, para uso exclusivo nos sistemas determinados pela SMS – Secretaria Municipal de Saúde, e a trabalho conforme meu cargo acima declarado, o equipamento abaixo especificado neste termo:
                </p>
              </div>

              {/* Informações do equipamento - só exibe se houver pelo menos um dado */}
              {(alocacao?.produto_nome || alocacao?.produto_codigo || alocacao?.imei || alocacao?.serial || alocacao?.mac) && (
                <div className="border p-3 rounded mb-4 bg-blue-50">
                  <h4 className="font-semibold mb-2">Informações do Equipamento:</h4>
                  {alocacao?.produto_nome && <p><strong>Equipamento:</strong> {alocacao.produto_nome}{alocacao?.produto_codigo ? ` - ${alocacao.produto_codigo}` : ''}</p>}
                  {alocacao?.imei && <p><strong>IMEI:</strong> {alocacao.imei}</p>}
                  {alocacao?.serial && <p><strong>Serial:</strong> {alocacao.serial}</p>}
                  {alocacao?.mac && <p><strong>MAC:</strong> {alocacao.mac}</p>}
                </div>
              )}

              {/* Condições - sempre exibe */}
              <div className="border p-3 rounded mb-4">
                <p className="mb-2 font-semibold">Pelo qual declaro estar ciente de que:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Se o equipamento for danificado ou inutilizado por emergência, manutenção, mau uso ou negligência, deverá comunicar o ocorrido ao responsável da Secretaria Municipal da Saúde, ficando sujeito às responsabilidades respectivas de cada conduta;</li>
                  <li>No caso de extravio, furto ou roubo deverá notificar crimes, deverá se apresentar boletim de ocorrência imediatamente;</li>
                  <li>Em caso de troca por dano, furto ou roubo, o novo equipamento acarretará custos não previstos para a Instituição, visto que a Instituição não tem obrigação de substituir equipamentos danificados nos casos acima citados;</li>
                  <li>Em caso de troca por dano, furto ou roubo, poderei vir a receber equipamentos de qualidade inferior, inclusive usados, resultados de outras marcas;</li>
                  <li>Em caso de troca por contrato entre a Instituição IGM e o município de Cascavel (PR) ou outros ente dos contratos firmados, deverá responsável pela devolução, sem direito a completo e em perfeito estado os equipamentos, constituindo-se o tempo de uso dos mesmo, no Instituto IGM/Empresa;</li>
                  <li>O equipamento em minha posse não é protegido, devendo ter apenas dados de trabalho nele, ou seja, todos os dados, programas e demais informações estão sendo salvos pelo usuário por sua conta e risco;</li>
                  <li>Estando os equipamentos em minha posse, estarei sujeito a inspeções sem prévio aviso;</li>
                </ol>
              </div>

              {/* Assinaturas */}
              <div className="border p-3 rounded space-y-4">
                <p>Cliente: _____________________________________</p>
                <div className="pt-4">
                  <p className="mb-2 font-semibold">Termo de responsabilidade instrumental:</p>
                  {(alocacao?.interveniente_nome || alocacao?.responsavel_unidade) && (
                    <p><strong>{alocacao.interveniente_nome || alocacao.responsavel_unidade}</strong></p>
                  )}
                  {alocacao?.interveniente_cpf && (
                    <p>CPF: {alocacao.interveniente_cpf}</p>
                  )}
                </div>
              </div>
            </div>
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