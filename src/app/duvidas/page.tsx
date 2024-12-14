'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Textarea } from '@/components/textarea';
import { generateAnswerForConsultant, parseOpenAIResponse } from '@/services/openai-duvida-geral';

interface QuestionResponse {
  resposta_direta: string;
  detalhamento: string[];
  exemplos_praticos: string[];
  pontos_atencao: string[];
  referencias_uteis: string[];
}

export default function DuvidasGeraisPage() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QuestionResponse | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const responseData = await generateAnswerForConsultant(question);
      const parsedContent = parseOpenAIResponse(responseData);
      setResponse(parsedContent);
    } catch (error) {
      console.error('Erro:', error);
      // Aqui você pode adicionar um componente de Alert para mostrar o erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Heading level={2} className="mb-6">Dúvidas Gerais - Consultor</Heading>

        <div className="bg-white shadow rounded-lg p-6">
          <Text className="text-zinc-600 mb-6">
            Tire suas dúvidas sobre seguros, processos e regulamentações
          </Text>

          <div className="space-y-4">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              rows={4}
              className="w-full"
            />

            <Button
              onClick={handleSubmit}
              disabled={!question || isLoading}
              className="w-full"
            >
              {isLoading ? 'Consultando...' : 'Enviar Pergunta'}
            </Button>
          </div>
        </div>

        {response && (
          <div className="mt-6 space-y-6">
            {/* Resposta Direta */}
    <div className="bg-white shadow rounded-lg p-6">
      <Heading level={3} className="text-blue-600 mb-4">Resposta</Heading>
      <Text className="text-lg">{response.resposta_direta}</Text>
    </div>

    {/* Scripts Prontos - só aparece se existirem */}
    {response.scripts_prontos && response.scripts_prontos.length > 0 && (
      <div className="bg-white shadow rounded-lg p-6">
        <Heading level={3} className="text-emerald-600 mb-4">Scripts Prontos para Uso</Heading>
        <div className="space-y-4">
          {response.scripts_prontos.map((script, index) => (
            <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex justify-between items-start">
                <Text className="text-zinc-700">{script}</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(script)}
                  className="ml-4"
                >
                  Copiar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

            {/* Detalhamento */}
            <div className="bg-white shadow rounded-lg p-6">
              <Heading level={3} className="text-green-600 mb-4">Detalhamento</Heading>
              <ul className="list-disc pl-5 space-y-2">
                {response.detalhamento.map((item, index) => (
                  <li key={index} className="text-zinc-700">{item}</li>
                ))}
              </ul>
            </div>

            {/* Exemplos Práticos */}
            <div className="bg-white shadow rounded-lg p-6">
              <Heading level={3} className="text-purple-600 mb-4">Exemplos Práticos</Heading>
              <div className="space-y-4">
                {response.exemplos_praticos.map((exemplo, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg">
                    <Text>{exemplo}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Pontos de Atenção */}
            <div className="bg-white shadow rounded-lg p-6">
              <Heading level={3} className="text-red-600 mb-4">Pontos de Atenção</Heading>
              <div className="space-y-2">
                {response.pontos_atencao.map((ponto, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-1.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    <Text>{ponto}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Referências */}
            <div className="bg-white shadow rounded-lg p-6">
              <Heading level={3} className="text-orange-600 mb-4">Referências Úteis</Heading>
              <ul className="list-disc pl-5 space-y-2">
                {response.referencias_uteis.map((ref, index) => (
                  <li key={index} className="text-zinc-700">{ref}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}