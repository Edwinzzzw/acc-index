import Fuse, { type IFuseOptions } from 'fuse.js';
import type { School } from './types';

/**
 * 搜索字段权重：
 *   英文校名 / 中文校名最高，别名次之，国家最低。
 *   threshold 0.4 在「容错」和「乱匹配」之间比较平衡。
 */
const FUSE_OPTIONS: IFuseOptions<School> = {
  keys: [
    { name: 'name_en', weight: 0.4 },
    { name: 'name_zh', weight: 0.4 },
    { name: 'aliases', weight: 0.15 },
    { name: 'country', weight: 0.05 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};

export function createSearcher(schools: School[]): Fuse<School> {
  return new Fuse(schools, FUSE_OPTIONS);
}

export interface SearchHit {
  school: School;
  score: number;
}

export function search(fuse: Fuse<School>, query: string, limit = 8): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return fuse
    .search(trimmed, { limit })
    .map((r) => ({ school: r.item, score: r.score ?? 1 }));
}
