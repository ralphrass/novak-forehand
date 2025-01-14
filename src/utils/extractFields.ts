export interface Parcela {
    parcelas: string;
    valor: string;
    detalhes: string;
}

export interface TabelaPagamento {
    tipo: string;
    parcelas: Parcela[];
}

export interface InsuranceData {
    investimentoAnual?: string;
    formasPagamento: TabelaPagamento[];
}

function extractFormasPagamento(text: string): TabelaPagamento[] {
    const formasPagamento: TabelaPagamento[] = [];
    
    // Dividir o texto em blocos por forma de pagamento
    const blocos = text.split(/(?=TODAS|1 BOLETO)/).filter(bloco => 
        bloco.includes('CARTÃO') || bloco.includes('BOLETO') || bloco.includes('DÉBITO')
    );

    blocos.forEach(bloco => {
        // Extrair o tipo de pagamento
        const tipoMatch = bloco.match(/(TODAS.*?|1 BOLETO.*?)(?:\n|$)/);
        if (!tipoMatch) return;

        const tabelaAtual: TabelaPagamento = {
            tipo: tipoMatch[1].trim(),
            parcelas: []
        };

        // Extrair linha de parcelas
        const parcelasMatch = bloco.match(/1x2x3x4x.*?(?:\n|$)/);
        if (!parcelasMatch) return;

        const numeroParcelas = parcelasMatch[0]
            .split('x')
            .filter(p => p)
            .map(p => p.replace(/[^0-9]/g, ''));

        // Processar valores e detalhes
        const linhas = bloco.split('\n');
        let parcelaAtual = 0;

        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            
            if (linha === 'R$' && numeroParcelas[parcelaAtual]) {
                const valor = linhas[i + 1]?.trim();
                let detalhes = '';
                
                // Coletar todos os detalhes até o próximo R$ ou fim do bloco
                let j = i + 2;
                let detalhesTemp = [];
                while (j < linhas.length) {
                    const proximaLinha = linhas[j].trim();
                    if (!proximaLinha || proximaLinha === 'R$' || proximaLinha === '--') break;
                    if (proximaLinha) detalhesTemp.push(proximaLinha);
                    j++;
                }
                
                // Juntar e formatar os detalhes
                if (detalhesTemp.length > 0) {
                    detalhes = detalhesTemp
                        .join(' ')
                        .replace(/[\(\)]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                }

                if (valor && valor !== '-') {
                    tabelaAtual.parcelas.push({
                        parcelas: numeroParcelas[parcelaAtual],
                        valor: valor,
                        detalhes: detalhes
                    });
                    parcelaAtual++;
                }
            }
        }

        if (tabelaAtual.parcelas.length > 0) {
            formasPagamento.push(tabelaAtual);
        }
    });

    return formasPagamento;
}

// Na interface de fields, remover formasPagamento como string e adicionar como TabelaPagamento[]
interface Fields {
    proponente?: string;
    nascimento?: string;
    placa?: string;
    modelo?: string;
    anoFabricacao?: string;
    anoModelo?: string;
    fipe?: string;
    coberturas?: string;
    compreensiva?: string;
    franquiaCasco?: string;
    rcfDanosMateriais?: string;
    rcfDanosCorporais?: string;
    danosMorais?: string;
    assistencia24h?: string;
    carroReserva?: string;
    vidros?: string;
    franquiaVidros?: string;
    pequenosReparos?: string;
    franquiaPequenosReparos?: string;
    investimentoAnual?: string;
    formasPagamento: [];
    nomeCondutor?: string;
    estadoCivil?: string;
    coberturaJovem?: string;
    garagem?: string;
    cepPernoite?: string;
    usoVeiculo?: string;
}

export function extractFields(text: string) {
    const fields: {
        proponente?: string;
        nascimento?: string;
        placa?: string;
        modelo?: string;
        anoFabricacao?: string;
        anoModelo?: string;
        fipe?: string;
        coberturas?: string;
        compreensiva?: string;
        franquiaCasco?: string;
        rcfDanosMateriais?: string;
        rcfDanosCorporais?: string;
        danosMorais?: string;
        assistencia24h?: string;
        carroReserva?: string;
        vidros?: string;
        franquiaVidros?: string;
        pequenosReparos?: string;
        franquiaPequenosReparos?: string;
        investimentoAnual?: string;
        formasPagamento: TabelaPagamento[];
        nomeCondutor?: string;
        estadoCivil?: string;
        coberturaJovem?: string;
        garagem?: string;
        cepPernoite?: string;
        usoVeiculo?: string;
    } = {
        formasPagamento: []
    };

    // Regex para Proponente
    const proponenteRegex = /PROPONENTE\s+([\w\s]+)\d{2}\/\d{2}\/\d{4}/;
    const proponenteMatch = text.match(proponenteRegex);
    if (proponenteMatch) {
        fields.proponente = proponenteMatch[1].trim();
    }

    // Regex para Nascimento
    const nascimentoRegex = /NascimentoCPF\s+[\w\s]+\s+(\d{2}\/\d{2}\/\d{4})/;
    const nascimentoMatch = text.match(nascimentoRegex);
    if (nascimentoMatch) {
        fields.nascimento = nascimentoMatch[1];
    }

    // Regex para Placa
    const placaRegex = /PlacaChassi\s+([A-Z0-9]{7})/;
    const placaMatch = text.match(placaRegex);
    if (placaMatch) {
        fields.placa = placaMatch[1];
    }

    // Regex para Modelo e Anos
    const modeloRegex = /VeículoAno Fabricação \/ Modelo\s*\d+\s*-\s*-\s*(.+?)\s*\d{4}\s*\/\s*\d{4}/;
    const modeloMatch = text.match(modeloRegex);
    if (modeloMatch) {
        fields.modelo = modeloMatch[1].trim(); // Captura o modelo completo
    }

    // Regex para FIPE
    const fipeRegex = /FipeCategoriaVeículo 0 Km\s*(\d+)/;
    const fipeMatch = text.match(fipeRegex);
    if (fipeMatch) {
        fields.fipe = fipeMatch[1];
    }

    // Regex para Coberturas
    const coberturasRegex = /COBERTURAS\s+(.*?)\s+Casco/;
    const coberturasMatch = text.match(coberturasRegex);
    if (coberturasMatch) {
        fields.coberturas = coberturasMatch[1].trim();
    }

    // Regex para Compreensiva
    const compreensivaRegex = /COMPREENSIVA.*?(\d+\.?\d*%)R\$/;
    const compreensivaMatch = text.match(compreensivaRegex);
    if (compreensivaMatch) {
        fields.compreensiva = compreensivaMatch[1];
    }

    // Regex para Franquia Casco (valor monetário no final da linha)
    const franquiaCascoRegex = /COMPREENSIVA.*?R\$ [\d.,]+.*?R\$ ([\d.,]+)/;
    const franquiaCascoMatch = text.match(franquiaCascoRegex);
    if (franquiaCascoMatch) {
        fields.franquiaCasco = `R$ ${franquiaCascoMatch[1].trim()}`;
    }

    // Regex para danos materiais
    const danosMateriaisRegex = /RCF-V DANOS MATERIAIS.*?R\$ ([\d,.]+)/;
    const danosMateriaisMatch = text.match(danosMateriaisRegex);
    if (danosMateriaisMatch) {
        fields.rcfDanosMateriais = danosMateriaisMatch[1];
    }

    // Regex para danos corporais
    const danosCorporaisRegex = /RCF-V DANOS CORPORAIS.*?R\$ ([\d,.]+)/;
    const danosCorporaisMatch = text.match(danosCorporaisRegex);
    if (danosCorporaisMatch) {
        fields.rcfDanosCorporais = danosCorporaisMatch[1];
    }

    // Regex para danos morais
    const danosMoraisRegex = /DANOS MORAIS.*?R\$ ([\d,.]+)/;
    const danosMoraisMatch = text.match(danosMoraisRegex);
    if (danosMoraisMatch) {
        fields.danosMorais = danosMoraisMatch[1];
    }

    // Regex para Assistência 24 horas (quilometragem)
    const assistenciaRegex = /ASSISTÊNCIA.*?(\d+\s*KM)/;
    const assistenciaMatch = text.match(assistenciaRegex);
    if (assistenciaMatch) {
        fields.assistencia24h = assistenciaMatch[1].trim();
    }

    // Regex para carro reserva
    const carroReservaRegex = /CARRO EXTRA.*?(\d+ DIAS)/;
    const carroReservaMatch = text.match(carroReservaRegex);
    if (carroReservaMatch) {
        fields.carroReserva = carroReservaMatch[1];
    }

    // Regex para Vidros ("Contratado" ou "Não contratado")
    const vidrosContratadoRegex = /\*Franquias: Vidros.*?: R\$/;
    if (text.match(vidrosContratadoRegex)) {
        fields.vidros = "Contratado";
    } else {
        fields.vidros = "Não contratado";
    }

    // Regex para Franquia Vidros (valores detalhados)
    const franquiaVidrosRegex = /\*Franquias:.*?Vidros.*?:.*?([\s\S]*?)(?:LMI|Danos|RCF|$)/;
    const franquiaVidrosMatch = text.match(franquiaVidrosRegex);
    if (franquiaVidrosMatch) {
        // Remove quebras de linha desnecessárias e organiza em múltiplas linhas
        fields.franquiaVidros = franquiaVidrosMatch[1]
            .replace(/\s*\/\s*/g, "\n")
            .trim();
    }

    // Regex para Pequenos Reparos ("Contratado" ou "Não contratado")
    const pequenosReparosContratadoRegex = /Reparos no Veículo.*?REPARO RÁPIDO.*?FRANQUIAS:/i;
    if (text.match(pequenosReparosContratadoRegex)) {
        fields.pequenosReparos = "Contratado";
    } else {
        fields.pequenosReparos = "Não contratado";
    }

    // Regex para Franquia de Pequenos Reparos
    const franquiaPequenosReparosRegex = /\*Franquias:.*?Reparo Rápido:.*?([\s\S]*?)(?:LMI|Danos|RCF|$)/;
    const franquiaPequenosReparosMatch = text.match(franquiaPequenosReparosRegex);
    if (franquiaPequenosReparosMatch) {
        // Remove quebras de linha desnecessárias e organiza em múltiplas linhas
        fields.franquiaPequenosReparos = franquiaPequenosReparosMatch[1]
            .replace(/\s*\/\s*/g, "\n")
            .trim();
    }

    // Extrair o Prêmio Total e seus componentes
    // Primeiro encontrar o bloco que contém os valores
    const linhas = text.split('\n');
    let premioTotalLiquido = '';
    let iof = '';
    let premioTotal = '';
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Se encontrar a linha do prêmio líquido, procurar os próximos valores
        if (linha.includes('Prêmio Total Líquido:')) {
            // Procurar nas próximas linhas os valores
            for (let j = i; j < i + 10 && j < linhas.length; j++) {
                const valorLinha = linhas[j];
                
                if (valorLinha.includes('R$')) {
                    const valorMatch = valorLinha.match(/R\$\s*([\d.,]+)/);
                    if (valorMatch) {
                        if (premioTotalLiquido === '') {
                            premioTotalLiquido = valorMatch[1];
                        } else if (iof === '') {
                            iof = valorMatch[1];
                        } else if (premioTotal === '') {
                            premioTotal = valorMatch[1];
                            break;
                        }
                    }
                }
            }
            break;
        }
    }

    // Se encontrou o prêmio total, usar esse valor
    if (premioTotal) {
        fields.investimentoAnual = `R$ ${premioTotal}`;
    }



    fields.formasPagamento = extractFormasPagamento(text)
    

    // Regex para Nome do Condutor
    const nomeCondutorRegex = /Nome do principal Condutor:\s*(.*?)(?=CPF)/;
    const nomeCondutorMatch = text.match(nomeCondutorRegex);
    if (nomeCondutorMatch) {
        fields.nomeCondutor = nomeCondutorMatch[1].trim();
    }

    // Regex para Estado Civil
    const estadoCivilRegex = /Estado Civil:\s+([\w\s]+)/;
    const estadoCivilMatch = text.match(estadoCivilRegex);
    if (estadoCivilMatch) {
        fields.estadoCivil = estadoCivilMatch[1].trim();
    }

    // Regex para Cobertura Jovem
    const coberturaJovemRegex = /Cobertura para condutores de 18 a 25 anos:\s+(Sim|Não)/i;
    const coberturaJovemMatch = text.match(coberturaJovemRegex);
    if (coberturaJovemMatch) {
        fields.coberturaJovem = coberturaJovemMatch[1].trim();
    }

    // Regex para Garagem
    const garagemRegex = /Garagem:\s+(Sim|Não)/i;
    const garagemMatch = text.match(garagemRegex);
    if (garagemMatch) {
        fields.garagem = garagemMatch[1].trim();
    }

    // Regex para CEP Pernoite
    const cepPernoiteRegex = /CEP PERNOITE:\s*([\d-]+)/;
    const cepPernoiteMatch = text.match(cepPernoiteRegex);
    if (cepPernoiteMatch) {
        fields.cepPernoite = cepPernoiteMatch[1].trim();
    }


    // Regex para Uso do Veículo
    const usoVeiculoRegex = /Uso do Veículo:\s+([\w\s]+)/;
    const usoVeiculoMatch = text.match(usoVeiculoRegex);
    if (usoVeiculoMatch) {
        fields.usoVeiculo = usoVeiculoMatch[1].trim();
    }

    return fields;
}
