import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ExternalLink, 
  FileText, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { 
  dataUrlToArrayBuffer, 
  dataUrlToBlob, 
  downloadPdf, 
  openPdfInNewTab, 
  resolvePdfSource 
} from '../../lib/pdfUtils';

// Configure pdfjs worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('pdfjs worker init note:', e);
}

interface PdfCanvasViewerProps {
  url: string;
  title?: string;
  onDownload?: () => void;
  className?: string;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  url,
  title = 'Document',
  onDownload,
  className = ''
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [useIframeFallback, setUseIframeFallback] = useState<boolean>(false);
  const [resolvedSource, setResolvedSource] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setUseIframeFallback(false);
    pdfDocRef.current = null;
    setCurrentPage(1);

    let createdBlobUrl = '';

    async function loadPdf() {
      if (!url) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const resolved = await resolvePdfSource(url);
        if (!isMounted) return;

        setResolvedSource(resolved);

        let loadingTask: any;

        // Base64 Data URL or raw base64 string
        if (resolved.startsWith('data:') || (!resolved.startsWith('http') && !resolved.startsWith('blob:') && resolved.length > 200)) {
          const arrayBuffer = dataUrlToArrayBuffer(resolved);
          const blob = dataUrlToBlob(resolved);
          
          if (blob) {
            createdBlobUrl = URL.createObjectURL(blob);
            setBlobUrl(createdBlobUrl);
          }

          if (!arrayBuffer) {
            throw new Error('Could not parse base64 file data');
          }
          loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        } else if (resolved.startsWith('blob:')) {
          setBlobUrl(resolved);
          loadingTask = pdfjsLib.getDocument({ url: resolved });
        } else {
          // HTTP/HTTPS URL
          loadingTask = pdfjsLib.getDocument({ url: resolved });
        }

        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err: any) {
        console.warn('[PdfCanvasViewer Load Warning] Falling back to embedded iframe viewer:', err?.message || err);
        if (isMounted) {
          // Switch to embedded browser PDF iframe fallback smoothly
          setUseIframeFallback(true);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
      if (pdfDocRef.current && typeof pdfDocRef.current.destroy === 'function') {
        try {
          pdfDocRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [url]);

  // Render current page onto Canvas
  useEffect(() => {
    if (useIframeFallback || !pdfDocRef.current || loading) return;

    let isMounted = true;

    async function renderPage() {
      try {
        const page = await pdfDocRef.current!.getPage(currentPage);
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('[PdfCanvasViewer Render Exception] Switching to iframe fallback:', err);
          if (isMounted) {
            setUseIframeFallback(true);
          }
        }
      }
    }

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [currentPage, scale, loading, useIframeFallback]);

  const handleDownload = () => {
    if (onDownload) onDownload();
    downloadPdf(url, `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  };

  const handleOpenNewTab = () => {
    openPdfInNewTab(url);
  };

  const embedUrl = blobUrl || resolvedSource || url;

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-100 ${className}`}>
      
      {/* Viewer Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-slate-800/90 border-b border-slate-700/80 text-xs select-none">
        
        {/* Page Navigation */}
        {!useIframeFallback ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-slate-200 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-slate-300 min-w-[70px] text-center">
              {numPages > 0 ? `${currentPage} / ${numPages}` : '-'}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
              disabled={currentPage >= numPages || loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-slate-200 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-slate-300">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="font-medium truncate max-w-xs">{title}</span>
          </div>
        )}

        {/* Zoom Controls (Canvas Mode Only) */}
        {!useIframeFallback && (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setScale(s => Math.max(s - 0.2, 0.6))}
              disabled={loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="font-mono text-slate-400 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={() => setScale(s => Math.min(s + 0.3, 2.5))}
              disabled={loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition shadow-sm"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewer Content Area */}
      <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-auto flex items-center justify-center min-h-[480px]">
        {loading && (
          <div className="flex flex-col items-center space-y-3 text-amber-400 p-8">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-xs font-mono text-slate-400">Loading PDF Document...</p>
          </div>
        )}

        {!loading && useIframeFallback && (
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[500px] rounded-lg shadow-lg border border-slate-800 bg-white"
            title={title}
          />
        )}

        {!loading && !useIframeFallback && (
          <div className="shadow-2xl rounded overflow-hidden max-w-full my-auto border border-slate-800 bg-white">
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
          </div>
        )}
      </div>

    </div>
  );
};
