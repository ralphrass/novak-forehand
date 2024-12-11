'use client';

import dynamic from 'next/dynamic';
import { PDFTemplate } from './insurance-pdf-template';

const PDFViewerComponent = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4">Carregando visualizador de PDF...</p>
        </div>
      </div>
    )
  }
);

interface PDFViewerWrapperProps {
  data: any;
}

export function PDFViewerWrapper({ data }: PDFViewerWrapperProps) {
  return (
    <PDFViewerComponent style={{ width: '100%', height: '100%' }}>
      <PDFTemplate data={data} />
    </PDFViewerComponent>
  );
}