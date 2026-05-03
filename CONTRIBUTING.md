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

## Tier 等级定义

Tier 由 `coursework_end_avg`（结课日）的**月份**决定。看月份不看绝对周数，是因为不同学校开学日有 3–4 周差异（HKU 9/1 vs Imperial 9/29），只看周数会让"5 月初结课但 9 月底开学"的学校被错划。学生关心的是"啥时候自由"，不是"总共熬多久"，所以结课月份才是体感锚点。

| Tier | 标签 | 结课时间 | 体感 |
| --- | --- | --- | --- |
| T0 | 夯爆了 | 12 月 / 次年 1 月 | 年内基本搞定，回国跨年 |
| T1 | 顶级 | 次年 2–4 月 | 春天回国，赶上春招 / 暑期实习 |
| T2 | 人上人 | 次年 5 月 | 春天没了，跟美国 master 一档 |
| T3 | NPC | 次年 6 月及以后 | 一整个夏天没了 |

`acc_weeks` 仍然按 `floor((coursework_end_avg − academic_year_start) / 7)` 计算并保留在数据里——它是开学到结课的精确跨度，作参考使用，但不再用于划 tier。

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
