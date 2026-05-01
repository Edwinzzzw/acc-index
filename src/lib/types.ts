/**
 * ACC Index 核心类型定义
 *
 * 所有学校数据的字段以本文件为准。schema.json 是从这里手工同步过去的运行时校验镜像，
 * 修改类型时请同步修改 data/schema.json，CI 会做一致性校验。
 */

export type Tier = 'T0' | 'T1' | 'T2' | 'T3';

export type TierLabel = '夯爆了' | '顶级' | '人上人' | 'NPC';

export type Confidence = 'high' | 'medium' | 'low';

export type TermSystem = 'semester' | '3-term' | 'quarter' | 'other';

export type SourceType = 'official' | 'community' | 'inferred';

export interface DataSource {
  type: SourceType;
  url: string;
  /** 这条来源支撑了哪个字段，便于追溯 */
  field: string;
  /** 抓取日期 (YYYY-MM-DD) */
  fetched_at?: string;
}

export interface School {
  /** kebab-case 唯一 ID，例如 "ucl"、"nyu"、"tu-munich" */
  id: string;
  name_en: string;
  name_zh: string;
  /** 别名/简称/常见错拼，用于模糊搜索 */
  aliases: string[];
  /** ISO 3166-1 alpha-2 国家代码，例如 "GB"、"US" */
  country: string;
  qs_rank_2026: number;

  /** 项目长度（月），通常是 12 或 24 */
  program_length_months: 12 | 18 | 24;
  term_system: TermSystem;

  /** 标准秋季入学日 (YYYY-MM-DD)，作为 ACC 计算基准 */
  academic_year_start: string;
  /** 必修/选修理论课全部结束的日期 (YYYY-MM-DD) */
  coursework_end_avg: string;

  /**
   * 从 academic_year_start 到 coursework_end_avg 的整周数。
   * 这是 tier 判定的唯一依据，由脚本从两个日期算出，不应人工填写。
   */
  acc_weeks: number;

  /** 由 acc_weeks 推导，不应人工填写 */
  tier: Tier;
  tier_label: TierLabel;

  confidence: Confidence;
  data_sources: DataSource[];

  /** 备注，例如 "Term 3 用于写毕业论文" */
  notes?: string;

  /** 数据最近核对日 (YYYY-MM-DD) */
  last_verified: string;
}

export interface SchoolsDatabase {
  /** 数据集语义版本 */
  version: string;
  /** 最后更新日 */
  updated_at: string;
  schools: School[];
}
