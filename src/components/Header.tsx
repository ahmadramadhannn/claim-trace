import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Share2,
  HelpCircle,
  Sun,
  Moon,
  User,
  LogOut,
  LogIn,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { PostDocument } from '../types/claim';

interface HeaderProps {
  currentPost?: PostDocument;
  posts?: PostDocument[];
  onOpenShare?: () => void;
  onOpenLegend?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPost,
  posts,
  onOpenShare,
  onOpenLegend,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/create');
    } else {
      navigate('/create');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 group text-stone-900 dark:text-stone-100 focus:outline-none shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-900 dark:bg-amber-400 text-amber-100 dark:text-stone-950 flex items-center justify-center font-serif text-base sm:text-lg font-bold shadow-xs group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                ClaimTrace
              </span>
            </div>
          </Link>

          {/* Desktop & Mobile Nav Links */}
          <nav className="flex items-center gap-1 text-xs font-medium text-stone-600 dark:text-stone-300">
            <Link
              to="/"
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs transition-colors ${
                location.pathname === '/'
                  ? 'bg-stone-200/70 dark:bg-slate-800 text-stone-900 dark:text-amber-300 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/posts"
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs transition-colors ${
                location.pathname.startsWith('/posts')
                  ? 'bg-stone-200/70 dark:bg-slate-800 text-stone-900 dark:text-amber-300 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Directory
            </Link>
          </nav>
        </div>

        {/* Center: Post Dropdown if on post detail page */}
        {currentPost && posts && (
          <div className="hidden xl:flex items-center gap-2">
            <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
              Viewing:
            </span>
            <div className="relative">
              <select
                value={currentPost.id}
                onChange={(e) => navigate(`/posts/${e.target.value}`)}
                className="appearance-none bg-stone-100/80 dark:bg-slate-800 hover:bg-stone-200/70 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-stone-200 text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[240px] truncate"
              >
                {posts.map((p) => (
                  <option key={p.id} value={p.id} className="dark:bg-slate-900 dark:text-stone-200">
                    {p.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500 dark:text-stone-400">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Right: Actions, Theme Toggle, Auth User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Taxonomy help button */}
          {onOpenLegend && (
            <button
              onClick={onOpenLegend}
              title="How Grounding Taxonomy Works"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Taxonomy</span>
            </button>
          )}

          {/* Share button if on post page */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 rounded-lg shadow-2xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          )}

          {/* Theme Toggle (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            type="button"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-1.5 sm:p-2 text-stone-600 dark:text-amber-300 hover:text-stone-900 dark:hover:text-amber-200 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* New Post Button */}
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white dark:text-stone-950 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 rounded-lg shadow-xs transition-colors whitespace-nowrap active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Create Trace</span>
            <span className="xs:hidden">Create</span>
          </button>

          {/* User Auth Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-0.5 sm:p-1 rounded-full border border-stone-300 dark:border-slate-700 hover:ring-2 hover:ring-amber-500 transition-all focus:outline-none"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-stone-200 dark:bg-slate-700 object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-slate-700">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 font-mono text-[11px] truncate">
                      {user.handle}
                    </p>
                    {user.isVerifiedWriter && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] rounded font-medium">
                        Authenticated Writer
                      </span>
                    )}
                  </div>

                  <Link
                    to="/create"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Trace</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors border border-stone-300 dark:border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
