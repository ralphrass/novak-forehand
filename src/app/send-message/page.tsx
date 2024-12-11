"use client";

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Alert } from '@/components/alert';

interface Analysis {
  primary_intent: string;
  knowledge_level: string;
  emotional_tone: string;
  key_concerns: string[];
  buying_signals: string;
}

interface ApiResponse {
  analysis: Analysis;
  response: string;
  suggested_actions: string[];
}

interface FormData {
  product_catalog: {
    name: string;
    price_range: string;
    features: string;
    editions: string;
  };
  company_guidelines: {
    tone: string;
    price_discussion: string;
  };
  customer_history: {
    first_contact: boolean;
    previous_interactions: string;
  };
  conversation_context: {
    channel: string;
    stage: string;
  };
  customer_profile: {
    segment: string;
    industry: string;
    size: string;
  };
  customer_question: string;
}

function parseApiResponse(apiResponse: any): ApiResponse {
  try {
    if (typeof apiResponse.response === 'string' && apiResponse.response.includes('```json')) {
      const jsonMatch = apiResponse.response.match(/```json\n([\s\S]*)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
    }
    
    return {
      analysis: apiResponse.analysis || {},
      response: apiResponse.response || '',
      suggested_actions: apiResponse.suggested_actions || []
    };
  } catch (error) {
    console.error('Error parsing response:', error);
    return {
      analysis: {},
      response: apiResponse.response || '',
      suggested_actions: []
    };
  }
}

export default function SalesContextPage() {
  const [activeTab, setActiveTab] = useState<string>('product_catalog');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const [formData, setFormData] = useState<FormData>({
    product_catalog: {
      name: "",
      price_range: "",
      features: "",
      editions: ""
    },
    company_guidelines: {
      tone: "",
      price_discussion: ""
    },
    customer_history: {
      first_contact: true,
      previous_interactions: ""
    },
    conversation_context: {
      channel: "",
      stage: ""
    },
    customer_profile: {
      segment: "",
      industry: "",
      size: ""
    },
    customer_question: ""
  });

  const handleChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' ? {
        ...prev[section],
        [field]: value
      } : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiResponse = await fetch('http://localhost:8000/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const rawData = await apiResponse.json();
      const parsedResponse = parseApiResponse(rawData);
      setResponse(parsedResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu ao gerar a resposta');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'product_catalog':
        return (
          <div className="space-y-4">
            <div>
              <Text className="block text-sm font-medium mb-1">Nome do Produto</Text>
              <Input 
                value={formData.product_catalog.name}
                onChange={(e) => handleChange('product_catalog', 'name', e.target.value)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Faixa de Preço</Text>
              <Input 
                value={formData.product_catalog.price_range}
                onChange={(e) => handleChange('product_catalog', 'price_range', e.target.value)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Funcionalidades</Text>
              <Textarea 
                value={formData.product_catalog.features}
                onChange={(e) => handleChange('product_catalog', 'features', e.target.value)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Edições</Text>
              <Input 
                value={formData.product_catalog.editions}
                onChange={(e) => handleChange('product_catalog', 'editions', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'company_guidelines':
        return (
          <div className="space-y-4">
            <div>
              <Text className="block text-sm font-medium mb-1">Tom de Comunicação</Text>
              <Select 
                value={formData.company_guidelines.tone}
                onChange={(e) => handleChange('company_guidelines', 'tone', e.target.value)}
              >
                <option value="">Selecione o tom</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="technical">Técnico</option>
              </Select>
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Diretrizes de Preço</Text>
              <Textarea 
                value={formData.company_guidelines.price_discussion}
                onChange={(e) => handleChange('company_guidelines', 'price_discussion', e.target.value)}
              />
            </div>
          </div>
        );

      case 'customer_history':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={formData.customer_history.first_contact}
                onChange={(e) => handleChange('customer_history', 'first_contact', e.target.checked)}
                className="h-4 w-4"
              />
              <Text className="text-sm font-medium">Primeiro Contato</Text>
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Interações Anteriores</Text>
              <Textarea 
                value={formData.customer_history.previous_interactions}
                onChange={(e) => handleChange('customer_history', 'previous_interactions', e.target.value)}
                placeholder="Descreva as interações anteriores..."
              />
            </div>
          </div>
        );

      case 'conversation_context':
        return (
          <div className="space-y-4">
            <div>
              <Text className="block text-sm font-medium mb-1">Canal</Text>
              <Select 
                value={formData.conversation_context.channel}
                onChange={(e) => handleChange('conversation_context', 'channel', e.target.value)}
              >
                <option value="">Selecione o canal</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Telefone</option>
                <option value="meeting">Reunião</option>
              </Select>
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Etapa da Venda</Text>
              <Select 
                value={formData.conversation_context.stage}
                onChange={(e) => handleChange('conversation_context', 'stage', e.target.value)}
              >
                <option value="">Selecione a etapa</option>
                <option value="prospecting">Prospecção</option>
                <option value="qualification">Qualificação</option>
                <option value="presentation">Apresentação</option>
                <option value="negotiation">Negociação</option>
                <option value="closing">Fechamento</option>
              </Select>
            </div>
          </div>
        );

      case 'customer_profile':
        return (
          <div className="space-y-4">
            <div>
              <Text className="block text-sm font-medium mb-1">Segmento</Text>
              <Select 
                value={formData.customer_profile.segment}
                onChange={(e) => handleChange('customer_profile', 'segment', e.target.value)}
              >
                <option value="">Selecione o segmento</option>
                <option value="small">Pequena Empresa</option>
                <option value="medium">Média Empresa</option>
                <option value="enterprise">Grande Empresa</option>
              </Select>
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Indústria</Text>
              <Input 
                value={formData.customer_profile.industry}
                onChange={(e) => handleChange('customer_profile', 'industry', e.target.value)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Tamanho da Empresa</Text>
              <Input 
                value={formData.customer_profile.size}
                onChange={(e) => handleChange('customer_profile', 'size', e.target.value)}
                placeholder="Ex: 50 funcionários"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        {/* Formulário */}
        <div className="bg-white shadow rounded">
          <div className="p-6">
            <Heading level={2} className="mb-2">Assistente de Vendas - Contexto</Heading>
            <Text className="text-gray-600 mb-6">
              Forneça o contexto para gerar a melhor resposta para seu cliente
            </Text>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('product_catalog')}
                    className={`px-4 py-2 ${activeTab === 'product_catalog' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  >
                    Produto
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('company_guidelines')}
                    className={`px-4 py-2 ${activeTab === 'company_guidelines' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  >
                    Empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('customer_history')}
                    className={`px-4 py-2 ${activeTab === 'customer_history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  >
                    Histórico
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('conversation_context')}
                    className={`px-4 py-2 ${activeTab === 'conversation_context' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  >
                    Contexto
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('customer_profile')}
                    className={`px-4 py-2 ${activeTab === 'customer_profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  >
                    Cliente
                  </button>
                </div>
              </div>

              {/* Conteúdo das Tabs */}
              <div className="mt-4">
                {renderTabContent()}
              </div>

              {/* Pergunta do Cliente sempre visível */}
              <div className="mt-6">
                <Text className="block text-sm font-medium mb-1">Pergunta do Cliente</Text>
                <Textarea 
                  value={formData.customer_question}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_question: e.target.value }))}
                  rows={6}
                  placeholder="Digite a pergunta do cliente aqui..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Gerando resposta...' : 'Gerar Resposta'}
              </Button>
            </form>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <Alert>
            {error}
          </Alert>
        )}

        {/* Área de Resposta */}
        {response && (
          <div className="bg-white shadow rounded p-6 space-y-6">
            <div className="border-b pb-4">
              <Heading level={3} className="mb-4 text-gray-900">Análise da Pergunta</Heading>
              <div className="grid gap-4">
                <div>
                  <Text className="font-medium text-gray-900">Intenção Principal:</Text>
                  <Text className="text-gray-900">{response.analysis.primary_intent}</Text>
                </div>
                <div>
                  <Text className="font-medium text-gray-900">Nível de Conhecimento:</Text>
                  <Text className="text-gray-900">{response.analysis.knowledge_level}</Text>
                </div>
                <div>
                  <Text className="font-medium text-gray-900">Tom Emocional:</Text>
                  <Text className="text-gray-900">{response.analysis.emotional_tone}</Text>
                </div>
                <div>
                  <Text className="font-medium text-gray-900">Principais Preocupações:</Text>
                  <ul className="list-disc pl-4">
                    {response.analysis.key_concerns?.map((concern, index) => (
                      <li key={index} className="text-gray-900">{concern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Text className="font-medium text-gray-900">Sinais de Compra:</Text>
                  <Text className="text-gray-900">{response.analysis.buying_signals}</Text>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <Heading level={3} className="mb-4 text-gray-900">Resposta Sugerida</Heading>
              <div className="bg-gray-50 p-4 rounded">
                <Text className="whitespace-pre-wrap text-gray-900">{response.response}</Text>
              </div>
            </div>

            <div>
              <Heading level={3} className="mb-4 text-gray-900">Próximas Ações</Heading>
              <ul className="space-y-2">
                {response.suggested_actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 min-w-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                    <Text className="text-gray-900">{action}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}