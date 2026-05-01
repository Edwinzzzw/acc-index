import { describe, it, expect } from 'vitest';
import schoolsData from '../../data/schools.json';
import type { SchoolsDatabase } from '../../src/lib/types';
import { computeTier, tierLabel, weeksBetween } from '../../src/lib/tier';

const db = schoolsData as unknown as SchoolsDatabase;

describe('数据完整性', () => {
  it('schools 数组非空', () => {
    expect(db.schools.length).toBeGreaterThan(0);
  });

  it('所有 id 唯一', () => {
    const ids = db.schools.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每条记录的 acc_weeks 与日期吻合', () => {
    for (const s of db.schools) {
      const expected = weeksBetween(s.academic_year_start, s.coursework_end_avg);
      expect(s.acc_weeks, `${s.id} acc_weeks 应为 ${expected}`).toBe(expected);
    }
  });

  it('每条记录的 tier 与 coursework_end_avg 吻合', () => {
    for (const s of db.schools) {
      const expected = computeTier(s.coursework_end_avg);
      expect(s.tier, `${s.id} tier 应为 ${expected}`).toBe(expected);
    }
  });

  it('每条记录的 tier_label 与 tier 吻合', () => {
    for (const s of db.schools) {
      expect(s.tier_label).toBe(tierLabel(s.tier));
    }
  });

  it('每条记录至少有一个 data_source', () => {
    for (const s of db.schools) {
      expect(s.data_sources.length, `${s.id} 缺 data_source`).toBeGreaterThan(0);
    }
  });

  it('所有日期格式合法', () => {
    const isoRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const s of db.schools) {
      expect(s.academic_year_start).toMatch(isoRe);
      expect(s.coursework_end_avg).toMatch(isoRe);
      expect(s.last_verified).toMatch(isoRe);
    }
  });
});
