import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { HomepageSection } from '../../types';
import { Layers, Eye, EyeOff, MoveUp, MoveDown, Save, CheckCircle2 } from 'lucide-react';

export const SectionManager: React.FC = () => {
  const { settings, saveSettings } = useCms();

  const [sections, setSections] = useState<HomepageSection[]>(
    [...(settings.homepage_sections || [])].sort((a, b) => a.order - b.order)
  );
  const [saved, setSaved] = useState(false);

  const toggleVisibility = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // update order numbers
    updated.forEach((s, idx) => { s.order = idx + 1; });
    setSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updated.forEach((s, idx) => { s.order = idx + 1; });
    setSections(updated);
  };

  const handleSave = async () => {
    const newSettings = { ...settings, homepage_sections: sections };
    await saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Homepage Section Manager</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Control homepage layout structure, show/hide blocks, and reorder display sequence</p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Section Order</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Homepage layout configuration updated!</span>
        </div>
      )}

      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs p-6 space-y-3">
        {sections.map((sec, index) => (
          <div
            key={sec.id}
            className={`p-4 rounded-xl border flex items-center justify-between transition ${
              sec.visible ? 'bg-amber-50/40 border-amber-900/20' : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-red-950 font-mono font-bold text-xs flex items-center justify-center">
                #{sec.order}
              </span>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-sm">
                  {sec.title_hindi} ({sec.title_english})
                </h3>
                <p className="text-[11px] font-mono text-slate-500 uppercase">{sec.key}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Order Buttons */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                  title="Move Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === sections.length - 1}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                  title="Move Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
              </div>

              {/* Show/Hide Toggle */}
              <button
                onClick={() => toggleVisibility(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                  sec.visible
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
