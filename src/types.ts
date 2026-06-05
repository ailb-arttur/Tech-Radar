/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryKey = 'AI_ASSISTANTS' | 'API_ENDPOINTS' | 'FRAMEWORKS' | 'SECURITY_HQ' | 'DATABASES_DEV';

export interface Category {
  key: CategoryKey;
  label: string;
  iconName: string; // Lucide icon lookup string
}

export interface ToolSignal {
  id: string;
  name: string;
  iconType: 'lucide' | 'emoji';
  iconName: string; // e.g. "Cpu", "Terminal" or emoji string "🤖"
  category: CategoryKey;
  version: string;
  status: 'STABLE' | 'BETA' | 'HIGH_IMPACT' | 'CRITICAL' | 'DEPRECATED';
  lastUpdated: string; // ISO date string or human readable string
  summary: string;
  changes: string[];
  predictions: string[]; // "Previsões / Rumores"
  weakSignals: string[]; // "Sinais Fracos / Discussões em comunidades (Reddit, etc)"
  securityAlerts: string[]; // "Alertas de vulnerabilidades"
  unread: boolean; // blue indicator dot
}

export interface TechNews {
  id: string;
  title: string;
  summary: string;
  body: string;
  // optional image URL (og:image or thumbnail)
  image?: string;
  // optional shorter excerpt used for previews
  excerpt?: string;
  source: string;
  date: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
}
