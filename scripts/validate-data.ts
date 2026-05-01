/**
 * 校验 data/schools.json 是否自洽。CI 跑这个脚本，任何不一致直接卡掉合并。
 *
 * 推导规则（数据里 acc_weeks / tier / tier_label 由日期推导，必须与脚本算出的一致）：
 *
 *   acc_weeks = floor((coursework_end_avg − academic_year_start) / 7 天)
 *
 *   tier 按 coursework_end_avg 的月份划分（中国学生关心的是"啥时候自由"，不是"总共熬多久"）：
 *     T0 夯爆了 = 12 月或 1 月结课（年内基本搞定）
 *     T1 顶级   = 2–4 月结课（春天回国，赶上春招/暑期实习）
 *     T2 人上人 = 5 月结课（春天没了，跟美国 master 一档）
 *     T3 NPC    = 6 月及以后结课（一整个夏天没了）
 *
 *   阈值看月份而非绝对周数，是因为开学日有 3-4 周差异（HKU 9/1 vs Imperial 9/29），
 *   只看周数会让"5 月初结课但 9 月底开学"的学校被错划进 T1。结课月份才是体感锚点。
 *
 * 用法: npm run validate-data
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface DataSource {
  type: string;
  url: string;
  field: string;
  fetched_at: string;
}

interface School {
  id: string;
  name_en: string;
  name_zh: string;
  aliases: string[];
  country: string;
  qs_rank_2026: number;
  program_length_months: number;
  term_system: string;
  academic_year_start: string;
  coursework_end_avg: string;
  acc_weeks: number;
  tier: string;
  tier_label: string;
  confidence: string;
  data_sources: DataSource[];
  notes?: string;
  last_verified: string;
}

interface SchoolsFile {
  version: string;
  updated_at: string;
  schools: School[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_CONFIDENCE = new Set(['high', 'medium', 'low']);
const VALID_TIERS = new Set(['T0', 'T1', 'T2', 'T3']);

function deriveAccWeeks(startIso: string, endIso: string): number {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 7));
}

function deriveTier(endIso: string): { tier: string; tier_label: string } {
  const m = parseInt(endIso.slice(5, 7), 10);
  if (m === 12 || m === 1) return { tier: 'T0', tier_label: '夯爆了' };
  if (m >= 2 && m <= 4) return { tier: 'T1', tier_label: '顶级' };
  if (m === 5) return { tier: 'T2', tier_label: '人上人' };
  return { tier: 'T3', tier_label: 'NPC' };
}

function main() {
  const path = resolve('data/schools.json');
  const raw = readFileSync(path, 'utf-8');
  let data: SchoolsFile;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('❌ schools.json 不是合法 JSON:', (err as Error).message);
    process.exit(1);
  }

  if (!Array.isArray(data.schools)) {
    console.error('❌ schools 字段不是数组');
    process.exit(1);
  }

  const errors: string[] = [];
  const warn = (tag: string, msg: string) => errors.push(`${tag} ${msg}`);

  const seenIds = new Set<string>();
  for (const s of data.schools) {
    const tag = `[${s.id ?? '?'}]`;

    // 必填
    if (!s.id) warn(tag, '缺 id');
    else if (seenIds.has(s.id)) warn(tag, 'id 重复');
    else seenIds.add(s.id);

    for (const k of ['name_en', 'name_zh', 'country', 'term_system', 'last_verified'] as const) {
      if (!s[k]) warn(tag, `缺字段 ${k}`);
    }
    if (typeof s.qs_rank_2026 !== 'number') warn(tag, 'qs_rank_2026 不是数字');
    if (typeof s.program_length_months !== 'number') warn(tag, 'program_length_months 不是数字');

    // 枚举
    if (s.confidence && !VALID_CONFIDENCE.has(s.confidence)) {
      warn(tag, `confidence=${s.confidence} 不在 high/medium/low 内`);
    }
    if (s.tier && !VALID_TIERS.has(s.tier)) {
      warn(tag, `tier=${s.tier} 不在 T0–T3 内`);
    }

    // 日期格式
    for (const k of ['academic_year_start', 'coursework_end_avg', 'last_verified'] as const) {
      if (s[k] && !ISO_DATE.test(s[k])) warn(tag, `${k} 不是 YYYY-MM-DD: ${s[k]}`);
    }

    // 数组类
    if (!Array.isArray(s.aliases)) warn(tag, 'aliases 不是数组');
    if (!Array.isArray(s.data_sources) || s.data_sources.length === 0) {
      warn(tag, 'data_sources 缺失或为空');
    }

    // 推导：acc_weeks
    if (s.academic_year_start && s.coursework_end_avg
        && ISO_DATE.test(s.academic_year_start) && ISO_DATE.test(s.coursework_end_avg)) {
      const expected = deriveAccWeeks(s.academic_year_start, s.coursework_end_avg);
      if (s.acc_weeks !== expected) {
        warn(tag, `acc_weeks=${s.acc_weeks}，按日期应为 ${expected}`);
      }
    }

    // 推导：tier / tier_label（按结课月份）
    if (s.coursework_end_avg && ISO_DATE.test(s.coursework_end_avg)) {
      const { tier, tier_label } = deriveTier(s.coursework_end_avg);
      if (s.tier !== tier) warn(tag, `tier=${s.tier}，按 ${s.coursework_end_avg} 月份应为 ${tier}`);
      if (s.tier_label !== tier_label) warn(tag, `tier_label=${s.tier_label}，应为 ${tier_label}`);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ 校验失败（${errors.length} 个问题）：`);
    for (const e of errors) console.error('  ' + e);
    process.exit(1);
  }
  console.log(`✅ 校验通过：${data.schools.length} 所学校全部一致`);
}

main();
