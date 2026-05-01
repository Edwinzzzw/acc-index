import { describe, it, expect } from 'vitest';
import { computeTier, tierLabel, weeksBetween, TIER_BOUNDARIES } from '../../src/lib/tier';

describe('computeTier - 等级边界', () => {
  it('T0 上限正好是 22 周', () => {
    expect(computeTier(0)).toBe('T0');
    expect(computeTier(15)).toBe('T0');
    expect(computeTier(TIER_BOUNDARIES.T0_MAX)).toBe('T0'); // 22
  });

  it('T0/T1 边界在 22 与 23 之间', () => {
    expect(computeTier(22)).toBe('T0');
    expect(computeTier(23)).toBe('T1');
  });

  it('T1 覆盖 23–32 周', () => {
    expect(computeTier(23)).toBe('T1');
    expect(computeTier(28)).toBe('T1');
    expect(computeTier(32)).toBe('T1');
  });

  it('T1/T2 边界在 32 与 33 之间', () => {
    expect(computeTier(32)).toBe('T1');
    expect(computeTier(33)).toBe('T2');
  });

  it('T2 覆盖 33–37 周', () => {
    expect(computeTier(33)).toBe('T2');
    expect(computeTier(35)).toBe('T2');
    expect(computeTier(37)).toBe('T2');
  });

  it('T2/T3 边界在 37 与 38 之间', () => {
    expect(computeTier(37)).toBe('T2');
    expect(computeTier(38)).toBe('T3');
  });

  it('T3 覆盖 38 周及以后', () => {
    expect(computeTier(38)).toBe('T3');
    expect(computeTier(45)).toBe('T3');
    expect(computeTier(60)).toBe('T3');
  });

  it('非法输入应抛错', () => {
    expect(() => computeTier(-1)).toThrow();
    expect(() => computeTier(Number.NaN)).toThrow();
    expect(() => computeTier(Number.POSITIVE_INFINITY)).toThrow();
  });
});

describe('tierLabel', () => {
  it('返回中文等级标签', () => {
    expect(tierLabel('T0')).toBe('夯爆了');
    expect(tierLabel('T1')).toBe('顶级');
    expect(tierLabel('T2')).toBe('人上人');
    expect(tierLabel('T3')).toBe('NPC');
  });
});

describe('weeksBetween', () => {
  it('整周数用 floor', () => {
    expect(weeksBetween('2025-09-01', '2025-09-08')).toBe(1); // 正好 7 天
    expect(weeksBetween('2025-09-01', '2025-09-15')).toBe(2); // 14 天
    expect(weeksBetween('2025-09-01', '2025-09-14')).toBe(1); // 13 天 -> 1 周
    expect(weeksBetween('2025-09-01', '2025-09-13')).toBe(1); // 12 天 -> 1 周
  });

  it('同一天 = 0 周', () => {
    expect(weeksBetween('2025-09-01', '2025-09-01')).toBe(0);
  });

  it('开学到次年 4 月初约 28-29 周', () => {
    const w = weeksBetween('2025-09-15', '2026-04-03');
    expect(w).toBeGreaterThanOrEqual(28);
    expect(w).toBeLessThanOrEqual(29);
  });

  it('结束日早于开始日抛错', () => {
    expect(() => weeksBetween('2025-09-15', '2025-09-01')).toThrow();
  });

  it('非法日期抛错', () => {
    expect(() => weeksBetween('not-a-date', '2025-09-01')).toThrow();
  });
});
