'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { generateSalesResponse } from '@/services/openai-assistente';

export default function SalesResponsePage() {
  const [formData, setFormData] = useState({
    productName: '',
    productPriceRange: '',
    productEditions: '',
    productFeatures: '',
    communicationTone: '',
    firstContact: true,
    previousInteractions: '',
    salesChannel: '',
    salesStage: '',
    customerSegment: '',
    customerIndustry: '',
    customerSize: '',
    customerQuestion: '',
    priceDiscussion: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    customerResponse: string;
    salesStrategy: string;
    additionalAnalysis: string;
  } | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await generateSalesResponse(formData);
      setResponse(apiResponse);
    } catch (error) {
      console.error('Erro ao processar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Gerar Resposta de Vendas</h1>
      <div className="bg-white p-6 shadow rounded space-y-6">
        {/* Campos do Formulário */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Produto</label>
          <Input
            value={formData.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Faixa de Preço</label>
          <Input
            value={formData.productPriceRange}
            onChange={(e) => handleChange('productPriceRange', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Funcionalidades do Produto</label>
          <Textarea
            value={formData.productFeatures}
            onChange={(e) => handleChange('productFeatures', e.target.value)}
            placeholder="Descreva as principais funcionalidades"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tom de Comunicação</label>
          <Select
            value={formData.communicationTone}
            onChange={(e) => handleChange('communicationTone', e.target.value)}
          >
            <option value="">Selecione o tom</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="técnico">Técnico</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.firstContact}
            onChange={(e) => handleChange('firstContact', e.target.checked)}
          />
          <label className="text-sm font-medium">Primeiro Contato</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interações Anteriores</label>
          <Textarea
            value={formData.previousInteractions}
            onChange={(e) => handleChange('previousInteractions', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Canal de Vendas</label>
          <Select
            value={formData.salesChannel}
            onChange={(e) => handleChange('salesChannel', e.target.value)}
          >
            <option value="">Selecione o canal</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telefone">Telefone</option>
            <option value="reunião">Reunião</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Etapa da Venda</label>
          <Select
            value={formData.salesStage}
            onChange={(e) => handleChange('salesStage', e.target.value)}
          >
            <option value="">Selecione a etapa</option>
            <option value="prospecção">Prospecção</option>
            <option value="qualificação">Qualificação</option>
            <option value="apresentação">Apresentação</option>
            <option value="negociação">Negociação</option>
            <option value="fechamento">Fechamento</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Segmento do Cliente</label>
          <Input
            value={formData.customerSegment}
            onChange={(e) => handleChange('customerSegment', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Indústria do Cliente</label>
          <Input
            value={formData.customerIndustry}
            onChange={(e) => handleChange('customerIndustry', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tamanho do Cliente</label>
          <Input
            value={formData.customerSize}
            onChange={(e) => handleChange('customerSize', e.target.value)}
            placeholder="Ex: 50 funcionários"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pergunta do Cliente</label>
          <Textarea
            value={formData.customerQuestion}
            onChange={(e) => handleChange('customerQuestion', e.target.value)}
            placeholder="Digite a pergunta do cliente aqui..."
          />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Gerando...' : 'Gerar Resposta'}
        </Button>
      </div>

      {/* Respostas Geradas */}
      {response && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Resposta ao Cliente</h2>
            <p>{response.customerResponse}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Estratégia de Venda</h2>
            <p>{response.salesStrategy}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Análise Complementar</h2>
            <p>{response.additionalAnalysis}</p>
          </div>
        </div>
      )}
    </div>
  );
}
