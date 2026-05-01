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

/**
 * 知名学校的短 id 手工映射表。
 * slugify 的机械转换会产出 `the-university-of-manchester` 这种又长又啰嗦的 id，
 * 跟 schools.json 里手工起的短 id（imperial / ucl / lse）风格不一致，所以建一个
 * 覆盖表，命中就用短 id，没命中就退化到 slugify。
 *
 * Key 必须跟 CSV 里 name_en 完全一致（包括括号、缩写后缀），否则不命中。
 * 添加新学校时往这里加一条即可。
 */
const ID_OVERRIDES: Record<string, string> = {
  // UK — Phase 1 已收录
  'Imperial College London': 'imperial',
  'UCL (University College London)': 'ucl',
  'London School of Economics and Political Science (LSE)': 'lse',
  'University of Edinburgh': 'edinburgh',
  // UK — Phase 3 Batch 1
  'University of Oxford': 'oxford',
  'University of Cambridge': 'cambridge',
  "King's College London (KCL)": 'kcl',
  'The University of Manchester': 'manchester',
  'University of Bristol': 'bristol',
  'The University of Warwick': 'warwick',
  'University of Birmingham': 'birmingham',
  'University of Glasgow': 'glasgow',
  'University of Leeds': 'leeds',
  'University of Southampton': 'southampton',
  'The University of Sheffield': 'sheffield',
  'The University of Nottingham': 'nottingham',
  // HK / Asia — Phase 1 已收录
  'The University of Hong Kong': 'hku',
  // US — Phase 1 已收录
  'Columbia University': 'columbia',
  'New York University': 'nyu',
  // Europe — Phase 1 已收录
  'ETH Zurich (Swiss Federal Institute of Technology)': 'ethz',
  'Technical University of Munich': 'tu-munich',
};

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

function resolveId(name: string): string {
  return ID_OVERRIDES[name] ?? slugify(name);
}

function makeTemplate(row: QsRow) {
  return {
    id: resolveId(row.name_en),
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
