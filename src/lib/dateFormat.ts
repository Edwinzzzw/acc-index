/**
 * 日期展示辅助函数。集中放在这里方便所有视图（排行榜 / 详情卡）共用。
 */

/**
 * 把 ISO 日期 (YYYY-MM-DD) 转成模糊月份描述（中文）。
 *
 * 三档切法（与 tier 月份判档独立，仅用于展示）：
 *   1–10 日  → 月初
 *   11–20 日 → 月中
 *   21–末日 → 月底
 *
 * 例：
 *   2025-12-19 → "12 月中"
 *   2026-04-29 → "4 月底"
 *   2026-05-12 → "5 月中"
 *   2026-06-03 → "6 月初"
 *
 * 设计意图：让"周数不同但结课时间接近"的学校在视觉上同档（如 MIT 35 周、
 * Manchester 32 周都落在"5 月中"），与 month-based tier 规则视觉一致。
 */
export function fuzzyMonthLabel(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return iso; // 容错：非法格式原样返回，避免崩溃
  }
  const month = parseInt(iso.slice(5, 7), 10);
  const day = parseInt(iso.slice(8, 10), 10);
  const part = day <= 10 ? '初' : day <= 20 ? '中' : '底';
  return `${month} 月${part}`;
}

/**
 * 把 ISO 日期转成 yyyy/mm/dd 短格式。
 */
export function formatDateShort(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${y}/${m}/${d}`;
}

/**
 * 把 ISO 日期转成 m/d 月日格式（不带年）。常用于副标题省空间。
 */
export function formatMonthDay(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [, m, d] = iso.split('-');
  // 去掉前导 0：09 → 9
  return `${parseInt(m, 10)}/${parseInt(d, 10)}`;
}
