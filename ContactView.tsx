import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { lang, settings, submitContactMessage } = useCms();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSubmitting(true);
    await submitContactMessage(form);
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-10 shadow-md border border-amber-500/30">
        <h1 className="text-3xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'संपादकीय कार्यालय संपर्क' : 'Contact Editorial Office'}
        </h1>
        <p className="text-sm text-amber-200/80 mt-2">
          {lang === 'hi' 
            ? 'शोध पत्र प्रस्तुति, पत्रिका वितरण एवं अकादमिक पूछताछ हेतु हमसे संपर्क करें।'
            : 'Get in touch for paper submissions, journal subscriptions, or academic inquiries.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info */}
        <div className="bg-white border border-amber-900/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-serif font-bold text-red-950 border-b border-amber-900/10 pb-3">
            {lang === 'hi' ? 'कार्यालय विवरण' : 'Editorial Office Address'}
          </h2>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500/10 text-red-900 rounded-xl border border-amber-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs uppercase text-slate-400 font-mono">
                  {lang === 'hi' ? 'स्थान' : 'Address'}
                </strong>
                <p className="font-medium mt-0.5">
                  {lang === 'hi' ? settings.contact_address_hindi : settings.contact_address_english}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500/10 text-red-900 rounded-xl border border-amber-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs uppercase text-slate-400 font-mono">
                  {lang === 'hi' ? 'ईमेल' : 'Email Inquiry'}
                </strong>
                <a href={`mailto:${settings.contact_email}`} className="font-semibold text-red-900 hover:underline">
                  {settings.contact_email}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500/10 text-red-900 rounded-xl border border-amber-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs uppercase text-slate-400 font-mono">
                  {lang === 'hi' ? 'दूरभाष' : 'Phone'}
                </strong>
                <p className="font-medium text-slate-900">
                  {settings.contact_phone}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500/10 text-red-900 rounded-xl border border-amber-500/20">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs uppercase text-slate-400 font-mono">
                  {lang === 'hi' ? 'प्रकाशक' : 'Publisher'}
                </strong>
                <p className="font-medium text-slate-900">
                  {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-amber-900/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-serif font-bold text-red-950 border-b border-amber-900/10 pb-3">
            {lang === 'hi' ? 'संदेश भेजें' : 'Send Message'}
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
              <h3 className="font-serif font-bold text-lg">{lang === 'hi' ? 'संदेश सफलतापूर्वक भेजा गया' : 'Message Sent Successfully'}</h3>
              <p className="text-xs text-emerald-700">{lang === 'hi' ? 'संपादकीय मंडल शीघ्र ही आपसे संपर्क करेगा।' : 'Our editorial team will get back to you shortly.'}</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-900 underline"
              >
                {lang === 'hi' ? 'दूसरा संदेश भेजें' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">{lang === 'hi' ? 'पूरा नाम' : 'Full Name'} *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. Rameshwar Pawar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{lang === 'hi' ? 'ईमेल पता' : 'Email Address'} *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. author@example.org"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{lang === 'hi' ? 'विषय (Subject)' : 'Subject'}</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Paper Status Inquiry"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{lang === 'hi' ? 'संदेश' : 'Message'} *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'भेजा जा रहा है...' : (lang === 'hi' ? 'संदेश प्रेषित करें' : 'Submit Inquiry')}</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
