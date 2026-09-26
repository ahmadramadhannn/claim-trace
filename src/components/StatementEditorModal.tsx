import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Split,
  Check,
  HelpCircle,
} from 'lucide-react';
import {
  PostDocument,
  StatementClaim,
  GroundingType,
  GROUNDING_CONFIGS,
} from '../types/claim';

interface StatementEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPost?: PostDocument | null;
  onSavePost: (post: PostDocument) => void;
}

export const StatementEditorModal: React.FC<StatementEditorModalProps> = ({
  isOpen,
  onClose,
  initialPost,
  onSavePost,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialPost?.title || 'My New Social Post');
  const [authorName, setAuthorName] = useState(initialPost?.author.name || 'Author');
  const [authorHandle, setAuthorHandle] = useState(initialPost?.author.handle || '@author');
  const [platform, setPlatform] = useState<PostDocument['author']['platform']>(
    initialPost?.author.platform || 'threads'
  );
  const [summary, setSummary] = useState(
    initialPost?.summary || 'Context and attribution breakdown for this post.'
  );

  const [statements, setStatements] = useState<StatementClaim[]>(
    initialPost?.statements || [
      {
        id: 'stmt-' + Date.now() + '-1',
        text: 'Ini adalah statement berdasarkan pengalaman pribadi.',
        type: 'personal_experience',
      },
      {
        id: 'stmt-' + Date.now() + '-2',
        text: 'Ini adalah statement berdasarkan data statistik yang terukur.',
        type: 'data',
        dataContext: 'Survei industri kuartal 4',
      },
      {
        id: 'stmt-' + Date.now() + '-3',
        text: 'Ini adalah statement berdasarkan observasi di lapangan.',
        type: 'observation',
      },
      {
        id: 'stmt-' + Date.now() + '-4',
        text: 'Ini adalah statement berdasarkan opini pribadi.',
        type: 'personal_opinion',
      },
      {
        id: 'stmt-' + Date.now() + '-5',
        text: 'Ini adalah statement yang diambil dari situs referensi eksternal.',
        type: 'url_reference',
        url: 'https://example.com/reference',
        urlTitle: 'Example Reference Source',
        urlDomain: 'example.com',
      },
    ]
  );

  // Quick Raw Text Paste to Auto-Split
  const [rawText, setRawText] = useState('');
  const [showAutoSplitter, setShowAutoSplitter] = useState(false);

  const handleAutoSplit = () => {
    if (!rawText.trim()) return;

    // Split text by sentence terminators (. ! ? \n)
    const rawSentences = rawText
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (rawSentences.length === 0) return;

    const newClaims: StatementClaim[] = rawSentences.map((sentence, idx) => {
      // Heuristic detection: does it look like data or personal or url?
      let detectedType: GroundingType = 'personal_opinion';
      let detectedUrl: string | undefined = undefined;

      const urlMatch = sentence.match(/(https?:\/\/[^\s]+)/g);
      if (urlMatch) {
        detectedType = 'url_reference';
        detectedUrl = urlMatch[0];
      } else if (/\d+%|\bdata\b|\bmetric\b|\bstat\b|\bpersen\b|\bsurvei\b/i.test(sentence)) {
        detectedType = 'data';
      } else if (/\bsaya\b|\bmy experience\b|\bpribadi\b|\bpernah\b|\bi noticed\b/i.test(sentence)) {
        detectedType = 'personal_experience';
      } else if (/\bobservasi\b|\bsering kali\b|\bterlihat\b|\bobserved\b/i.test(sentence)) {
        detectedType = 'observation';
      }

      return {
        id: `stmt-${Date.now()}-${idx}`,
        text: sentence,
        type: detectedType,
        url: detectedUrl,
        urlDomain: detectedUrl ? new URL(detectedUrl).hostname.replace('www.', '') : undefined,
      };
    });

    setStatements(newClaims);
    setShowAutoSplitter(false);
  };

  const handleAddStatement = () => {
    const newClaim: StatementClaim = {
      id: 'stmt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text: '',
      type: 'url_reference',
    };
    setStatements([...statements, newClaim]);
  };

  const handleUpdateStatement = (id: string, updates: Partial<StatementClaim>) => {
    setStatements(
      statements.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };

        // If URL updated, try extracting domain
        if (updates.url) {
          try {
            const urlObj = new URL(updates.url);
            updated.urlDomain = urlObj.hostname.replace('www.', '');
          } catch {
            // invalid URL while typing is fine
          }
        }
        return updated;
      })
    );
  };

  const handleRemoveStatement = (id: string) => {
    setStatements(statements.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    const newPost: PostDocument = {
      id: initialPost?.id || 'post-' + Date.now(),
      title: title.trim() || 'Untitled Post',
      author: {
        name: authorName.trim() || 'Author',
        handle: authorHandle.trim() || '@author',
        platform,
      },
      createdAt: initialPost?.createdAt || 'Just now',
      summary: summary.trim(),
      statements: statements.filter((s) => s.text.trim().length > 0),
    };

    onSavePost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              {initialPost ? 'Edit Post & Statements' : 'Create New Grounded Post'}
            </h2>
            <p className="text-xs text-stone-500">
              Mark each statement as observation, data, personal experience, opinion, or URL reference.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Meta Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Post Title / Main Topic
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Breakdown of my observation on AI adoption..."
                className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ahmad Ramadhan"
                className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Social Handle & Platform
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  placeholder="@handle"
                  className="flex-1 text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono"
                />
                <select
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as PostDocument['author']['platform'])
                  }
                  className="text-xs px-2 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="threads">Threads</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="substack">Substack</option>
                  <option value="custom">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Paste & Auto-Split Section */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Split className="w-4 h-4 text-stone-600" />
                <span>Quick Paste from Social Media / Paragraph</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAutoSplitter(!showAutoSplitter)}
                className="text-xs text-stone-600 hover:text-stone-900 underline"
              >
                {showAutoSplitter ? 'Hide Paste Tool' : 'Paste Raw Post Text'}
              </button>
            </div>

            {showAutoSplitter && (
              <div className="mt-3 space-y-2 animate-in fade-in duration-150">
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your full tweet, post, or thoughts here. We will split it into distinct sentences and auto-detect claims..."
                  className="w-full text-xs p-3 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
                <button
                  type="button"
                  onClick={handleAutoSplit}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Split into Statements & Detect Types</span>
                </button>
              </div>
            )}
          </div>

          {/* Statement List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-800">
                Statements ({statements.length})
              </h3>
              <button
                type="button"
                onClick={handleAddStatement}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Statement</span>
              </button>
            </div>

            {statements.map((stmt, idx) => {
              const config = GROUNDING_CONFIGS[stmt.type];

              return (
                <div
                  key={stmt.id}
                  className="p-4 bg-white border border-stone-200 rounded-xl shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-stone-500 font-semibold">
                      Statement #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStatement(stmt.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      title="Remove statement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Statement Text input */}
                  <textarea
                    rows={2}
                    value={stmt.text}
                    onChange={(e) =>
                      handleUpdateStatement(stmt.id, { text: e.target.value })
                    }
                    placeholder="Enter the statement or assertion here..."
                    className="w-full text-sm p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />

                  {/* Grounding Type Picker Chips */}
                  <div>
                    <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                      Grounding Basis (What is this statement based on?):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(GROUNDING_CONFIGS) as GroundingType[]).map((t) => {
                        const c = GROUNDING_CONFIGS[t];
                        const isSelected = stmt.type === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleUpdateStatement(stmt.id, { type: t })}
                            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: c.hexColor }}
                            />
                            <span>{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditional Fields based on Type */}
                  {stmt.type === 'url_reference' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/70">
                      <div>
                        <label className="block text-[11px] font-semibold text-emerald-900 mb-0.5">
                          Source URL:
                        </label>
                        <input
                          type="url"
                          value={stmt.url || ''}
                          onChange={(e) =>
                            handleUpdateStatement(stmt.id, { url: e.target.value })
                          }
                          placeholder="https://example.com/source"
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-emerald-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-emerald-900 mb-0.5">
                          Source Title / Publisher:
                        </label>
                        <input
                          type="text"
                          value={stmt.urlTitle || ''}
                          onChange={(e) =>
                            handleUpdateStatement(stmt.id, { urlTitle: e.target.value })
                          }
                          placeholder="e.g. W3C Recommendation"
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-emerald-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {stmt.type === 'data' && (
                    <div className="pt-2 border-t border-stone-100 bg-stone-100/60 p-2.5 rounded-lg border border-stone-200">
                      <label className="block text-[11px] font-semibold text-stone-800 mb-0.5">
                        Data Context / Metric Source:
                      </label>
                      <input
                        type="text"
                        value={stmt.dataContext || ''}
                        onChange={(e) =>
                          handleUpdateStatement(stmt.id, {
                            dataContext: e.target.value,
                          })
                        }
                        placeholder="e.g. Q3 2025 Internal database analytics across 10k users"
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-md focus:outline-none"
                      />
                    </div>
                  )}

                  {stmt.type === 'observation' && (
                    <div className="pt-2 border-t border-stone-100 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                      <label className="block text-[11px] font-semibold text-amber-900 mb-0.5">
                        Observation Notes:
                      </label>
                      <input
                        type="text"
                        value={stmt.observationContext || ''}
                        onChange={(e) =>
                          handleUpdateStatement(stmt.id, {
                            observationContext: e.target.value,
                          })
                        }
                        placeholder="e.g. Observed across 20 sprint retrospectives over 6 months"
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-amber-300 rounded-md focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & View on Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
