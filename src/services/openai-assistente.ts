const baseEndpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || '';

const getEndpointWithVersion = (endpoint: string) => {
  // Remove qualquer api-version existente
  const baseUrl = endpoint.split('?')[0];
  return `${baseUrl}?api-version=2024-08-01-preview`;
};

const AZURE_OPENAI_ENDPOINT = getEndpointWithVersion(baseEndpoint);
const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;

interface ReactFormData {
  productName: string;
  productPriceRange: string;
  productFeatures: string;
  productEditions: string;
  communicationTone: string;
  firstContact: boolean;
  previousInteractions: string;
  salesChannel: string;
  salesStage: string;
  customerSegment: string;
  customerIndustry: string;
  customerSize: string;
  customerQuestion: string;
  priceDiscussion: string;
}

interface AssistantFormData {
  customer_question: string;
  product_catalog: {
    name: string;
    price_range: string;
    features: string;
    editions: string;
  };
  company_guidelines: {
    tone: string;
    priceDiscussion: string;
  };
  customer_history: {
    first_contact: boolean;
    previous_interactions: string;
  };
  conversation_context: {
    channel: string;
    stage: string;
  };
  customer_profile: {
    segment: string;
    industry: string;
    size: string;
  };
}

function adaptFormData(reactData: ReactFormData): AssistantFormData {
  return {
    customer_question: reactData.customerQuestion,
    product_catalog: {
      name: reactData.productName,
      price_range: reactData.productPriceRange,
      features: reactData.productFeatures,
      editions: reactData.productEditions
    },
    company_guidelines: {
      tone: reactData.communicationTone,
      priceDiscussion: reactData.priceDiscussion
    },
    customer_history: {
      first_contact: reactData.firstContact,
      previous_interactions: reactData.previousInteractions
    },
    conversation_context: {
      channel: reactData.salesChannel,
      stage: reactData.salesStage
    },
    customer_profile: {
      segment: reactData.customerSegment,
      industry: reactData.customerIndustry,
      size: reactData.customerSize
    }
  };
}

interface ParsedResponse {
  customerResponse: string;
  salesStrategy: string;
  additionalAnalysis: string;
}

function parseAIResponse(content: string): ParsedResponse {
  // Dividir o conteúdo usando os títulos das seções como delimitadores
  const sections = content.split(/\d\.\s\*\*[^*]+\*\*:/);
  
  // Remover possíveis espaços em branco extras e linhas vazias
  const cleanSections = sections
    .map(section => section.trim())
    .filter(section => section.length > 0);

  return {
    customerResponse: cleanSections[0] || 'Não foi possível gerar uma resposta para o cliente.',
    salesStrategy: cleanSections[1] || 'Não foi possível gerar uma estratégia de vendas.',
    additionalAnalysis: cleanSections[2] || 'Não foi possível gerar uma análise adicional.'
  };
}


export async function generateSalesResponse(reactFormData: ReactFormData) {

  const formData = adaptFormData(reactFormData);

  const systemPrompt = `Você é um assistente especializado em vendas, treinado para analisar dados contextuais e gerar respostas práticas e acionáveis. 

Baseado nos dados fornecidos, elabore:
1. **Proposta de Resposta ao Cliente**:
   - Redija uma resposta clara e direta que possa ser utilizada imediatamente para responder ao cliente.
   - Inclua detalhes específicos do produto ou serviço que atendam às necessidades do cliente.
2. **Estratégia de Venda Personalizada**:
   - Proponha argumentos sólidos para convencer o cliente, considerando os dados fornecidos.
   - Identifique as principais preocupações ou pontos de dor do cliente e ofereça soluções claras.
3. **Análise Complementar**:
   - Sugira ações adicionais que a equipe de vendas possa realizar para aprofundar o relacionamento com o cliente ou maximizar a conversão.

Evite repetir as informações fornecidas e foque em insights novos e úteis.

`;

const userPrompt = `
Contexto do cliente:
Produto:
  Nome: ${formData.product_catalog.name}
  Faixa de Preço: ${formData.product_catalog.price_range}
  Funcionalidades: ${formData.product_catalog.features}
  Edições: ${formData.product_catalog.editions}
Diretrizes da Empresa:
  Tom de Comunicação: ${formData.company_guidelines.tone}
  Discussão de Preços: ${formData.company_guidelines.priceDiscussion}
Histórico do Cliente:
  Primeiro Contato: ${formData.customer_history.first_contact ? "Sim" : "Não"}
  Interações Anteriores: ${formData.customer_history.previous_interactions}
Contexto da Conversa:
  Canal: ${formData.conversation_context.channel}
  Etapa da Venda: ${formData.conversation_context.stage}
Perfil do Cliente:
  Segmento: ${formData.customer_profile.segment}
  Indústria: ${formData.customer_profile.industry}
  Tamanho: ${formData.customer_profile.size}
Pergunta do Cliente: ${formData.customer_question}
`;

const payload = {
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  temperature: 0.7,
  max_tokens: 1000,
};

console.log('JSON sendo enviado à API:', JSON.stringify(payload, null, 2))

  try {
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_KEY!,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const result = await response.json();

    // console.log(result)

    const messageContent = result.choices[0].message.content;

    return parseAIResponse(messageContent);

    // return result
  } catch (error) {
    console.error('Erro ao gerar a resposta:', error);
    throw error;
  }
}
