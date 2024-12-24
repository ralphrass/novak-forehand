'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Textarea } from '@/components/textarea';
import { Select } from '@/components/select';
import { queryInsuranceAssistant } from '@/services/openai';

interface Response {
  explanation: string;
  references: string;
  topics: {
    title: string;
    description: string;
  }[];
}

export default function AssistentePage() {
  const [question, setQuestion] = useState('');
  const [insuranceType, setInsuranceType] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await queryInsuranceAssistant(question, insuranceType);
      setResponse(result);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <Heading level={2} className="mb-6">Assistente de Condições Gerais</Heading>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <Text className="block text-sm font-medium mb-2">Tipo de Seguro</Text>
            <Select
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
              className="w-full"
            >
              <option value="auto">Automóvel</option>
              <option value="life">Vida</option>
              <option value="home">Residencial</option>
              <option value="business">Empresarial</option>
            </Select>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2">Sua Pergunta</Text>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Como funciona a franquia do seguro?"
              rows={4}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!question || isLoading}
            className="w-full"
          >
            {isLoading ? 'Consultando...' : 'Consultar'}
          </Button>
        </div>

        {response && (
          <div className="mt-6 bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <Heading level={3} className="mb-4">Explicação</Heading>
              <Text className="text-zinc-700 leading-relaxed">{response.explanation}</Text>
            </div>

            <div>
              <Heading level={3} className="mb-4">Referências</Heading>
              <Text className="text-zinc-600 leading-relaxed">{response.references}</Text>
            </div>

            <div>
              <Heading level={3} className="mb-4">Tópicos Relacionados</Heading>
              <div className="space-y-4">
                {response.topics.map((topic, index) => (
                  <div key={index} className="bg-zinc-50 p-4 rounded-lg">
                    <Text className="font-medium mb-2">{topic.title}</Text>
                    <Text className="text-zinc-600">{topic.description}</Text>
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