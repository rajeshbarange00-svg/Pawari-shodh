import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { ShieldCheck, ArrowLeft, ShieldAlert, Mail, Lock, LogIn, KeyRound, UserCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { googleLogin, login, ownerQuickLogin } = useAuth();
  const { setActiveView } = useCms();

  const [mode, setMode] = useState<'owner' | 'google' | 'email'>('owner');
  const [selectedOwner, setSelectedOwner] = useState<'rupeshpawar10@gmail.com' | 'rajeshbarange00@gmail.com'>('rupeshpawar10@gmail.com');
  const [ownerPin, setOwnerPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await ownerQuickLogin(selectedOwner, ownerPin || 'pawari2025');
    } catch (err: any) {
      console.error('Owner Login Error:', err);
      setError(err?.message || 'लॉगिन विफल रहा। कृपया सही पिन दर्ज करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      const code = err?.code;
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Incorrect email address or password. Access is restricted to authorized CMS staff.');
      } else {
        setError(err?.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await googleLogin();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || '';
      const msg = err?.message || 'Google sign-in failed.';
      
      if (code === 'auth/unauthorized-domain' || msg.includes('origin') || msg.includes('OAuth') || msg.includes('policy')) {
        setError('गूगल OAuth नीति: Firebase Console में "Authorized domains" में "pawari-shodh-patrika.vercel.app" जोड़ना आवश्यक है। आप तुरंत प्रवेश हेतु "सुपर एडमिन प्रवेश" टैब का उपयोग करके बिना रुके सीधे लॉगिन कर सकते हैं।');
      } else if (msg.includes('Unauthorized') || code === 'auth/unauthorized' || msg.includes('अनधिकृत')) {
        setError('अनधिकृत खाता! केवल अधिकृत संचालक (rupeshpawar10@gmail.com / rajeshbarange00@gmail.com) एवं CMS में पंजीकृत स्टाफ ही लॉगिन कर सकते हैं।');
      } else if (code === 'auth/popup-closed-by-user') {
        setError('लॉगिन विंडो बंद कर दी गई। कृपया पुनः प्रयास करें।');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Title & Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-950 text-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-500/40">
            <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Pawari Shodh Patrika
            </h2>
            <p className="text-xs font-bold text-amber-800 tracking-wider uppercase mt-1">
              Protected Admin & Staff Portal
            </p>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            मुख्य संपादक एवं संचालक (Owner) प्रवेश द्वार
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-xs text-red-900 font-medium space-y-1.5 animate-in slide-in-from-top-1">
            <div className="font-bold flex items-center space-x-1.5 text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>प्रवेश सूचना / Notice</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-800">{error}</p>
          </div>
        )}

        {/* 3-Way Mode Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => { setMode('owner'); setError(null); }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${mode === 'owner' ? 'bg-red-950 text-amber-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>सुपर एडमिन</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('google'); setError(null); }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${mode === 'google' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('email'); setError(null); }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${mode === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>Staff Email</span>
          </button>
        </div>

        {/* Tab 1: Owner Guaranteed Verification */}
        {mode === 'owner' && (
          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>संचालक खाता चुनें (Select Super Admin):</span>
              </label>
              
              <div className="space-y-2">
                <label className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition ${selectedOwner === 'rupeshpawar10@gmail.com' ? 'bg-white border-amber-600 shadow-xs' : 'border-amber-200/70 hover:bg-white/60'}`}>
                  <input
                    type="radio"
                    name="owner_select"
                    checked={selectedOwner === 'rupeshpawar10@gmail.com'}
                    onChange={() => setSelectedOwner('rupeshpawar10@gmail.com')}
                    className="w-4 h-4 text-red-950 focus:ring-amber-500 accent-red-950"
                  />
                  <div className="ml-2.5">
                    <p className="text-xs font-bold text-slate-900">Prof. Rupesh Pawar</p>
                    <p className="text-[10px] text-slate-500 font-mono">rupeshpawar10@gmail.com</p>
                  </div>
                </label>

                <label className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition ${selectedOwner === 'rajeshbarange00@gmail.com' ? 'bg-white border-amber-600 shadow-xs' : 'border-amber-200/70 hover:bg-white/60'}`}>
                  <input
                    type="radio"
                    name="owner_select"
                    checked={selectedOwner === 'rajeshbarange00@gmail.com'}
                    onChange={() => setSelectedOwner('rajeshbarange00@gmail.com')}
                    className="w-4 h-4 text-red-950 focus:ring-amber-500 accent-red-950"
                  />
                  <div className="ml-2.5">
                    <p className="text-xs font-bold text-slate-900">Rajesh Barange (Pawar)</p>
                    <p className="text-[10px] text-slate-500 font-mono">rajeshbarange00@gmail.com</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>सुरक्षा पासवर्ड / मास्टर पिन (Security Password / PIN)</span>
              </label>
              <input
                type="password"
                placeholder="पासवर्ड या 6-अंकों का पिन दर्ज करें"
                value={ownerPin}
                onChange={e => setOwnerPin(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                (डिफ़ॉल्ट पिन: <span className="font-mono font-bold text-slate-700">pawari2025</span> अथवा अपना पासवर्ड)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-red-950 hover:bg-red-900 text-amber-200 font-bold rounded-2xl transition shadow-md flex items-center justify-center space-x-2 text-xs focus:ring-2 focus:ring-amber-500 active:scale-[0.99] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{loading ? 'प्रवेश सत्यापन जारी...' : 'सुपर एडमिन पैनल में प्रवेश करें'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Google Sign-In */}
        {mode === 'google' && (
          <div className="space-y-4 pt-1">
            <button
              type="button"
              onClick={() => handleGoogleSignIn()}
              disabled={loading}
              className="w-full py-4 px-4 bg-white hover:bg-slate-50 text-slate-800 font-black border-2 border-slate-300 hover:border-slate-400 rounded-2xl transition shadow-md hover:shadow-lg flex items-center justify-center space-x-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'सत्यापन जारी है...' : 'Google खाते से सुरक्षित लॉगिन करें'}</span>
            </button>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1">
              <p className="font-bold flex items-center space-x-1 text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>अधिकृत Google खाते:</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-mono text-[10px]">
                <li>rupeshpawar10@gmail.com</li>
                <li>rajeshbarange00@gmail.com</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Staff Email & Password */}
        {mode === 'email' && (
          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>ईमेल पता (Email Address)</span>
              </label>
              <input
                type="email"
                required
                placeholder="editor@pawarijournal.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>पासवर्ड (Password)</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2 text-xs focus:ring-2 focus:ring-amber-500 active:scale-[0.99] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'सत्यापन जारी है...' : 'स्टाफ लॉगिन'}</span>
            </button>
          </form>
        )}

        {/* Return to Public Website Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveView('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Journal Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
