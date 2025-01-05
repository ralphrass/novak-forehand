import pdf from 'pdf-parse/lib/pdf-parse.js';


/**
 * Função para processar e extrair texto de um PDF.
 * @param pdfBuffer - Buffer contendo os dados do PDF.
 * @returns Texto extraído do PDF.
 */
export async function processPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const pdfData = await pdf(pdfBuffer);
    return pdfData.text;
  } catch (error) {
    console.error('Erro ao processar o PDF:', error);
    throw error;
  }
}
