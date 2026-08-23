import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Quote, 
  Undo, 
  Redo, 
  Palette, 
  Highlighter, 
  Sparkles, 
  Search, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Code, 
  Superscript as SuperIcon, 
  Subscript as SubIcon, 
  Minus, 
  Maximize2, 
  Eye, 
  FileCheck,
  Grid,
  CornerDownRight,
  ChevronDown,
  Wand2
} from 'lucide-react';
import { cleanWordHtml } from '../../lib/wordParser';

interface SectionRichEditorProps {
  initialHtml: string;
  onChange: (html: string) => void;
  sectionTitle?: string;
  lang?: 'hi' | 'en';
  onJournalFormatApply?: () => void;
}

export const SectionRichEditor: React.FC<SectionRichEditorProps> = ({
  initialHtml,
  onChange,
  sectionTitle = 'अनुभाग पाठ (Section Content)',
  lang = 'hi',
  onJournalFormatApply
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState(initialHtml || '');
  const [pasteOption, setPasteOption] = useState<'original' | 'journal' | 'plain'>('original');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Modals & Popovers
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSpecialCharsModal, setShowSpecialCharsModal] = useState(false);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showWordPasteAlert, setShowWordPasteAlert] = useState(false);

  // Image Form State
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [imageAlign, setImageAlign] = useState<'left' | 'center' | 'right'>('center');
  const [imageWidth, setImageWidth] = useState<'25%' | '50%' | '75%' | '100%'>('100%');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Table Form State
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableCaption, setTableCaption] = useState('');
  const [tableHasHeader, setTableHasHeader] = useState(true);

  // Link Form State
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);

  // Find & Replace State
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [findCount, setFindCount] = useState<number | null>(null);

  // Synchronize initial content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialHtml) {
      editorRef.current.innerHTML = initialHtml || '';
      calculateCounts(initialHtml || '');
    }
  }, [initialHtml]);

  const calculateCounts = (html: string) => {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setHtmlContent(newHtml);
      calculateCounts(newHtml);
      onChange(newHtml);
    }
  };

  // Execute standard formatting commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  // Handle Paste from Word / Google Docs according to pasteOption
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const html = clipboardData.getData('text/html');
    const plainText = clipboardData.getData('text/plain');

    let processedHtml = '';

    if (html && (html.includes('urn:schemas-microsoft-com') || html.includes('MsoNormal') || html.includes('WordDocument') || html.includes('docs-internal-guid'))) {
      setShowWordPasteAlert(true);
    } else if (html) {
      setShowWordPasteAlert(true);
    }

    if (pasteOption === 'plain' || (!html && plainText)) {
      processedHtml = plainText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => `<p class="mb-3 leading-relaxed">${line}</p>`)
        .join('');
    } else if (html) {
      if (pasteOption === 'journal') {
        const cleaned = cleanWordHtml(html);
        processedHtml = `<div class="journal-formatted-section font-serif text-base leading-loose text-justify text-slate-900">${cleaned}</div>`;
      } else {
        // Keep Original Formatting
        processedHtml = cleanWordHtml(html);
      }
    }

    if (processedHtml) {
      document.execCommand('insertHTML', false, processedHtml);
      handleInput();
    }
  };

  // Drag & drop file directly into canvas
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert(lang === 'hi' ? 'केवल JPG, PNG, WEBP या SVG चित्र फ़ाइल अपलोड करें।' : 'Only JPG, PNG, WEBP, or SVG image files are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'hi' ? 'चित्र फ़ाइल का आकार 5 MB से कम होना चाहिए।' : 'Image file size must be less than 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Src = event.target?.result as string;
        const imgHtml = `<figure class="my-5 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center mx-auto block max-w-full">
          <img src="${base64Src}" alt="${file.name}" class="w-full h-auto rounded-xl shadow-xs object-cover" />
          <figcaption class="mt-2 text-xs font-serif font-medium text-slate-700">चित्र (Figure): ${file.name}</figcaption>
        </figure><p><br></p>`;
        execCmd('insertHTML', imgHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert Table into ContentEditable
  const insertTable = () => {
    if (tableRows <= 0 || tableCols <= 0) return;

    let tableHtml = `<div class="overflow-x-auto my-4 border border-slate-300 rounded-xl shadow-2xs bg-white p-2">`;
    if (tableCaption) {
      tableHtml += `<p class="text-xs font-bold text-center text-slate-700 py-1 font-serif bg-amber-50 rounded-t-lg border-b border-amber-200">तालिका / Table: ${tableCaption}</p>`;
    }
    tableHtml += `<table class="w-full text-xs text-left border-collapse border border-slate-300 my-1">`;

    if (tableHasHeader) {
      tableHtml += `<thead class="bg-amber-100/80 font-serif font-bold text-slate-900"><tr>`;
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<th class="border border-slate-300 p-2.5">शीर्षक ${c + 1}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    const startRow = tableHasHeader ? 1 : 0;
    for (let r = startRow; r < tableRows; r++) {
      tableHtml += `<tr class="hover:bg-slate-50 transition-colors">`;
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<td class="border border-slate-300 p-2 text-slate-800">डेटा ${r + 1}.${c + 1}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    execCmd('insertHTML', tableHtml);
    setShowTableModal(false);
    setTableCaption('');
  };

  // Insert Image into ContentEditable
  const handleImageInsert = () => {
    if (!imageUrl && !imageFile) return;

    let finalSrc = imageUrl;

    const processInsert = (src: string) => {
      const alignClass = imageAlign === 'center' ? 'mx-auto block' : imageAlign === 'right' ? 'ml-auto block' : 'mr-auto block';
      let imgHtml = `<figure class="my-5 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center ${alignClass}" style="max-width: ${imageWidth};">`;
      imgHtml += `<img src="${src}" alt="${imageAlt || 'Article Figure'}" class="w-full h-auto rounded-xl shadow-xs object-cover" />`;
      if (imageCaption || imageCredit) {
        imgHtml += `<figcaption class="mt-2 text-xs font-serif font-medium text-slate-700">`;
        if (imageCaption) imgHtml += `<span class="font-bold text-slate-900">चित्र (Figure):</span> ${imageCaption} `;
        if (imageCredit) imgHtml += `<span class="text-slate-500 italic">(${imageCredit})</span>`;
        imgHtml += `</figcaption>`;
      }
      imgHtml += `</figure><p><br></p>`;

      execCmd('insertHTML', imgHtml);
      setShowImageModal(false);
      setImageUrl('');
      setImageCaption('');
      setImageAlt('');
      setImageCredit('');
      setImageFile(null);
    };

    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        setImageError(lang === 'hi' ? 'चित्र का आकार 5 MB से कम होना चाहिए।' : 'Image size must be less than 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Src = e.target?.result as string;
        processInsert(base64Src);
      };
      reader.readAsDataURL(imageFile);
    } else {
      processInsert(finalSrc);
    }
  };

  // Insert Link
  const handleLinkInsert = () => {
    if (!linkUrl) return;
    const target = linkTargetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
    const text = linkText || linkUrl;
    const linkHtml = `<a href="${linkUrl}"${target} class="text-amber-800 underline font-semibold hover:text-amber-950">${text}</a>`;
    execCmd('insertHTML', linkHtml);
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Apply Journal Formatting Action
  const applyJournalFormatting = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const cleaned = cleanWordHtml(currentHtml);
      const journalFormatted = `<div class="journal-standard-article font-serif text-base leading-relaxed text-justify text-slate-900 space-y-4 font-normal">${cleaned}</div>`;
      editorRef.current.innerHTML = journalFormatted;
      handleInput();
      if (onJournalFormatApply) onJournalFormatApply();
    }
  };

  // Find and Replace
  const handleFindReplace = () => {
    if (!findQuery || !editorRef.current) return;
    const current = editorRef.current.innerHTML;
    const regex = new RegExp(findQuery, 'gi');
    const matches = current.match(regex);
    setFindCount(matches ? matches.length : 0);

    if (replaceQuery && matches) {
      const updated = current.replace(regex, replaceQuery);
      editorRef.current.innerHTML = updated;
      handleInput();
    }
  };

  // Insert Special Symbol
  const insertSymbol = (symbol: string) => {
    execCmd('insertHTML', symbol);
    setShowSpecialCharsModal(false);
  };

  const specialCharsList = [
    '।', '॥', '₹', '©', '®', '™', '§', '¶', '°', '±', 'µ', 'α', 'β', 'γ', 'δ', 'π', 'Ω',
    '½', '⅓', '⅔', '¼', '¾', '•', '—', '–', '“', '”', '‘', '’', '«', '»', '≤', '≥', '≠', '≈', '∞'
  ];

  const colorsList = [
    '#000000', '#1e293b', '#78350f', '#991b1b', '#065f46', '#1e40af', '#6b21a8', '#374151',
    '#b45309', '#dc2626', '#047857', '#2563eb', '#9333ea', '#64748b'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden flex flex-col my-3">
      {/* Top Header & Formatting Option Selector */}
      <div className="bg-slate-900 text-white p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-amber-400" />
          <span className="font-serif font-bold text-sm text-amber-100">{sectionTitle}</span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono">
            {wordCount} {lang === 'hi' ? 'शब्द' : 'words'} | {charCount} {lang === 'hi' ? 'अक्षर' : 'chars'}
          </span>
        </div>

        {/* Word Paste & Journal Format Control */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 px-2 font-semibold">
              {lang === 'hi' ? 'पेस्ट शैली:' : 'Paste Style:'}
            </span>
            <button
              type="button"
              onClick={() => setPasteOption('original')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                pasteOption === 'original' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              {lang === 'hi' ? 'मूल फ़ॉर्मेटिंग' : 'Keep Original'}
            </button>
            <button
              type="button"
              onClick={() => setPasteOption('journal')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                pasteOption === 'journal' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              {lang === 'hi' ? 'जर्नल शैली' : 'Journal Style'}
            </button>
            <button
              type="button"
              onClick={() => setPasteOption('plain')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                pasteOption === 'plain' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              {lang === 'hi' ? 'सादा पाठ' : 'Plain Text'}
            </button>
          </div>

          <button
            type="button"
            onClick={applyJournalFormatting}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Apply Standard Journal Typography & Margins"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{lang === 'hi' ? 'पत्रिका प्रारूप लागू करें' : 'Apply Journal Formatting'}</span>
          </button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1.5 text-slate-700">
        {/* Undo / Redo */}
        <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Headings / Block Dropdown */}
        <select
          onChange={(e) => execCmd('formatBlock', e.target.value)}
          className="bg-white border border-slate-300 rounded-lg text-xs font-semibold p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          defaultValue="p"
        >
          <option value="p">Paragraph (सामान्य पैरा)</option>
          <option value="h2">Heading 1 (मुख्य हेडिंग - H2)</option>
          <option value="h3">Heading 2 (उप-शीर्षक - H3)</option>
          <option value="h4">Heading 3 (सहायक शीर्षक - H4)</option>
          <option value="blockquote">Blockquote (उद्धरण बॉक्स)</option>
        </select>

        {/* Font Family */}
        <select
          onChange={(e) => execCmd('fontName', e.target.value)}
          className="bg-white border border-slate-300 rounded-lg text-xs font-semibold p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          defaultValue="Noto Serif Devanagari"
        >
          <option value="Noto Serif Devanagari">Noto Serif Devanagari (जर्नल मानकीकृत)</option>
          <option value="Mangal">Mangal (मंगल)</option>
          <option value="Georgia">Georgia (जॉर्जिया)</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="sans-serif">Sans-Serif</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => execCmd('fontSize', e.target.value)}
          className="bg-white border border-slate-300 rounded-lg text-xs font-semibold p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          defaultValue="3"
        >
          <option value="2">12px (छोटा पाठ)</option>
          <option value="3">14px (सामान्य पाठ)</option>
          <option value="4">16px (जर्नल मानक)</option>
          <option value="5">18px (बड़ा पाठ)</option>
          <option value="6">24px (हेडिंग)</option>
        </select>

        <div className="h-4 w-px bg-slate-300 my-auto"></div>

        {/* Basic Inline Styles */}
        <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-800 transition font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-800 transition italic"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-800 transition underline"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-800 transition line-through"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color & Highlight Color */}
        <div className="relative flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1.5 hover:bg-slate-100 rounded text-amber-900 transition flex items-center gap-1"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-9 left-0 z-20 bg-white border border-slate-300 p-2 rounded-xl shadow-lg grid grid-cols-7 gap-1">
              {colorsList.map((col) => (
                <button
                  key={col}
                  type="button"
                  style={{ backgroundColor: col }}
                  onClick={() => {
                    execCmd('foreColor', col);
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded hover:scale-110 transition border border-slate-200"
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className="p-1.5 hover:bg-slate-100 rounded text-amber-700 transition"
            title="Highlight Color"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-9 left-6 z-20 bg-white border border-slate-300 p-2 rounded-xl shadow-lg grid grid-cols-4 gap-1">
              {['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'].map((col) => (
                <button
                  key={col}
                  type="button"
                  style={{ backgroundColor: col }}
                  onClick={() => {
                    execCmd('hiliteColor', col);
                    setShowHighlightPicker(false);
                  }}
                  className="w-6 h-6 rounded hover:scale-110 transition border border-slate-300"
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-300 my-auto"></div>

        {/* Alignments */}
        <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Left Align"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Center Align"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Right Align"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Justify Align"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Indent */}
        <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Subscript / Superscript */}
        <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
          <button
            type="button"
            onClick={() => execCmd('subscript')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Subscript"
          >
            <SubIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('superscript')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition"
            title="Superscript"
          >
            <SuperIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-300 my-auto"></div>

        {/* Insert Media & Tools */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs"
          >
            <TableIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>+ Table</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>+ Figure</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="px-2 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 transition"
          >
            <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>Link</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSpecialCharsModal(true)}
            className="px-2 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition"
            title="Special Characters (चिह्न)"
          >
            Ω
          </button>

          <button
            type="button"
            onClick={() => setShowFindReplaceModal(true)}
            className="px-2 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 transition"
            title="Find & Replace"
          >
            <Search className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Word Formatting Detected Alert Banner */}
      {showWordPasteAlert && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold font-serif">
            <Wand2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lang === 'hi' ? 'MS Word फ़ॉर्मैटिंग का पता चला (Word formatting detected)' : 'Word formatting detected'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setPasteOption('original');
                setShowWordPasteAlert(false);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition ${pasteOption === 'original' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'}`}
            >
              Keep Original Formatting
            </button>
            <button
              type="button"
              onClick={() => {
                setPasteOption('journal');
                applyJournalFormatting();
                setShowWordPasteAlert(false);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition ${pasteOption === 'journal' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'}`}
            >
              Apply Journal Formatting
            </button>
            <button
              type="button"
              onClick={() => {
                setPasteOption('plain');
                setShowWordPasteAlert(false);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition ${pasteOption === 'plain' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'}`}
            >
              Paste as Plain Text
            </button>
            <button
              type="button"
              onClick={() => setShowWordPasteAlert(false)}
              className="p-1 text-amber-700 hover:text-amber-950"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Editable Area */}
      <div className="p-4 sm:p-6 bg-slate-50/50 min-h-[220px]">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="rich-editor-canvas bg-white border border-slate-200 rounded-xl p-5 min-h-[200px] outline-none font-serif text-base leading-relaxed text-slate-900 focus:ring-2 focus:ring-amber-500/40 shadow-inner"
          style={{ fontFamily: 'Noto Serif Devanagari, Georgia, serif' }}
        />
      </div>

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-amber-600" />
                <span>तालिका सम्मिलित करें (Insert Word Table)</span>
              </h3>
              <button onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पंक्तियाँ (Rows):</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">स्तंभ (Columns):</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">तालिका का शीर्षक (Table Caption):</label>
                <input
                  type="text"
                  value={tableCaption}
                  onChange={(e) => setTableCaption(e.target.value)}
                  placeholder="उदा. तालिका 1: Pawar Dialect Demographic Data"
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hasHeader"
                  checked={tableHasHeader}
                  onChange={(e) => setTableHasHeader(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="hasHeader" className="font-semibold text-slate-700">
                  प्रथम पंक्ति को हेडर (Header Row) बनाएं
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                तालिका जोड़ें (Insert Table)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <span>चित्र या आरेख जोड़ें (Insert Figure/Image)</span>
              </h3>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* File upload option */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">चित्र अपलोड करें (File Upload max 5MB):</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 bg-slate-50"
                />
              </div>

              <div className="text-center font-bold text-slate-400 uppercase tracking-widest text-[10px] my-1">- या फिर URL दर्ज करें -</div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">चित्र URL (Image Web URL):</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/figure.png"
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">चित्र कैप्शन (Figure Caption):</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="उदा. चित्र 1: पवार जनजाति ऐतिहासिक मानचित्र"
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">स्थान (Alignment):</label>
                  <select
                    value={imageAlign}
                    onChange={(e: any) => setImageAlign(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="center">बीच में (Center)</option>
                    <option value="left">बाईं ओर (Left)</option>
                    <option value="right">दाईं ओर (Right)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">चौड़ाई (Width):</label>
                  <select
                    value={imageWidth}
                    onChange={(e: any) => setImageWidth(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="100%">100% (पूरी चौड़ाई)</option>
                    <option value="75%">75% (मध्यम)</option>
                    <option value="50%">50% (आधा)</option>
                    <option value="25%">25% (छोटा)</option>
                  </select>
                </div>
              </div>

              {imageError && (
                <div className="p-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {imageError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleImageInsert}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                चित्र जोड़ें (Insert Figure)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-amber-600" />
                <span>हाइपरलिंक जोड़ें (Insert Link)</span>
              </h3>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">वेब यूआरएल (URL):</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://doi.org/10.5281/..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">लिंक टेक्स्ट (Link Text):</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="उदा. DOI / सन्दर्भ लिंक"
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleLinkInsert}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                लिंक जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Characters Modal */}
      {showSpecialCharsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-sm w-full p-5 space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <h3 className="font-serif font-bold text-sm text-slate-900">विशेष चिह्न (Special Symbols)</h3>
              <button onClick={() => setShowSpecialCharsModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2 text-center">
              {specialCharsList.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertSymbol(sym)}
                  className="p-2 border border-slate-200 rounded-lg text-base font-bold hover:bg-amber-100 text-slate-900 transition"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Find and Replace Modal */}
      {showFindReplaceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-5 space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                <span>खोजें एवं बदलें (Find & Replace)</span>
              </h3>
              <button onClick={() => setShowFindReplaceModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">खोजें (Find):</label>
                <input
                  type="text"
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  placeholder="शब्द खोजें..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">बदलें (Replace With):</label>
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="प्रतिस्थापित शब्द..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              {findCount !== null && (
                <p className="text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {findCount} बार शब्द पाया गया।
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleFindReplace}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                बदलें (Replace All)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
