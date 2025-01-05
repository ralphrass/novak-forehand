import { NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.pdf) {
      return NextResponse.json({ error: 'PDF não fornecido.' }, { status: 400 });
    }

    const pdfBuffer = Buffer.from(body.pdf, 'base64'); // Decodifica o Base64 enviado pelo cliente
    const pdfData = await pdf(pdfBuffer); // Extrai o texto do PDF

    return NextResponse.json({ text: pdfData.text }); // Retorna o texto extraído
  } catch (error) {
    console.error('Erro ao processar PDF:', error);
    return NextResponse.json({ error: 'Erro ao processar o PDF.' }, { status: 500 });
  }
}
