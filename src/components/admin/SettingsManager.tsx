import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { JournalSettings, ThemePreset } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { Settings, Save, CheckCircle2, Upload, Image as ImageIcon, Palette, Sparkles, Check } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { settings, saveSettings, uploadFileToStorage } = useCms();

  const [formSettings, setFormSettings] = useState<JournalSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [uploadingCopyright, setUploadingCopyright] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(formSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant FileReader local Data URL preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setFormSettings(prev => ({ ...prev, logo_url: dataUrl }));
      }
    };
    reader.readAsDataURL(file);

    setUploadingLogo(true);
    setLogoError(null);
    try {
      const res = await uploadFileToStorage(file, 'journal-assets/logos');
      if (res && res.url) {
        setFormSettings(prev => ({ ...prev, logo_url: res.url }));
      }
    } catch (err: any) {
      console.error('Logo upload failed:', err);
      // Even if cloud storage upload fails, local Data URL preview is maintained
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'manuscript' | 'copyright') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === 'manuscript') setUploadingTemplate(true);
    else setUploadingCopyright(true);
    setTemplateError(null);
    try {
      const res = await uploadFileToStorage(file, 'journal-assets/templates');
      if (field === 'manuscript') {
        setFormSettings(prev => ({
          ...prev,
          manuscript_template_url: res.url,
          manuscript_template_name: file.name
        }));
      } else {
        setFormSettings(prev => ({
          ...prev,
          copyright_form_url: res.url,
          copyright_form_name: file.name
        }));
      }
    } catch (err: any) {
      console.error('Template upload failed:', err);
      setTemplateError(err?.message || 'File upload failed');
    } finally {
      if (field === 'manuscript') setUploadingTemplate(false);
      else setUploadingCopyright(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Journal Global Settings CMS</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Configure ISSNs, bilingual titles, contact info, footer, and navigation labels</p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Journal Settings</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Global journal settings saved to Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-2xs space-y-6 text-xs sm:text-sm">
        
        {/* Titles Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2">Journal Titles & Subtitles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Journal Title (Hindi)</label>
              <input type="text" value={formSettings.journal_title_hindi} onChange={e => setFormSettings({ ...formSettings, journal_title_hindi: e.target.value })} className="w-full p-2.5 border rounded-lg font-serif font-bold text-slate-900" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Journal Title (English)</label>
              <input type="text" value={formSettings.journal_title_english} onChange={e => setFormSettings({ ...formSettings, journal_title_english: e.target.value })} className="w-full p-2.5 border rounded-lg font-serif font-bold text-slate-900" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subtitle (Hindi)</label>
              <input type="text" value={formSettings.subtitle_hindi} onChange={e => setFormSettings({ ...formSettings, subtitle_hindi: e.target.value })} className="w-full p-2.5 border rounded-lg text-slate-800" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subtitle (English)</label>
              <input type="text" value={formSettings.subtitle_english} onChange={e => setFormSettings({ ...formSettings, subtitle_english: e.target.value })} className="w-full p-2.5 border rounded-lg text-slate-800" />
            </div>

            <div className="md:col-span-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-2">
              <label className="block font-bold text-slate-800 text-xs">Journal Logo Asset (Storage Folder: journal-assets/logos/)</label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {formSettings.logo_url && (
                  <div className="w-16 h-16 rounded-xl border border-amber-900/20 bg-white p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    <SafeImage src={formSettings.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={formSettings.logo_url || ''}
                    onChange={e => setFormSettings({ ...formSettings, logo_url: e.target.value })}
                    placeholder="https://... or upload new logo image"
                    className="w-full p-2 border rounded-lg text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500">Provide direct image URL or upload image file directly to Firebase Storage.</p>
                  {logoError && <p className="text-[11px] text-red-600 font-bold font-mono">{logoError}</p>}
                </div>
                <label className="cursor-pointer px-3.5 py-2 bg-amber-900 hover:bg-amber-950 text-amber-100 font-bold text-xs rounded-xl transition shadow-2xs flex items-center space-x-1.5 shrink-0 self-start sm:self-auto">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ISSN & Publisher */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2">ISSN Identifiers & Publisher</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ISSN (Online)</label>
              <input type="text" value={formSettings.issn_online} onChange={e => setFormSettings({ ...formSettings, issn_online: e.target.value })} className="w-full p-2.5 border rounded-lg font-mono font-bold" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ISSN (Print)</label>
              <input type="text" value={formSettings.issn_print} onChange={e => setFormSettings({ ...formSettings, issn_print: e.target.value })} className="w-full p-2.5 border rounded-lg font-mono font-bold" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Publisher (Hindi)</label>
              <input type="text" value={formSettings.publisher_hindi} onChange={e => setFormSettings({ ...formSettings, publisher_hindi: e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Publisher (English)</label>
              <input type="text" value={formSettings.publisher_english} onChange={e => setFormSettings({ ...formSettings, publisher_english: e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2">Editorial Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
              <input type="email" value={formSettings.contact_email} onChange={e => setFormSettings({ ...formSettings, contact_email: e.target.value })} className="w-full p-2.5 border rounded-lg font-mono" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input type="text" value={formSettings.contact_phone} onChange={e => setFormSettings({ ...formSettings, contact_phone: e.target.value })} className="w-full p-2.5 border rounded-lg font-mono" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address (Hindi)</label>
              <input type="text" value={formSettings.contact_address_hindi} onChange={e => setFormSettings({ ...formSettings, contact_address_hindi: e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address (English)</label>
              <input type="text" value={formSettings.contact_address_english} onChange={e => setFormSettings({ ...formSettings, contact_address_english: e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Journal Badges & Indexing Settings */}
        <div className="space-y-4 bg-slate-900 text-slate-100 p-5 rounded-2xl border border-amber-500/30 shadow-md">
          <div className="border-b border-amber-500/30 pb-3">
            <h2 className="text-sm font-serif font-bold text-amber-400 uppercase flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Journal Academic Recognition & Indexing Badges (अकादमिक मान्यता एवं इंडेक्सिंग)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Edit peer review statements, open access declarations, and repository badges displayed across the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-800">
            <div>
              <label className="block font-bold text-amber-200 text-xs mb-1">Journal Access & Type Label</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.impact_factor_label ?? 'Peer-Reviewed & Open Access Journal'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, impact_factor_label: e.target.value }
                })}
                placeholder="e.g. Peer-Reviewed & Open Access Journal"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-amber-100 rounded-lg text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-amber-200 text-xs mb-1">Journal Language Model</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.impact_factor_value ?? 'Bilingual'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, impact_factor_value: e.target.value }
                })}
                placeholder="e.g. Bilingual"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-amber-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-300 text-xs mb-1">Peer Review Status Text</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.peer_review_text ?? 'Refereed & Double-Blind Peer Reviewed'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, peer_review_text: e.target.value }
                })}
                placeholder="e.g. Refereed & Double-Blind Peer Reviewed"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-emerald-200 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 text-xs mb-1">Indexing Badge 1</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.indexing_badge_1 ?? 'Google Scholar'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, indexing_badge_1: e.target.value }
                })}
                placeholder="e.g. Google Scholar"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 text-xs mb-1">Indexing Badge 2</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.indexing_badge_2 ?? 'Zenodo'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, indexing_badge_2: e.target.value }
                })}
                placeholder="e.g. Zenodo"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-sky-300 text-xs mb-1">Indexing Badge 3 (DOI / Indexing)</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.indexing_badge_3 ?? 'Crossref DOI Registered'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, indexing_badge_3: e.target.value }
                })}
                placeholder="e.g. Crossref DOI Registered"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-sky-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-purple-300 text-xs mb-1">Indexing Badge 4 (Access Policy)</label>
              <input
                type="text"
                value={formSettings.journal_metrics?.indexing_badge_4 ?? 'Gold Open Access (CC BY 4.0)'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  journal_metrics: { ...formSettings.journal_metrics, indexing_badge_4: e.target.value }
                })}
                placeholder="e.g. Gold Open Access (CC BY 4.0)"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-purple-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Call for Papers 2026 Announcement Banner Settings */}
        <div className="space-y-4 bg-amber-50/40 p-5 rounded-2xl border border-amber-300/60 shadow-2xs">
          <div className="flex items-center justify-between border-b border-amber-300/60 pb-3">
            <div>
              <h2 className="text-sm font-serif font-bold text-red-950 uppercase flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Call for Papers / Submission Banner Settings (शोध पत्र आमंत्रण विवरण)</span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Customize Call for Papers 2026 badge title, Hindi/English invitation text, review process/APC info, deadline date, and target volume/issue shown on homepage CTA box.
              </p>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
              <input
                type="checkbox"
                checked={formSettings.call_for_papers?.is_active !== false}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: {
                    ...formSettings.call_for_papers,
                    is_active: e.target.checked
                  }
                })}
                className="w-4 h-4 rounded text-red-900 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Show Banner</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Badge Title (English)</label>
              <input
                type="text"
                value={formSettings.call_for_papers?.title_badge_english ?? 'Call for Papers 2026'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, title_badge_english: e.target.value }
                })}
                placeholder="e.g. Call for Papers 2026"
                className="w-full p-2.5 bg-white border rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Badge Title (Hindi)</label>
              <input
                type="text"
                value={formSettings.call_for_papers?.title_badge_hindi ?? 'शोध पत्र आमंत्रण 2026'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, title_badge_hindi: e.target.value }
                })}
                placeholder="e.g. शोध पत्र आमंत्रण 2026"
                className="w-full p-2.5 bg-white border rounded-lg font-serif font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Heading (English)</label>
              <input
                type="text"
                value={formSettings.call_for_papers?.heading_english ?? 'Submit Manuscript for Next Issue'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, heading_english: e.target.value }
                })}
                placeholder="e.g. Submit Manuscript for Next Issue"
                className="w-full p-2.5 bg-white border rounded-lg font-serif font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Heading (Hindi / शोध पत्र सबमिशन हेतु आमंत्रण)</label>
              <input
                type="text"
                value={formSettings.call_for_papers?.heading_hindi ?? 'शोध पत्र सबमिशन हेतु आमंत्रण'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, heading_hindi: e.target.value }
                })}
                placeholder="e.g. शोध पत्र सबमिशन हेतु आमंत्रण"
                className="w-full p-2.5 bg-white border rounded-lg font-serif font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Description & APC Notice (English)</label>
              <textarea
                rows={2}
                value={formSettings.call_for_papers?.description_english ?? 'Fast-Track 14-day double blind peer review process. Zero Article Processing Charge (APC) option available.'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, description_english: e.target.value }
                })}
                placeholder="e.g. Fast-Track 14-day double blind peer review process..."
                className="w-full p-2.5 bg-white border rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Description & APC Notice (Hindi)</label>
              <textarea
                rows={2}
                value={formSettings.call_for_papers?.description_hindi ?? 'त्वरित 14-दिवसीय डबल ब्लाइंड पीर-रिव्यू प्रक्रिया। शून्य लेख प्रसंस्करण शुल्क (APC) विकल्प उपलब्ध।'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, description_hindi: e.target.value }
                })}
                placeholder="e.g. त्वरित 14-दिवसीय डबल ब्लाइंड पीर-रiv्यू प्रक्रिया..."
                className="w-full p-2.5 bg-white border rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Submission Deadline</label>
              <input
                type="text"
                value={formSettings.call_for_papers?.deadline_date ?? '15th September'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, deadline_date: e.target.value }
                })}
                placeholder="e.g. 15th September"
                className="w-full p-2.5 bg-white border rounded-lg font-mono font-bold text-red-950"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Target Publication Issue</label>
              <input
                type="text"
                value={formSettings.call_for_papers?.target_volume_issue ?? 'Vol. 4 Issue 2'}
                onChange={e => setFormSettings({
                  ...formSettings,
                  call_for_papers: { ...formSettings.call_for_papers, target_volume_issue: e.target.value }
                })}
                placeholder="e.g. Vol. 4 Issue 2"
                className="w-full p-2.5 bg-white border rounded-lg font-mono font-bold text-red-950"
              />
            </div>
          </div>
        </div>

        {/* Downloadable Author Templates (पांडुलिपि एवं कॉपीराइट फॉर्म) */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2 flex items-center justify-between">
            <span>Author Templates & Downloads (पांडुलिपि एवं कॉपीराइट फॉर्म)</span>
            <span className="text-xs font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Saved to Firestore Storage</span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload Word (.docx/.doc) or PDF templates for manuscript writing and signed copyright declarations. These files will be directly downloadable by authors on the public website.
          </p>

          {templateError && (
            <p className="p-2.5 bg-red-50 text-red-800 font-bold font-mono text-xs rounded-lg border border-red-200">
              {templateError}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Manuscript Template Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="block font-serif font-bold text-slate-900 text-xs">
                  1. पांडुलिपि टेम्पलेट (Manuscript Template - DOCX / PDF)
                </label>
                <p className="text-[11px] text-slate-500">मानक प्रारूप में शोध पत्र लिखने हेतु (Standard paper formatting template)</p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={formSettings.manuscript_template_url || ''}
                  onChange={e => setFormSettings({ ...formSettings, manuscript_template_url: e.target.value })}
                  placeholder="Storage URL or upload file..."
                  className="w-full p-2 bg-white border rounded-lg text-xs font-mono"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                    {formSettings.manuscript_template_name || (formSettings.manuscript_template_url ? 'Template Uploaded' : 'No file attached')}
                  </span>

                  <label className="cursor-pointer px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-amber-100 font-bold text-xs rounded-lg transition shadow-2xs flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingTemplate ? 'Uploading...' : 'Upload DOCX/PDF'}</span>
                    <input 
                      type="file" 
                      accept=".docx,.doc,.pdf" 
                      onChange={e => handleTemplateUpload(e, 'manuscript')} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Copyright & Declaration Form Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="block font-serif font-bold text-slate-900 text-xs">
                  2. कॉपीराइट एवं स्वघोषणा पत्र (Copyright & Declaration Form - PDF / DOCX)
                </label>
                <p className="text-[11px] text-slate-500">हस्ताक्षरित स्वघोषणा पत्र अनिवार्य (Signed declaration form)</p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={formSettings.copyright_form_url || ''}
                  onChange={e => setFormSettings({ ...formSettings, copyright_form_url: e.target.value })}
                  placeholder="Storage URL or upload file..."
                  className="w-full p-2 bg-white border rounded-lg text-xs font-mono"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                    {formSettings.copyright_form_name || (formSettings.copyright_form_url ? 'Form Uploaded' : 'No file attached')}
                  </span>

                  <label className="cursor-pointer px-3 py-1.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-lg transition shadow-2xs flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCopyright ? 'Uploading...' : 'Upload PDF/DOCX'}</span>
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.doc" 
                      onChange={e => handleTemplateUpload(e, 'copyright')} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Color Theme Selector Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 border-b pb-2">
            <Palette className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wide">
              Website Theme & Color Palette (वेबसाइट थीम एवं रंग कस्टमाइजेशन)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Select a color theme for the journal layout. This updates header banners, buttons, cards, and accent highlights across the entire public portal and CMS.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* Maroon Gold */}
            <div
              onClick={() => setFormSettings({
                ...formSettings,
                theme_preset: 'maroon_gold',
                primary_color: '#420708',
                secondary_color: '#7f1d1d',
                accent_color: '#d97706'
              })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                (formSettings.theme_preset || 'maroon_gold') === 'maroon_gold'
                  ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-xs">Royal Crimson & Gold</span>
                {(formSettings.theme_preset || 'maroon_gold') === 'maroon_gold' && (
                  <Check className="w-4 h-4 text-amber-600 font-bold" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#420708] border border-amber-400 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#7f1d1d] border border-slate-200 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#d97706] border border-slate-200 shadow-2xs"></div>
                <span className="text-[10px] text-slate-500 font-mono">Traditional Academic</span>
              </div>
            </div>

            {/* Academic Navy */}
            <div
              onClick={() => setFormSettings({
                ...formSettings,
                theme_preset: 'academic_navy',
                primary_color: '#0f172a',
                secondary_color: '#1e3a8a',
                accent_color: '#0284c7'
              })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                formSettings.theme_preset === 'academic_navy'
                  ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-xs">Oxford Navy & Sky Blue</span>
                {formSettings.theme_preset === 'academic_navy' && (
                  <Check className="w-4 h-4 text-sky-600 font-bold" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#0f172a] border border-sky-400 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#1e3a8a] border border-slate-200 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#0284c7] border border-slate-200 shadow-2xs"></div>
                <span className="text-[10px] text-slate-500 font-mono">International Standard</span>
              </div>
            </div>

            {/* Emerald Teal */}
            <div
              onClick={() => setFormSettings({
                ...formSettings,
                theme_preset: 'emerald_teal',
                primary_color: '#064e3b',
                secondary_color: '#0f766e',
                accent_color: '#0d9488'
              })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                formSettings.theme_preset === 'emerald_teal'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-xs">Imperial Emerald & Teal</span>
                {formSettings.theme_preset === 'emerald_teal' && (
                  <Check className="w-4 h-4 text-emerald-600 font-bold" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#064e3b] border border-emerald-400 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#0f766e] border border-slate-200 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#0d9488] border border-slate-200 shadow-2xs"></div>
                <span className="text-[10px] text-slate-500 font-mono">Rich Cultural Heritage</span>
              </div>
            </div>

            {/* Slate Classic */}
            <div
              onClick={() => setFormSettings({
                ...formSettings,
                theme_preset: 'slate_classic',
                primary_color: '#18181b',
                secondary_color: '#27272a',
                accent_color: '#dc2626'
              })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                formSettings.theme_preset === 'slate_classic'
                  ? 'border-zinc-800 bg-zinc-100/80 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-xs">Modern Slate & Crimson</span>
                {formSettings.theme_preset === 'slate_classic' && (
                  <Check className="w-4 h-4 text-zinc-900 font-bold" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#18181b] border border-zinc-400 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#27272a] border border-slate-200 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#dc2626] border border-slate-200 shadow-2xs"></div>
                <span className="text-[10px] text-slate-500 font-mono">Clean Modern Minimal</span>
              </div>
            </div>

            {/* Burgundy Wine */}
            <div
              onClick={() => setFormSettings({
                ...formSettings,
                theme_preset: 'burgundy_wine',
                primary_color: '#4c0519',
                secondary_color: '#831843',
                accent_color: '#e11d48'
              })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                formSettings.theme_preset === 'burgundy_wine'
                  ? 'border-rose-600 bg-rose-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-xs">Editorial Burgundy & Wine</span>
                {formSettings.theme_preset === 'burgundy_wine' && (
                  <Check className="w-4 h-4 text-rose-600 font-bold" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#4c0519] border border-rose-400 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#831843] border border-slate-200 shadow-2xs"></div>
                <div className="w-6 h-6 rounded-full bg-[#e11d48] border border-slate-200 shadow-2xs"></div>
                <span className="text-[10px] text-slate-500 font-mono">Literary & Humanities</span>
              </div>
            </div>

            {/* Custom Theme */}
            <div
              onClick={() => setFormSettings({
                ...formSettings,
                theme_preset: 'custom'
              })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                formSettings.theme_preset === 'custom'
                  ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-xs">Custom Hex Theme Palette</span>
                {formSettings.theme_preset === 'custom' && (
                  <Check className="w-4 h-4 text-purple-600 font-bold" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: formSettings.primary_color || '#1e1b4b' }}></div>
                <div className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: formSettings.secondary_color || '#3730a3' }}></div>
                <div className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: formSettings.accent_color || '#e0e7ff' }}></div>
                <span className="text-[10px] text-slate-500 font-mono">Personalized Hex</span>
              </div>
            </div>

          </div>

          {/* Custom Hex Inputs when Custom is selected */}
          {formSettings.theme_preset === 'custom' && (
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Color (Hex)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formSettings.primary_color || '#420708'}
                    onChange={e => setFormSettings({ ...formSettings, primary_color: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formSettings.primary_color || '#420708'}
                    onChange={e => setFormSettings({ ...formSettings, primary_color: e.target.value })}
                    className="flex-1 p-2 border rounded font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Color (Hex)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formSettings.secondary_color || '#7f1d1d'}
                    onChange={e => setFormSettings({ ...formSettings, secondary_color: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formSettings.secondary_color || '#7f1d1d'}
                    onChange={e => setFormSettings({ ...formSettings, secondary_color: e.target.value })}
                    className="flex-1 p-2 border rounded font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accent Highlight Color (Hex)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formSettings.accent_color || '#d97706'}
                    onChange={e => setFormSettings({ ...formSettings, accent_color: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formSettings.accent_color || '#d97706'}
                    onChange={e => setFormSettings({ ...formSettings, accent_color: e.target.value })}
                    className="flex-1 p-2 border rounded font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2">Footer Copyright Statements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Footer Text (Hindi)</label>
              <textarea rows={2} value={formSettings.footer_text_hindi} onChange={e => setFormSettings({ ...formSettings, footer_text_hindi: e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Footer Text (English)</label>
              <textarea rows={2} value={formSettings.footer_text_english} onChange={e => setFormSettings({ ...formSettings, footer_text_english: e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
