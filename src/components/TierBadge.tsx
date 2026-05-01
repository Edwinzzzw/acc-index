import type { Tier } from '../lib/types';
import { TIER_COLORS, TIER_LABELS } from '../lib/tier';

interface Props {
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tier, size = 'md' }: Props) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-1.5',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold text-white ${sizes[size]}`}
      style={{ backgroundColor: TIER_COLORS[tier] }}
    >
      <span className="opacity-80">{tier}</span>
      <span>{TIER_LABELS[tier]}</span>
    </span>
  );
}
