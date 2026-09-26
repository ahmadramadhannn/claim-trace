import React from 'react';
import { X, Palette } from 'lucide-react';
import { GROUNDING_CONFIGS, GroundingType } from '../types/claim';

interface GroundingLegendProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroundingLegend: React.FC<GroundingLegendProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Intuitive Color Taxonomy Legend</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Each color instantly communicates the epistemic grounding type at a glance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-2.5 sm:space-y-3.5">
          {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((type) => {
            const config = GROUNDING_CONFIGS[type];
            return (
              <div
                key={type}
                className="p-3 sm:p-4 rounded-xl border border-stone-200/80 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex items-start gap-2.5 sm:gap-3.5"
              >
                <div
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full mt-1 shrink-0 shadow-xs"
                  style={{ backgroundColor: config.hexColor }}
                />
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        {config.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs font-mono text-stone-400 dark:text-stone-500">
                        ({config.nameId})
                      </span>
                    </div>

                    <span
                      className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${config.hexColor}15`,
                        borderColor: `${config.hexColor}40`,
                        color: config.hexColor,
                      }}
                    >
                      {config.colorMeaning}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-stone-50 dark:bg-slate-800/80 border-t border-stone-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
