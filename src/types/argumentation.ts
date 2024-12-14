// Interfaces para os dados de entrada do formulário
export interface ArgumentationData {
    product: string;
    price: string;
    mainCoverage: string;
    additionalCoverages: string;
    clientProfile: string;
    mainObjection: string;
    competitorInfo: string;
  }
  
  // Interfaces para a resposta da API
  export interface AnaliseObjecao {
    tipo: string;
    nivel_resistencia: string;
    motivacao_subjacente: string;
  }
  
  export interface ArgumentoResposta {
    argumento: string;
    abordagem: string;
    pontos_chave: string[];
  }
  
  export interface ExemploPratico {
    situacao: string;
    demonstracao: string;
  }
  
  export interface TecnicaNegociacao {
    tecnica: string;
    aplicacao: string;
    palavras_chave: string[];
  }
  
  export interface ProximoPasso {
    acao: string;
    objetivo: string;
  }
  
  export interface ArgumentationResponse {
    analise_objecao: AnaliseObjecao;
    argumentos_resposta: ArgumentoResposta[];
    exemplos_praticos: ExemploPratico[];
    tecnicas_negociacao: TecnicaNegociacao[];
    proximos_passos: ProximoPasso[];
  }