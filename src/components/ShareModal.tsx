import React, { useState } from 'react';
import { X, Copy, Check, Link2, Share2, FileText } from 'lucide-react';
import { PostDocument } from '../types/claim';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostDocument;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null;

  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Direct clean URL to the post route /posts/:id
  const shareUrl = `${window.location.origin}/posts/${post.id}`;

  const urlCount = post.statements.filter((s) => s.type === 'url_reference').length;
  const dataCount = post.statements.filter((s) => s.type === 'data').length;
  const obsCount = post.statements.filter((s) => s.type === 'observation').length;

  const summaryParts = [];
  if (urlCount > 0) summaryParts.push(`${urlCount} URL citations`);
  if (dataCount > 0) summaryParts.push(`${dataCount} data points`);
  if (obsCount > 0) summaryParts.push(`${obsCount} observations`);

  const summaryString = summaryParts.join(' · ');

  const fullBodyText = post.statements.map((s) => s.text).join('\n\n');
  const socialSnippet = `${fullBodyText}\n\n---\n🔍 Statement breakdown & sources:\n${shareUrl}\n(${summaryString})`;

  const markdownSnippet = `${post.title}\n\n${post.statements
    .map((s, idx) => {
      let citationTag = '';
      if (s.type === 'url_reference' && s.url) {
        citationTag = ` [^${idx + 1}]`;
      }
      return `${s.text}${citationTag}`;
    })
    .join('\n\n')}\n\n---\n\n${post.statements
    .filter((s) => s.type === 'url_reference' && s.url)
    .map((s, idx) => `[^${idx + 1}]: ${s.urlTitle || 'Source'}: ${s.url}`)
    .join('\n')}\n\n*Interactive attribution analysis available on ClaimTrace: ${shareUrl}*`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xl max-w-xl w-full flex flex-col overflow-hidden transition-colors max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100">
              Share & Reference This Trace Post
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Shareable URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Direct Link to /posts/{post.id}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full text-xs font-mono px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg select-all text-stone-900 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(shareUrl, 'link')}
                className="px-3.5 py-2 text-xs font-semibold text-white dark:text-stone-950 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors active:scale-95"
              >
                {copiedType === 'link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Snippet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                <span>Social Post Footer (Ready for X/LinkedIn)</span>
              </label>
              <button
                type="button"
                onClick={() => copyToClipboard(socialSnippet, 'social')}
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                {copiedType === 'social' ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={socialSnippet}
              className="w-full text-xs p-3 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg font-mono text-stone-700 dark:text-stone-200 select-all"
            />
          </div>

          {/* Markdown Format */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Markdown Footnotes (For Substack & Newsletters)
              </label>
              <button
                type="button"
                onClick={() => copyToClipboard(markdownSnippet, 'markdown')}
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                {copiedType === 'markdown' ? 'Copied!' : 'Copy Markdown'}
              </button>
            </div>
            <textarea
              readOnly
              rows={3}
              value={markdownSnippet}
              className="w-full text-xs p-3 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg font-mono text-stone-700 dark:text-stone-200 select-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-slate-800/80 border-t border-stone-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
