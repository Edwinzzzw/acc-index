import { describe, it, expect } from 'vitest';
import { createSearcher, search } from '../../src/lib/search';
import schoolsData from '../../data/schools.json';
import type { SchoolsDatabase } from '../../src/lib/types';

const db = schoolsData as unknown as SchoolsDatabase;
const fuse = createSearcher(db.schools);

describe('search - 搜索功能', () => {
  it('英文校名精确匹配', () => {
    const hits = search(fuse, 'University College London');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].school.id).toBe('ucl');
  });

  it('中文校名匹配', () => {
    const hits = search(fuse, '帝国理工学院');
    expect(hits[0].school.id).toBe('imperial');
  });

  it('别名匹配 - UCL', () => {
    const hits = search(fuse, 'UCL');
    expect(hits[0].school.id).toBe('ucl');
  });

  it('别名匹配 - 哥大', () => {
    const hits = search(fuse, '哥大');
    expect(hits[0].school.id).toBe('columbia');
  });

  it('容错：少打几个字也能匹配', () => {
    const hits = search(fuse, 'imperia');
    expect(hits[0].school.id).toBe('imperial');
  });

  it('空查询返回空数组', () => {
    expect(search(fuse, '')).toEqual([]);
    expect(search(fuse, '   ')).toEqual([]);
  });

  it('完全不相关的查询返回空或低相关性', () => {
    const hits = search(fuse, '麦当劳工坊学院');
    // 允许 fuse 返回空，或者所有命中都很弱（score 接近 1）
    if (hits.length > 0) {
      expect(hits[0].score).toBeGreaterThan(0.4);
    }
  });
});
