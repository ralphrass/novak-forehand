'use client';

import React from 'react';
import { Page, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { Text } from '@/components/text';  // Seu componente Text customizado

// Registrando a fonte Arial (você precisa ter o arquivo da fonte)
Font.register({
family: 'Arial',
src: '/fonts/arial.ttf'
});

// Estilos do PDF
const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Arial'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    logo: {
      width: 120,
    },
    title: {
      color: '#C41E3A',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    section: {
      marginVertical: 10,
    },
    table: {
      border: '1pt solid black',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1pt solid black',
    },
    tableCell: {
      padding: 8,
      fontSize: 10,
    },
    tableCellHeader: {
      backgroundColor: '#f4f4f5',
      fontWeight: 'bold',
    },
    redText: {
      color: '#C41E3A',
    }
  });

interface PDFTemplateProps {
data: InsuranceProposal; // Use a mesma interface que já temos
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
    minorRepairs: {
      coverage: string;
      deductibles: {
        bodyworkAndPaint: string;
        scratchRepairFirst: string;
        scratchRepairOthers: string;
      };
    };
  }
  
  interface Payment {
    annualPremium: string;
    paymentOptions: {
      debit: string;
      creditCard: string;
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
  
  interface ImportantNotes {
    validUntil: string;
    notes: string[];
    broker: {
      name: string;
      phones: string[];
    };
  }
  
  interface InsuranceProposal {
    vehicleData: VehicleData;
    coverage: Coverage;
    payment: Payment;
    mainDriver: MainDriver;
    importantNotes: ImportantNotes;
  }

export default function InsuranceProposal({vehicleData, coverage, payment, mainDriver, importantNotes}: InsuranceProposal) {
  // Dados mockados para exemplo - seriam extraídos do PDF
  const proposal = {
    vehicleData: {
      insuredName: "Renato Cesar Lisboa da Silva",
      vehicle: {
        makeModelYear: "Nissan - FRONTIER PRO4X 4X4 AT (C.Dup) 2.3 Bi-TB Dies. 4p -- 2023",
        plate: "RXW7A68",
        fipeCode: "023184-3"
      }
    },
    coverage: {
      comprehensive: {
        type: "Compreensiva",
        value: "100% FIPE"
      },
      deductible: {
        value: "R$ 10.445,68"
      },
      thirdPartyLiability: {
        propertyDamage: "R$ 200.000,00",
        bodilyInjury: "R$ 200.000,00"
      },
      moralDamages: "R$ 10.000,00",
      greenCard: "Não contratado",
      roadside: "Guincho 550 Km",
      rentalCar: "15 Diárias",
      glass: {
        coverage: "Contratado",
        deductibles: {
          conventionalHeadlights: "R$ 480,00",
          ledHeadlights: "R$ 2.310,00",
          xenonHeadlights: "R$ 2.310,00",
          // ... outros valores conforme documento
        }
      }
    },
    payment: {
      annualPremium: "R$ 3.935,11",
      paymentOptions: {
        debit: "1+5 R$ 655,85 s/juros (Débito em Conta)",
        creditCard: "1+9 R$ 393,51 s/juros (Cartão de Crédito)"
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Heading level={2}>Proposta de Seguro</Heading>
        <Button onClick={() => window.print()}>Gerar PDF</Button>
      </div>

      {/* Dados do Segurado */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Text className="font-bold mb-4">Segurado(a): {proposal.vehicleData.insuredName}</Text>
        
        <Heading level={3} className="mt-6 mb-4">DESCRIÇÃO DO VEÍCULO</Heading>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Marca/Modelo/Ano modelo</TableCell>
              <TableCell>{proposal.vehicleData.vehicle.makeModelYear}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Placa</TableCell>
              <TableCell>{proposal.vehicleData.vehicle.plate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">FIPE</TableCell>
              <TableCell>{proposal.vehicleData.vehicle.fipeCode}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Heading level={3} className="mt-8 mb-4">OPÇÕES DE CONTRATAÇÃO</Heading>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>COBERTURAS</TableHeader>
              <TableHeader>OPÇÃO 1</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Compreensiva</TableCell>
              <TableCell>{proposal.coverage.comprehensive.value}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Franquia Casco</TableCell>
              <TableCell>{proposal.coverage.deductible.value}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">RCF-V Danos Materiais</TableCell>
              <TableCell>{proposal.coverage.thirdPartyLiability.propertyDamage}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">RCF-V Corporais a Terceiros</TableCell>
              <TableCell>{proposal.coverage.thirdPartyLiability.bodilyInjury}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Investimento Anual</TableCell>
              <TableCell className="font-bold">{proposal.payment.annualPremium}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Formas de Pagamento */}
        <div className="mt-6 bg-zinc-50 p-4 rounded">
          <Text className="font-bold mb-2">FORMAS DE PAGAMENTO</Text>
          <Text>{proposal.payment.paymentOptions.debit}</Text>
          <Text>{proposal.payment.paymentOptions.creditCard}</Text>
        </div>
      </div>
    </div>
  );
}