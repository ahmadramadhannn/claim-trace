import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Filter, Plus } from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { Header } from '../components/Header';
import { GROUNDING_CONFIGS, GroundingType } from '../types/claim';

export const DirectoryPage: React.FC = () => {
  const { posts } = usePosts();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredPosts = posts.filter((p) => {
    const query = search.toLowerCase();
    const matchesQuery =
      p.title.toLowerCase().includes(query) ||
      p.author.name.toLowerCase().includes(query) ||
      p.author.handle.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query);

    if (selectedType === 'all') return matchesQuery;
    return matchesQuery && p.statements.some((s) => s.type === selectedType);
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-stone-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Trace Posts Directory
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Browse all social media posts and their statement attribution breakdowns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topic, author, keywords..."
                className="w-full text-xs pl-8 sm:pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 dark:text-stone-200"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs py-2.5 px-3 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Grounding Types</option>
              {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((t) => (
                <option key={t} value={t}>
                  Contains {GROUNDING_CONFIGS[t].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => {
            const urlRefs = post.statements.filter((s) => s.type === 'url_reference');
            const dataCount = post.statements.filter((s) => s.type === 'data').length;
            const obsCount = post.statements.filter((s) => s.type === 'observation').length;

            return (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 p-4 sm:p-5 md:p-6 shadow-xs hover:shadow-md hover:border-amber-400/80 dark:hover:border-amber-500/60 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-200 dark:bg-slate-700 overflow-hidden border border-stone-300 dark:border-slate-600 shrink-0">
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
                      <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 font-mono block truncate">
                        {post.author.handle} · {post.author.platform}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug">
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
                    {dataCount > 0 && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-mono rounded-md font-medium">
                        {dataCount} Data
                      </span>
                    )}
                    {obsCount > 0 && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] sm:text-[11px] font-mono rounded-md font-medium">
                        {obsCount} Obs
                      </span>
                    )}
                  </div>

                  <span className="text-amber-700 dark:text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 text-xs shrink-0">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};
