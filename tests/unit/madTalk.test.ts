import { describe, it, expect } from 'vitest';
import { MAD_TALK, pickMadTalk } from '../../src/lib/madTalk';
import type { Tier } from '../../src/lib/types';

describe('madTalk', () => {
  it('每个 tier 至少有 2 条文案', () => {
    const tiers: Tier[] = ['T0', 'T1', 'T2', 'T3'];
    for (const t of tiers) {
      expect(MAD_TALK[t].length).toBeGreaterThanOrEqual(2);
    }
  });

  it('pickMadTalk 返回的字符串属于该 tier 的池子', () => {
    const tiers: Tier[] = ['T0', 'T1', 'T2', 'T3'];
    for (const t of tiers) {
      for (let i = 0; i < 20; i++) {
        const text = pickMadTalk(t);
        expect(MAD_TALK[t]).toContain(text);
      }
    }
  });

  it('文案非空', () => {
    for (const tier of Object.keys(MAD_TALK) as Tier[]) {
      for (const text of MAD_TALK[tier]) {
        expect(text.length).toBeGreaterThan(0);
      }
    }
  });
});
