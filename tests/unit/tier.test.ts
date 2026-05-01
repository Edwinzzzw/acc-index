import { describe, it, expect } from 'vitest';
import { computeTier, tierLabel, weeksBetween } from '../../src/lib/tier';

describe('computeTier - 月份分档', () => {
  it('T0 = 12 月或 1 月结课', () => {
    expect(computeTier('2025-12-01')).toBe('T0');
    expect(computeTier('2025-12-19')).toBe('T0'); // HKU 实际值
    expect(computeTier('2025-12-31')).toBe('T0');
    expect(computeTier('2026-01-01')).toBe('T0');
    expect(computeTier('2026-01-31')).toBe('T0');
  });

  it('T0/T1 边界：1 月底 → T0，2 月初 → T1', () => {
    expect(computeTier('2026-01-31')).toBe('T0');
    expect(computeTier('2026-02-01')).toBe('T1');
  });

  it('T1 = 2–4 月结课', () => {
    expect(computeTier('2026-02-15')).toBe('T1');
    expect(computeTier('2026-03-20')).toBe('T1'); // Imperial 实际值
    expect(computeTier('2026-03-27')).toBe('T1'); // UCL / LSE / Glasgow 实际值
    expect(computeTier('2026-04-03')).toBe('T1'); // Edinburgh 实际值
    expect(computeTier('2026-04-30')).toBe('T1');
  });

  it('T1/T2 边界：4 月底 → T1，5 月初 → T2', () => {
    expect(computeTier('2026-04-30')).toBe('T1');
    expect(computeTier('2026-05-01')).toBe('T2'); // KCL / Bristol / Birmingham 实际值
  });

  it('T2 = 5 月结课（仅此一个月）', () => {
    expect(computeTier('2026-05-01')).toBe('T2');
    expect(computeTier('2026-05-08')).toBe('T2'); // Columbia / Leeds 实际值
    expect(computeTier('2026-05-15')).toBe('T2'); // NYU / Manchester / Sheffield / Nottingham 实际值
    expect(computeTier('2026-05-31')).toBe('T2');
  });

  it('T2/T3 边界：5 月底 → T2，6 月初 → T3', () => {
    expect(computeTier('2026-05-31')).toBe('T2');
    expect(computeTier('2026-06-01')).toBe('T3');
  });

  it('T3 = 6 月及以后结课', () => {
    expect(computeTier('2026-06-19')).toBe('T3'); // ETH 实际值
    expect(computeTier('2026-07-25')).toBe('T3'); // TUM 实际值
    expect(computeTier('2026-08-15')).toBe('T3');
    expect(computeTier('2026-11-30')).toBe('T3');
  });

  it('非法输入应抛错', () => {
    expect(() => computeTier('not-a-date')).toThrow();
    expect(() => computeTier('2026/05/01')).toThrow(); // 斜杠分隔
    expect(() => computeTier('')).toThrow();
    expect(() => computeTier('20260501')).toThrow(); // 缺分隔符
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

  it('开学到次年 4 月初约 28–29 周', () => {
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
