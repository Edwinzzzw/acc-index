# 贡献指南

## 我想加一所学校

1. fork 仓库，本地 `npm install`
2. 在 `data/schools.json` 的 `schools` 数组里加一条记录
3. 必填字段（参见 `data/schema.json`）：

```json
{
  "id": "your-school-id",
  "name_en": "...",
  "name_zh": "...",
  "aliases": ["..."],
  "country": "GB",
  "qs_rank_2026": 50,
  "program_length_months": 12,
  "term_system": "semester",
  "academic_year_start": "2025-09-15",
  "coursework_end_avg": "2026-04-03",
  "acc_weeks": 0,
  "tier": "T1",
  "tier_label": "顶级",
  "confidence": "medium",
  "data_sources": [
    {"type": "official", "url": "https://...", "field": "term_dates"}
  ],
  "last_verified": "2026-04-30"
}
```

4. **`acc_weeks` / `tier` / `tier_label` 你随便填一个值都行**，CI 的 `validate-data` 会用日期重新计算并报错告诉你正确值。修正后再次提交即可。
5. `npm run validate-data` 本地跑一次确认无误
6. 提 PR

## 我想修正一所学校的数据

打开 issue 或直接 PR，**务必附上权威来源 URL**（学校 academic calendar、program handbook 等）。
社区数据（一亩三分地、知乎、Reddit）可以作为辅助，但 `confidence` 字段需要标 `medium` 或 `low`。

## 数据可信度分级

- **high**：官方明确公布该项目的具体结课日（program handbook / module schedule）
- **medium**：从学校通用 academic calendar 推算（如「Term 2 ends」当作结课日）
- **low**：社区反馈或合理估算

## 不收录哪些学校

- 中国大陆高校（按 manifesto）
- 不提供 1–2 年制申请制授课型 master 的学校（如纯研究型机构）
- QS 排名 100 名之外

## 项目级粒度（Phase 4）

未来同校不同 program 会拆开，例如 `lse-finance`、`lse-msc-data-science`。
当前 Phase 1–3 先按学校均值收录。
