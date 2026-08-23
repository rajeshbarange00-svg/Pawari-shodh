import { jsPDF } from 'jspdf';

export interface ExportCertificateOptions {
  elementId?: string;
  element?: HTMLElement | null;
  fileName?: string;
  userName?: string;
  certificateNo?: string;
  scale?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
}

export interface ShareCertificateResult {
  success: boolean;
  method?: 'file_share' | 'text_share' | 'fallback_clipboard' | 'fallback_download';
  aborted?: boolean;
  downloadUrl?: string;
  error?: string;
}

/**
 * Dynamically resolves html2canvas-pro engine
 */
async function getHtml2CanvasEngine() {
  try {
    const mod = await import('html2canvas-pro');
    return (mod as any).default || mod;
  } catch (err) {
    console.warn('html2canvas-pro load failed, attempting standard html2canvas fallback', err);
    const modFallback = await import('html2canvas');
    return (modFallback as any).default || modFallback;
  }
}

/**
 * Replaces modern CSS color functions (oklch, color-mix, lab, lch, display-p3)
 * with reliable HEX and HSL color equivalents for canvas rendering engines.
 */
export function replaceUnsupportedCssColors(cssText: string): string {
  if (!cssText) return '';

  return cssText
    // Convert common tailwind 4 oklch palette variables to vibrant, accurate HEX / HSL
    .replace(/oklch\([^)]*--color-amber-950[^)]*\)/gi, '#451a03')
    .replace(/oklch\([^)]*--color-amber-900[^)]*\)/gi, '#78350f')
    .replace(/oklch\([^)]*--color-amber-800[^)]*\)/gi, '#92400e')
    .replace(/oklch\([^)]*--color-amber-700[^)]*\)/gi, '#b45309')
    .replace(/oklch\([^)]*--color-amber-600[^)]*\)/gi, '#d97706')
    .replace(/oklch\([^)]*--color-amber-500[^)]*\)/gi, '#f59e0b')
    .replace(/oklch\([^)]*--color-amber-400[^)]*\)/gi, '#fbbf24')
    .replace(/oklch\([^)]*--color-amber-300[^)]*\)/gi, '#fcd34d')
    .replace(/oklch\([^)]*--color-amber-200[^)]*\)/gi, '#fde68a')
    .replace(/oklch\([^)]*--color-amber-100[^)]*\)/gi, '#fef3c7')
    .replace(/oklch\([^)]*--color-amber-50[^)]*\)/gi, '#fffbeb')

    .replace(/oklch\([^)]*--color-red-950[^)]*\)/gi, '#450a0a')
    .replace(/oklch\([^)]*--color-red-900[^)]*\)/gi, '#7f1d1d')
    .replace(/oklch\([^)]*--color-red-800[^)]*\)/gi, '#991b1b')
    .replace(/oklch\([^)]*--color-red-700[^)]*\)/gi, '#b91c1c')
    .replace(/oklch\([^)]*--color-red-600[^)]*\)/gi, '#dc2626')
    .replace(/oklch\([^)]*--color-red-500[^)]*\)/gi, '#ef4444')

    .replace(/oklch\([^)]*--color-stone-950[^)]*\)/gi, '#0c0a09')
    .replace(/oklch\([^)]*--color-stone-900[^)]*\)/gi, '#1c1917')
    .replace(/oklch\([^)]*--color-stone-800[^)]*\)/gi, '#292524')
    .replace(/oklch\([^)]*--color-stone-700[^)]*\)/gi, '#44403c')
    .replace(/oklch\([^)]*--color-stone-600[^)]*\)/gi, '#57534e')
    .replace(/oklch\([^)]*--color-stone-500[^)]*\)/gi, '#78716c')
    .replace(/oklch\([^)]*--color-stone-300[^)]*\)/gi, '#d6d3d1')
    .replace(/oklch\([^)]*--color-stone-100[^)]*\)/gi, '#f5f5f4')
    .replace(/oklch\([^)]*--color-stone-50[^)]*\)/gi, '#fafaf9')

    .replace(/oklch\([^)]*--color-emerald-800[^)]*\)/gi, '#065f46')
    .replace(/oklch\([^)]*--color-emerald-700[^)]*\)/gi, '#047857')
    .replace(/oklch\([^)]*--color-emerald-600[^)]*\)/gi, '#059669')

    // Generic oklch color approximations using HSL / HEX
    .replace(/oklch\(\s*([0-9.]+)%?\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi, (_match, l, c, h, a) => {
      const lightness = parseFloat(l) > 1 ? parseFloat(l) : Math.round(parseFloat(l) * 100);
      const hue = Math.round(parseFloat(h) || 35);
      const alpha = a !== undefined ? (parseFloat(a) > 1 ? parseFloat(a) / 100 : parseFloat(a)) : 1;
      const sat = Math.min(100, Math.round((parseFloat(c) || 0.1) * 250));
      return alpha < 1 ? `hsla(${hue}, ${sat}%, ${lightness}%, ${alpha})` : `hsl(${hue}, ${sat}%, ${lightness}%)`;
    })
    .replace(/oklch\([^)]+\)/gi, '#881337')

    // Replace color-mix
    .replace(/color-mix\([^)]+\)/gi, 'hsl(45, 90%, 96%)')

    // Replace lab / lch / color(display-p3 ...)
    .replace(/lab\([^)]+\)/gi, 'hsl(35, 80%, 50%)')
    .replace(/lch\([^)]+\)/gi, 'hsl(35, 80%, 50%)')
    .replace(/color\([^)]+\)/gi, '#1c1917');
}

/**
 * Sanitizes stylesheets and inline styles in cloned documents
 * to replace modern CSS Color 4 (oklch, color-mix, etc.) with safe RGB/HEX/HSL fallbacks
 */
function sanitizeClonedStyles(clonedDoc: Document, elementId?: string) {
  try {
    // 1. Sanitize all <style> elements containing oklch or unsupported color functions
    const styleEls = clonedDoc.querySelectorAll('style');
    styleEls.forEach((style) => {
      if (style.textContent && /oklch|color-mix|lab\(|lch\(/i.test(style.textContent)) {
        style.textContent = replaceUnsupportedCssColors(style.textContent);
      }
    });

    // 2. Format cloned certificate root element to strict A4 Landscape dimensions
    const targetEl = (elementId ? clonedDoc.getElementById(elementId) : null) || 
      clonedDoc.getElementById('pawari-official-certificate-canvas') ||
      clonedDoc.getElementById('printable-certificate-card') || 
      clonedDoc.querySelector('.printable-certificate') as HTMLElement;

    if (targetEl) {
      targetEl.style.position = 'relative';
      targetEl.style.transform = 'none';
      targetEl.style.margin = '0 auto';
      targetEl.style.boxShadow = 'none';
      targetEl.style.width = '1120px';
      targetEl.style.minWidth = '1120px';
      targetEl.style.maxWidth = '1120px';
      targetEl.style.height = '792px';
      targetEl.style.minHeight = '792px';
      targetEl.style.maxHeight = '792px';
      targetEl.style.boxSizing = 'border-box';
      targetEl.style.backgroundColor = '#FFFDF8';
      targetEl.style.color = '#1c1917';
      targetEl.style.overflow = 'hidden';
      targetEl.style.borderRadius = '0';

      // Sanitize inline style attributes on any child elements
      const styledElements = targetEl.querySelectorAll('[style]');
      styledElements.forEach((el) => {
        const styleAttr = el.getAttribute('style');
        if (styleAttr && /oklch|color-mix|lab\(|lch\(/i.test(styleAttr)) {
          el.setAttribute('style', replaceUnsupportedCssColors(styleAttr));
        }
      });

      // Ensure all images in target element have crossOrigin set to anonymous
      const imgs = targetEl.querySelectorAll('img');
      imgs.forEach(img => {
        if (img.src && !img.src.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
        }
      });
    }
  } catch (err) {
    console.warn('Error during cloned style sanitization:', err);
  }
}

/**
 * Capture an HTML certificate element as a high-resolution HTML Canvas
 * with strict A4 Landscape proportions (1120px x 792px)
 */
export async function captureCertificateCanvas(
  elementOrId: string | HTMLElement, 
  scale = 2.5
): Promise<HTMLCanvasElement | null> {
  const element = typeof elementOrId === 'string'
    ? (document.getElementById(elementOrId) || document.getElementById('printable-certificate-card') || document.querySelector('.printable-certificate') as HTMLElement)
    : elementOrId;

  if (!element) {
    console.error('Certificate element not found in DOM.');
    return null;
  }

  const elementId = typeof elementOrId === 'string' ? elementOrId : element.id;

  // Ensure fonts are loaded before rasterization
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
    } catch (e) {
      // ignore font timeout
    }
  }

  // Pre-check images within element
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(images.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise<void>(resolve => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      if (!img.complete) {
        const currentSrc = img.src;
        img.src = currentSrc;
      }
      setTimeout(resolve, 1000); // 1s safety fallback
    });
  }));

  try {
    const html2canvas = await getHtml2CanvasEngine();

    const canvas = await html2canvas(element, {
      scale: Math.max(scale, 2.5),
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFDF8',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: 850,
      onclone: (clonedDoc: Document) => {
        sanitizeClonedStyles(clonedDoc, elementId);
      }
    });

    return canvas;
  } catch (error) {
    console.error('Failed to capture certificate canvas with html2canvas-pro:', error);
    throw error;
  }
}

/**
 * Downloads high-res PNG or JPEG image of the certificate.
 * Optimized for both desktop and mobile browsers.
 */
export async function downloadCertificateImage(options: ExportCertificateOptions): Promise<string | null> {
  const target = options.element || options.elementId || 'pawari-official-certificate-canvas';
  const canvas = await captureCertificateCanvas(target, options.scale || 2.5);
  if (!canvas) {
    throw new Error('Certificate canvas could not be rendered');
  }

  const format = options.format === 'jpeg' ? 'jpeg' : 'png';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = options.quality ?? (format === 'jpeg' ? 0.95 : 1.0);

  const safeName = (options.userName || 'Participant').trim().replace(/\s+/g, '_');
  const safeNo = (options.certificateNo || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = options.fileName || `Pawari_Sanskriti_Certificate_${safeName}_${safeNo}.${format === 'jpeg' ? 'jpg' : 'png'}`;

  // Try Blob-based download first for robust mobile & desktop support
  if (canvas.toBlob) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          try {
            const dataUrl = canvas.toDataURL(mimeType, quality);
            triggerDownload(dataUrl, fileName);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
          return;
        }

        try {
          const blobUrl = URL.createObjectURL(blob);
          triggerDownload(blobUrl, fileName);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
          resolve(blobUrl);
        } catch (err) {
          const dataUrl = canvas.toDataURL(mimeType, quality);
          triggerDownload(dataUrl, fileName);
          resolve(dataUrl);
        }
      }, mimeType, quality);
    });
  }

  // Fallback to dataURL
  const dataUrl = canvas.toDataURL(mimeType, quality);
  triggerDownload(dataUrl, fileName);
  return dataUrl;
}

/**
 * Helper to trigger native download via anchor click
 */
export function triggerDownload(url: string, fileName: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  link.setAttribute('target', '_blank');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (link.parentNode) {
      document.body.removeChild(link);
    }
  }, 300);
}

/**
 * Generates and downloads an A4 Landscape PDF (297mm x 210mm) of the certificate
 */
export async function downloadCertificatePdf(options: ExportCertificateOptions): Promise<boolean> {
  const target = options.element || options.elementId || 'pawari-official-certificate-canvas';
  const canvas = await captureCertificateCanvas(target, options.scale || 3);
  if (!canvas) {
    throw new Error('Certificate canvas could not be rendered for PDF');
  }

  try {
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Standard ISO A4 Landscape dimensions: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 297;
    const pdfHeight = 210;

    // Place image to exactly fill A4 landscape without margins
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const safeName = (options.userName || 'Participant').trim().replace(/\s+/g, '_');
    const safeNo = (options.certificateNo || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = options.fileName || `Pawari_Sanskriti_Certificate_${safeName}_${safeNo}.pdf`;

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate certificate PDF:', error);
    throw error;
  }
}

/**
 * Shares certificate using the Web Share API with thorough checks:
 * 1. Checks `navigator.canShare({ files: [file] })` before `navigator.share()` with files
 * 2. Falls back to text/link share if file sharing fails or is unsupported
 * 3. Falls back to clipboard copy + automatic download if Web Share is unavailable
 */
export async function shareCertificate(options: {
  elementId?: string;
  element?: HTMLElement | null;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  certificateNo: string;
  quizUrl?: string;
  onFallback?: () => void;
}): Promise<ShareCertificateResult> {
  const quizUrl = options.quizUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/quiz?cert=${options.certificateNo}`;
  const shareTitle = `पवारी भोयरी संस्कृति ज्ञान ई-प्रमाण-पत्र | ${options.userName}`;
  const shareText = `🚩 मैंने माँ ताप्ती पवारी शोध संस्थान द्वारा आयोजित "पवारी भोयरी संस्कृति ज्ञान परीक्षा" में ${options.percentage}% अंक (${options.score}/${options.total}) प्राप्त कर ई-प्रमाण-पत्र (प्रमाण-पत्र क्र.: ${options.certificateNo}) अर्जित किया है! 

आप भी अपनी संस्कृति ज्ञान की परीक्षा दें और डिजिटल प्रमाण-पत्र प्राप्त करें:
${quizUrl}`;

  const safeNo = (options.certificateNo || 'Cert').replace(/[^a-zA-Z0-9_-]/g, '_');
  const target = options.element || options.elementId || 'pawari-official-certificate-canvas';

  // 1. Try Web Share API with File Attachment
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      const canvas = await captureCertificateCanvas(target, 2.5);
      if (canvas && typeof navigator.canShare === 'function') {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
        if (blob) {
          const file = new File([blob], `Pawari_Certificate_${safeNo}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              files: [file],
              url: quizUrl
            });
            return { success: true, method: 'file_share' };
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      console.warn('Web Share with file failed, attempting text share fallback:', err);
    }

    // 2. Fallback: Web Share with Text & URL only (after verifying canShare or calling directly)
    try {
      const textSharePayload = {
        title: shareTitle,
        text: shareText,
        url: quizUrl
      };
      
      const canShareText = typeof navigator.canShare === 'function' ? navigator.canShare(textSharePayload) : true;
      if (canShareText) {
        await navigator.share(textSharePayload);
        return { success: true, method: 'text_share' };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      console.warn('Web Share with text failed:', err);
    }
  }

  // 3. Fallback: Copy Link to Clipboard and trigger image download
  let copiedToClipboard = false;
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareText);
      copiedToClipboard = true;
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  }

  // Automatically trigger certificate image download as fallback
  let downloadUrl: string | undefined;
  try {
    const resUrl = await downloadCertificateImage({
      elementId: typeof target === 'string' ? target : undefined,
      element: typeof target !== 'string' ? target : undefined,
      userName: options.userName,
      certificateNo: options.certificateNo,
      scale: 2.5
    });
    if (resUrl) downloadUrl = resUrl;
  } catch (e) {
    console.warn('Fallback download attempt error:', e);
  }

  if (options.onFallback) {
    options.onFallback();
  }

  return {
    success: true,
    method: copiedToClipboard ? 'fallback_clipboard' : 'fallback_download',
    downloadUrl
  };
}

