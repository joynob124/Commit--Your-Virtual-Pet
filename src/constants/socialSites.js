import {
  Play,
  Camera,
  Users,
  Share2,
  Music2,
  MessageCircle,
  Gamepad2,
  Briefcase,
  Pin,
  Ghost,
  Globe,
  Monitor,
} from 'lucide-react';

export const SITE_META = {
  'youtube.com':   { label: 'YouTube',   emoji: '📺', color: '#ff4444', Icon: Play },
  'instagram.com': { label: 'Instagram', emoji: '📸', color: '#e1306c', Icon: Camera },
  'facebook.com':  { label: 'Facebook',  emoji: '👤', color: '#1877f2', Icon: Users },
  'twitter.com':   { label: 'Twitter',   emoji: '🐦', color: '#1da1f2', Icon: Share2 },
  'x.com':         { label: 'X',         emoji: '🐦', color: '#1da1f2', Icon: Share2 },
  'tiktok.com':    { label: 'TikTok',    emoji: '🎵', color: '#ff0050', Icon: Music2 },
  'reddit.com':    { label: 'Reddit',    emoji: '👽', color: '#ff4500', Icon: MessageCircle },
  'snapchat.com':  { label: 'Snapchat',  emoji: '👻', color: '#fffc00', Icon: Ghost },
  'pinterest.com': { label: 'Pinterest', emoji: '📌', color: '#e60023', Icon: Pin },
  'twitch.tv':     { label: 'Twitch',    emoji: '🎮', color: '#9147ff', Icon: Gamepad2 },
  'linkedin.com':  { label: 'LinkedIn',  emoji: '💼', color: '#0a66c2', Icon: Briefcase },
  'discord.com':   { label: 'Discord',   emoji: '💬', color: '#5865f2', Icon: MessageCircle },
  'threads.net':   { label: 'Threads',   emoji: '🧵', color: '#101010', Icon: Monitor },
};

export function getSiteMeta(site) {
  return (
    SITE_META[site] || {
      label: site?.split('.')[0] || 'Unknown',
      emoji: '📵',
      color: '#a78bfa',
      Icon: Globe,
    }
  );
}
