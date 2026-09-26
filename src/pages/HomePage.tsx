import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  Plus,
} from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { GROUNDING_CONFIGS, GroundingType } from '../types/claim';

export const HomePage: React.FC = () => {
  const { posts } = usePosts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && p.statements.some((s) => s.type === selectedFilter);
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-stone-200/80 dark:border-slate-800 bg-gradient-to-b from-stone-100/60 to-[#FAF8F5] dark:from-slate-900 dark:to-slate-950 py-10 sm:py-16 md:py-20 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] sm:text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Beyond Standard Bottom References in Social Media</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight sm:leading-tight">
            Distinguish <span className="underline decoration-amber-400 decoration-wavy underline-offset-4 sm:underline-offset-8">Observation, Data & Opinion</span> in every post.
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Instead of burying links at the bottom of long threads, ClaimTrace links every sentence directly to its underlying epistemic basis—whether it’s direct data, an observation, or an external URL reference.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 sm:pt-4">
            <Link
              to="/posts/excalidraw-sketch-demo"
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white dark:text-stone-950 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>Explore Interactive Excalidraw Post</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {isAuthenticated ? (
              <Link
                to="/create"
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Create New Trace Post</span>
              </Link>
            ) : (
              <Link
                to="/login?redirect=/create"
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Sign In to Publish Trace</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Grounding Categories */}
      <section className="py-8 sm:py-12 px-3 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Epistemic Attribution Pillars
          </h2>
          <p className="mt-1 text-lg sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Clear visual cues for readers
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((type) => {
            const config = GROUNDING_CONFIGS[type];
            const isSelected = selectedFilter === type;
            const count = posts.filter((p) => p.statements.some((s) => s.type === type)).length;

            return (
              <button
                key={type}
                onClick={() => setSelectedFilter(isSelected ? 'all' : type)}
                className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-500 shadow-sm bg-white dark:bg-slate-800 border-amber-500 dark:border-amber-400'
                    : 'bg-white dark:bg-slate-900/80 hover:bg-stone-50 dark:hover:bg-slate-800 border-stone-200/90 dark:border-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                    style={{ backgroundColor: config.hexColor }}
                  />
                  <span className="text-[10px] sm:text-[11px] font-mono text-stone-400 dark:text-stone-500">
                    {count} {count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {config.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono truncate">
                  {config.nameId}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Directory of Trace Posts Section */}
      <section className="py-6 sm:py-8 px-3 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Trace Posts Directory
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Browse posts with attributed statements, external URL references, and evidence context.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts or authors..."
                className="w-full text-xs pl-8 sm:pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 dark:text-stone-200"
              />
            </div>

            {selectedFilter !== 'all' && (
              <button
                onClick={() => setSelectedFilter('all')}
                className="text-xs text-amber-700 dark:text-amber-400 hover:underline shrink-0 font-medium px-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => {
            const urlRefs = post.statements.filter((s) => s.type === 'url_reference');
            const dataRefs = post.statements.filter((s) => s.type === 'data');
            const obsRefs = post.statements.filter((s) => s.type === 'observation');

            return (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 p-4 sm:p-5 md:p-6 shadow-xs hover:shadow-md hover:border-amber-400/80 dark:hover:border-amber-500/60 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-200 dark:bg-slate-700 overflow-hidden border border-stone-300 dark:border-slate-600 shrink-0">
                      {post.author.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif font-bold text-stone-700 dark:text-stone-200 text-xs sm:text-sm">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {post.author.name}
                      </h3>
                      <span className="text-[10px] sm:text-[11px] text-stone-400 dark:text-stone-500 font-mono block truncate">
                        {post.author.handle} · {post.author.platform}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    {urlRefs.length > 0 && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-[11px] font-mono rounded-md font-medium">
                        {urlRefs.length} URLs
                      </span>
                    )}
                    {dataRefs.length > 0 && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-mono rounded-md font-medium">
                        {dataRefs.length} Data
                      </span>
                    )}
                    {obsRefs.length > 0 && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] sm:text-[11px] font-mono rounded-md font-medium">
                        {obsRefs.length} Obs
                      </span>
                    )}
                  </div>

                  <span className="text-amber-700 dark:text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 text-xs shrink-0">
                    View Trace <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-slate-800 py-8 px-4 text-center text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900 dark:text-stone-100">ClaimTrace</span>
            <span>— Transparent Grounding for Social Posts</span>
          </div>
          <span>Built for like-minded thinkers & critical discussions</span>
        </div>
      </footer>
    </div>
  );
};
