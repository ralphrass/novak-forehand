'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { generateValueArgumentation, parseOpenAIResponse } from '@/services/openai-argumentacao';

// Interfaces para os dados de entrada do formulário
export interface ArgumentationData {
    product: string;
    price: string;
    mainCoverage: string;
    additionalCoverages: string;
    clientProfile: string;
    mainObjection: string;
    competitorInfo: string;
  }
  
  // Interfaces para a resposta da API
  export interface AnaliseObjecao {
    tipo: string;
    nivel_resistencia: string;
    motivacao_subjacente: string;
  }
  
  export interface ArgumentoResposta {
    argumento: string;
    abordagem: string;
    pontos_chave: string[];
  }
  
  export interface ExemploPratico {
    situacao: string;
    demonstracao: string;
  }
  
  export interface TecnicaNegociacao {
    tecnica: string;
    aplicacao: string;
    palavras_chave: string[];
  }
  
  export interface ProximoPasso {
    acao: string;
    objetivo: string;
  }
  
  export interface ArgumentationResponse {
    analise_objecao: AnaliseObjecao;
    argumentos_resposta: ArgumentoResposta[];
    exemplos_praticos: ExemploPratico[];
    tecnicas_negociacao: TecnicaNegociacao[];
    proximos_passos: ProximoPasso[];
  }
  
export default function ValueArgumentationPage() {
  const [data, setData] = useState<ArgumentationData>({
    product: '',
    price: '',
    mainCoverage: '',
    additionalCoverages: '',
    clientProfile: '',
    mainObjection: '',
    competitorInfo: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ArgumentationResponse | null>(null);

  const handleChange = (field: keyof ArgumentationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const responseData = await generateValueArgumentation(data);
      const parsedContent = parseOpenAIResponse(responseData.choices[0].message.content);
      setResponse(parsedContent);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Heading level={2} className="mb-6">Assistente de Argumentação de Valor</Heading>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Informações do Produto */}
          <div>
            <Text className="text-lg font-medium mb-4">Informações do Produto</Text>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium mb-2">Produto</Text>
                <Select
                  value={data.product}
                  onChange={(e) => handleChange('product', e.target.value)}
                >
                  <option value="">Selecione o produto...</option>
                  <option value="auto">Seguro Auto</option>
                  <option value="life">Seguro Vida</option>
                  <option value="home">Seguro Residencial</option>
                  <option value="business">Seguro Empresarial</option>
                </Select>
              </div>
              <div>
                <Text className="block text-sm font-medium mb-2">Preço</Text>
                <Input
                  type="text"
                  value={data.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="Ex: R$ 2.800,00"
                />
              </div>
            </div>
          </div>

          {/* Coberturas */}
          <div>
            <Text className="block text-sm font-medium mb-2">Cobertura Principal</Text>
            <Input
              value={data.mainCoverage}
              onChange={(e) => handleChange('mainCoverage', e.target.value)}
              placeholder="Ex: 100% FIPE"
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2">Coberturas Adicionais</Text>
            <Textarea
              value={data.additionalCoverages}
              onChange={(e) => handleChange('additionalCoverages', e.target.value)}
              placeholder="Liste as coberturas adicionais..."
            />
          </div>

          {/* Informações do Cliente */}
          <div>
            <Text className="text-lg font-medium mb-4">Informações do Cliente</Text>
            <div>
              <Text className="block text-sm font-medium mb-2">Perfil do Cliente</Text>
              <Textarea
                value={data.clientProfile}
                onChange={(e) => handleChange('clientProfile', e.target.value)}
                placeholder="Descreva o perfil do cliente..."
              />
            </div>
          </div>

          {/* Objeções */}
          <div>
            <Text className="text-lg font-medium mb-4">Objeções</Text>
            <div>
              <Text className="block text-sm font-medium mb-2">Principal Objeção</Text>
              <Select
                value={data.mainObjection}
                onChange={(e) => handleChange('mainObjection', e.target.value)}
              >
                <option value="">Selecione a objeção...</option>
                <option value="price">Encontrei mais barato</option>
                <option value="need">Não preciso agora</option>
                <option value="think">Preciso pensar melhor</option>
                <option value="other">Outra seguradora oferece mais</option>
              </Select>
            </div>

            <div className="mt-4">
              <Text className="block text-sm font-medium mb-2">Informações do Concorrente</Text>
              <Textarea
                value={data.competitorInfo}
                onChange={(e) => handleChange('competitorInfo', e.target.value)}
                placeholder="Informações sobre a proposta concorrente..."
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Gerando argumentos...' : 'Gerar Argumentos'}
          </Button>
        </div>

        {response && (
  <div className="mt-6 space-y-6">
    {/* Análise da Objeção */}
    <div className="bg-white shadow rounded-lg p-6">
      <Heading level={3} className="text-blue-600 mb-4">Análise da Objeção</Heading>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <Text className="font-medium">Tipo</Text>
          <Text className="text-zinc-700 mt-1">{response.analise_objecao.tipo}</Text>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <Text className="font-medium">Nível de Resistência</Text>
          <div className="flex items-center mt-1">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              response.analise_objecao.nivel_resistencia === 'alto' ? 'bg-red-500' :
              response.analise_objecao.nivel_resistencia === 'médio' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <Text className="text-zinc-700">{response.analise_objecao.nivel_resistencia}</Text>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <Text className="font-medium">Motivação</Text>
          <Text className="text-zinc-700 mt-1">{response.analise_objecao.motivacao_subjacente}</Text>
        </div>
      </div>
    </div>

    {/* Argumentos de Resposta */}
    <div className="bg-white shadow rounded-lg p-6">
      <Heading level={3} className="text-green-600 mb-4">Argumentos de Resposta</Heading>
      <div className="space-y-6">
        {response.argumentos_resposta.map((arg, index) => (
          <div key={index} className="border-l-4 border-green-500 pl-4">
            <Text className="font-medium text-lg">{arg.argumento}</Text>
            <Text className="text-zinc-600 mt-2">{arg.abordagem}</Text>
            <div className="mt-3">
              <Text className="font-medium mb-2">Pontos-chave:</Text>
              <ul className="list-disc pl-5 space-y-1">
                {arg.pontos_chave.map((ponto, idx) => (
                  <li key={idx} className="text-zinc-700">{ponto}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Exemplos Práticos */}
    <div className="bg-white shadow rounded-lg p-6">
      <Heading level={3} className="text-purple-600 mb-4">Exemplos Práticos</Heading>
      <div className="grid md:grid-cols-2 gap-6">
        {response.exemplos_praticos.map((exemplo, index) => (
          <div key={index} className="bg-purple-50 p-4 rounded-lg">
            <Text className="font-medium">{exemplo.situacao}</Text>
            <Text className="text-zinc-700 mt-2">{exemplo.demonstracao}</Text>
          </div>
        ))}
      </div>
    </div>

    {/* Técnicas de Negociação */}
    <div className="bg-white shadow rounded-lg p-6">
      <Heading level={3} className="text-orange-600 mb-4">Técnicas de Negociação</Heading>
      {response.tecnicas_negociacao.map((tecnica, index) => (
        <div key={index} className="mb-6 last:mb-0">
          <Text className="font-medium text-lg">{tecnica.tecnica}</Text>
          <Text className="text-zinc-700 mt-2">{tecnica.aplicacao}</Text>
          <div className="flex flex-wrap gap-2 mt-3">
            {tecnica.palavras_chave.map((palavra, idx) => (
              <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                {palavra}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Próximos Passos */}
    <div className="bg-white shadow rounded-lg p-6">
      <Heading level={3} className="text-red-600 mb-4">Próximos Passos</Heading>
      <div className="space-y-4">
        {response.proximos_passos.map((passo, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-zinc-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              {index + 1}
            </div>
            <div>
              <Text className="font-medium">{passo.acao}</Text>
              <Text className="text-zinc-600 mt-1">{passo.objetivo}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}