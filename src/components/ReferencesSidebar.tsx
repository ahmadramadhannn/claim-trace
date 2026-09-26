import React, { useState } from 'react';
import {
  ExternalLink,
  Target,
  Filter,
  ChevronDown,
  ChevronUp,
  PanelRightClose,
} from 'lucide-react';
import {
  GroundingType,
  GROUNDING_CONFIGS,
  PostDocument,
} from '../types/claim';

interface ReferencesSidebarProps {
  post: PostDocument;
  activeHighlightedTypes: GroundingType[];
  onToggleType: (type: GroundingType) => void;
  onSetTypes: (types: GroundingType[]) => void;
  hoveredStatementId: string | null;
  onHoverStatement: (id: string | null) => void;
  selectedStatementId: string | null;
  onSelectStatement: (id: string | null) => void;
  urlRefIndexMap: Map<string, number>;
  onHideSidebar?: () => void;
}

export const ReferencesSidebar: React.FC<ReferencesSidebarProps> = ({
  post,
  activeHighlightedTypes,
  onToggleType,
  onSetTypes,
  hoveredStatementId,
  onHoverStatement,
  selectedStatementId,
  onSelectStatement,
  urlRefIndexMap,
  onHideSidebar,
}) => {
  const [showTogglesDetail, setShowTogglesDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'url_refs' | 'all_evidence'>('url_refs');

  // Filter URL reference statements
  const urlStatements = post.statements.filter(
    (s) => s.type === 'url_reference' && s.url
  );

  const allStatementsWithGrounding = post.statements;

  const isTypeActive = (type: GroundingType) => activeHighlightedTypes.includes(type);

  const isUrlOnly =
    activeHighlightedTypes.length === 1 && activeHighlightedTypes[0] === 'url_reference';

  const isAllActive = activeHighlightedTypes.length === Object.keys(GROUNDING_CONFIGS).length;

  const handleGoToStatement = (stmtId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectStatement(stmtId);
  };

  const handleOpenUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col gap-4">
      {/* Excalidraw-Styled Right Panel Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 shadow-xs flex flex-col p-4 sm:p-5 lg:p-6 static lg:sticky lg:top-20 max-h-none lg:max-h-[calc(100vh-6rem)] overflow-hidden transition-colors">
        {/* Panel Header & Toggle Section */}
        <div className="border-b border-stone-100 dark:border-slate-800 pb-3.5 sm:pb-4 mb-3.5 sm:mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                References & Grounding
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                {urlStatements.length} URLs
              </span>
            </div>

            {/* Filter Toggle & Hide Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowTogglesDetail(!showTogglesDetail)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  showTogglesDetail
                    ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400 shadow-2xs font-semibold'
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700 border-stone-300 dark:border-slate-700'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {showTogglesDetail ? (
                  <ChevronUp className="w-3 h-3 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                )}
              </button>

              {onHideSidebar && (
                <button
                  type="button"
                  onClick={onHideSidebar}
                  className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-stone-200 dark:border-slate-700 flex items-center gap-1 text-xs font-medium"
                  title="Hide References & Grounding Sidebar"
                >
                  <PanelRightClose className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hide</span>
                </button>
              )}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => onSetTypes(['url_reference'])}
              className={`flex-1 py-1.5 sm:py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                isUrlOnly
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-400 shadow-2xs ring-1 ring-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border-stone-200 dark:border-slate-700'
              }`}
            >
              URL Ref Only
            </button>
            <button
              type="button"
              onClick={() =>
                onSetTypes(
                  isAllActive
                    ? ['url_reference']
                    : (Object.keys(GROUNDING_CONFIGS) as GroundingType[])
                )
              }
              className={`flex-1 py-1.5 sm:py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                isAllActive
                  ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border-stone-200 dark:border-slate-700'
              }`}
            >
              {isAllActive ? 'Reset to URLs' : 'Show All Types'}
            </button>
          </div>

          {/* Collapsible Individual Toggles */}
          {showTogglesDetail && (
            <div className="mt-3 p-3 bg-stone-50 dark:bg-slate-800/80 rounded-xl border border-stone-200/80 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
              <p className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                Toggle statement categories to highlight on board:
              </p>
              {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((type) => {
                const config = GROUNDING_CONFIGS[type];
                const active = isTypeActive(type);
                const count = post.statements.filter((s) => s.type === type).length;

                return (
                  <label
                    key={type}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => onToggleType(type)}
                        className="rounded border-stone-300 dark:border-slate-600 text-stone-900 dark:text-amber-400 focus:ring-stone-400 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="font-medium text-stone-800 dark:text-stone-200 text-xs">
                        {config.name}
                      </span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">
                        ({config.nameId})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: config.hexColor }}
                        title={config.sketchColor}
                      />
                      <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                        {count}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg mb-3 border border-stone-200/60 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('url_refs')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'url_refs'
                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-amber-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            URL Citations ({urlStatements.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all_evidence')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'all_evidence'
                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-amber-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            All Statements ({post.statements.length})
          </button>
        </div>

        {/* References List Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 max-h-[60vh] lg:max-h-none">
          {activeTab === 'url_refs' ? (
            urlStatements.length > 0 ? (
              urlStatements.map((stmt) => {
                const urlIndex = urlRefIndexMap.get(stmt.id) || 1;
                const isHovered = hoveredStatementId === stmt.id;
                const isSelected = selectedStatementId === stmt.id;

                return (
                  <div
                    key={stmt.id}
                    onMouseEnter={() => onHoverStatement(stmt.id)}
                    onMouseLeave={() => onHoverStatement(null)}
                    onClick={() => onSelectStatement(isSelected ? null : stmt.id)}
                    className={`group relative p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/60 shadow-xs ring-1 ring-emerald-500'
                        : isHovered
                        ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs'
                        : 'border-stone-200/90 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300/80 dark:border-emerald-800">
                          url ref {urlIndex}
                        </span>
                        {stmt.urlDomain && (
                          <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
                            {stmt.urlDomain}
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                      {stmt.urlTitle || stmt.url}
                    </h4>

                    <p className="mt-1 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 line-clamp-2 italic">
                      "{stmt.text}"
                    </p>

                    {/* Prominent Two Options */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenUrl(stmt.url!, e)}
                        title="Open external source URL in new tab"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 min-h-[38px] text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors active:scale-95 shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        <span>1. Open URL</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleGoToStatement(stmt.id, e)}
                        title="Scroll to and highlight this statement on the board"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 min-h-[38px] text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 rounded-lg transition-colors active:scale-95 shadow-2xs"
                      >
                        <Target className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0" />
                        <span>2. Go to Board</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 px-4 text-xs text-stone-400 dark:text-stone-500">
                No external URL references attached to this post yet.
              </div>
            )
          ) : (
            allStatementsWithGrounding.map((stmt) => {
              const config = GROUNDING_CONFIGS[stmt.type];
              const isHovered = hoveredStatementId === stmt.id;
              const isSelected = selectedStatementId === stmt.id;
              const isHighlighted = isTypeActive(stmt.type);

              return (
                <div
                  key={stmt.id}
                  onMouseEnter={() => onHoverStatement(stmt.id)}
                  onMouseLeave={() => onHoverStatement(null)}
                  onClick={() => onSelectStatement(isSelected ? null : stmt.id)}
                  className={`group p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'border-stone-900 dark:border-amber-400 bg-stone-50 dark:bg-slate-800 shadow-xs'
                      : isHovered
                      ? 'border-stone-400 dark:border-slate-600 bg-stone-50/70 dark:bg-slate-800/80'
                      : isHighlighted
                      ? `${config.borderClass} bg-stone-50/40 dark:bg-slate-800/40`
                      : 'border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded ${config.badgeBg} ${config.badgeText}`}
                    >
                      {config.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleGoToStatement(stmt.id, e)}
                      className="text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-1"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Go to board</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 line-clamp-2 leading-relaxed">
                    {stmt.text}
                  </p>
                  {stmt.url && (
                    <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                      <span className="text-emerald-700 dark:text-emerald-400 truncate max-w-[200px] font-medium">
                        {stmt.urlTitle || stmt.url}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleOpenUrl(stmt.url!, e)}
                        className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0 font-semibold"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 mt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400 dark:text-stone-500">
          <span>Tap ref to highlight statement & open URL</span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">Excalidraw Mode</span>
        </div>
      </div>
    </aside>
  );
};
