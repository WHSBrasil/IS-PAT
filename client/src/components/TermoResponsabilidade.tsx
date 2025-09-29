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
                  font-size: 11px;
                  line-height: 1.3;
                  margin: 20px;
                  color: #000;
                  background: white;
                }

                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                  padding: 10px 0;
                  border-bottom: 1px solid #ccc;
                }

                .logo-left, .logo-right {
                  width: 120px;
                  height: 60px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 1px solid #ddd;
                  background: #f9f9f9;
                  font-size: 10px;
                  text-align: center;
                  color: #666;
                }

                .title-section {
                  text-align: center;
                  flex-grow: 1;
                  margin: 0 20px;
                }

                .title-section h1 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0 0 5px 0;
                  letter-spacing: 0.5px;
                }

                .title-section h2 {
                  font-size: 12px;
                  font-weight: normal;
                  margin: 0;
                  letter-spacing: 0.3px;
                }

                .content {
                  text-align: justify;
                  margin-bottom: 15px;
                  line-height: 1.4;
                }

                .equipment-info {
                  margin: 15px 0;
                  padding: 8px;
                  background-color: #f8f8f8;
                  border: 1px solid #ddd;
                  font-size: 11px;
                }

                .conditions {
                  margin: 15px 0;
                  text-align: justify;
                }

                .conditions ol {
                  padding-left: 20px;
                  margin: 10px 0;
                }

                .conditions li {
                  margin: 8px 0;
                  text-align: justify;
                  line-height: 1.4;
                }

                .signatures {
                  margin-top: 40px;
                }

                .signature-line {
                  margin: 25px 0;
                  text-align: center;
                }

                .signature-line::before {
                  content: '';
                  display: block;
                  width: 300px;
                  height: 1px;
                  background: #000;
                  margin: 0 auto 5px auto;
                }

                .footer {
                  margin-top: 40px;
                  text-align: center;
                  font-size: 10px;
                  color: #666;
                  border-top: 1px solid #ccc;
                  padding-top: 15px;
                }

                @media print {
                  body {
                    margin: 0;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }

                  .no-print {
                    display: none !important;
                  }

                  .page-break {
                    page-break-before: always;
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

              <div class="header">
                <div class="logo-left">
                  LOGO<br>CASCAVEL
                </div>
                <div class="title-section">
                  <h1>TERMO DE RESPONSABILIDADE</h1>
                  <h2>GUARDA E USO DE EQUIPAMENTOS</h2>
                </div>
                <div class="logo-right">
                  LOGO<br>IGM
                </div>
              </div>

              <div class="content">
                <p>Eu, <strong>${alocacao?.interveniente?.nome || alocacao?.responsavel_unidade || '[sotech.cdg_interveniente.interveniente]'}</strong>, Portador do CNS <strong>${alocacao?.interveniente?.cnscnes || '[sotech.cdg_interveniente.cnscnes]'}</strong>, lotado na unidade de saúde <strong>${alocacao?.unidadesaude?.nome || '[sotech.cdg_unidadesaude.unidadesaude]'}</strong>, CNES <strong>${alocacao?.unidadesaude?.cnes || '[sotech.cdx_unidadesaude.cnes]'}</strong>, declaro que recebi do <strong>${alocacao?.mantenedora?.nome || empresa?.mantenedora || '[sotech.cdg_mantenedora.mantenedora]'}</strong>, CNPJ <strong>${alocacao?.mantenedora?.cnpj || empresa?.cnpj || '[sotech.cdg_mantenedora.cnpj]'}</strong> a título de guarda, transporte e conservação, para uso exclusivo nos sistemas determinados pela SMS – Secretaria Municipal de Saúde, e a trabalho conforme meu cargo acima declarado, o equipamento abaixo especificado neste termo:</p>
              </div>

              <div class="equipment-info">
                <p><strong>Equipamento:</strong> ${alocacao?.tombamento?.produto?.nome || '[descricao_produto]'} ${alocacao?.tombamento?.observacao || '[codigo_produto]'}</p>
                <p><strong>IMEI:</strong> ${alocacao?.tombamento?.imei || '[sotech.pat_tombamento.imei]'}</p>
                <p><strong>Serial:</strong> ${alocacao?.tombamento?.serial || '[numero_serie]'}</p>
                <p><strong>MAC:</strong> ${alocacao?.tombamento?.mac || '[sotech.pat_tombamento.mac]'}</p>
              </div>

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
                <p>Cliente:</p>
                <div class="signature-line"></div>

                <br><br>
                <p><strong>Termo de responsabilidade instrumental:</strong></p>
                <br>
                <p><strong>${alocacao?.interveniente?.nome || alocacao?.responsavel_unidade || '[nome_responsavel]'}</strong></p>
                <p>CPF: ${alocacao?.interveniente?.cpfcnpj || '[sotech.cdg_interveniente.cpfcnpj]'}</p>
              </div>

              <div class="footer">
                <p><strong>Grupo IS</strong></p>
                <p>SWITCH ® SYSCOM</p>
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
          <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ minHeight: '600px' }}>
            {/* Cabeçalho com logos */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div className="w-24 h-12 bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-xs text-blue-600">
                LOGO<br/>CASCAVEL
              </div>
              <div className="text-center flex-grow mx-4">
                <h1 className="text-sm font-bold mb-1">TERMO DE RESPONSABILIDADE</h1>
                <h2 className="text-xs">GUARDA E USO DE EQUIPAMENTOS</h2>
              </div>
              <div className="w-24 h-12 bg-green-100 border border-green-200 rounded flex items-center justify-center text-xs text-green-600">
                LOGO<br/>IGM
              </div>
            </div>

            {/* Conteúdo do termo */}
            <div className="text-xs leading-relaxed space-y-4">
              <div className="bg-gray-50 p-4 rounded text-xs">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
{`Eu, ${intervenienteNome || '________________'}${intervenienteCns ? `, Portador do CNS ${intervenienteCns}` : ''}, lotado na unidade de saúde ${unidade || '________________'}${unidadeCnes ? `, CNES ${unidadeCnes}` : ''}, declaro que recebi do ${mantenedoraNome || '________________'}${mantenedoraCnpj ? `, CNPJ ${mantenedoraCnpj}` : ''} a título de guarda, transporte e conservação, para uso exclusivo nos sistemas determinados pela SMS – Secretaria Municipal de Saúde, e a trabalho conforme meu cargo acima declarado, o equipamento abaixo especificado neste termo:

${produto || produtoCodigo ? `Equipamento: ${produto || ''} ${produtoCodigo || ''}` : ''}
${imei ? `IMEI: ${imei}` : ''}
${serial ? `Serial: ${serial}` : ''}
${mac ? `MAC: ${mac}` : ''}

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

${alocacao?.interveniente?.nome || alocacao?.responsavel_unidade || '[nome_responsavel]'}
CPF: ${alocacao?.interveniente?.cpfcnpj || '[sotech.cdg_interveniente.cpfcnpj]'}`}
                </pre>
              </div>

              <div className="text-center text-xs text-gray-600 border-t pt-4 mt-6">
                <p><strong>Grupo IS</strong></p>
                <p>SWITCH ® SYSCOM</p>
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