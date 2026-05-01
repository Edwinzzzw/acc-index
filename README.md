# ACC 指数 · 研究生平均结课早晚指数

> 废除 QS、US News、THE，拥抱 ACC。结课越早，学校越好。

一个评估全球高校（QS 前 100，剔除中国大陆）授课型研究生「友好度」的搜索网站。
唯一指标：从开学到所有理论课结束的周数。

## 为什么是 ACC

传统排名过于关注科研产出和雇主声誉，脱离研究生的实际生存状态。
我们认为，结课越早 = 越早摆脱排课和早八 = 越早投入科研、实习、求职。

## 评级标准

以秋季入学为基准：

| 等级 | 名号 | 结课时间 | ACC 周数 |
|------|------|----------|----------|
| **T0** | 夯爆了 | 次年 1–2 月 | ≤ 22 |
| **T1** | 顶级 | 次年 3–4 月 | 23–32 |
| **T2** | 人上人 | 次年 5 月 | 33–37 |
| **T3** | NPC | 次年 6 月或更晚 | ≥ 38 |

## 本地开发

```bash
npm install
npm run dev          # 启动开发服务器
npm test             # 单元测试
npm run test:e2e     # 端到端测试（首次需要 npx playwright install chromium）
npm run validate-data  # 校验 schools.json 数据完整性
npm run build        # 生产构建
```

## 仓库结构

```
data/
  schools.json     # 主数据文件（唯一数据来源）
  schema.json      # JSON Schema，CI 用来校验数据
  sources/         # 每所学校的数据来源备注
src/
  components/      # React 组件
  lib/             # 业务逻辑（搜索、tier 判定、类型）
  data/            # 数据加载
tests/
  unit/            # Vitest 单测
  e2e/             # Playwright E2E
scripts/
  validate-data.ts # CI 数据校验
  seed-schools.ts  # 从 QS 榜单生成空白模板
.github/workflows/
  ci.yml           # PR 跑测试
  deploy.yml       # main 推送自动部署到 GitHub Pages
```

## 数据贡献

发现某所学校的 ACC 数据不准确？欢迎 PR：

1. 编辑 `data/schools.json`，修正字段
2. **不要手填 `acc_weeks` / `tier` / `tier_label`** —— 这些由 `validate-data` 脚本从日期推导，CI 会校验一致性
3. 在 `data_sources` 里附上权威来源链接
4. 提交 PR，CI 会自动跑数据校验和测试

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署

推送到 `main` 分支会自动触发 GitHub Actions 部署到 GitHub Pages。
首次部署前需在仓库设置中将 Pages 来源切换为 "GitHub Actions"。

## 路线图

- [x] **Phase 1**：脚手架 + 9 校种子数据 + 单测 + E2E + CI/CD
- [x] **Phase 2**：UI 打磨（移动端、加载态、ACC 排行榜页）
- [ ] **Phase 3**：批量收录 QS 前 100（剔除中国大陆，约 90 所）
- [ ] **Phase 4**：项目级粒度（同校不同 program 拆分）
- [ ] **Phase 5**：社区数据反馈入口

## 免责声明

ACC 数据基于各校公开的 academic calendar 推算，与具体项目实际课表可能存在偏差。
该指标完全是项目维护者主观定义，不构成择校建议。
