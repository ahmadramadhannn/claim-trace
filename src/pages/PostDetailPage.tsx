import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { Header } from '../components/Header';
import { Board } from '../components/Board';
import { ReferencesSidebar } from '../components/ReferencesSidebar';
import { ShareModal } from '../components/ShareModal';
import { GroundingLegend } from '../components/GroundingLegend';
import { ReadingProgressIndicator } from '../components/ReadingProgressIndicator';
import { GroundingType } from '../types/claim';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, getPostById } = usePosts();

  const currentPost = id ? getPostById(id) : undefined;

  // Highlight default: URL reference statements
  const [activeHighlightedTypes, setActiveHighlightedTypes] = useState<GroundingType[]>([
    'url_reference',
  ]);

  const [hoveredStatementId, setHoveredStatementId] = useState<string | null>(null);
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'stacked' | 'prose'>('stacked');

  // Sidebar visibility toggle state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Global Citations & Grounding toggle switch
  const [showCitations, setShowCitations] = useState(true);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Reading & processing progress states
  const [readStatementIds, setReadStatementIds] = useState<Set<string>>(new Set());
  const [activeReadingStatementId, setActiveReadingStatementId] = useState<string | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Reset/initialize reading progress when post changes
  useEffect(() => {
    if (currentPost && currentPost.statements.length > 0) {
      setReadStatementIds(new Set([currentPost.statements[0].id]));
      setScrollPercent(0);
      setActiveReadingStatementId(currentPost.statements[0].id);
    } else {
      setReadStatementIds(new Set());
      setScrollPercent(0);
      setActiveReadingStatementId(null);
    }
  }, [currentPost?.id]);

  // Window scroll handler for tracking reading progress and statements
  useEffect(() => {
    if (!currentPost) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const boardEl = document.getElementById('board-canvas-card');
          if (boardEl) {
            const rect = boardEl.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const headerOffset = 70; // sticky header height
            const totalHeight = rect.height;
            const scrolled = headerOffset - rect.top;
            const maxScroll = totalHeight - (windowHeight - headerOffset);

            let pct = 0;
            if (maxScroll <= 0) {
              pct = 100;
            } else {
              pct = Math.min(100, Math.max(0, (scrolled / maxScroll) * 100));
            }
            setScrollPercent(Math.round(pct));

            // Check which statements have entered viewport/been read
            const statementEls = boardEl.querySelectorAll('[data-statement-id]');
            let activeId: string | null = null;
            let closestDistance = Infinity;

            setReadStatementIds((prev) => {
              const updated = new Set(prev);

              statementEls.forEach((el) => {
                const sId = el.getAttribute('data-statement-id');
                if (!sId) return;

                const sRect = el.getBoundingClientRect();

                // If statement top is above 75% of viewport, it has been read/processed
                if (sRect.top < windowHeight * 0.75) {
                  updated.add(sId);
                }

                // Identify currently active statement around reading eye-line (35%-50% viewport)
                const distanceToFocalLine = Math.abs(sRect.top - windowHeight * 0.4);
                if (distanceToFocalLine < closestDistance) {
                  closestDistance = distanceToFocalLine;
                  activeId = sId;
                }
              });

              // If scrolled close to bottom, mark all statements as read
              if (pct >= 92) {
                currentPost.statements.forEach((s) => updated.add(s.id));
              }

              return updated;
            });

            if (activeId) {
              setActiveReadingStatementId(activeId);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPost]);

  const handleSelectFromProgress = (stmtId: string) => {
    setSelectedStatementId(stmtId);
    setReadStatementIds((prev) => new Set([...prev, stmtId]));
  };

  const handleResetProgress = () => {
    if (currentPost && currentPost.statements.length > 0) {
      setReadStatementIds(new Set([currentPost.statements[0].id]));
      setScrollPercent(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMarkAllRead = () => {
    if (currentPost) {
      setReadStatementIds(new Set(currentPost.statements.map((s) => s.id)));
      setScrollPercent(100);
    }
  };

  // Map of URL statements to sequential 1-based index (url ref 1, url ref 2...)
  const urlRefIndexMap = useMemo(() => {
    if (!currentPost) return new Map<string, number>();
    const map = new Map<string, number>();
    let count = 1;
    for (const stmt of currentPost.statements) {
      if (stmt.type === 'url_reference') {
        map.set(stmt.id, count);
        count++;
      }
    }
    return map;
  }, [currentPost]);

  const handleToggleType = (type: GroundingType) => {
    if (activeHighlightedTypes.includes(type)) {
      setActiveHighlightedTypes(activeHighlightedTypes.filter((t) => t !== type));
    } else {
      setActiveHighlightedTypes([...activeHighlightedTypes, type]);
    }
  };

  const handleSetTypes = (types: GroundingType[]) => {
    setActiveHighlightedTypes(types);
  };

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
        <Header />
        <main className="max-w-md mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">Trace Post Not Found</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">
            The post trace ID <code className="font-mono">{id}</code> does not exist or has been removed.
          </p>
          <Link
            to="/posts"
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-amber-400 dark:text-stone-950 rounded-lg shadow-xs"
          >
            Browse All Posts
          </Link>
        </main>
      </div>
    );
  }

  const urlCount = currentPost.statements.filter((s) => s.type === 'url_reference' && s.url).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors">
      <Header
        currentPost={currentPost}
        posts={posts}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenLegend={() => setIsLegendOpen(true)}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Top bar with back navigation and Sidebar Visibility Toggle */}
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 font-medium transition-colors py-1.5 px-1 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>

          {/* Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border transition-all active:scale-95 shadow-xs ${
              isSidebarVisible
                ? 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700 border-stone-200 dark:border-slate-700'
                : 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 border-emerald-600 font-bold'
            }`}
          >
            {isSidebarVisible ? (
              <>
                <PanelRightClose className="w-4 h-4 shrink-0" />
                <span>Hide References Panel</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4 shrink-0" />
                <span>Show References Panel ({urlCount} URLs)</span>
              </>
            )}
          </button>
        </div>

        {/* Subtle Reading & Processing Progress Indicator */}
        <ReadingProgressIndicator
          statements={currentPost.statements}
          readStatementIds={readStatementIds}
          activeStatementId={selectedStatementId || activeReadingStatementId}
          scrollPercent={scrollPercent}
          onSelectStatement={handleSelectFromProgress}
          onResetProgress={handleResetProgress}
          onMarkAllRead={handleMarkAllRead}
          postTitle={currentPost.title}
          postSummary={currentPost.summary}
        />

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">
          {/* Left Canvas: Board (expands to 100% when sidebar is hidden) */}
          <div className="flex-1 w-full transition-all min-w-0">
            <Board
              post={currentPost}
              activeHighlightedTypes={activeHighlightedTypes}
              hoveredStatementId={hoveredStatementId}
              onHoverStatement={setHoveredStatementId}
              selectedStatementId={selectedStatementId}
              onSelectStatement={setSelectedStatementId}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              urlRefIndexMap={urlRefIndexMap}
              showCitations={showCitations}
              onToggleShowCitations={() => setShowCitations(!showCitations)}
            />
          </div>

          {/* Right Margin: References Sidebar (collapsible) */}
          {isSidebarVisible && (
            <ReferencesSidebar
              post={currentPost}
              activeHighlightedTypes={activeHighlightedTypes}
              onToggleType={handleToggleType}
              onSetTypes={handleSetTypes}
              hoveredStatementId={hoveredStatementId}
              onHoverStatement={setHoveredStatementId}
              selectedStatementId={selectedStatementId}
              onSelectStatement={setSelectedStatementId}
              urlRefIndexMap={urlRefIndexMap}
              onHideSidebar={() => setIsSidebarVisible(false)}
            />
          )}
        </div>
      </main>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        post={currentPost}
      />

      <GroundingLegend
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </div>
  );
};
