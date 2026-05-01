/**
 * Tier 判定逻辑
 *
 * 评级标准（以 9 月开学为基准）：
 *   T0 夯爆了：次年 1–2 月结课  → acc_weeks ≤ 22
 *   T1 顶级  ：次年 3–4 月结课  → 23 ≤ acc_weeks ≤ 32
 *   T2 人上人：次年 5 月结课    → 33 ≤ acc_weeks ≤ 37
 *   T3 NPC   ：次年 6 月或更晚 → acc_weeks ≥ 38
 *
 * 边界值在 tests/unit/tier.test.ts 中钉死，修改时务必同步更新测试。
 */

import type { Tier, TierLabel } from './types';

export const TIER_BOUNDARIES = {
  T0_MAX: 22,
  T1_MAX: 32,
  T2_MAX: 37,
} as const;

export const TIER_LABELS: Record<Tier, TierLabel> = {
  T0: '夯爆了',
  T1: '顶级',
  T2: '人上人',
  T3: 'NPC',
};

export const TIER_DESCRIPTIONS: Record<Tier, string> = {
  T0: '神仙学校。开学即冲刺，春季直接放飞，完美的实习与科研时间差。',
  T1: '主流中的优秀代表，结课早，能完美衔接暑期实习和春招。',
  T2: '中规中矩。时间安排略显拖沓，但还能抢救一下。',
  T3: '战线拉得极长。研一下还在赶 pre 和小组作业的时候，T0 同学的 SCI 已经收到 reviewer comments 了。',
};

export const TIER_COLORS: Record<Tier, string> = {
  T0: '#ef4444',
  T1: '#f59e0b',
  T2: '#3b82f6',
  T3: '#6b7280',
};

/**
 * 根据周数返回 tier。
 * @param accWeeks 从开学到结课的整周数
 */
export function computeTier(accWeeks: number): Tier {
  if (!Number.isFinite(accWeeks) || accWeeks < 0) {
    throw new Error(`Invalid acc_weeks: ${accWeeks}`);
  }
  if (accWeeks <= TIER_BOUNDARIES.T0_MAX) return 'T0';
  if (accWeeks <= TIER_BOUNDARIES.T1_MAX) return 'T1';
  if (accWeeks <= TIER_BOUNDARIES.T2_MAX) return 'T2';
  return 'T3';
}

export function tierLabel(tier: Tier): TierLabel {
  return TIER_LABELS[tier];
}

/**
 * 计算两个 ISO 日期 (YYYY-MM-DD) 之间的整周数。
 * 用 floor 而不是 round，避免边界 case 把"差几天"算多。
 */
export function weeksBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO + 'T00:00:00Z');
  const end = new Date(endISO + 'T00:00:00Z');
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error(`Invalid date(s): ${startISO} ~ ${endISO}`);
  }
  if (end < start) {
    throw new Error(`End date precedes start date: ${startISO} ~ ${endISO}`);
  }
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}
