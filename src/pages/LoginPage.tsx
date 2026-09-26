import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LogIn, UserPlus, ShieldCheck, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { Header } from '../components/Header';

export const LoginPage: React.FC = () => {
  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/create';

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<UserProfile['platform']>('threads');

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
        <Header />
        <main className="max-w-md mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">You are already signed in</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">
            Authenticated as <span className="font-semibold">{user.name}</span> ({user.handle}).
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(redirectPath)}
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-amber-400 dark:text-stone-950 rounded-lg shadow-xs"
            >
              Continue to {redirectPath === '/create' ? 'Create Trace' : 'Dashboard'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim()) return;
      login(email, name, handle);
    } else {
      if (!name.trim() || !handle.trim() || !email.trim()) return;
      register(name, handle, email, platform);
    }
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="max-w-md w-full mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 p-4 sm:p-6 md:p-8 shadow-xs">
          <div className="text-center mb-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Writer Authentication Required
            </h1>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              To prevent anonymous spam or nonsense posts, please sign in with your writer profile before publishing traces.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-slate-800 rounded-xl mb-5 sm:mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-amber-300 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-amber-300 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Register Writer Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmad Ramadhan"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Social Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@ahmadramadannesia"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Primary Social Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as UserProfile['platform'])}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                  >
                    <option value="threads">Threads</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="substack">Substack</option>
                    <option value="custom">Other</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="writer@claimtrace.io"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white dark:text-stone-950 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 active:scale-95"
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Continue</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Writer Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-slate-800 text-center text-[10px] sm:text-[11px] text-stone-400">
            <span>By signing in, your authored posts are tied to your handle.</span>
          </div>
        </div>
      </main>
    </div>
  );
};
