import type { TabType } from './types';
import { User, Settings, Bell, Star, Database, Cloud, Laptop, Github, Wrench, List } from 'lucide-react';





export const TAB_ICONS: Record<TabType, React.ComponentType<{ className?: string }>> = {
  profile: User,
  settings: Settings,
  features: Star,
  data: Database,
  'cloud-providers': Cloud,
  github: Github,
};

export const TAB_LABELS: Record<TabType, string> = {
  profile: 'Profile',
  settings: 'Settings',
  features: 'Features',
  data: 'Data Management',
  'cloud-providers': 'Cloud Providers',
  github: 'GitHub',
};

export const TAB_DESCRIPTIONS: Record<TabType, string> = {
  profile: 'Manage your profile and account settings',
  settings: 'Configure application preferences',
  features: 'Explore new and upcoming features',
  data: 'Manage your data and storage',
  'cloud-providers': 'Configure cloud AI providers and models',
  github: 'Connect and manage GitHub integration',
};

export const DEFAULT_TAB_CONFIG = [
  // User Window Tabs (Always visible by default)
  { id: 'features', visible: true, window: 'user' as const, order: 0 },
  { id: 'data', visible: true, window: 'user' as const, order: 1 },
  { id: 'cloud-providers', visible: true, window: 'user' as const, order: 2 },
  { id: 'github', visible: true, window: 'user' as const, order: 4 },
  { id: 'github', visible: true, window: 'user' as const, order: 4 },

  // User Window Tabs (In dropdown, initially hidden)
];
