declare module 'pdf-parse/lib/pdf-parse.js' {
    type PdfParseResult = {
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      text: string;
      version: string;
    };
  
    export default function pdf(data: Buffer | Uint8Array | ArrayBuffer, options?: any): Promise<PdfParseResult>;
  }
  