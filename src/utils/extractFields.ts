export function extractFields(text: string) {
    const fields: { proponente?: string; nascimento?: string; placa?: string; modelo?: string; anoFabricacao?: string; anoModelo?: string} = {};

    const modeloRegex = /VeículoAno Fabricação \/ Modelo\s*(.+?)\d{4}\s*\/\s*\d{4}/;
    const anosRegex = /\d{4}\s*\/\s*\d{4}/;

    // Extraindo o Modelo
    const modeloMatch = text.match(modeloRegex);
    if (modeloMatch) {
        fields.modelo = modeloMatch[1].trim();
    }

    // Extraindo os Anos de Fabricação e Modelo
    const anosMatch = text.match(anosRegex);
    if (anosMatch) {
        const [anoFabricacao, anoModelo] = anosMatch[0].split(" / ").map((ano) => ano.trim());
        fields.anoFabricacao = anoFabricacao;
        fields.anoModelo = anoModelo;
    }
  
    // Regex para localizar o trecho do Proponente, Nascimento e CPF
    const proponenteRegex = /Proponente \/ Segurado\(a\)NascimentoCPF\s*PROPONENTE\s*(.+?)\d{2}\/\d{2}\/\d{4}/i;
  
    const nascimentoRegex = /(\d{2}\/\d{2}\/\d{4})/;
    const placaRegex = /PlacaChassi\s*([A-Z]{3}[0-9][A-Z0-9][0-9]{2})/;
  
    // Extraindo o Proponente
    const proponenteMatch = text.match(proponenteRegex);
    if (proponenteMatch) {
      fields.proponente = proponenteMatch[1].trim();
    }
  
    // Extraindo a Data de Nascimento
    const nascimentoMatch = text.match(nascimentoRegex);
    if (nascimentoMatch) {
      fields.nascimento = nascimentoMatch[1];
    }
  
    // Extraindo a Placa do Veículo
    const placaMatch = text.match(placaRegex);
    if (placaMatch) {
      fields.placa = placaMatch[1];
    }
  
    return fields;
  }
  