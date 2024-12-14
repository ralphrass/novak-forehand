const AZURE_OPENAI_ENDPOINT =
  'https://foreman-openai.openai.azure.com/openai/deployments/gpt-4o-foreman/chat/completions?api-version=2024-08-01-preview';

const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;

interface QuestionResponse {
    resposta_direta: string;
    scripts_prontos?: string[];  // Opcional, presente apenas em perguntas de abordagem/vendas
    detalhamento: string[];
    exemplos_praticos: string[];
    pontos_atencao: string[];
    referencias_uteis: string[];
  }

export async function generateAnswerForConsultant(question: string) {
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
            content: `Você é um especialista sênior em seguros com vasta experiência em todos os ramos (automóvel, vida, residencial, empresarial, etc). 
Seu papel é ajudar consultores de seguros com respostas práticas e imediatamente aplicáveis.

Para perguntas sobre abordagem, vendas ou comunicação com clientes, comece SEMPRE com scripts, frases e exemplos PRONTOS PARA USO.
Seja direto e prático, fornecendo material que o consultor possa usar IMEDIATAMENTE.

Forneça respostas estruturadas no seguinte formato JSON:
{
  "resposta_direta": "Para perguntas de abordagem/vendas, comece SEMPRE com scripts e frases prontas. Para questões técnicas, dê a explicação objetiva.",
  "scripts_prontos": [
    "exemplo de frase ou abordagem 1",
    "exemplo de frase ou abordagem 2",
    "exemplo de frase ou abordagem 3"
  ],
  "detalhamento": [
    "ponto detalhado 1",
    "ponto detalhado 2"
  ],
  "exemplos_praticos": [
    "situação real 1 com resolução",
    "situação real 2 com resolução"
  ],
  "pontos_atencao": [
    "ponto de atenção 1",
    "ponto de atenção 2"
  ],
  "referencias_uteis": [
    "referência 1",
    "referência 2"
  ]
}

IMPORTANTE:
- Se a pergunta for sobre ABORDAGEM ou VENDAS: Comece com scripts e frases PRONTAS para uso
- Se for sobre PROCESSOS ou TÉCNICA: Comece com a explicação objetiva
- Mantenha linguagem natural e empática
- Foque em exemplos reais e aplicáveis
- Forneça material que possa ser usado imediatamente pelo consultor`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Falha na chamada à API');
    }

    return response.json();
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw error;
  }
}

export function parseOpenAIResponse(responseData: any): QuestionResponse {
  try {
    // Extrai o conteúdo da mensagem da resposta completa da API
    const content = responseData.choices[0].message.content;
    
    // Parse do JSON da resposta
    return JSON.parse(content);
  } catch (error) {
    console.error('Erro ao fazer parse da resposta:', error);
    throw new Error('Erro ao processar resposta da API');
  }
}