/**
 * Tier 判定逻辑
 *
 * 评级以 coursework_end_avg 的月份为锚（看"啥时候自由"，不看"总共熬多久"）：
 *   T0 夯爆了 = 12 月 / 1 月结课（年内基本搞定）
 *   T1 顶级   = 2–4 月结课（春天回国，赶上春招/暑期实习）
 *   T2 人上人 = 5 月结课（春天没了，跟美国 master 一档）
 *   T3 NPC    = 6 月及以后结课（一整个夏天没了）
 *
 * 月份阈值而非绝对周数，是因为开学日有 3–4 周差异（HKU 9/1 vs Imperial 9/29），
 * 只看周数会让"5 月初结课但 9 月底开学"的学校被错划进 T1。
 *
 * 边界值在 tests/unit/tier.test.ts 中钉死，修改时务必同步更新测试。
 */

import type { Tier, TierLabel } from './types';

/**
 * 月份口径。仅用于 UI legend / 文档展示，computeTier 内部直接判月份。
 */
export const TIER_END_MONTH_RULE = {
  T0: 'Dec / Jan',
  T1: 'Feb–Apr',
  T2: 'May',
  T3: 'Jun onwards',
} as const;

/**
 * @deprecated tier 不再由周数划档。此常量仅为兼容历史引用保留，请勿用于新逻辑。
 * 新规则按 coursework_end_avg 月份判定，见 {@link computeTier}。
 */
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
 * 根据 coursework_end_avg (ISO YYYY-MM-DD) 返回 tier。
 * 仅看月份。
 *
 * @param courseworkEndISO 结课日，例如 "2026-05-01"
 */
export function computeTier(courseworkEndISO: string): Tier {
  if (typeof courseworkEndISO !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(courseworkEndISO)) {
    throw new Error(`Invalid coursework_end_avg: ${courseworkEndISO}`);
  }
  const month = parseInt(courseworkEndISO.slice(5, 7), 10);
  if (month === 12 || month === 1) return 'T0';
  if (month >= 2 && month <= 4) return 'T1';
  if (month === 5) return 'T2';
  return 'T3';
}

export function tierLabel(tier: Tier): TierLabel {
  return TIER_LABELS[tier];
}

/**
 * 计算两个 ISO 日期 (YYYY-MM-DD) 之间的整周数。
 * 仅供 acc_weeks 字段使用——tier 计算不再依赖 acc_weeks。
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
