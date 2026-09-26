import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Check,
  Lock,
  ArrowLeft,
  Sparkles,
  Clipboard,
  Layers,
  Link2,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { Header } from '../components/Header';
import {
  PostDocument,
  StatementClaim,
  GroundingType,
  GROUNDING_CONFIGS,
} from '../types/claim';

const DEFAULT_EXAMPLE_POST = `Have you noticed how every teacher thinks that their field is the most important in the world? Math teachers think math is the most important because it’s the purest description of reality or whatever. Language teachers think that language is the most important because that’s how we communicate and think. Biology teachers think that biology is the most important because biology is life, and what’s more important than life?

This continues in Computer Science departments, doesn’t it. Whatever the professor teaches — algorithms, data structures, linear algebra, complexity theory — that’s what they think is the most important.`;

export const CreatePostPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addPost } = usePosts();
  const navigate = useNavigate();

  // Full raw post content pasted/typed by user
  const [fullText, setFullText] = useState(DEFAULT_EXAMPLE_POST);
  const [title, setTitle] = useState('Academic Subject Bias in Computer Science Departments');
  const [summary, setSummary] = useState(
    'Reflections on how educators across disciplines prioritize their own specialized fields.'
  );

  // Default grounding category assigned to parsed sentences
  const [defaultGrounding, setDefaultGrounding] = useState<GroundingType>('personal_opinion');

  // Statements state derived or overridden
  const [statements, setStatements] = useState<StatementClaim[]>([]);

  // Mobile / tab view state: 'draft' vs 'breakdown'
  const [mobileTab, setMobileTab] = useState<'draft' | 'breakdown'>('draft');

  // Auto-parse fullText whenever fullText or defaultGrounding changes
  useEffect(() => {
    if (!fullText.trim()) {
      setStatements([]);
      return;
    }

    // Split text into logical sentences / thought blocks
    const rawChunks = fullText
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);

    const parsedClaims: StatementClaim[] = rawChunks.map((chunkText, idx) => {
      let detectedType: GroundingType = defaultGrounding;
      let detectedUrl: string | undefined = undefined;
      let urlDomain: string | undefined = undefined;

      const urlMatch = chunkText.match(/(https?:\/\/[^\s]+)/g);
      if (urlMatch) {
        detectedType = 'url_reference';
        detectedUrl = urlMatch[0];
        try {
          urlDomain = new URL(detectedUrl).hostname.replace('www.', '');
        } catch {
          // fallback
        }
      } else if (/\b(\d+%|\d+\s*(percent|users|survey|stats|data|respondents))\b/i.test(chunkText)) {
        detectedType = 'data';
      }

      return {
        id: `auto-stmt-${idx}-${chunkText.substring(0, 10).replace(/\W/g, '')}`,
        text: chunkText,
        type: detectedType,
        url: detectedUrl,
        urlDomain: urlDomain,
      };
    });

    setStatements(parsedClaims);
  }, [fullText, defaultGrounding]);

  // Auth Guard
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
        <Header />
        <main className="max-w-md mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">Sign In Required to Post</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            To prevent spam or unverified trace creation, all trace posts must be attributed to an authenticated writer profile.
          </p>
          <Link
            to="/login?redirect=/create"
            className="px-6 py-2.5 text-xs font-bold text-white bg-stone-900 dark:bg-amber-400 dark:text-stone-950 rounded-xl shadow-xs"
          >
            Sign In / Register Writer Profile
          </Link>
        </main>
      </div>
    );
  }

  const handleUpdateStatementType = (id: string, newType: GroundingType) => {
    setStatements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, type: newType } : s))
    );
  };

  const handleUpdateStatementMeta = (id: string, key: keyof StatementClaim, value: string) => {
    setStatements((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, [key]: value };
        if (key === 'url' && value) {
          try {
            updated.urlDomain = new URL(value).hostname.replace('www.', '');
          } catch {
            // invalid while typing
          }
        }
        return updated;
      })
    );
  };

  const handleRemoveStatement = (id: string) => {
    setStatements((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddCustomStatement = () => {
    const newClaim: StatementClaim = {
      id: 'custom-stmt-' + Date.now(),
      text: '',
      type: defaultGrounding,
    };
    setStatements((prev) => [...prev, newClaim]);
  };

  const handlePasteExample = () => {
    setFullText(DEFAULT_EXAMPLE_POST);
    setTitle('Academic Subject Bias in CS Departments');
    setSummary('Observation on how educators view their specific fields.');
  };

  const derivedTitle =
    title.trim() ||
    (statements[0]?.text ? statements[0].text.substring(0, 60) + '...' : 'Untitled Trace Post');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (statements.length === 0) {
      alert('Please paste or enter at least one sentence/statement for your post.');
      return;
    }

    const newPostId = 'post-' + Date.now();
    const finalPost: PostDocument = {
      id: newPostId,
      title: derivedTitle,
      author: {
        name: user.name,
        handle: user.handle,
        platform: user.platform,
        avatarUrl: user.avatarUrl,
      },
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      summary: summary.trim() || 'A structured trace breakdown of social post statements.',
      statements: statements.filter((s) => s.text.trim().length > 0),
    };

    addPost(finalPost);
    navigate(`/posts/${newPostId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Top Navigation & Status Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors shrink-0 py-1.5 px-1 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex text-[11px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 font-semibold items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Writer: {user.name} ({user.handle})
            </span>

            <button
              type="button"
              onClick={handlePublish}
              className="px-4 sm:px-5 py-2 text-xs font-bold text-white dark:text-stone-950 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Publish Trace Post</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tabs */}
        <div className="lg:hidden flex items-center gap-1.5 mb-4 p-1 bg-stone-200/60 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab('draft')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mobileTab === 'draft'
                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Draft Text</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('breakdown')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mobileTab === 'breakdown'
                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>2. Breakdown ({statements.length})</span>
          </button>
        </div>

        {/* Dual-Pane Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 flex-1 items-start">
          {/* LEFT PANE: Paste Social Draft & Default Fallback */}
          <div
            className={`lg:col-span-6 space-y-4 sm:space-y-5 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-stone-200/90 dark:border-slate-800 shadow-xs ${
              mobileTab !== 'draft' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="border-b border-stone-100 dark:border-slate-800 pb-3">
              <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Paste Social Draft
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Paste your post from X, Threads, Substack, or LinkedIn. All sentences automatically split and receive your chosen default grounding category.
              </p>
            </div>

            {/* Title & Short Abstract */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Post Title / Topic
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Academic Subject Bias in CS Departments..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Short Summary / Context
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief context overview..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Main Raw Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Clipboard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Full Social Post Content</span>
                </label>

                <button
                  type="button"
                  onClick={handlePasteExample}
                  className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample Post</span>
                </button>
              </div>

              <textarea
                rows={8}
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                placeholder="Paste your full article, thread, or social post text here..."
                className="w-full text-xs sm:text-sm p-3.5 sm:p-4 bg-stone-50/50 dark:bg-slate-800/60 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 leading-relaxed font-sans"
              />
            </div>

            {/* Default Grounding Category Bar */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Default Grounding Fallback:
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((t) => {
                  const config = GROUNDING_CONFIGS[t];
                  const isSelected = defaultGrounding === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDefaultGrounding(t)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400 font-bold shadow-2xs'
                          : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-700 border-stone-200 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: config.hexColor }}
                      />
                      <span>{config.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 italic">
                ✨ Every sentence is automatically assigned{' '}
                <strong className="text-stone-700 dark:text-stone-300">
                  {GROUNDING_CONFIGS[defaultGrounding].name}
                </strong>
                . Zero manual work required.
              </p>
            </div>
          </div>

          {/* RIGHT PANE: Interactive Statement Breakdown */}
          <div
            className={`lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col lg:sticky lg:top-20 max-h-none lg:max-h-[85vh] ${
              mobileTab === 'draft' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Statement Breakdown ({statements.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={handleAddCustomStatement}
                className="p-1.5 px-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-stone-200 dark:border-slate-700"
                title="Add extra statement"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            {/* Scrollable statement list */}
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-3">
              {statements.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  Paste content on the left to see your parsed statement breakdown.
                </div>
              ) : (
                statements.map((stmt, idx) => {
                  const currentConfig = GROUNDING_CONFIGS[stmt.type];

                  return (
                    <div
                      key={stmt.id}
                      className="p-3 sm:p-3.5 bg-stone-50/70 dark:bg-slate-800/40 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-2.5 transition-colors hover:border-amber-300 dark:hover:border-amber-700"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-400">
                            #{idx + 1}
                          </span>
                          <span
                            className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1"
                            style={{
                              backgroundColor: `${currentConfig.hexColor}15`,
                              borderColor: `${currentConfig.hexColor}40`,
                              color: currentConfig.hexColor,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: currentConfig.hexColor }}
                            />
                            {currentConfig.name}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveStatement(stmt.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Remove line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-lg border border-stone-200 dark:border-slate-800">
                        {stmt.text}
                      </p>

                      {/* Quick Category Switch Pills */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((t) => {
                          const c = GROUNDING_CONFIGS[t];
                          const isSelected = stmt.type === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleUpdateStatementType(stmt.id, t)}
                              className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md border transition-all flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400 font-bold shadow-2xs'
                                  : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-700 border-stone-200 dark:border-slate-700'
                              }`}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: c.hexColor }}
                              />
                              <span>{c.name}</span>
                            </button>
                          );
                        })}
                      </div>


                      {/* Optional Reference URL field */}
                      {stmt.type === 'url_reference' && (
                        <div className="pt-2 grid grid-cols-1 gap-2 bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <div>
                            <label className="block text-[10px] font-semibold text-emerald-900 dark:text-emerald-300 mb-0.5 flex items-center gap-1">
                              <Link2 className="w-3 h-3" />
                              <span>Reference URL:</span>
                            </label>
                            <input
                              type="url"
                              value={stmt.url || ''}
                              onChange={(e) =>
                                handleUpdateStatementMeta(stmt.id, 'url', e.target.value)
                              }
                              placeholder="https://example.com/source-link"
                              className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded font-mono text-stone-900 dark:text-stone-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-emerald-900 dark:text-emerald-300 mb-0.5">
                              Publisher / Source Name:
                            </label>
                            <input
                              type="text"
                              value={stmt.urlTitle || ''}
                              onChange={(e) =>
                                handleUpdateStatementMeta(stmt.id, 'urlTitle', e.target.value)
                              }
                              placeholder="e.g. Stanford CS Curriculum Survey"
                              className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded text-stone-900 dark:text-stone-100"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom publish bar inside side-pane */}
            <div className="pt-3 border-t border-stone-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">
                {statements.length} grounded statements
              </span>
              <button
                type="button"
                onClick={handlePublish}
                className="px-4 py-2 text-xs font-bold text-white dark:text-stone-950 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publish Trace Post</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
