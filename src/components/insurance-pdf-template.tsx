import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { InsuranceProposal } from '@/types/insurance';

// Registrando a fonte Arial
Font.register({
  family: 'Arial',
  src: 'https://fonts.cdnfonts.com/s/29107/ARIAL.woff',
});

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Arial',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C41E3A',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
  },
  tableCellBold: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  insuredName: {
    fontSize: 12,
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  redText: {
    color: '#C41E3A',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
  },
  observationsList: {
    marginTop: 10,
    fontSize: 10,
  },
  observation: {
    marginBottom: 5,
  },
  paymentInfo: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    marginTop: 10,
    borderRadius: 4,
  }
});

interface PDFTemplateProps {
    data: InsuranceProposal;
  }
  
  export const PDFTemplate: React.FC<PDFTemplateProps> = ({ data }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header com Logos */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image 
              src="/images/logo-fante.png" 
              style={styles.logo}
            />
          </View>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image 
            src="/images/icon-car.png" 
            style={[styles.logo, { width: 80 }]}
          />
        </View>
  
        {/* Dados do Segurado */}
        <Text style={styles.insuredName}>
          <Text style={styles.boldText}>Segurado(a): </Text>
          {data.vehicleData.insuredName}
        </Text>
  
        {/* Descrição do Veículo */}
        <View style={styles.section}>
          <Text style={styles.heading}>DESCRIÇÃO DO VEÍCULO</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellBold}>Marca/Modelo/Ano modelo</Text>
              <Text style={styles.tableCell}>{data.vehicleData.vehicle.makeModelYear}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Placa</Text>
              <Text style={styles.tableCell}>{data.vehicleData.vehicle.plate}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>FIPE</Text>
              <Text style={styles.tableCell}>{data.vehicleData.vehicle.fipeCode}</Text>
            </View>
          </View>
        </View>
  
        {/* Opções de Contratação */}
        <View style={styles.section}>
          <Text style={styles.heading}>OPÇÕES DE CONTRATAÇÃO</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellBold}>COBERTURAS</Text>
              <Text style={styles.tableCellBold}>OPÇÃO 2</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Compreensiva</Text>
              <Text style={styles.tableCell}>{data.coverage.comprehensive.value}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Franquia Casco</Text>
              <Text style={styles.tableCell}>{data.coverage.deductible.value}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>RCF-V Danos Materiais</Text>
              <Text style={styles.tableCell}>{data.coverage.thirdPartyLiability.propertyDamage}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>RCF-V Corporais a Terceiros</Text>
              <Text style={styles.tableCell}>{data.coverage.thirdPartyLiability.bodilyInjury}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Danos Morais</Text>
              <Text style={styles.tableCell}>{data.coverage.moralDamages}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Carta Verde</Text>
              <Text style={styles.tableCell}>{data.coverage.greenCard}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Assistência 24 Horas</Text>
              <Text style={styles.tableCell}>{data.coverage.roadside}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Carro Reserva</Text>
              <Text style={styles.tableCell}>{data.coverage.rentalCar}</Text>
            </View>
          </View>
        </View>
  
        {/* Pagamento */}
        <View style={styles.section}>
          <Text style={styles.heading}>FORMAS DE PAGAMENTO</Text>
          <View style={styles.paymentInfo}>
            <Text style={[styles.boldText, { marginBottom: 5 }]}>
              Investimento Anual: {data.payment.annualPremium}
            </Text>
            <Text style={{ marginBottom: 3 }}>{data.payment.paymentOptions.debit}</Text>
            <Text style={{ marginBottom: 3 }}>{data.payment.paymentOptions.creditCard}</Text>
            <Text>{data.payment.paymentOptions.porto}</Text>
          </View>
        </View>
  
        {/* Perfil do Condutor */}
        <View style={styles.section}>
          <Text style={styles.heading}>PERFIL PRINCIPAL CONDUTOR</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Nome</Text>
              <Text style={styles.tableCell}>{data.mainDriver.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Data de Nascimento</Text>
              <Text style={styles.tableCell}>{data.mainDriver.birthDate}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Estado Civil</Text>
              <Text style={styles.tableCell}>{data.mainDriver.maritalStatus}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Garagem</Text>
              <Text style={styles.tableCell}>{data.mainDriver.garage}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>CEP Pernoite</Text>
              <Text style={styles.tableCell}>{data.mainDriver.zipCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellBold}>Uso do Veículo</Text>
              <Text style={styles.tableCell}>{data.mainDriver.vehicleUse}</Text>
            </View>
          </View>
        </View>
  
        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.heading}>OBSERVAÇÕES IMPORTANTES:</Text>
          <View style={styles.observationsList}>
            <Text style={styles.observation}>• Orçamento válido até 10/12/2024</Text>
            <Text style={styles.observation}>• É de responsabilidade do cliente conferir o perfil e informar se está correto. Qualquer alteração, favor comunicar.</Text>
            <Text style={styles.observation}>• Este orçamento não pressupõe a aceitação do risco por parte da seguradora</Text>
          </View>
        </View>
  
        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Att. Karen Almeida | Fones: (54) 3317.7750 // 9.9669-2432
          </Text>
        </View>
      </Page>
    </Document>
  );
  
  export default PDFTemplate;