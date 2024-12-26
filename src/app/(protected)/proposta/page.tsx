'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { PDFViewer } from '@react-pdf/renderer';
import { PDFTemplate } from '@/components/insurance-pdf-template';
// No topo do arquivo, junto com os outros imports
import { Input } from '@/components/input';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';


const pdfjsWorker = `
importScripts('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js');`;

const setupPdfWorker = async () => {
  if (typeof window === 'undefined') return; // Verifica se está no browser
  
  // Criar um blob com o código do worker
  const blob = new Blob([pdfjsWorker], { type: 'text/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
};


// Novas interfaces para dados com validação
interface ExtractedField<T> {
  value: T;
  confidence: number;
  pdfContext: string;
}

interface ExtractedInsuranceData {
  vehicleData: {
    insuredName: ExtractedField<string>;
    vehicle: {
      makeModelYear: ExtractedField<string>;
      plate: ExtractedField<string>;
      fipeCode: ExtractedField<string>;
    };
  };
  coverage: {
    comprehensive: ExtractedField<string>;
    deductible: ExtractedField<string>;
    thirdPartyLiability: {
      propertyDamage: ExtractedField<string>;
      bodilyInjury: ExtractedField<string>;
    };
    moralDamages: ExtractedField<string>;
    greenCard: ExtractedField<string>;
    roadside: ExtractedField<string>;
    rentalCar: ExtractedField<string>;
    glass: ExtractedField<string>;
  };
  payment: {
    annualPremium: ExtractedField<string>;
    paymentOptions: ExtractedField<{
      debit: string;
      creditCard: string;
    }>;
  };
  mainDriver: {
    name: ExtractedField<string>;
    birthDate: ExtractedField<string>;
    maritalStatus: ExtractedField<string>;
    youngDriverCoverage: ExtractedField<string>;
    garage: ExtractedField<string>;
    zipCode: ExtractedField<string>;
    vehicleUse: ExtractedField<string>;
  };
}


interface VehicleData {
  insuredName: string;
  vehicle: {
    makeModelYear: string;
    plate: string;
    fipeCode: string;
  };
}

interface Coverage {
  comprehensive: {
    type: string;
    value: string;
  };
  deductible: {
    value: string;
  };
  thirdPartyLiability: {
    propertyDamage: string;
    bodilyInjury: string;
  };
  moralDamages: string;
  greenCard: string;
  roadside: string;
  rentalCar: string;
  glass: {
    coverage: string;
    deductibles: {
      conventionalHeadlights: string;
      ledHeadlights: string;
      xenonHeadlights: string;
      conventionalAuxLights: string;
      ledAuxLights: string;
      xenonAuxLights: string;
      conventionalTaillights: string;
      auxTaillights: string;
      ledTaillights: string;
      windshield: string;
      conventionalMirrors: string;
      sunroof: string;
      sidePanels: string;
      rearWindow: string;
    };
  };
}

interface Payment {
  annualPremium: string;
  paymentOptions: {
    debit: string;
    creditCard: string;
    porto: string;
  };
}

interface MainDriver {
  name: string;
  birthDate: string;
  maritalStatus: string;
  youngDriverCoverage: string;
  garage: string;
  zipCode: string;
  vehicleUse: string;
}

interface InsuranceProposal {
  vehicleData: VehicleData;
  coverage: Coverage;
  payment: Payment;
  mainDriver: MainDriver;
}

export default function PropostasPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [proposalData, setProposalData] = useState<InsuranceProposal | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedInsuranceData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  

  const handleReset = () => {
    setFile(null);
    setShowProposal(false);
    setShowPDF(false);
    setProposalData(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === 'application/pdf') {
      setFile(file);
    }
  };

  const mockProposalData: InsuranceProposal = {
    vehicleData: {
      insuredName: "Cleo Henrique Beux dos Reis",
      vehicle: {
        makeModelYear: "GOLF COMFORTLINE 1.0 TSI FLEX – 2017",
        plate: "GAD1F07",
        fipeCode: "54666"
      }
    },
    coverage: {
      comprehensive: {
        type: "Compreensiva",
        value: "100% FIPE"
      },
      deductible: {
        value: "R$ 3.980,00"
      },
      thirdPartyLiability: {
        propertyDamage: "R$ 200.000,00",
        bodilyInjury: "R$ 200.000,00"
      },
      moralDamages: "R$ 10.000,00",
      greenCard: "Contratado",
      roadside: "Guincho 500 Km",
      rentalCar: "15 Diárias",
      glass: {
        coverage: "Contratado",
        deductibles: {
          conventionalHeadlights: "R$ 480,00",
          ledHeadlights: "R$ 2.310,00",
          xenonHeadlights: "R$ 2.469,00",
          conventionalAuxLights: "R$ 130,00",
          ledAuxLights: "R$ 2.310,00",
          xenonAuxLights: "R$ 2.310,00",
          conventionalTaillights: "R$ 245,00",
          auxTaillights: "R$ 130,00",
          ledTaillights: "R$ 643,00",
          windshield: "R$ 561,00",
          conventionalMirrors: "R$ 450,00",
          sunroof: "R$ 1.665,00",
          sidePanels: "R$ 197,00",
          rearWindow: "R$ 310,00"
        }
      }
    },
    payment: {
      annualPremium: "R$ 3.110,25",
      paymentOptions: {
        debit: "1+3 R$ 777,56 s/juros (Boleto/ Débito em Conta)",
        creditCard: "1+9 R$ 311,03 s/juros (Cartão de Crédito)",
        porto: "1+11 R$ 246,23 s/juros (Cartão Porto)"
      }
    },
    mainDriver: {
      name: "Eduardo Felippin Beux dos Reis",
      birthDate: "17/11/1999",
      maritalStatus: "Solteiro",
      youngDriverCoverage: "Não",
      garage: "Sim",
      zipCode: "99025-500",
      vehicleUse: "Particular"
    }
  };

  // Padrões de extração ajustados para o PDF da Alfa
  const patterns = {
    // Dados do Veículo
    insuredName: /Proponente:\s*(.*?)\s*Corretor:/,
    makeModelYear: /Veículo:\s*(.*?)\s*Ano:/,
    plate: /Placa:\s*([A-Z0-9]{7})/,
    fipeCode: /Cód\.\s*FIPE:\s*(\d+-\d)/,
    
    // Coberturas
    comprehensive: /Auto\s*-\s*Casco\s*(100\s*%[^R]*)/,
    deductible: /Franquia[^R]*R\$\s*([\d,.]+)/,
    danosMateriais: /RCFV\s*-\s*Danos\s*Materiais\s*(\d{1,3}\.?\d{3},\d{2})/,
    danosCorporais: /RCFV\s*-\s*Danos\s*Corporais\s*(\d{1,3}\.?\d{3},\d{2})/,
    danosMorais: /RCFV\s*-\s*Danos\s*Morais[^R]*(\d{1,3}\.?\d{3},\d{2})/,
    
    // Assistências
    assistance24h: /Assistência\s*-\s*24\s*horas\s*(.*?)(?=\d)/,
    carroReserva: /Assistência\s*-\s*Carro\s*Reserva\s*(.*?)(?=\d)/,
    vidros: /Assistência\s*-\s*Vidros\s*(.*?)(?=\d)/,
    
    // Pagamento
    valorTotal: /Valor\s*Total.*?Vista:\s*R\$\s*([\d,.]+)/,
    
    // Condutor
    mainDriverName: /Nome\s*do\s*Condutor\s*Principal\s*(.*?)(?=CPF|$)/,
    birthDate: /Data\s*de\s*Nascimento[^:]*:\s*(\d{2}\/\d{2}\/\d{4})/,
    maritalStatus: /Estado\s*Civil[^:]*:\s*(.*?)(?=\n|Data)/,
    garage: /Veículo\s*permanece\s*em\s*garagem.*?Residência\s*(.*?)(?=\n|Veículo)/,
    cepPernoite: /CEP\s*Pernoite:\s*(\d{5}-\d{3})/,
    vehicleUse: /Utilização\s*do\s*Veículo\s*(.*?)(?=\n|Deseja)/
  };

  // Função auxiliar para extrair campos
  const extractField = (pattern: RegExp, text: string): ExtractedField<string> => {
    const match = text.match(pattern);
    if (!match) {
      return {
        value: '',
        confidence: 0,
        pdfContext: 'Campo não encontrado'
      };
    }

    const startIndex = Math.max(0, match.index! - 100);
    const endIndex = Math.min(text.length, match.index! + match[0].length + 100);
    const context = text.substring(startIndex, endIndex)
    .replace(/\s+/g, ' ')
    .trim();

    // Limpar o valor extraído
    const value = match[1]
    .replace(/\s+/g, ' ')
    .trim();

    // Calcular confiança baseado em alguns fatores
    const confidence = value.length > 3 ? 0.9 : 0.5;

    return {
      value: value,
      confidence: confidence,
      pdfContext: context
    };
  };

  const handleProcessPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
  
    try {
      // Configurar o worker antes de processar
      await setupPdfWorker();

      // Ler o PDF como array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Carregar o PDF
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/`
      });
      const pdf = await loadingTask.promise;
      
      // Extrair texto de todas as páginas
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log('Texto extraído:', fullText); // Para debug
  
      // Extrair dados usando os padrões da Alfa
      const extracted = {
        vehicleData: {
          insuredName: extractField(patterns.insuredName, fullText),
          vehicle: {
            makeModelYear: extractField(patterns.makeModelYear, fullText),
            plate: extractField(patterns.plate, fullText),
            fipeCode: extractField(patterns.fipeCode, fullText),
          },
        },
        coverage: {
          comprehensive: extractField(/Compreensiva:\s*(.*?)(?=\n|$)/m, fullText),
          deductible: extractField(/Franquia Casco[^R]*R\$\s*([\d,.]+)/m, fullText),
          thirdPartyLiability: {
            propertyDamage: extractField(/RCF-V Danos Materiais[^R]*R\$\s*([\d,.]+)/m, fullText),
            bodilyInjury: extractField(/RCF-V.*Corporais[^R]*R\$\s*([\d,.]+)/m, fullText),
          },
          moralDamages: extractField(/Danos Morais[^R]*R\$\s*([\d,.]+)/m, fullText),
          greenCard: extractField(/Carta Verde[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
          roadside: extractField(/Assistência 24 Horas[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
          rentalCar: extractField(/Carro Reserva[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
          glass: extractField(/Vidros[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
        },
        payment: {
          annualPremium: extractField(/Investimento Anual[^R]*R\$\s*([\d,.]+)/m, fullText),
          paymentOptions: {
            value: {
              debit: extractField(/Débito[^:]*:\s*(.*?)(?=\n|$)/m, fullText).value,
              creditCard: extractField(/Cartão[^:]*:\s*(.*?)(?=\n|$)/m, fullText).value,
            },
            confidence: 0.9,
            pdfContext: 'Opções de pagamento extraídas',
          },
        },
        mainDriver: {
          name: extractField(/Nome[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
          birthDate: extractField(/Data\s*nascimento[^:]*:\s*(\d{2}\/\d{2}\/\d{4})/m, fullText),
          maritalStatus: extractField(/Estado Civil[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
          youngDriverCoverage: extractField(/Deseja contratar cobertura.*?:\s*(Sim|Não)/m, fullText),
          garage: extractField(/Garagem[^:]*:\s*(Sim|Não)/m, fullText),
          zipCode: extractField(/CEP[^:]*:\s*(\d{5}-\d{3})/m, fullText),
          vehicleUse: extractField(/Uso do veículo[^:]*:\s*(.*?)(?=\n|$)/m, fullText),
        },
      };      

      console.log('Dados extraídos:', extracted); // Para debug
  
      setExtractedData(extracted);
  
      // Converter para o formato da proposta
      const proposal: InsuranceProposal = {
        vehicleData: {
          insuredName: extracted.vehicleData.insuredName.value,
          vehicle: {
            makeModelYear: extracted.vehicleData.vehicle.makeModelYear.value,
            plate: extracted.vehicleData.vehicle.plate.value,
            fipeCode: extracted.vehicleData.vehicle.fipeCode.value
          }
        },
        coverage: {
          comprehensive: {
            type: "Compreensiva",
            value: extracted.coverage.comprehensive.value
          },
          deductible: {
            value: extracted.coverage.deductible.value
          },
          thirdPartyLiability: {
            propertyDamage: extracted.coverage.thirdPartyLiability.propertyDamage.value,
            bodilyInjury: extracted.coverage.thirdPartyLiability.bodilyInjury.value
          },
          moralDamages: extracted.coverage.moralDamages.value,
          greenCard: extracted.coverage.greenCard.value,
          roadside: extracted.coverage.roadside.value,
          rentalCar: extracted.coverage.rentalCar.value,
          glass: {
            coverage: "Contratado",
            deductibles: {
              conventionalHeadlights: "",
              ledHeadlights: "",
              xenonHeadlights: "",
              conventionalAuxLights: "",
              ledAuxLights: "",
              xenonAuxLights: "",
              conventionalTaillights: "",
              auxTaillights: "",
              ledTaillights: "",
              windshield: "",
              conventionalMirrors: "",
              sunroof: "",
              sidePanels: "",
              rearWindow: ""
            }
          }
        },
        payment: {
          annualPremium: extracted.payment.annualPremium.value,
          paymentOptions: {
            debit: extracted.payment.paymentOptions.value.debit,
            creditCard: extracted.payment.paymentOptions.value.creditCard,
            porto: ""
          }
        },
        mainDriver: {
          name: extracted.mainDriver.name.value,
          birthDate: extracted.mainDriver.birthDate.value,
          maritalStatus: extracted.mainDriver.maritalStatus.value,
          youngDriverCoverage: extracted.mainDriver.youngDriverCoverage.value,
          garage: extracted.mainDriver.garage.value,
          zipCode: extracted.mainDriver.zipCode.value,
          vehicleUse: extracted.mainDriver.vehicleUse.value
        }
      };
  
      setProposalData(proposal);
      setShowProposal(true);
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPDF = () => {
    // URL para um PDF estático que você colocará na pasta public
    const pdfUrl = '/proposta-exemplo.pdf';
    
    // Cria um elemento <a> temporário
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'proposta-seguro.pdf'; // Nome do arquivo que será baixado
    
    // Simula o clique no link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ValidationIndicator: React.FC<{
    field: ExtractedField<any>;
    onEdit: (value: string) => void;
    label?: string;
  }> = ({ field, onEdit, label }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(field.value);
    const [showTooltip, setShowTooltip] = useState(false);
  
    return (
      <div className="flex items-center gap-2 group relative">
        {/* Indicador de confiança - usando SVGs inline */}
        {field.confidence > 0.8 ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-4 w-4 text-green-500"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-4 w-4 text-yellow-500"
            strokeWidth="2"
          >
            <path d="M12 9v4M12 17h.01M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
          </svg>
        )}
        
        {/* Campo de edição ou valor */}
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onEdit(editValue);
            }}
            className="flex-1"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 flex-1">
            {label && <span className="font-medium">{label}:</span>}
            <span>{field.value}</span>
            <Button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </Button>
          </div>
        )}
        
        {/* Tooltip para contexto do PDF */}
        {field.confidence < 0.8 && field.pdfContext && (
          <div className="relative">
            <Button
              className="p-1"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 text-zinc-400"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </Button>
            
            {showTooltip && (
              <div className="absolute z-10 w-64 p-2 text-sm bg-white border rounded-md shadow-lg -right-2 top-8">
                <div className="text-zinc-600">{field.pdfContext}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderProposal = () => {
    if (!proposalData || !extractedData) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-8 bg-white">
        {/* Dados do Segurado */}
        <div className="p-6">
        <section>
        <div className="space-y-4">
          <ValidationIndicator
            field={extractedData.vehicleData.insuredName}
            label="Segurado(a)"
            onEdit={(value) => {
              setProposalData(prev => ({
                ...prev!,
                vehicleData: {
                  ...prev!.vehicleData,
                  insuredName: value
                }
              }));
            }}
          />

          <ValidationIndicator
                  field={extractedData.vehicleData.vehicle.makeModelYear}
                  label="Marca/Modelo/Ano"
                  onEdit={(value) => {
                    setProposalData(prev => ({
                      ...prev!,
                      vehicleData: {
                        ...prev!.vehicleData,
                        vehicle: {
                          ...prev!.vehicleData.vehicle,
                          makeModelYear: value
                        }
                      }
                    }));
                  }}
          />

          </div>
          </section>
          <Heading level={3} className="mb-4">DESCRIÇÃO DO VEÍCULO</Heading>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Marca/Modelo/Ano modelo</TableCell>
                <TableCell>
                <ValidationIndicator
                  field={extractedData.vehicleData.vehicle.makeModelYear}
                  onEdit={(value) => {
                    setProposalData(prev => ({
                      ...prev!,
                      vehicleData: {
                        ...prev!.vehicleData,
                        vehicle: {
                          ...prev!.vehicleData.vehicle,
                          makeModelYear: value
                        }
                      }
                    }));
                  }}
                />
              </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Placa</TableCell>
                <TableCell>{proposalData.vehicleData.vehicle.plate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">FIPE</TableCell>
                <TableCell>{proposalData.vehicleData.vehicle.fipeCode}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Coberturas */}
          <section>
          <Heading level={3} className="mt-8 mb-4">OPÇÕES DE CONTRATAÇÃO</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>COBERTURAS</TableHeader>
                <TableHeader>OPÇÃO 2</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Compreensiva</TableCell>
                <TableCell>{proposalData.coverage.comprehensive.value}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Franquia Casco</TableCell>
                <TableCell>{proposalData.coverage.deductible.value}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">RCF-V Danos Materiais</TableCell>
                <TableCell>{proposalData.coverage.thirdPartyLiability.propertyDamage}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">RCF-V Corporais a Terceiros</TableCell>
                <TableCell>{proposalData.coverage.thirdPartyLiability.bodilyInjury}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Danos Morais</TableCell>
                <TableCell>{proposalData.coverage.moralDamages}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Carta Verde</TableCell>
                <TableCell>{proposalData.coverage.greenCard}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Assistência 24 Horas</TableCell>
                <TableCell>{proposalData.coverage.roadside}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Carro Reserva</TableCell>
                <TableCell>{proposalData.coverage.rentalCar}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </section>

          {/* Pagamento */}
          <div className="mt-8">
            <Heading level={3} className="mb-4">FORMAS DE PAGAMENTO</Heading>
            <div className="bg-zinc-50 p-4 rounded">
              <Text className="font-bold mb-2">Investimento Anual: {proposalData.payment.annualPremium}</Text>
              <Text className="mb-2">{proposalData.payment.paymentOptions.debit}</Text>
              <Text className="mb-2">{proposalData.payment.paymentOptions.creditCard}</Text>
              {proposalData.payment.paymentOptions.porto && (
                <Text>{proposalData.payment.paymentOptions.porto}</Text>
              )}
            </div>
          </div>

          {/* Dados do Principal Condutor */}
          <div className="mt-8">
            <Heading level={3} className="mb-4">PERFIL PRINCIPAL CONDUTOR</Heading>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nome</TableCell>
                  <TableCell>{proposalData.mainDriver.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Data de Nascimento</TableCell>
                  <TableCell>{proposalData.mainDriver.birthDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Estado Civil</TableCell>
                  <TableCell>{proposalData.mainDriver.maritalStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Garagem</TableCell>
                  <TableCell>{proposalData.mainDriver.garage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CEP Pernoite</TableCell>
                  <TableCell>{proposalData.mainDriver.zipCode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Uso do Veículo</TableCell>
                  <TableCell>{proposalData.mainDriver.vehicleUse}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {showPDF && proposalData ? (
        <div className="fixed inset-0 bg-white z-50">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200"
              onClick={handleReset}
            >
              Novo Upload
            </Button>
            <Button 
              className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200"
              onClick={() => setShowPDF(false)}
            >
              Voltar para Proposta
            </Button>
          </div>
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <PDFTemplate data={proposalData} />
          </PDFViewer>
        </div>
      ) : (
        <>
          {!showProposal ? (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <Heading level={2}>Upload da Proposta</Heading>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100">
                          <svg 
                            className="w-6 h-6 text-zinc-400" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path d="M12 15V3m0 0L8 7m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                          </svg>
                        </div>
                        <Text>Clique para selecionar ou arraste um PDF</Text>
                      </div>
                    </label>
                    {file && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <svg 
                          className="w-4 h-4 text-zinc-400" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <path d="M14 2v6h6" />
                        </svg>
                        <Text>{file.name}</Text>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleProcessPDF}
                    disabled={!file || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Processando...' : 'Gerar Proposta'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <Button 
                  className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200"
                  onClick={handleReset}
                >
                  Novo Upload
                </Button>
                <Button 
                  className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200"
                  onClick={() => setShowProposal(false)}
                >
                  Voltar
                </Button>
              </div>
              {renderProposal()}
              <div className="flex justify-end mt-6">
                <Button onClick={handleExportPDF}>
                  Exportar PDF
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}