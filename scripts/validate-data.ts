/**
 * 校验 data/schools.json：
 *   1. 满足 JSON Schema
 *   2. id 唯一
 *   3. acc_weeks 与 (academic_year_start, coursework_end_avg) 一致
 *   4. tier / tier_label 与 acc_weeks 一致
 *
 * CI 上跑这个脚本，任意一项失败都阻断合并。
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { computeTier, tierLabel, weeksBetween } from '../src/lib/tier';
import type { SchoolsDatabase } from '../src/lib/types';

const ROOT = resolve(import.meta.dirname, '..');

function loadJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(resolve(ROOT, relPath), 'utf-8')) as T;
}

function fail(msg: string): never {
  console.error(`❌ ${msg}`);
  process.exit(1);
  throw new Error(msg); // unreachable, satisfies TS
}

function main() {
  const schema = loadJson<object>('data/schema.json');
  const db = loadJson<SchoolsDatabase>('data/schools.json');

  // 1. JSON Schema
  const ajv = new Ajv({ allErrors: true, strict: false });
  // ajv-formats 是可选依赖；如果没装就跳过 format 校验
  try {
    addFormats(ajv);
  } catch {
    /* noop */
  }
  const validate = ajv.compile(schema);
  if (!validate(db)) {
    console.error('Schema errors:', validate.errors);
    fail('schools.json 不满足 schema');
  }

  // 2. id 唯一
  const ids = new Set<string>();
  for (const s of db.schools) {
    if (ids.has(s.id)) fail(`重复的 id: ${s.id}`);
    ids.add(s.id);
  }

  // 3 & 4. 各字段一致性
  const errors: string[] = [];
  for (const s of db.schools) {
    const expectedWeeks = weeksBetween(s.academic_year_start, s.coursework_end_avg);
    if (expectedWeeks !== s.acc_weeks) {
      errors.push(
        `[${s.id}] acc_weeks 不匹配：实际 ${expectedWeeks}，文件中 ${s.acc_weeks}`,
      );
    }
    const expectedTier = computeTier(s.acc_weeks);
    if (expectedTier !== s.tier) {
      errors.push(`[${s.id}] tier 不匹配：应为 ${expectedTier}，文件中 ${s.tier}`);
    }
    const expectedLabel = tierLabel(expectedTier);
    if (expectedLabel !== s.tier_label) {
      errors.push(
        `[${s.id}] tier_label 不匹配：应为 ${expectedLabel}，文件中 ${s.tier_label}`,
      );
    }
  }
  if (errors.length) {
    errors.forEach((e) => console.error('  ' + e));
    fail(`共 ${errors.length} 条数据一致性错误`);
  }

  console.log(`✅ 校验通过：${db.schools.length} 所学校`);
}

main();
