const baseEndpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || '';

const getEndpointWithVersion = (endpoint: string) => {
  // Remove qualquer api-version existente
  const baseUrl = endpoint.split('?')[0];
  return `${baseUrl}?api-version=2024-08-01-preview`;
};

const AZURE_OPENAI_ENDPOINT = getEndpointWithVersion(baseEndpoint);
const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;

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

export async function analyzeInsuranceProfile(profile: ClientProfile) {
  const systemPrompt = `Você é um especialista em vendas de seguros com vasta experiência em análise de perfil de clientes e desenvolvimento de estratégias de abordagem personalizadas. 

Analise os dados do cliente e forneça uma resposta estruturada no seguinte formato JSON:

{
  "clientProfile": {
    "summary": "Resumo geral do perfil do cliente",
    "keyCharacteristics": ["característica 1", "característica 2"]
  },
  "approachStrategy": {
    "mainPoints": ["ponto 1", "ponto 2"],
    "toneSuggestion": "sugestão de tom de comunicação",
    "valueProposition": "proposta de valor principal"
  },
  "productRecommendations": {
    "primary": "produto principal recomendado",
    "additional": ["produto adicional 1", "produto adicional 2"],
    "justification": "justificativa das recomendações"
  },
  "communicationTips": {
    "doList": ["fazer 1", "fazer 2"],
    "avoidList": ["evitar 1", "evitar 2"]
  }
}

Mantenha o foco em uma abordagem consultiva e ética, priorizando as necessidades reais do cliente.`;

  const userPrompt = `Analise o seguinte perfil de cliente:
    Idade: ${profile.age}
    Ocupação: ${profile.occupation}
    Renda: ${profile.income}
    Status Familiar: ${profile.familyStatus}
    Seguro Atual: ${profile.currentInsurance}
    Interesses: ${profile.interests}
    Pontos de Dor: ${profile.painPoints}
    Gatilhos de Decisão: ${profile.decisionTriggers}`;

  try {
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': AZURE_OPENAI_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Falha na chamada à API');
    }

    return response;

  } catch (error) {
    console.error('Erro ao analisar perfil:', error);
    throw error;
  }
}