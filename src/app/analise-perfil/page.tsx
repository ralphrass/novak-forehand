'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { analyzeInsuranceProfile } from '@/services/openai-analise-perfil';

interface ClientProfile {
  age: string;
  occupation: string;
  income: string;
  familyStatus: string;
  currentInsurance: string;
  interests: string;
  painPoints: string;
  decisionTriggers: string;
}

interface AnalysisResponse {
  clientProfile: {
    summary: string;
    keyCharacteristics: string[];
  };
  approachStrategy: {
    mainPoints: string[];
    toneSuggestion: string;
    valueProposition: string;
  };
  productRecommendations: {
    primary: string;
    additional: string[];
    justification: string;
  };
  communicationTips: {
    doList: string[];
    avoidList: string[];
  };
}

export default function ProfileAnalyzerPage() {
  const [profile, setProfile] = useState<ClientProfile>({
    age: '',
    occupation: '',
    income: '',
    familyStatus: '',
    currentInsurance: '',
    interests: '',
    painPoints: '',
    decisionTriggers: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleChange = (field: keyof ClientProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  function parseOpenAIResponse(responseContent: string): any {
    try {
      const jsonString = responseContent.replace('```json\n', '').replace('\n```', '');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Erro ao fazer parse da resposta:', error);
      throw error;
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await analyzeInsuranceProfile(profile);
      const data = await response.json();
      const parsedContent = parseOpenAIResponse(data.choices[0].message.content);
      setAnalysis(parsedContent);
    } catch (error) {
      console.error('Erro:', error);
      // Você pode adicionar um toast ou alert aqui para mostrar o erro ao usuário
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Heading level={2} className="mb-6">Análise de Perfil e Sugestão de Abordagem</Heading>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Text className="block text-sm font-medium mb-2">Idade</Text>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Ex: 35"
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Ocupação</Text>
              <Input
                value={profile.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                placeholder="Ex: Engenheiro"
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Faixa de Renda</Text>
              <Select
                value={profile.income}
                onChange={(e) => handleChange('income', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="até 5k">Até R$ 5.000</option>
                <option value="5k-10k">R$ 5.000 a R$ 10.000</option>
                <option value="10k-20k">R$ 10.000 a R$ 20.000</option>
                <option value="acima 20k">Acima de R$ 20.000</option>
              </Select>
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Status Familiar</Text>
              <Select
                value={profile.familyStatus}
                onChange={(e) => handleChange('familyStatus', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="solteiro">Solteiro</option>
                <option value="casado">Casado</option>
                <option value="casado com filhos">Casado com Filhos</option>
                <option value="divorciado">Divorciado</option>
              </Select>
            </div>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2">Seguro Atual</Text>
            <Textarea
              value={profile.currentInsurance}
              onChange={(e) => handleChange('currentInsurance', e.target.value)}
              placeholder="Descreva os seguros que o cliente já possui..."
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2">Interesses e Hobbies</Text>
            <Textarea
              value={profile.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              placeholder="O que o cliente gosta de fazer, seus interesses..."
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2">Pontos de Dor</Text>
            <Textarea
              value={profile.painPoints}
              onChange={(e) => handleChange('painPoints', e.target.value)}
              placeholder="Quais as principais preocupações e necessidades do cliente..."
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2">Gatilhos de Decisão</Text>
            <Textarea
              value={profile.decisionTriggers}
              onChange={(e) => handleChange('decisionTriggers', e.target.value)}
              placeholder="O que motiva o cliente a tomar decisões de compra..."
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Analisando...' : 'Analisar Perfil'}
          </Button>
        </div>

        {analysis && (
          <div className="mt-6 space-y-6">
            {/* Perfil do Cliente */}
                <div className="bg-white shadow rounded-lg p-6">
                <Heading level={3} className="mb-4 text-blue-600">Perfil do Cliente</Heading>
                <Text className="mb-4 text-zinc-700">{analysis.clientProfile.summary}</Text>
                <div className="flex flex-wrap gap-2">
                    {analysis.clientProfile.keyCharacteristics.map((char, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {char}
                    </span>
                    ))}
                </div>
                </div>

                {/* Estratégia de Abordagem */}
                <div className="bg-white shadow rounded-lg p-6">
                <Heading level={3} className="mb-4 text-green-600">Estratégia de Abordagem</Heading>
                <div className="space-y-4">
                    <div>
                    <Text className="font-medium mb-2">Principais Pontos:</Text>
                    <ul className="list-disc pl-5 space-y-2">
                        {analysis.approachStrategy.mainPoints.map((point, index) => (
                        <li key={index} className="text-zinc-700">{point}</li>
                        ))}
                    </ul>
                    </div>
                    <div>
                    <Text className="font-medium mb-2">Tom Sugerido:</Text>
                    <Text className="text-zinc-700">{analysis.approachStrategy.toneSuggestion}</Text>
                    </div>
                    <div>
                    <Text className="font-medium mb-2">Proposta de Valor:</Text>
                    <Text className="text-zinc-700">{analysis.approachStrategy.valueProposition}</Text>
                    </div>
                </div>
                </div>

                {/* Recomendações de Produtos */}
                <div className="bg-white shadow rounded-lg p-6">
                <Heading level={3} className="mb-4 text-purple-600">Recomendações de Produtos</Heading>
                <div className="space-y-4">
                    <div>
                    <Text className="font-medium mb-2">Principal:</Text>
                    <Text className="text-zinc-700">{analysis.productRecommendations.primary}</Text>
                    </div>
                    <div>
                    <Text className="font-medium mb-2">Produtos Adicionais:</Text>
                    <ul className="list-disc pl-5 space-y-2">
                        {analysis.productRecommendations.additional.map((product, index) => (
                        <li key={index} className="text-zinc-700">{product}</li>
                        ))}
                    </ul>
                    </div>
                    <div>
                    <Text className="font-medium mb-2">Justificativa:</Text>
                    <Text className="text-zinc-700">{analysis.productRecommendations.justification}</Text>
                    </div>
                </div>
                </div>

                {/* Dicas de Comunicação */}
                <div className="bg-white shadow rounded-lg p-6">
                <Heading level={3} className="mb-4 text-orange-600">Dicas de Comunicação</Heading>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                    <Text className="font-medium mb-2 text-green-600">Fazer:</Text>
                    <ul className="list-disc pl-5 space-y-2">
                        {analysis.communicationTips.doList.map((tip, index) => (
                        <li key={index} className="text-zinc-700">{tip}</li>
                        ))}
                    </ul>
                    </div>
                    <div>
                    <Text className="font-medium mb-2 text-red-600">Evitar:</Text>
                    <ul className="list-disc pl-5 space-y-2">
                        {analysis.communicationTips.avoidList.map((tip, index) => (
                        <li key={index} className="text-zinc-700">{tip}</li>
                        ))}
                    </ul>
                    </div>
                </div>
                </div>
          </div>
        )}
      </div>
    </div>
  );
}