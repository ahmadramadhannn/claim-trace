import React, { useMemo } from 'react';
import { CheckCircle2, Clock, RotateCcw, ChevronRight, BookOpen, Compass } from 'lucide-react';
import { StatementClaim } from '../types/claim';

interface ReadingProgressIndicatorProps {
  statements: StatementClaim[];
  readStatementIds: Set<string>;
  activeStatementId: string | null;
  scrollPercent: number;
  isScrolledDown?: boolean;
  onSelectStatement: (id: string) => void;
  onResetProgress?: () => void;
  onMarkAllRead?: () => void;
  postTitle?: string;
  postSummary?: string;
}

export const ReadingProgressIndicator: React.FC<ReadingProgressIndicatorProps> = ({
  statements,
  readStatementIds,
  activeStatementId,
  scrollPercent,
  isScrolledDown = false,
  onSelectStatement,
  onResetProgress,
  onMarkAllRead,
  postTitle = '',
  postSummary = '',
}) => {
  const totalStatements = statements.length;
  const readCount = readStatementIds.size;

  // Calculate percentage
  const statementPercent = totalStatements > 0 ? Math.round((readCount / totalStatements) * 100) : 0;
  const effectivePercent = isScrolledDown
    ? Math.max(statementPercent, scrollPercent)
    : Math.min(statementPercent, totalStatements > 0 ? Math.round((1 / totalStatements) * 100) : 0);
  
  const isComplete = effectivePercent >= 100 || (totalStatements > 0 && readCount === totalStatements && scrollPercent >= 85);

  // Calculate estimated reading time and remaining time
  const { totalMinutes, remainingMinutes } = useMemo(() => {
    const totalWords = statements.reduce((acc, s) => acc + s.text.split(/\s+/).length, 0)
      + postTitle.split(/\s+/).length
      + postSummary.split(/\s+/).length;
    
    // Average reading speed: 200 words per minute
    const totalMin = Math.max(1, Math.ceil(totalWords / 200));

    // Calculate unread words
    const unreadWords = statements
      .filter((s) => !readStatementIds.has(s.id))
      .reduce((acc, s) => acc + s.text.split(/\s+/).length, 0);

    const remMin = Math.max(0, Math.ceil(unreadWords / 200));

    return { totalMinutes: totalMin, remainingMinutes: remMin };
  }, [statements, readStatementIds, postTitle, postSummary]);

  // Find next unread statement
  const nextUnreadStatement = useMemo(() => {
    return statements.find((s) => !readStatementIds.has(s.id));
  }, [statements, readStatementIds]);

  return (
    <>
      {/* 1. Subtle Sticky Header Top Line - HIDDEN when at top of page, smoothly fades in when scrolling down */}
      <div
        className={`sticky top-14 sm:top-16 z-25 w-full transition-all duration-300 pointer-events-none ${
          isScrolledDown
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        aria-hidden={!isScrolledDown}
      >
        <div className="w-full bg-stone-200/80 dark:bg-slate-800/80 h-[3px] overflow-hidden shadow-xs">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            style={{ width: `${Math.max(statementPercent, scrollPercent)}%` }}
          />
        </div>

        {/* Compact reading pill while scrolling down */}
        {isScrolledDown && (
          <div className="max-w-[1440px] mx-auto px-3 sm:px-6 flex justify-end">
            <div className="pointer-events-auto mt-1.5 inline-flex items-center gap-2 px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-stone-200/90 dark:border-slate-800 rounded-full shadow-sm text-[11px] text-stone-700 dark:text-stone-300">
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {Math.max(statementPercent, scrollPercent)}%
              </span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span>
                {readCount}/{totalStatements} claims read
              </span>
              {activeStatementId && (
                <>
                  <span className="text-stone-300 dark:text-stone-700 hidden xs:inline">·</span>
                  <span className="text-stone-500 dark:text-stone-400 hidden xs:inline truncate max-w-[150px]">
                    Claim #{statements.findIndex((s) => s.id === activeStatementId) + 1}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. In-View Progress Card (At top of post detail content) */}
      <section
        aria-label="Reading & Processing Progress"
        className="mb-4 sm:mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-stone-200/90 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xs transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-2.5">
          {/* Left: Progress status with statement count */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {isComplete ? 'Post Fully Processed' : 'Reading Progress'}
              </span>
            </div>

            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>

            {/* Read Count Badge */}
            <span className="text-xs text-stone-600 dark:text-stone-400 font-mono">
              <strong className="text-stone-900 dark:text-stone-200 font-semibold">{readCount}</strong>
              {' / '}
              <span>{totalStatements}</span> statements processed
            </span>

            {/* Percentage pill */}
            <span
              className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                isComplete
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {isComplete ? '100%' : `${statementPercent}%`}
            </span>
          </div>

          {/* Right: Reading time info & quick skip/reset actions */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-stone-500 dark:text-stone-400 justify-between sm:justify-end">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isComplete
                  ? `${totalMinutes} min read complete`
                  : remainingMinutes > 0
                  ? `~${remainingMinutes} min remaining`
                  : `~${totalMinutes} min read`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {!isComplete && nextUnreadStatement && (
                <button
                  type="button"
                  onClick={() => onSelectStatement(nextUnreadStatement.id)}
                  className="inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900 rounded-md transition-colors"
                  title="Jump to the next unread statement in this post"
                >
                  <span>Next claim</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}

              {isComplete && onResetProgress && (
                <button
                  type="button"
                  onClick={onResetProgress}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  title="Reset reading progress to start over"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}

              {!isComplete && onMarkAllRead && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  title="Mark all statements as read"
                >
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Interactive Segmented Progress Bar */}
        <div
          className="relative w-full bg-stone-100 dark:bg-slate-800 rounded-full h-2 p-0.5 flex items-center gap-1 overflow-hidden"
          role="progressbar"
          aria-valuenow={statementPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {statements.map((stmt, idx) => {
            const isRead = readStatementIds.has(stmt.id);
            const isActive = activeStatementId === stmt.id;

            return (
              <button
                key={stmt.id}
                type="button"
                onClick={() => onSelectStatement(stmt.id)}
                title={`Statement ${idx + 1}: ${stmt.text.slice(0, 60)}... (${isRead ? 'Read' : 'Unread'})`}
                className={`flex-1 h-full rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-amber-500 ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-slate-900 scale-y-125 z-10'
                    : isRead
                    ? 'bg-emerald-500/90 dark:bg-emerald-400/90 hover:brightness-110'
                    : 'bg-stone-200 dark:bg-slate-700 hover:bg-stone-300 dark:hover:bg-slate-600'
                }`}
                aria-label={`Jump to statement ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* 4. Subtle Micro-Labels under segments */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500 font-mono mt-1.5 px-0.5">
          <span>Start (Statement 1)</span>
          {activeStatementId && (
            <span className="text-amber-700 dark:text-amber-400 font-sans truncate max-w-[200px] sm:max-w-[400px]">
              Active: Claim #{statements.findIndex((s) => s.id === activeStatementId) + 1}
            </span>
          )}
          <span>End (Statement {totalStatements})</span>
        </div>
      </section>
    </>
  );
};
