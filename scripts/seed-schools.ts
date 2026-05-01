/**
 * Phase 3 用：从 QS 前 100 榜单生成空白学校模板，待 Claude 逐一补全。
 *
 * 使用方式：
 *   1. 提供一份 qs-top100.csv（字段：rank,name_en,country_iso）
 *   2. 运行 `npm run seed -- --input qs-top100.csv`
 *   3. 脚本会过滤中国大陆学校，并在 data/schools.pending.json 输出未填充字段为 null 的模板
 *   4. Claude 拿着这份模板逐一爬官网，补完后再合并到 schools.json
 *
 * 该脚本本身不做爬取，爬取由对话中的 Claude Code 完成（每所学校独立确认）。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface QsRow {
  rank: number;
  name_en: string;
  country_iso: string;
}

const CN_MAINLAND = new Set(['CN']); // 香港 HK / 澳门 MO / 台湾 TW 不算大陆

function parseCsv(text: string): QsRow[] {
  const lines = text.trim().split(/\r?\n/);
  const [header, ...rows] = lines;
  const cols = header.split(',').map((s) => s.trim());
  const idx = (n: string) => cols.indexOf(n);
  return rows.map((line) => {
    const parts = line.split(',').map((s) => s.trim());
    return {
      rank: Number(parts[idx('rank')]),
      name_en: parts[idx('name_en')],
      country_iso: parts[idx('country_iso')],
    };
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function makeTemplate(row: QsRow) {
  return {
    id: slugify(row.name_en),
    name_en: row.name_en,
    name_zh: null, // 待补
    aliases: [],
    country: row.country_iso,
    qs_rank_2026: row.rank,
    program_length_months: null, // 待补
    term_system: null, // 待补
    academic_year_start: null, // 待补
    coursework_end_avg: null, // 待补
    acc_weeks: null,
    tier: null,
    tier_label: null,
    confidence: 'low',
    data_sources: [],
    notes: '',
    last_verified: null,
  };
}

function main() {
  const inputArg = process.argv.indexOf('--input');
  if (inputArg === -1) {
    console.error('用法: npm run seed -- --input qs-top100.csv');
    process.exit(1);
  }
  const inputPath = process.argv[inputArg + 1];
  const csv = readFileSync(resolve(inputPath), 'utf-8');
  const rows = parseCsv(csv).filter((r) => !CN_MAINLAND.has(r.country_iso));

  const templates = rows.map(makeTemplate);
  const out = {
    version: '0.0.0-pending',
    updated_at: new Date().toISOString().slice(0, 10),
    schools: templates,
  };
  const outPath = resolve('data/schools.pending.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`✅ 生成 ${templates.length} 所学校模板 → ${outPath}`);
  console.log('   下一步：让 Claude 逐校爬取 academic calendar，补完字段后合并到 schools.json');
}

main();
