'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar o caminho do worker manualmente
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export default function ExtractPDFPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile?.type === 'application/pdf') {
            setFile(uploadedFile);
        }
    };

    const extractTextFromPDF = async (arrayBuffer: ArrayBuffer) => {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => (item as any).str).join(' ');
            fullText += ` ${pageText}`;
        }

        console.log('Texto extraído:', fullText); // Validar o texto extraído
        return fullText;
    };

    const extractDataFromAzulPDF = (text: string) => {
        // Divide o texto em linhas para análise detalhada
        const lines = text.split('\n').map(line => line.trim());
    
        // Captura o modelo com regex específico
        const makeModelYear = text.match(/Veículo\s+(.+?)\s+Ano Fabricação \/ Modelo/i)?.[1]?.trim() || '';
    
        // Captura a linha da placa corretamente
        let plate = '';
        const plateIndex = lines.findIndex(line => line.includes('Placa Chassi'));
        if (plateIndex !== -1 && lines[plateIndex + 1]) {
            plate = lines[plateIndex + 1].trim(); // Captura a linha imediatamente abaixo
        }
    
        // Captura o FIPE
        const fipeCode = text.match(/Fipe\s+(\d{5})/i)?.[1] || '';
    
        return {
            vehicleData: {
                makeModelYear, // Modelo corrigido
                plate,         // Placa corrigida
                fipeCode,      // FIPE corrigido
            },
            coverageOptions: {
                comprehensive: text.match(/Casco\s*COMPREENSIVA\s*100.00%\s*R\$ ([\d,.]+)/i)?.[1]?.trim() || '',
                deductible: text.match(/Franquia\s*:\s*50% da Obrigatória/i) ? '50%' : '',
                thirdPartyLiability: {
                    propertyDamage: text.match(/RCF-V DANOS MATERIAIS\s*R\$ ([\d,.]+)/i)?.[1] || '',
                    bodilyInjury: text.match(/RCF-V DANOS CORPORAIS\s*R\$ ([\d,.]+)/i)?.[1] || '',
                },
                moralDamages: text.match(/DANOS MORAIS E ESTÉTICOS\s*R\$ ([\d,.]+)/i)?.[1] || '',
                rentalCar: text.match(/CARRO EXTRA BÁSICO 15 DIAS\s*-\s*REFERENCIADA\s*R\$ ([\d,.]+)/i)?.[1] || '',
            },
            driverProfile: {
                name: text.match(/Nome do principal Condutor:\s*(.+?)\s*CPF:/i)?.[1]?.trim() || '',
                birthDate: text.match(/Nascimento\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1] || '',
                maritalStatus: text.match(/Estado Civil\s*:\s*(.+?)\s*CEP PERNOITE/i)?.[1]?.trim() || '',
                zipCode: text.match(/CEP PERNOITE:\s*(\d{5}-\d{3})/i)?.[1] || '',
                vehicleUse: text.match(/Uso\s*(PARTICULAR)/i)?.[1]?.trim() || '',
            },
        };
    };    

    const handleProcessPDF = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const text = await extractTextFromPDF(arrayBuffer);
            const extractedData = extractDataFromAzulPDF(text);
            setFormData(extractedData);
        } catch (error) {
            console.error('Erro ao processar o PDF:', error);
            alert('Erro ao processar o PDF. Verifique o arquivo e tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (section: string, key: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <Heading level={2} className="mb-6">Processar PDF da Azul</Heading>
            {!formData ? (
                <div className="space-y-6">
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <Button onClick={handleProcessPDF} disabled={!file || isProcessing}>
                        {isProcessing ? 'Processando...' : 'Processar PDF'}
                    </Button>
                </div>
            ) : (
                <form className="space-y-4">
                    <Heading level={3}>Editar Dados Extraídos</Heading>
                    <div>
                        <label>Marca/Modelo/Ano</label>
                        <input
                            type="text"
                            value={formData.vehicleData.makeModelYear}
                            onChange={(e) => handleInputChange('vehicleData', 'makeModelYear', e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>Placa</label>
                        <input
                            type="text"
                            value={formData.vehicleData.plate}
                            onChange={(e) => handleInputChange('vehicleData', 'plate', e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>FIPE</label>
                        <input
                            type="text"
                            value={formData.vehicleData.fipeCode}
                            onChange={(e) => handleInputChange('vehicleData', 'fipeCode', e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                </form>
            )}
        </div>
    );
}
