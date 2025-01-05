'use client';

import React, { useRef, useState } from 'react';
import { extractFields } from "@/utils/extractFields";

const Page: React.FC = () => {

    const [showProposal, setShowProposal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        proponente: "", // Nome do Proponente
        nascimento: "", // Data de Nascimento
        placa: "",      // Placa do Veículo
        modelo: "",
      });
      

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          console.log(`Arquivo carregado: ${file.name}`);
          setFile(file);
        }
      };

      const handleProcessPDF = async () => {
        console.log("handleProcessPDF foi chamado");
      
        if (!file) {
          alert("Por favor, carregue um arquivo PDF antes de prosseguir.");
          return;
        }
      
        try {
          // Converte o arquivo para Base64
          const arrayBuffer = await file.arrayBuffer();
          const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          console.log("PDF convertido para Base64:", base64Data);
      
          // Envia o PDF para a API no servidor
          console.log("Enviando PDF para o servidor...");
          const response = await fetch("/api/extract-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdf: base64Data }),
          });
      
          if (!response.ok) {
            throw new Error("Erro ao processar o PDF");
          }
      
          // Obtém o texto extraído do servidor
          const { text } = await response.json();
          console.log("Texto extraído:", text);

          // **Use a função extractFields para extrair os campos do texto**
          const extractedFields = extractFields(text);
          console.log("Campos Extraídos:", extractedFields);

          // Atualize o estado do formulário com os campos extraídos
        setFormData({
            proponente: extractedFields.proponente || "",
            nascimento: extractedFields.nascimento || "",
            placa: extractedFields.placa || "",
            modelo: extractedFields.modelo || "",
        });
      
          // Atualiza o estado com o texto extraído e renderiza o formulário
          setExtractedText(text); // Define o texto extraído
          setShowProposal(true);  // Atualiza para exibir o formulário
          console.log("Estado atualizado para exibir o formulário");
        } catch (error) {
          console.error("Erro ao processar o PDF:", error);
        }
      };      
      
      const handleClear = () => {
        // Reinicia os estados para permitir um novo carregamento
        setFile(null);
        setIsProcessing(false);
        setShowProposal(false);
        setExtractedText('');
        console.log('Processo reiniciado.');
      };

    const htmlTableRef = useRef<HTMLIFrameElement>(null);

    const handleSaveAndDownloadHTML = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Impede o comportamento padrão de recarregamento
        event.preventDefault();
      
        try {
          // Obter referência do documento no iframe
          const iframeDoc = htmlTableRef.current?.contentDocument;
          if (!iframeDoc) {
            console.error('Não foi possível acessar o documento no iframe.');
            return;
          }
      
          // Atualizar o parágrafo com o nome do segurado
          const nomeSeguradoInput = document.querySelector<HTMLInputElement>('#nomeSegurado');
          if (nomeSeguradoInput) {
            const seguradoParagraph = iframeDoc.querySelector(
              "p.MsoNormal span"
            );
            if (seguradoParagraph) {
            //   console.log(`Atualizando nome do segurado para: ${nomeSeguradoInput.value}`);
              seguradoParagraph.textContent = `Segurado(a): ${nomeSeguradoInput.value}.`;
            } else {
              console.warn('Parágrafo do segurado não encontrado no documento.');
            }
          } else {
            console.warn('Campo de entrada "nomeSegurado" não encontrado.');
          }
      
          // Atualizar as células da tabela
          const tableCells = iframeDoc.querySelectorAll('table td:nth-child(2)'); // Seleciona as células da segunda coluna
          const inputs = document.querySelectorAll<HTMLInputElement>('input, textarea');
          inputs.forEach((input, index) => {
            // Ignorar o primeiro campo (nomeSegurado) que já foi tratado
            if (input.id === 'nomeSegurado') return;
      
            const cell = tableCells[index - 1]; // Ajusta o índice, pois o primeiro input não está relacionado às tabelas
            if (cell) {
            //   console.log(`Preenchendo célula ${index} com o valor: ${input.value}`);
              cell.textContent = input.value; // Atualiza o conteúdo da célula com o valor do input
            } else {
              console.warn(`Célula da tabela não encontrada para o índice ${index - 1}.`);
            }
          });
      
          // Serializa o conteúdo atualizado do iframe para HTML
          const htmlContent = iframeDoc.documentElement.outerHTML;
      
          // Cria um link para download do arquivo HTML
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'proposta-preenchida.html'; // Nome do arquivo baixado
          link.click();
        } catch (error) {
          console.error('Erro durante o processamento:', error);
        }
      };
      
      

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

    {!showProposal ? (
        <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Upload da Proposta</h2>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100">
                    <svg
                      className="w-6 h-6 text-zinc-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 15V3m0 0L8 7m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                    </svg>
                  </div>
                  <p className="text-zinc-600">Clique para selecionar ou arraste um PDF</p>
                </div>
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 text-zinc-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <p className="text-zinc-600">{file.name}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleProcessPDF}
              disabled={!file || isProcessing}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? 'Processando...' : 'Gerar Proposta'}
            </button>
          </div>
        </div>
      </div>
      ) : (
      <div>

        {/* Texto extraído */}
        {/* {extractedText && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Texto Extraído</h3>
          <pre className="text-sm text-gray-800">{extractedText}</pre>
        </div>
      )} */}

        <h1 className="text-2xl font-bold mb-4">Proposta de Seguro</h1>

      <form className="space-y-6 bg-white p-6 shadow-md rounded-lg">
        {/* Nome do Segurado */}
        <div>
          <label htmlFor="nomeSegurado" className="block text-sm font-medium">
            Nome do Segurado
          </label>
          <input
            id="nomeSegurado"
            name="nomeSegurado"
            type="text"
            value={formData.proponente}
            onChange={(e) => setFormData({ ...formData, proponente: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* DESCRIÇÃO DO VEÍCULO */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Descrição do Veículo</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="marcaModeloAno" className="block text-sm font-medium">
                Marca/Modelo/Ano modelo
              </label>
              <input
                id="marcaModeloAno"
                name="marcaModeloAno"
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="placa" className="block text-sm font-medium">
                Placa
              </label>
              <input
                id="placa"
                name="placa"
                type="text"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="fipe" className="block text-sm font-medium">
                FIPE
              </label>
              <input
                id="fipe"
                name="fipe"
                type="text"
                defaultValue="023184-3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </section>

        {/* OPÇÕES DE CONTRATAÇÃO */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Opções de Contratação</h2>
          <div className="grid grid-cols-1 gap-4">
          <div>
              <label htmlFor="cobertura" className="block text-sm font-medium">
                COBERTURAS
              </label>
              <input
                id="cobertura"
                name="cobertura"
                type="text"
                defaultValue="Opção 1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="compreensiva" className="block text-sm font-medium">
                Compreensiva: Colisão + Incêndio + Roubo/Furto+ Eventos Causados pela Natureza
              </label>
              <input
                id="compreensiva"
                name="compreensiva"
                type="text"
                defaultValue="100% FIPE"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="franquiaCasco" className="block text-sm font-medium">
                Franquia Casco
              </label>
              <input
                id="franquiaCasco"
                name="franquiaCasco"
                type="text"
                defaultValue="R$ 10.445,68"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="danosMateriais" className="block text-sm font-medium">
                RCF-V Danos Materiais
              </label>
              <input
                id="danosMateriais"
                name="danosMateriais"
                type="text"
                defaultValue="R$ 200.000,00"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="danosCorporais" className="block text-sm font-medium">
                RCF-V Corporais a Terceiros
              </label>
              <input
                id="danosCorporais"
                name="danosCorporais"
                type="text"
                defaultValue="R$ 200.000,00"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="danosMorais" className="block text-sm font-medium">
                Danos Morais
              </label>
              <input
                id="danosMorais"
                name="danosMorais"
                type="text"
                defaultValue="R$ 10.000,00"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="cartaVerde" className="block text-sm font-medium">
                Carta Verde
              </label>
              <input
                id="cartaVerde"
                name="cartaVerde"
                type="text"
                defaultValue="Não contratado"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="assistencia" className="block text-sm font-medium">
                Assistência 24 Horas
              </label>
              <input
                id="assistencia"
                name="assistencia"
                type="text"
                defaultValue="Guincho 550 Km"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="carroReserva" className="block text-sm font-medium">
                Carro Reserva em Caso de Sinistro
              </label>
              <input
                id="carroReserva"
                name="carroReserva"
                type="text"
                defaultValue="15 Diárias"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="vidros" className="block text-sm font-medium">
                Vidros
              </label>
              <input
                id="vidros"
                name="vidros"
                type="text"
                defaultValue="Contratado"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="franquia_vidros" className="block text-sm font-medium">
                Franquia Vidros (R$)
              </label>
              <input
                id="franquia_vidros"
                name="franquia_vidros"
                type="text"
                defaultValue="Faróis Convencionais 480,00
                            Faróis Led 2.310,00
                            Faróis Xênon 2.310,00
                            Faróis Auxiliares Convencionais 130,00
                            Faróis Auxiliares Led 2.310,00
                            Faróis Auxiliares Xênon 2.310,00
                            Lanternas Convencionais 245,00
                            Lanternas Auxiliares 130,00
                            Lanternas Led 510,00
                            Para-brisa 555,00
                            Retrovisores Convencionais 485,00
                            Teto Solar 1.665,00
                            Vidros Laterais 155,00
                            Traseiro (Vigia) 310,00"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="pequenos_reparos" className="block text-sm font-medium">
                Pequenos Reparos (Rede referenciada)
              </label>
              <input
                id="pequenos_reparos"
                name="pequenos_reparos"
                type="text"
                defaultValue="Não Contratado"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="franquia_pequenos_reparos" className="block text-sm font-medium">
                Franquia Pequenos Reparos (R$)
              </label>
              <input
                id="franquia_pequenos_reparos"
                name="franquia_pequenos_reparos"
                type="text"
                defaultValue="Reparo de Lataria e Pintura 160,00
                                SRA - Reparo em arranhões - 1a peça 75,00 SRA - Reparo em arranhões demais peças 15,00"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="investimento_anual" className="block text-sm font-medium">
                Investimento Anual
              </label>
              <input
                id="investimento_anual"
                name="investimento_anual"
                type="text"
                defaultValue="R$ 3.935,11"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="formas_pagamento" className="block text-sm font-medium">
                FORMAS DE PAGAMENTO
              </label>
              <input
                id="formas_pagamento"
                name="formas_pagamento"
                type="text"
                defaultValue="1+5 R$ 655,85 s/juros (Débito em Conta)

                                1+9 R$ 393,51s/juros (Cartão de Crédito) – não compromete o limite do Cartão"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </section>

        {/* PERFIL PRINCIPAL CONDUTOR */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Perfil do Principal Condutor</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="nomeCondutor" className="block text-sm font-medium">
                Nome
              </label>
              <input
                id="nomeCondutor"
                name="nomeCondutor"
                type="text"
                defaultValue="Renato Cesar Lisboa da Silva"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="nascimento" className="block text-sm font-medium">
                Data de Nascimento
              </label>
              <input
                id="nascimento"
                name="nascimento"
                type="date"
                defaultValue="1960-03-04"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="estadoCivil" className="block text-sm font-medium">
                Estado Civil
              </label>
              <input
                id="estadoCivil"
                name="estadoCivil"
                type="text"
                defaultValue="Casado(a) ou convive em União Estável"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="coberturaJovem" className="block text-sm font-medium">
                Cobertura para condutores de 18 a 25 anos
              </label>
              <input
                id="coberturaJovem"
                name="coberturaJovem"
                type="text"
                defaultValue="Não"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="garagem" className="block text-sm font-medium">
                Garagem
              </label>
              <input
                id="garagem"
                name="garagem"
                type="text"
                defaultValue="Sim"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="cep" className="block text-sm font-medium">
                CEP Pernoite
              </label>
              <input
                id="cep"
                name="cep"
                type="text"
                defaultValue="95200-040"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="usoVeiculo" className="block text-sm font-medium">
                Uso do Veículo
              </label>
              <input
                id="usoVeiculo"
                name="usoVeiculo"
                type="text"
                defaultValue="Particular"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </section>

        {/* BOTÕES */}
        <div className="flex space-x-4">
            <button
                onClick={handleSaveAndDownloadHTML}
                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Salvar e Baixar HTML
            </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Salvar
          </button>
          <button
            type="reset"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Limpar
          </button>
        </div>
      </form>
      {/* Iframe para exibir o HTML da tabela */}
      <iframe
        ref={htmlTableRef}
        src="template_proposta.html"
        title="Tabela HTML"
        className="w-full h-96 mt-6 border"
      ></iframe>
      </div>
      )}
    </div>
  );
};

export default Page;
