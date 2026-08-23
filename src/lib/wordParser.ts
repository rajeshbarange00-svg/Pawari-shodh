import mammoth from 'mammoth';
import { Author, CustomSectionBlock, Article } from '../types';

export interface ParsedWordArticle {
  title_hindi: string;
  title_english: string;
  authors: Author[];
  abstract_hindi: string;
  abstract_english: string;
  keywords: string[];
  full_text_introduction: string;
  full_text_literature_review: string;
  full_text_methodology: string;
  full_text_results_discussion: string;
  full_text_conclusion: string;
  full_text_acknowledgement: string;
  full_text_conflict_of_interest: string;
  references: string[];
  custom_sections: CustomSectionBlock[];
  detectionSummary: string[];
  rawCleanHtml: string;
}

/**
 * Removes Microsoft Word junk markup, inline Mso styles, font tags,
 * and normalizes paragraph breaks into clean semantic HTML.
 */
export function cleanWordHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  // 1. Remove Word comments and XML data blocks, but keep VML/MSO images if present
  let html = rawHtml
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<xml[\s\S]*?<\/xml>/gi, '')
    .replace(/<\/?o:[^>]*>/gi, '')
    .replace(/<\/?w:[^>]*>/gi, '')
    .replace(/<\/?m:[^>]*>/gi, '');

  // Convert MS Word VML <v:imagedata src="..."> to standard <img> tag if present
  html = html.replace(/<v:imagedata[^>]*src=["']([^"']+)["'][^>]*>/gi, '<img src="$1" alt="Word Document Image" />');

  // 2. DOM based cleaning if in browser
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Helper function to clean element nodes
      const cleanNode = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();

          // Remove Word classes (MsoNormal, MsoTitle, etc.)
          if (el.className) {
            const newClass = el.className
              .split(/\s+/)
              .filter(c => !/^mso/i.test(c) && !/^word/i.test(c))
              .join(' ');
            if (newClass) el.className = newClass;
            else el.removeAttribute('class');
          }

          // Preserve legitimate inline styles (font-family, font-size, font-weight, font-style, color, background-color, text-align, text-decoration, line-height)
          if (el.hasAttribute('style')) {
            const style = el.getAttribute('style') || '';
            const cleanStyle = style
              .split(';')
              .map(s => s.trim())
              .filter(s => {
                const key = s.split(':')[0]?.toLowerCase() || '';
                return key && 
                       !key.startsWith('mso-') &&
                       !key.startsWith('panose-') &&
                       !key.startsWith('tab-stops') &&
                       !key.startsWith('v-text-anchor');
              })
              .join('; ');
            
            if (cleanStyle) el.setAttribute('style', cleanStyle);
            else el.removeAttribute('style');
          }

          // Convert <font> tags to <span> with inline CSS styles
          if (tagName === 'font') {
            const span = doc.createElement('span');
            const face = el.getAttribute('face');
            const color = el.getAttribute('color');
            const size = el.getAttribute('size');
            const styles: string[] = [];
            if (face) styles.push(`font-family: ${face}`);
            if (color) styles.push(`color: ${color}`);
            if (size) {
              const sizes: Record<string, string> = { '1': '10px', '2': '12px', '3': '14px', '4': '16px', '5': '18px', '6': '24px', '7': '32px' };
              styles.push(`font-size: ${sizes[size] || '14px'}`);
            }
            if (styles.length) span.setAttribute('style', styles.join('; '));
            while (el.firstChild) {
              span.appendChild(el.firstChild);
            }
            el.parentNode?.replaceChild(span, el);
            cleanNode(span);
            return;
          }

          // Format <img> tags gracefully
          if (tagName === 'img') {
            const src = el.getAttribute('src');
            if (src) {
              el.className = 'max-w-full h-auto my-3 rounded-lg shadow-xs inline-block';
            }
          }

          // Recurse children
          Array.from(el.childNodes).forEach(cleanNode);
        }
      };

      Array.from(doc.body.childNodes).forEach(cleanNode);
      html = doc.body.innerHTML;
    } catch (e) {
      console.warn('DOMParser cleaning fallback:', e);
    }
  }

  // 3. Regex cleanup fallback for remaining tags
  html = html
    .replace(/\s*mso-[^:]+:[^;"]+;?/gi, '')
    .replace(/class="Mso[^"]*"/gi, '')
    .replace(/style=""/gi, '')
    .replace(/\n\s*\n/g, '\n');

  return html.trim();
}

/**
 * Parse pasted Word content (from Clipboard HTML/Text or File) into a structured Journal Article.
 */
export async function parseWordArticle(input: {
  html?: string;
  text?: string;
  file?: File;
}): Promise<ParsedWordArticle> {
  let rawHtml = input.html || '';
  let plainText = input.text || '';

  // If a .docx File was uploaded, use Mammoth to convert to clean HTML & Text
  if (input.file) {
    try {
      const arrayBuffer = await input.file.arrayBuffer();
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          convertImage: (mammoth.images as any).inline((element: any) => {
            return element.read("base64").then((imageBuffer: string) => ({
              src: `data:${element.contentType};base64,${imageBuffer}`
            }));
          })
        }
      );
      rawHtml = result.value;
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      plainText = textResult.value;
    } catch (err) {
      console.error('Error parsing docx with mammoth:', err);
      if (!plainText && input.file.name.endsWith('.txt')) {
        plainText = await input.file.text();
      }
    }
  }

  // If we have HTML, clean it first
  const cleanHtml = cleanWordHtml(rawHtml);

  // Fallback plainText extraction if missing
  if (!plainText && cleanHtml) {
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(cleanHtml, 'text/html');
      plainText = doc.body.textContent || '';
    } else {
      plainText = cleanHtml.replace(/<[^>]+>/g, ' ');
    }
  }

  const lines = plainText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const detectionSummary: string[] = [];

  // Helper detection variables
  let title_hindi = '';
  let title_english = '';
  let abstract_hindi = '';
  let abstract_english = '';
  const keywordsSet = new Set<string>();
  const authors: Author[] = [];
  
  let introLines: string[] = [];
  let litLines: string[] = [];
  let methLines: string[] = [];
  let resLines: string[] = [];
  let concLines: string[] = [];
  let ackLines: string[] = [];
  let conflictLines: string[] = [];
  let rawRefLines: string[] = [];

  const customSections: CustomSectionBlock[] = [];

  // Current active section tracker
  let currentSection = 'header'; // 'header', 'abstract', 'keywords', 'intro', 'literature', 'methodology', 'results', 'conclusion', 'ack', 'conflict', 'references', 'custom'
  let currentCustomSection: { title: string; lines: string[] } | null = null;

  // Extract Emails & ORCIDs across document
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const orcidRegex = /0000-000\d-\d{4}-\d{3}[\dX]/gi;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lLower = line.toLowerCase();

    // SECTION HEADERS RECOGNITION
    // 1. Abstract
    if (/^(abstract\s*\((hindi|हिंदी)\)|हिंदी\s*सार|अमूर्त|सारांश)[\s:]*/i.test(line)) {
      currentSection = 'abstract_hindi';
      const textAfterHeader = line.replace(/^(abstract\s*\((hindi|हिंदी)\)|हिंदी\s*सार|अमूर्त|सारांश)[\s:]*/i, '').trim();
      if (textAfterHeader) abstract_hindi += textAfterHeader + ' ';
      continue;
    }
    if (/^(abstract\s*\((english)\)|abstract|summary)[\s:]*/i.test(line)) {
      currentSection = 'abstract_english';
      const textAfterHeader = line.replace(/^(abstract\s*\((english)\)|abstract|summary)[\s:]*/i, '').trim();
      if (textAfterHeader) abstract_english += textAfterHeader + ' ';
      continue;
    }

    // 2. Keywords
    if (/^(keywords|key\s*words|बीज\s*शब्द|कुंजी\s*शब्द|मुख्य\s*शब्द)[\s:]*/i.test(line)) {
      currentSection = 'keywords';
      const kwText = line.replace(/^(keywords|key\s*words|बीज\s*शब्द|कुंजी\s*शब्द|मुख्य\s*शब्द)[\s:]*/i, '').trim();
      if (kwText) {
        kwText.split(/[,;|\/]/).forEach(k => {
          const cleanK = k.trim().replace(/^['"\[]+|['"\]]+$/g, '');
          if (cleanK) keywordsSet.add(cleanK);
        });
      }
      continue;
    }

    // 3. Major Sections (Numbered or Keyword)
    // Introduction
    if (/^([1१][.\-)\s]+)?(introduction|prostavna|प्रस्तावना|भूमिका)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'intro';
      continue;
    }

    // Literature Review
    if (/^([2२][.\-)\s]+)?(literature\s*review|sahitya\s*avalokan|साहित्य\s*अवलोकन|साहित्य\s*समीक्षा)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'literature';
      continue;
    }

    // Methodology
    if (/^([3३][.\-)\s]+)?(methodology|karyapranali|अनुसंधान\s*कार्यप्रणाली|शोध\s*विधि|प्रणाली|कार्यप्रणाली)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'methodology';
      continue;
    }

    // Results & Discussion
    if (/^([4४][.\-)\s]+)?(results\s*(&|and)?\s*discussion|parinam|परिणाम\s*एवं\s*विश्लेषण|परिणाम\s*व\s*चर्चा|निष्कर्ष\s*व\s*परिणाम|परिणाम)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'results';
      continue;
    }

    // Conclusion
    if (/^([5५][.\-)\s]+)?(conclusion|niskarsa|निष्कर्ष|उपसंहार)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'conclusion';
      continue;
    }

    // Acknowledgement
    if (/^(acknowledgement|acknowledgments|आभार)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'ack';
      continue;
    }

    // Conflict of Interest
    if (/^(conflict\s*of\s*interest|हित-संघर्ष)\b/i.test(line)) {
      currentSection = 'conflict';
      continue;
    }

    // References
    if (/^([6६][.\-)\s]+)?(references|bibliography|works\s*cited|संदर्भ\s*(ग्रंथ\s*)?सूची|संदर्भ)\b/i.test(line)) {
      if (currentCustomSection) {
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n')
        });
        currentCustomSection = null;
      }
      currentSection = 'references';
      continue;
    }

    // Numbered Subsections (e.g. 1.1, 1.2, 2.1, 3.1) -> Custom Section
    if (/^(\d+\.\d+|\b[1-9१-९]\.\d+)[\s:)]+[A-Za-z\u0900-\u097F]/i.test(line) && line.length < 120) {
      if (currentCustomSection) {
        const parentSec: any = ['intro', 'literature', 'methodology', 'results', 'conclusion'].includes(currentSection) ? currentSection : 'intro';
        customSections.push({
          id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
          type: 'subheading_h3',
          title: currentCustomSection.title,
          content: currentCustomSection.lines.join('\n\n'),
          parent_section: parentSec
        });
      }
      currentCustomSection = { title: line, lines: [] };
      const previousSec = currentSection;
      currentSection = 'custom';
      continue;
    }

    // CONTENT ROUTING ACCORDING TO CURRENT SECTION
    if (currentSection === 'header') {
      // First prominent non-empty line -> Title
      if (!title_hindi && !title_english) {
        if (/[\u0900-\u097F]/.test(line)) {
          title_hindi = line;
        } else {
          title_english = line;
        }
      } else if ((title_hindi && !title_english && !/[\u0900-\u097F]/.test(line) && line.length > 10) ||
                 (!title_hindi && title_english && /[\u0900-\u097F]/.test(line) && line.length > 10)) {
        if (!title_hindi && /[\u0900-\u097F]/.test(line)) title_hindi = line;
        if (!title_english && !/[\u0900-\u097F]/.test(line)) title_english = line;
      } else if (line.toLowerCase().includes('author') || emailRegex.test(line) || /डॉ\.|प्रो\.|डॉ|प्रा\.|dr\.|prof\./i.test(line)) {
        // Author detection line
        const emailMatch = line.match(emailRegex)?.[0] || '';
        const orcidMatch = line.match(orcidRegex)?.[0] || '';
        const cleanName = line
          .replace(emailRegex, '')
          .replace(orcidRegex, '')
          .replace(/email:?/i, '')
          .replace(/orcid:?/i, '')
          .trim();

        if (cleanName) {
          authors.push({
            name: cleanName.split(',')[0]?.trim() || cleanName,
            affiliation: cleanName.includes('(') ? cleanName.substring(cleanName.indexOf('(') + 1, cleanName.indexOf(')')).trim() : 'शोध संस्थान / अध्ययन केंद्र',
            email: emailMatch,
            orcid: orcidMatch,
            is_corresponding: authors.length === 0
          });
        }
      } else if (/abstract|सार|अमूर्त/i.test(line)) {
        currentSection = 'abstract_hindi';
      }
    } else if (currentSection === 'abstract_hindi') {
      if (/keywords|बीज\s*शब्द|abstract\s*\(english\)/i.test(line)) {
        if (/keywords|बीज\s*शब्द/i.test(line)) currentSection = 'keywords';
        else currentSection = 'abstract_english';
      } else {
        abstract_hindi += line + '\n';
      }
    } else if (currentSection === 'abstract_english') {
      if (/keywords|बीज\s*शब्द/i.test(line)) {
        currentSection = 'keywords';
      } else {
        abstract_english += line + '\n';
      }
    } else if (currentSection === 'keywords') {
      line.split(/[,;|\/]/).forEach(k => {
        const cleanK = k.trim().replace(/^['"\[]+|['"\]]+$/g, '');
        if (cleanK) keywordsSet.add(cleanK);
      });
    } else if (currentSection === 'intro') {
      introLines.push(line);
    } else if (currentSection === 'literature') {
      litLines.push(line);
    } else if (currentSection === 'methodology') {
      methLines.push(line);
    } else if (currentSection === 'results') {
      resLines.push(line);
    } else if (currentSection === 'conclusion') {
      concLines.push(line);
    } else if (currentSection === 'ack') {
      ackLines.push(line);
    } else if (currentSection === 'conflict') {
      conflictLines.push(line);
    } else if (currentSection === 'references') {
      rawRefLines.push(line);
    } else if (currentSection === 'custom' && currentCustomSection) {
      currentCustomSection.lines.push(line);
    }
  }

  // Push final custom section if active
  if (currentCustomSection) {
    customSections.push({
      id: 'sec_' + Date.now() + Math.random().toString(36).substring(2, 6),
      type: 'subheading_h3',
      title: currentCustomSection.title,
      content: currentCustomSection.lines.join('\n\n')
    });
  }

  // Final clean-up of extracted fields
  title_hindi = title_hindi.trim();
  title_english = title_english.trim();
  abstract_hindi = abstract_hindi.trim();
  abstract_english = abstract_english.trim();

  // If only one abstract was found, assign to appropriate or both
  if (abstract_hindi && !abstract_english && !/[\u0900-\u097F]/.test(abstract_hindi)) {
    abstract_english = abstract_hindi;
    abstract_hindi = '';
  }

  const keywords = Array.from(keywordsSet);

  // Clean References array (split into distinct clean entries)
  const cleanReferences: string[] = [];
  rawRefLines.forEach(refLine => {
    const trimmed = refLine.trim();
    if (trimmed.length > 5 && !/^(references|bibliography|साहित्य\s*सूची|संदर्भ\s*ग्रंथ\s*सूची)/i.test(trimmed)) {
      cleanReferences.push(trimmed);
    }
  });

  // Ensure default author if none detected
  if (authors.length === 0) {
    authors.push({
      name: 'शोधार्थी / लेखक',
      affiliation: 'पवारी भाषा व संस्कृति अध्ययन केंद्र',
      email: '',
      orcid: '',
      is_corresponding: true
    });
  }

  // Extract all embedded images in cleanHtml into custom_sections as figure blocks
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined' && cleanHtml) {
    try {
      const doc = new DOMParser().parseFromString(cleanHtml, 'text/html');
      const imgs = doc.querySelectorAll('img');
      let extractedCount = 0;
      imgs.forEach((img, idx) => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('data:image/') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:'))) {
          extractedCount++;
          const exists = customSections.some(s => s.type === 'figure' && s.image_url === src);
          if (!exists) {
            customSections.push({
              id: 'cs_fig_' + Date.now() + '_' + idx,
              type: 'figure',
              title: `Figure ${idx + 1}`,
              content: img.getAttribute('alt') || `Extracted Figure ${idx + 1} from Word Document`,
              caption: img.getAttribute('alt') || `Figure ${idx + 1}`,
              image_url: src,
              figure_number: idx + 1,
              placement: 'in_body',
              parent_section: 'intro'
            });
          }
        }
      });
      if (extractedCount > 0) {
        detectionSummary.push(`✓ ${extractedCount} Word Document Image(s) / Figure(s) preserved & extracted`);
      }
    } catch (e) {
      console.warn('Error extracting images from HTML:', e);
    }
  }

  // Detection Summary construction
  if (title_hindi || title_english) {
    detectionSummary.push(`✓ Article Title detected (${title_hindi ? 'Hindi' : ''} ${title_english ? 'English' : ''})`);
  }
  if (authors.length > 0) {
    detectionSummary.push(`✓ ${authors.length} Author(s) recognized with affiliations/contact`);
  }
  if (abstract_hindi || abstract_english) {
    detectionSummary.push(`✓ Abstract recognized (${abstract_hindi ? 'Hindi ' : ''}${abstract_english ? 'English' : ''})`);
  }
  if (keywords.length > 0) {
    detectionSummary.push(`✓ ${keywords.length} Keyword(s) extracted`);
  }

  const structuredSectionsFound = [
    introLines.length > 0 ? 'Introduction' : null,
    litLines.length > 0 ? 'Literature Review' : null,
    methLines.length > 0 ? 'Methodology' : null,
    resLines.length > 0 ? 'Results & Discussion' : null,
    concLines.length > 0 ? 'Conclusion' : null,
    ackLines.length > 0 ? 'Acknowledgement' : null
  ].filter(Boolean);

  if (structuredSectionsFound.length > 0) {
    detectionSummary.push(`✓ Core Journal Sections recognized: ${structuredSectionsFound.join(', ')}`);
  }

  if (customSections.length > 0) {
    detectionSummary.push(`✓ ${customSections.length} Sub-heading block(s) structured`);
  }

  if (cleanReferences.length > 0) {
    detectionSummary.push(`✓ ${cleanReferences.length} Reference entry(s) parsed`);
  }

  return {
    title_hindi,
    title_english,
    authors,
    abstract_hindi,
    abstract_english,
    keywords: keywords.length > 0 ? keywords : ['पवारी शोध', 'Linguistics'],
    full_text_introduction: introLines.join('\n\n').trim(),
    full_text_literature_review: litLines.join('\n\n').trim(),
    full_text_methodology: methLines.join('\n\n').trim(),
    full_text_results_discussion: resLines.join('\n\n').trim(),
    full_text_conclusion: concLines.join('\n\n').trim(),
    full_text_acknowledgement: ackLines.join('\n\n').trim(),
    full_text_conflict_of_interest: conflictLines.join('\n\n').trim() || 'लेखक घोषणा करते हैं कि इस शोध कार्य में किसी भी प्रकार का हित-संघर्ष नहीं है।',
    references: cleanReferences,
    custom_sections: customSections,
    detectionSummary,
    rawCleanHtml: cleanHtml
  };
}
