/**
 * Grounding taxonomy and claim models for ClaimTrace
 */

export type GroundingType =
  | 'url_reference'       // Based on an external web reference, study, or site
  | 'data'                // Based on empirical data, analytics, or stats
  | 'observation'         // Qualitative direct observation
  | 'personal_opinion'    // Subjective interpretation or perspective
  | 'personal_experience' // Direct firsthand personal anecdote/experience
  | 'research';           // Formal research paper, study, or academic finding

export interface GroundingConfig {
  id: GroundingType;
  name: string;
  nameId: string; // Indonesian title
  description: string;
  colorMeaning: string; // Intuitive color semantics explanation
  iconName: string;
  // Color configuration
  colorClass: string;
  borderClass: string;
  bgLightClass: string;
  badgeBg: string;
  badgeText: string;
  hexColor: string;
  sketchColor: string;
}

export interface StatementClaim {
  id: string;
  text: string;
  type: GroundingType;
  // Specific metadata
  url?: string;
  urlTitle?: string;
  urlFavicon?: string;
  urlDomain?: string;
  dataContext?: string;
  observationContext?: string;
  confidence?: 'verified' | 'strong' | 'hypothesis' | 'anecdotal';
  note?: string;
}

export interface PostDocument {
  id: string;
  title: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
    platform: 'twitter' | 'linkedin' | 'threads' | 'substack' | 'custom';
  };
  createdAt: string;
  summary: string;
  statements: StatementClaim[];
}

export const GROUNDING_CONFIGS: Record<GroundingType, GroundingConfig> = {
  url_reference: {
    id: 'url_reference',
    name: 'URL / Web Reference',
    nameId: 'Situs / URL Referensi',
    description: 'Directly verified or sourced from an external website or live web publication',
    colorMeaning: 'Emerald Green = Verifiable & Safe Link',
    iconName: 'ExternalLink',
    colorClass: 'text-emerald-900 dark:text-emerald-200 font-semibold',
    borderClass: 'border-emerald-300 dark:border-emerald-700',
    bgLightClass: 'bg-emerald-100/90 dark:bg-emerald-950/70 hover:bg-emerald-200/90 dark:hover:bg-emerald-900/80',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
    badgeText: 'text-emerald-900 dark:text-emerald-300',
    hexColor: '#10B981',
    sketchColor: 'Emerald Green',
  },
  data: {
    id: 'data',
    name: 'Empirical Data',
    nameId: 'Berdasarkan Data',
    description: 'Backed by quantifiable metrics, telemetry, chart analytics, or survey statistics',
    colorMeaning: 'Teal Cyan = Technical Metrics & Analytical Data',
    iconName: 'BarChart2',
    colorClass: 'text-teal-900 dark:text-teal-200 font-semibold',
    borderClass: 'border-teal-300 dark:border-teal-700',
    bgLightClass: 'bg-teal-100/90 dark:bg-teal-950/70 hover:bg-teal-200/90 dark:hover:bg-teal-900/80',
    badgeBg: 'bg-teal-100 dark:bg-teal-950',
    badgeText: 'text-teal-900 dark:text-teal-300',
    hexColor: '#0D9488',
    sketchColor: 'Teal Cyan',
  },
  observation: {
    id: 'observation',
    name: 'Observation',
    nameId: 'Berdasarkan Observasi',
    description: 'Firsthand qualitative field observation or recurring behavioral pattern',
    colorMeaning: 'Amber Yellow = Cautionary Field Notice & Pattern Watch',
    iconName: 'Eye',
    colorClass: 'text-amber-900 dark:text-amber-200 font-semibold',
    borderClass: 'border-amber-300 dark:border-amber-700',
    bgLightClass: 'bg-amber-100/90 dark:bg-amber-950/70 hover:bg-amber-200/90 dark:hover:bg-amber-900/80',
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-900 dark:text-amber-300',
    hexColor: '#F59E0B',
    sketchColor: 'Amber Yellow',
  },
  personal_opinion: {
    id: 'personal_opinion',
    name: 'Personal Opinion',
    nameId: 'Opini Pribadi',
    description: 'Subjective thesis, creative philosophy, internal view, or personal evaluation',
    colorMeaning: 'Violet Purple = Internal Mind & Subjective Thought',
    iconName: 'Lightbulb',
    colorClass: 'text-violet-900 dark:text-violet-200 font-semibold',
    borderClass: 'border-violet-300 dark:border-violet-700',
    bgLightClass: 'bg-violet-100/90 dark:bg-violet-950/70 hover:bg-violet-200/90 dark:hover:bg-violet-900/80',
    badgeBg: 'bg-violet-100 dark:bg-violet-950',
    badgeText: 'text-violet-900 dark:text-violet-300',
    hexColor: '#8B5CF6',
    sketchColor: 'Violet Purple',
  },
  personal_experience: {
    id: 'personal_experience',
    name: 'Personal Experience',
    nameId: 'Pengalaman Pribadi',
    description: 'Direct individual story, firsthand lived event, or individual anecdote',
    colorMeaning: 'Rose Coral = Human Story & Lived Experience',
    iconName: 'UserCheck',
    colorClass: 'text-rose-900 dark:text-rose-200 font-semibold',
    borderClass: 'border-rose-300 dark:border-rose-700',
    bgLightClass: 'bg-rose-100/90 dark:bg-rose-950/70 hover:bg-rose-200/90 dark:hover:bg-rose-900/80',
    badgeBg: 'bg-rose-100 dark:bg-rose-950',
    badgeText: 'text-rose-900 dark:text-rose-300',
    hexColor: '#F43F5E',
    sketchColor: 'Rose Coral',
  },
  research: {
    id: 'research',
    name: 'Research & Literature',
    nameId: 'Penelitian & Literatur',
    description: 'Formal academic journal, clinical paper, or peer-reviewed literature',
    colorMeaning: 'Indigo Royal = Academic Rigor & Peer-Reviewed Science',
    iconName: 'BookOpen',
    colorClass: 'text-indigo-900 dark:text-indigo-200 font-semibold',
    borderClass: 'border-indigo-300 dark:border-indigo-700',
    bgLightClass: 'bg-indigo-100/90 dark:bg-indigo-950/70 hover:bg-indigo-200/90 dark:hover:bg-indigo-900/80',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950',
    badgeText: 'text-indigo-900 dark:text-indigo-300',
    hexColor: '#4F46E5',
    sketchColor: 'Indigo Blue',
  },
};
