import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fileBlobManager, base64ToBlob } from './fileBlobManager';

/**
 * Helper utilities for processing, converting, viewing and downloading PDF files safely
 * across desktop and mobile devices using persistent Blob-based URL mapping.
 */

// Resolves a raw URL / file ID / path to a valid local Blob URL or HTTP URL
export async function resolvePdfSource(rawUrl: string): Promise<string> {
  if (!rawUrl) return '';
  return await fileBlobManager.getBlobUrl(rawUrl);
}

// Converts a base64 Data URL or string to an ArrayBuffer for PDF.js
export function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer | null {
  if (!dataUrl) return null;
  try {
    let base64 = dataUrl;
    if (dataUrl.includes(';base64,')) {
      base64 = dataUrl.split(';base64,')[1];
    }
    const binaryString = atob(base64.trim().replace(/[\r\n\s]/g, ''));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (err) {
    console.error('Failed to convert base64 to ArrayBuffer:', err);
    return null;
  }
}

// Converts a base64 Data URL or string to a Blob object
export function dataUrlToBlob(dataUrl: string): Blob | null {
  return base64ToBlob(dataUrl);
}

// Converts a raw pdf_url into a lightweight Blob URL
export function getEmbeddablePdfUrl(rawUrl: string): { displayUrl: string; isBlob: boolean; cleanup: () => void } {
  if (!rawUrl) {
    return { displayUrl: '', isBlob: false, cleanup: () => {} };
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return { displayUrl: rawUrl, isBlob: false, cleanup: () => {} };
  }

  if (rawUrl.startsWith('blob:')) {
    return { displayUrl: rawUrl, isBlob: true, cleanup: () => {} };
  }

  const memoryBlob = fileBlobManager.getMemoryBlobUrl(rawUrl);
  if (memoryBlob) {
    return { displayUrl: memoryBlob, isBlob: true, cleanup: () => {} };
  }

  if (rawUrl.startsWith('data:') || rawUrl.length > 300) {
    const blob = base64ToBlob(rawUrl);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      return {
        displayUrl: blobUrl,
        isBlob: true,
        cleanup: () => {
          URL.revokeObjectURL(blobUrl);
        }
      };
    }
  }

  return { displayUrl: rawUrl, isBlob: false, cleanup: () => {} };
}

// Downloads a PDF file safely regardless of format
export async function downloadPdf(rawUrl: string, fileName = 'article.pdf') {
  if (!rawUrl) return;

  const resolved = await resolvePdfSource(rawUrl);
  const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  const a = document.createElement('a');
  a.href = resolved;
  a.download = cleanFileName;
  a.target = '_blank';
  a.rel = 'noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Opens PDF in a new tab safely
export async function openPdfInNewTab(rawUrl: string) {
  if (!rawUrl) return;

  const resolved = await resolvePdfSource(rawUrl);
  window.open(resolved, '_blank');
}

/**
 * Downloads standard Manuscript Template for authors
 */
export function downloadManuscriptTemplate(customUrl?: string) {
  if (customUrl && customUrl.trim() !== '') {
    const a = document.createElement('a');
    a.href = customUrl;
    a.download = 'Pawari_Shodh_Patrika_Manuscript_Template.docx';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Pawari Shodh Patrika - Manuscript Template</title>
<style>
body { font-family: 'Times New Roman', Mangal, serif; margin: 40px; line-height: 1.6; }
h1 { text-align: center; color: #420708; font-size: 22pt; }
h2 { text-align: center; color: #7f1d1d; font-size: 14pt; font-weight: normal; }
.author { text-align: center; font-size: 12pt; margin-bottom: 20px; }
.abstract { border: 1px solid #ccc; padding: 15px; background: #f9f9f9; margin-bottom: 20px; }
.section { font-size: 14pt; font-weight: bold; color: #420708; margin-top: 20px; }
</style>
</head>
<body>
<h1>पवारी शोध पत्रिका (Pawari Shodh Patrika)</h1>
<h2>शोध पत्र हेतु मानक पांडुलिपि टेम्पलेट (Manuscript Formatting Template)</h2>

<div class="author">
<p><strong>[शोध पत्र का शीर्षक (Title in Hindi / English)]</strong></p>
<p><strong>लेखक का नाम:</strong> [लेखक का पूरा नाम]</p>
<p><strong>पद एवं संस्थान:</strong> [विभाग, कॉलेज/विश्वविद्यालय का नाम]</p>
<p><strong>ईमेल एवं मोबाइल:</strong> [email@example.com, +91-XXXXXXXXXX]</p>
<p><strong>ORCID iD:</strong> [0000-0000-0000-0000]</p>
</div>

<div class="abstract">
<p><strong>शोध सार (Abstract in Hindi):</strong> [यहाँ 150-250 शब्दों में शोध सार लिखें। इसमें शोध का उद्देश्य, अध्ययन पद्धति, मुख्य निष्कर्ष एवं सिफारिशें स्पष्ट करें।]</p>
<p><strong>कीवर्ड (Keywords in Hindi):</strong> [5-7 मुख्य शब्द, अल्पविराम (,) से पृथक]</p>
<hr>
<p><strong>Abstract (English):</strong> [Write 150-250 words English abstract here.]</p>
<p><strong>Keywords (English):</strong> [5-7 keywords in English]</p>
</div>

<div class="section">1. प्रस्तावना (Introduction)</div>
<p>[विषय का परिचय, शोध प्रश्न, शोध का महत्व एवं उद्देश्य यहाँ लिखें...]</p>

<div class="section">2. साहित्य पुनरावलोकन एवं अध्ययन पद्धति (Literature Review & Methodology)</div>
<p>[संबंधित शोध साहित्य, डेटा संग्रह विधि, नमूना आकार (Sample size) एवं विश्लेषण तकनीक...]</p>

<div class="section">3. अध्ययन एवं निष्कर्ष (Analysis & Discussion)</div>
<p>[शोध के मुख्य आंकड़े, तथ्य, भाषाई विश्लेषण एवं परिणाम...]</p>

<div class="section">4. उपसंहार एवं संस्तुतियाँ (Conclusion & Recommendations)</div>
<p>[अध्ययन का मुख्य निष्कर्ष एवं भावी शोध दिशाएँ...]</p>

<div class="section">5. सन्दर्भ सूची (References - APA 7th Edition)</div>
<p>1. पवार, रूपेश. (2025). <i>पवारी लोकभाषा का ऐतिहासिक एवं भाषाई अध्ययन</i>. भोपाल: मध्य प्रदेश साहित्य अकादमी.</p>
<p>2. Smith, J. A. (2024). Sociolinguistic profile of Pawari dialect. <i>Journal of Central Indian Languages</i>, 12(2), 45-62.</p>

</body>
</html>`;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pawari_Shodh_Patrika_Manuscript_Template.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads standard Copyright and Self-Declaration Form for authors
 */
export function downloadCopyrightForm(customUrl?: string) {
  if (customUrl && customUrl.trim() !== '') {
    const a = document.createElement('a');
    a.href = customUrl;
    a.download = 'Pawari_Shodh_Patrika_Copyright_Form.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Copyright & Self-Declaration Form - Pawari Shodh Patrika</title>
<style>
body { font-family: 'Times New Roman', Mangal, serif; margin: 40px; line-height: 1.6; }
h1 { text-align: center; color: #420708; font-size: 20pt; }
h2 { text-align: center; color: #7f1d1d; font-size: 13pt; margin-top: -10px; }
.form-box { border: 2px solid #420708; padding: 25px; border-radius: 10px; margin-top: 20px; }
.field { margin-bottom: 12px; }
.label { font-weight: bold; color: #333; }
.terms { background: #fdf8f0; border-left: 4px solid #d97706; padding: 12px; font-size: 10pt; margin: 20px 0; }
</style>
</head>
<body>

<h1>पवारी शोध पत्रिका (Pawari Shodh Patrika)</h1>
<h2>कॉपीराइट हस्तांतरण एवं स्वघोषणा पत्र (Copyright Transfer & Declaration Form)</h2>

<div class="form-box">
  <div class="field"><span class="label">शोध पत्र का शीर्षक (Article Title):</span> __________________________________________________</div>
  <div class="field"><span class="label">प्रथम लेखक का नाम (First Author):</span> __________________________________________________</div>
  <div class="field"><span class="label">सह-लेखकों के नाम (Co-Authors):</span> __________________________________________________</div>
  <div class="field"><span class="label">पद एवं संस्थान (Affiliation):</span> __________________________________________________</div>
  <div class="field"><span class="label">ईमेल (Email):</span> __________________________ <span class="label">मोबाइल (Phone):</span> ______________________</div>

  <div class="terms">
    <p><strong>स्वघोषणा एवं शर्तें (Mandatory Undertaking):</strong></p>
    <ol>
      <li>मैं/हम प्रमाणित करते हैं कि यह शोध पत्र मेरा/हमारा मूल (Original) कार्य है और यह किसी अन्य पत्रिका में प्रकाशन हेतु विचाराधीन नहीं है।</li>
      <li>शोध पत्र में उल्लिखित सभी आंकड़े, तथ्य एवं संदर्भ सत्य व प्रमाणिक हैं तथा इसमें किसी भी प्रकार का Plagiarism नहीं है।</li>
      <li>स्वीकृत होने पर इस शोध पत्र के सर्ववाधिकार (Copyright) 'पवारी शोध पत्रिका' को हस्तांतरित रहेंगे। Open Access (CC BY 4.0) लाइसेंस के तहत इसका अकादमिक प्रसार किया जा सकेगा।</li>
      <li>यदि शोध पत्र में किसी भी प्रकार की साहित्यिक चोरी या नियम उल्लंघन पाया जाता है, तो इसके लिए लेखक स्वयं पूर्णतः उत्तरदायी होंगे।</li>
    </ol>
  </div>

  <table width="100%" style="margin-top: 50px;">
    <tr>
      <td width="50%">
        <p><strong>लेखक के हस्ताक्षर (Signature):</strong> _______________</p>
        <p><strong>नाम (Name):</strong> ________________________</p>
        <p><strong>स्थान (Place):</strong> _______________________</p>
        <p><strong>दिनांक (Date):</strong> _______________________</p>
      </td>
      <td width="50%" style="text-align: right;">
        <p style="border: 1px dashed #999; padding: 30px 10px; text-align: center; font-size: 9pt; color: #666;">
          [हस्ताक्षरित प्रति स्कैन करके <br>PDF/JPEG प्रारूप में अपलोड करें]
        </p>
      </td>
    </tr>
  </table>
</div>

</body>
</html>`;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pawari_Shodh_Patrika_Copyright_Declaration_Form.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

