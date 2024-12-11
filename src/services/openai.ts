const AZURE_OPENAI_ENDPOINT = 'https://foreman-openai.openai.azure.com/openai/deployments/gpt-4o-foreman/chat/completions?api-version=2024-08-01-preview';
const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  explanation: string;
  references: string;
  topics: {
    title: string;
    description: string;
  }[];
}

export async function queryInsuranceAssistant(question: string, insuranceType: string): Promise<OpenAIResponse> {
  const systemPrompt = `Você é um assistente especializado em seguros, focado em explicar as condições gerais de apólices de seguros de forma clara e didática. Você deve responder especificamente sobre seguros do tipo: ${insuranceType}.

Forneça respostas diretas e práticas, organizadas em três seções:

1) Uma explicação direta e em linguagem simples, como se estivesse conversando com um cliente
2) As referências específicas das condições gerais relevantes para a resposta
3) 2-3 tópicos relacionados que podem interessar ao cliente, cada um com um título curto e uma breve descrição

Sua resposta deve estar em português e ser objetiva.`;

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
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error('Falha na consulta ao assistente');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Processando o conteúdo markdown
    const sections = content.split('\n\n');
    const explanation = sections[0].replace('1) **Explicação Simples:**\n', '');
    const references = sections[1].replace('2) **Referências das Condições Gerais:**\n', '');
    
    // Processando tópicos relacionados
    const topicsSection = sections[2].replace('3) **Tópicos Relacionados:**\n', '');
    const topicsLines = topicsSection.split('\n   - ').filter(line => line.trim());
    const topics = topicsLines.map(line => {
      const [title, ...descParts] = line.split(':');
      return {
        title: title.replace('**', '').replace('**', '').trim(),
        description: descParts.join(':').trim()
      };
    });

    return {
      explanation,
      references,
      topics
    };
  } catch (error) {
    console.error('Erro ao consultar assistente:', error);
    throw error;
  }
}