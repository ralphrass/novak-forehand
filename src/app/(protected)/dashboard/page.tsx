'use client';

import React from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

const mockData = {
  argumentationAssistant: {
    totalQueries: 245,
    timesSaved: '123 horas',
    successRate: '78%',
    commonObjections: [
      { type: 'Preço alto', count: 89, successRate: '82%' },
      { type: 'Concorrência', count: 67, successRate: '75%' },
      { type: 'Falta de necessidade', count: 45, successRate: '71%' },
      { type: 'Timing errado', count: 44, successRate: '69%' }
    ],
    recentSuccess: [
      { date: '2024-03-15', objection: 'Preço alto', outcome: 'Venda fechada', value: 'R$ 3.500,00' },
      { date: '2024-03-14', objection: 'Concorrência', outcome: 'Venda fechada', value: 'R$ 2.800,00' },
      { date: '2024-03-13', objection: 'Timing', outcome: 'Em negociação', value: 'R$ 4.200,00' }
    ]
  },

  proposalGenerator: {
    totalGenerated: 312,
    averageTimeSaved: '45 minutos/proposta',
    totalTimeSaved: '234 horas',
    conversionRate: '65%',
    recentProposals: [
      { date: '2024-03-15', type: 'Auto', status: 'Aceita', timeSaved: '42 min' },
      { date: '2024-03-14', type: 'Residencial', status: 'Em análise', timeSaved: '38 min' },
      { date: '2024-03-13', type: 'Vida', status: 'Aceita', timeSaved: '51 min' }
    ]
  },

  conditionsAssistant: {
    totalQueries: 567,
    averageResponseTime: '30 segundos',
    accuracyRate: '94%',
    topQuestions: [
      { question: 'Cobertura em caso de..', count: 89, avgTime: '28s' },
      { question: 'Processo de sinistro', count: 76, avgTime: '32s' },
      { question: 'Exclusões da apólice', count: 65, avgTime: '35s' }
    ]
  },

  profileAnalyzer: {
    totalAnalyzed: 189,
    conversionImprovement: '45%',
    averageTimePerAnalysis: '5 minutos',
    mostEffectiveApproaches: [
      { approach: 'Foco em segurança', success: '82%' },
      { approach: 'Análise financeira', success: '78%' },
      { approach: 'Comparativo detalhado', success: '75%' }
    ]
  }
};

export default function AIDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <Heading level={2} className="mb-6">Dashboard de Produtividade IA</Heading>

      {/* Assistente de Argumentação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <Text className="text-sm text-zinc-500">Total de Consultas</Text>
          <div className="flex items-end justify-between mt-2">
            <Text className="text-2xl font-bold">{mockData.argumentationAssistant.totalQueries}</Text>
            <Text className="text-sm text-green-600">+12% mês</Text>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <Text className="text-sm text-zinc-500">Tempo Economizado</Text>
          <div className="flex items-end justify-between mt-2">
            <Text className="text-2xl font-bold">{mockData.argumentationAssistant.timesSaved}</Text>
            <Text className="text-sm text-green-600">+15% mês</Text>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <Text className="text-sm text-zinc-500">Taxa de Sucesso</Text>
          <div className="flex items-end justify-between mt-2">
            <Text className="text-2xl font-bold">{mockData.argumentationAssistant.successRate}</Text>
            <Text className="text-sm text-green-600">+5% mês</Text>
          </div>
        </div>
      </div>

      {/* Objeções mais comuns e Taxa de Sucesso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <Heading level={3} className="mb-4">Objeções Mais Comuns</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Tipo</TableHeader>
                <TableHeader>Ocorrências</TableHeader>
                <TableHeader className="text-right">Taxa de Sucesso</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.argumentationAssistant.commonObjections.map((objection, index) => (
                <TableRow key={index}>
                  <TableCell>{objection.type}</TableCell>
                  <TableCell>{objection.count}</TableCell>
                  <TableCell className="text-right">{objection.successRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Gerador de Propostas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <Heading level={3} className="mb-4">Gerador de Propostas</Heading>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Text>Total Geradas</Text>
              <Text className="font-bold">{mockData.proposalGenerator.totalGenerated}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text>Tempo Médio Economizado</Text>
              <Text className="font-bold">{mockData.proposalGenerator.averageTimeSaved}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text>Taxa de Conversão</Text>
              <Text className="font-bold">{mockData.proposalGenerator.conversionRate}</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Assistente de Condições e Análise de Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <Heading level={3} className="mb-4">Assistente de Condições</Heading>
          <div className="space-y-4">
            <div>
              <Text className="text-sm font-medium mb-2">Consultas mais frequentes</Text>
              {mockData.conditionsAssistant.topQuestions.map((question, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <Text className="text-sm">{question.question}</Text>
                  <Text className="text-sm text-zinc-500">{question.count}x</Text>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Text className="font-medium">Taxa de Precisão</Text>
              <div className="w-full bg-zinc-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: mockData.conditionsAssistant.accuracyRate }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <Heading level={3} className="mb-4">Análise de Perfil</Heading>
          <div className="space-y-4">
            <Text>Abordagens mais efetivas</Text>
            {mockData.profileAnalyzer.mostEffectiveApproaches.map((approach, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <Text className="text-sm">{approach.approach}</Text>
                  <Text className="text-sm">{approach.success}</Text>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: approach.success }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Text>Melhoria na Conversão</Text>
                <Text className="font-bold text-green-600">+{mockData.profileAnalyzer.conversionImprovement}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}