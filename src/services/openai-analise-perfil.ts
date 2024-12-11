const AZURE_OPENAI_ENDPOINT =
  'https://foreman-openai.openai.azure.com/openai/deployments/gpt-4o-foreman/chat/completions?api-version=2024-08-01-preview';
const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface InsuranceAnalysisResponse {
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

export async function analyzeInsuranceProfile(
  question: string
): Promise<InsuranceAnalysisResponse> {
  const systemPrompt = `Você é um especialista em vendas de seguros com vasta experiência em análise de perfil de clientes e desenvolvimento de estratégias de abordagem personalizadas. Analise os dados do cliente e forneça uma resposta estruturada no seguinte formato JSON:

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
            content: systemPrompt,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha na consulta ao assistente');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parseando a resposta JSON do modelo
    const parsedResponse: InsuranceAnalysisResponse = JSON.parse(content);

    return parsedResponse;
  } catch (error) {
    console.error('Erro ao consultar assistente:', error);
    throw error;
  }
}
