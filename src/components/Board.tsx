import React, { useRef, useEffect } from 'react';
import {
  ExternalLink,
  Layers,
  AlignLeft,
  Info,
  Copy,
  Check,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { PostDocument, StatementClaim, GroundingType, GROUNDING_CONFIGS } from '../types/claim';

interface BoardProps {
  post: PostDocument;
  activeHighlightedTypes: GroundingType[];
  hoveredStatementId: string | null;
  onHoverStatement: (id: string | null) => void;
  selectedStatementId: string | null;
  onSelectStatement: (id: string | null) => void;
  viewMode: 'stacked' | 'prose';
  onChangeViewMode: (mode: 'stacked' | 'prose') => void;
  urlRefIndexMap: Map<string, number>;
  showCitations?: boolean;
  onToggleShowCitations?: () => void;
}

export const Board: React.FC<BoardProps> = ({
  post,
  activeHighlightedTypes,
  hoveredStatementId,
  onHoverStatement,
  selectedStatementId,
  onSelectStatement,
  viewMode,
  onChangeViewMode,
  urlRefIndexMap,
  showCitations = true,
  onToggleShowCitations,
}) => {
  const statementRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Auto scroll when selected from sidebar
  useEffect(() => {
    if (selectedStatementId) {
      const el = statementRefs.current.get(selectedStatementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedStatementId]);

  const handleCopyQuote = (statement: StatementClaim, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${statement.text}"`);
    setCopiedId(statement.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const isTypeHighlighted = (type: GroundingType) => {
    if (!showCitations) return false;
    return activeHighlightedTypes.includes(type);
  };

  return (
    <section className="flex-1 flex flex-col min-w-0">
      {/* Board Canvas Card Container */}
      <div id="board-canvas-card" className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-slate-800 shadow-xs flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 transition-colors">
        {/* Post Metadata Header */}
        <div className="border-b border-stone-100 dark:border-slate-800 pb-5 sm:pb-6 mb-5 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-stone-200 dark:bg-slate-700 border border-stone-300 dark:border-slate-600 shrink-0">
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-stone-700 dark:text-stone-200 text-base sm:text-lg font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base truncate">
                    {post.author.name}
                  </h3>
                  <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-mono truncate">
                    {post.author.handle}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  <span className="capitalize">{post.author.platform}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.createdAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.statements.length} Statements Analyzed</span>
                </div>
              </div>
            </div>

            {/* Controls Bar: View Mode + Global Citations Toggle Switch */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              {/* Global Citations & Grounding Toggle Switch */}
              {onToggleShowCitations && (
                <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-stone-100/90 dark:bg-slate-800 rounded-xl border border-stone-200/80 dark:border-slate-700">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    {showCitations ? (
                      <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                    )}
                    <span>Citations & Grounding:</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showCitations}
                      onClick={onToggleShowCitations}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showCitations
                          ? 'bg-amber-500 dark:bg-amber-400'
                          : 'bg-stone-300 dark:bg-slate-600'
                      }`}
                      title={showCitations ? 'Switch to Raw Text Mode' : 'Show Grounding & Citations'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-950 shadow-md transition duration-200 ease-in-out ${
                          showCitations ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase min-w-[24px] ${
                        showCitations
                          ? 'text-amber-800 dark:text-amber-300'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {showCitations ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              )}

              {/* View Mode Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-stone-100/90 dark:bg-slate-800 rounded-xl border border-stone-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onChangeViewMode('stacked')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    viewMode === 'stacked'
                      ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-amber-300 shadow-2xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                  title="Stacked statements line-by-line"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Stacked</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeViewMode('prose')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    viewMode === 'prose'
                      ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-amber-300 shadow-2xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                  title="Natural editorial paragraph flow"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Prose Flow</span>
                </button>
              </div>
            </div>
          </div>

          <h1 className="mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
            {post.title}
          </h1>

          {post.summary && (
            <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              {post.summary}
            </p>
          )}
        </div>

        {/* Statements Display Container */}
        {viewMode === 'stacked' ? (
          /* Stacked Statements View */
          <div className="space-y-3 sm:space-y-4">
            {post.statements.map((stmt) => {
              const highlighted = isTypeHighlighted(stmt.type);
              const config = GROUNDING_CONFIGS[stmt.type];
              const isHovered = hoveredStatementId === stmt.id;
              const isSelected = selectedStatementId === stmt.id;
              const urlRefIndex = stmt.url ? urlRefIndexMap.get(stmt.id) : undefined;

              return (
                <div
                  key={stmt.id}
                  data-statement-id={stmt.id}
                  ref={(el) => {
                    if (el) statementRefs.current.set(stmt.id, el);
                    else statementRefs.current.delete(stmt.id);
                  }}
                  onMouseEnter={() => onHoverStatement(stmt.id)}
                  onMouseLeave={() => onHoverStatement(null)}
                  onClick={() => onSelectStatement(isSelected ? null : stmt.id)}
                  className={`group relative p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-stone-900 dark:border-amber-400 bg-stone-50/95 dark:bg-slate-800 shadow-md ring-2 ring-amber-500/30'
                      : isHovered
                      ? 'border-stone-400 dark:border-slate-600 bg-stone-50/70 dark:bg-slate-800/80 shadow-xs'
                      : highlighted
                      ? `${config.borderClass} ${config.bgLightClass}`
                      : 'border-stone-200/80 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                    <div className="flex-1">
                      {/* Statement text with colored styling if highlighted */}
                      <p
                        className={`text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed transition-colors ${
                          highlighted
                            ? `${config.colorClass}`
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {stmt.text}

                        {/* If URL reference and citations enabled, show [url ref X] inline pill */}
                        {showCitations && stmt.type === 'url_reference' && urlRefIndex !== undefined && (
                          <span
                            className={`inline-flex items-center gap-1 ml-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium rounded-md align-middle transition-colors ${
                              highlighted
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span>url ref {urlRefIndex}</span>
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Quick copy quote affordance */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyQuote(stmt, e)}
                      title="Copy statement quote"
                      className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 rounded-lg transition-all shrink-0"
                    >
                      {copiedId === stmt.id ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Detail drawer when selected */}
                  {isSelected && (
                    <div className="mt-3.5 pt-3.5 sm:mt-4 sm:pt-4 border-t border-stone-200/80 dark:border-slate-800 animate-in fade-in duration-150">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[11px] sm:text-xs ${config.badgeBg} ${config.badgeText}`}
                          >
                            {config.name} ({config.nameId})
                          </span>
                          {stmt.confidence && (
                            <span className="text-stone-500 dark:text-stone-400 capitalize text-[11px] sm:text-xs">
                              · Confidence: {stmt.confidence}
                            </span>
                          )}
                        </div>

                        {stmt.url && (
                          <a
                            href={stmt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:underline font-semibold text-xs py-1"
                          >
                            <span>Open reference link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {stmt.urlTitle && (
                        <p className="mt-2 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300">
                          Source title: <span className="font-normal italic">{stmt.urlTitle}</span>
                        </p>
                      )}

                      {stmt.dataContext && (
                        <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-slate-800 p-2.5 sm:p-3 rounded-xl border border-stone-200 dark:border-slate-700">
                          <span className="font-semibold text-stone-800 dark:text-stone-100">Data Context: </span>
                          {stmt.dataContext}
                        </p>
                      )}

                      {stmt.observationContext && (
                        <p className="mt-2 text-xs sm:text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 sm:p-3 rounded-xl border border-amber-200 dark:border-amber-900">
                          <span className="font-semibold">Observation Notes: </span>
                          {stmt.observationContext}
                        </p>
                      )}

                      {stmt.note && (
                        <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 italic">
                          "{stmt.note}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Natural Editorial Prose Flow */
          <div className="prose max-w-none text-stone-800 dark:text-stone-200 text-base sm:text-lg md:text-xl font-serif leading-relaxed sm:leading-loose space-y-4">
            <p className="space-x-1">
              {post.statements.map((stmt) => {
                const highlighted = isTypeHighlighted(stmt.type);
                const config = GROUNDING_CONFIGS[stmt.type];
                const isHovered = hoveredStatementId === stmt.id;
                const isSelected = selectedStatementId === stmt.id;
                const urlRefIndex = stmt.url ? urlRefIndexMap.get(stmt.id) : undefined;

                return (
                  <span
                    key={stmt.id}
                    data-statement-id={stmt.id}
                    ref={(el) => {
                      if (el) statementRefs.current.set(stmt.id, el as unknown as HTMLDivElement);
                      else statementRefs.current.delete(stmt.id);
                    }}
                    onMouseEnter={() => onHoverStatement(stmt.id)}
                    onMouseLeave={() => onHoverStatement(null)}
                    onClick={() => onSelectStatement(isSelected ? null : stmt.id)}
                    className={`inline cursor-pointer rounded-xs px-1 py-0.5 transition-all duration-150 ${
                      isSelected
                        ? 'bg-amber-100 dark:bg-amber-950 ring-2 ring-amber-500 text-stone-900 dark:text-amber-200 font-medium'
                        : isHovered
                        ? 'bg-stone-200/80 dark:bg-slate-800 text-stone-900 dark:text-stone-100'
                        : highlighted
                        ? `${config.bgLightClass} ${config.colorClass} underline decoration-2 decoration-current/40 underline-offset-4 rounded-sm px-1 py-0.5`
                        : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {stmt.text}{' '}
                    {showCitations && stmt.type === 'url_reference' && urlRefIndex !== undefined && (
                      <sup className="font-mono text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded ml-0.5 select-none align-super">
                        [{urlRefIndex}]
                      </sup>
                    )}
                  </span>
                );
              })}
            </p>
          </div>
        )}

        {/* Board Bottom Context Bar */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
            <span>
              Click any statement to inspect its underlying evidence context or external citation.
            </span>
          </div>
          <div className="font-mono">
            {!showCitations ? (
              <span className="text-stone-500 font-semibold">
                Clean Raw Text Mode (Grounding Hidden)
              </span>
            ) : activeHighlightedTypes.length === 1 && activeHighlightedTypes[0] === 'url_reference' ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Active Filter: URL References Only
              </span>
            ) : (
              <span>
                Active Highlights: {activeHighlightedTypes.length} Grounding Types
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
