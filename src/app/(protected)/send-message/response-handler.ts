interface Analysis {
  primary_intent: string;
  knowledge_level: string;
  emotional_tone: string;
  key_concerns: string[];
  buying_signals: string;
}

interface ParsedResponse {
    analysis: {
      primary_intent: string;
      knowledge_level: string;
      emotional_tone: string;
      key_concerns: string[];
      buying_signals: string;
    };
    response: string;
    suggested_actions: string[];
  }
  
  
  export function parseApiResponse(apiResponse: any): ParsedResponse {
    try {
      // Se a resposta vier como string JSON dentro do campo response
      if (typeof apiResponse.response === 'string' && apiResponse.response.includes('```json')) {
        // Extrai o JSON da string markdown
        const jsonMatch = apiResponse.response.match(/```json\n([\s\S]*)\n```/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[1]);
          return parsedData;
        }
      }
      
      // Fallback para o formato direto
      return {
        analysis: apiResponse.analysis || {},
        response: apiResponse.response || '',
        suggested_actions: apiResponse.suggested_actions || []
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      return {
        analysis: {
          primary_intent: '',
          knowledge_level: '',
          emotional_tone: '',
          key_concerns: [],
          buying_signals: ''
        },
        response: apiResponse.response || '',
        suggested_actions: []
      };
    }
  }