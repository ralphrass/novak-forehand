'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { PDFViewer } from '@react-pdf/renderer';
import { PDFTemplate } from '@/components/insurance-pdf-template';

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

  const handleProcessPDF = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProposalData(mockProposalData);
    setShowProposal(true);
    setIsProcessing(false);
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

  const renderProposal = () => {
    if (!proposalData) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-8 bg-white">
        {/* Dados do Segurado */}
        <div className="p-6">
          <Text className="font-bold mb-6">Segurado(a): {proposalData.vehicleData.insuredName}</Text>
          
          <Heading level={3} className="mb-4">DESCRIÇÃO DO VEÍCULO</Heading>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Marca/Modelo/Ano modelo</TableCell>
                <TableCell>{proposalData.vehicleData.vehicle.makeModelYear}</TableCell>
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

          {/* Pagamento */}
          <div className="mt-8">
            <Heading level={3} className="mb-4">FORMAS DE PAGAMENTO</Heading>
            <div className="bg-zinc-50 p-4 rounded">
              <Text className="font-bold mb-2">Investimento Anual: {proposalData.payment.annualPremium}</Text>
              <Text className="mb-2">{proposalData.payment.paymentOptions.debit}</Text>
              <Text className="mb-2">{proposalData.payment.paymentOptions.creditCard}</Text>
              <Text>{proposalData.payment.paymentOptions.porto}</Text>
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
      {showPDF ? (
        <div className="fixed inset-0 bg-white z-50">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              Novo Upload
            </Button>
            <Button 
              variant="outline" 
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
                  variant="outline" 
                  onClick={handleReset}
                >
                  Novo Upload
                </Button>
                <Button 
                  variant="outline" 
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