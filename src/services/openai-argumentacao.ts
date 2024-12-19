import { ArgumentationData, ArgumentationResponse } from '@/types/argumentation';


  const AZURE_OPENAI_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT + '?api-version=2024-08-01-preview';
  

  const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;
  
  export async function generateValueArgumentation(data: ArgumentationData) {
    const systemPrompt = `Você é um especialista em vendas de seguros com vasta experiência em lidar com objeções e criar argumentos persuasivos. Dada uma objeção do cliente, forneça uma resposta estruturada focando em argumentação de valor e superação de objeções.
  
  Retorne APENAS um objeto JSON válido, sem formatação markdown, seguindo exatamente esta estrutura:
  
  {
    "analise_objecao": {
      "tipo": "tipo da objeção (preço, necessidade, timing, concorrência, etc)",
      "nivel_resistencia": "baixo, médio ou alto",
      "motivacao_subjacente": "motivo real por trás da objeção"
    },
    "argumentos_resposta": [
      {
        "argumento": "argumento principal",
        "abordagem": "como apresentar o argumento",
        "pontos_chave": ["ponto 1", "ponto 2", "ponto 3"]
      }
    ],
    "exemplos_praticos": [
      {
        "situacao": "exemplo de situação real",
        "demonstracao": "como o seguro ajudaria neste caso"
      }
    ],
    "tecnicas_negociacao": [
      {
        "tecnica": "nome da técnica de negociação",
        "aplicacao": "como aplicar neste caso específico",
        "palavras_chave": ["palavra 1", "palavra 2", "palavra 3"]
      }
    ],
    "proximos_passos": [
      {
        "acao": "próxima ação recomendada",
        "objetivo": "objetivo desta ação"
      }
    ]
  }
  
  Foque em fornecer argumentos persuasivos e práticos que ajudem o vendedor a superar as objeções do cliente, sem repetir informações técnicas do produto. Use linguagem natural e empática.`;
  
    const userPrompt = `Produto: ${data.product}
  Preço: ${data.price}
  Cobertura Principal: ${data.mainCoverage}
  Coberturas Adicionais: ${data.additionalCoverages}
  Perfil Cliente: ${data.clientProfile}
  Objeção Principal: ${data.mainObjection}
  Informações do Concorrente: ${data.competitorInfo}`;
  
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
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Erro ao gerar argumentação:', error);
      throw error;
    }
  }
  
  export function parseOpenAIResponse(responseContent: string): ArgumentationResponse {
    try {
      // Limpa formatações markdown e espaços extras
      let cleanContent = responseContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
  
      // Log para debug
      console.log('Content before parsing:', cleanContent);
  
      // Tenta fazer o parse do JSON
      let parsed;
      try {
        parsed = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Parse error details:', parseError);
        
        // Tenta limpar possíveis problemas no JSON
        cleanContent = cleanContent
          .replace(/,(\s*[}\]])/g, '$1')
          .replace(/\n/g, '')
          .replace(/\s+/g, ' ')
          .replace(/,\s*,/g, ',')
          .trim();
  
        console.log('Cleaned content:', cleanContent);
        parsed = JSON.parse(cleanContent);
      }
  
      return parsed;
    } catch (error) {
      console.error('Erro ao fazer parse da resposta:', error);
      throw error;
    }
  }