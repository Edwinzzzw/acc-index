import type { School } from '../lib/types';
import { TIER_DESCRIPTIONS } from '../lib/tier';
import { TierBadge } from './TierBadge';

interface Props {
  school: School;
}

const CONFIDENCE_TEXT = {
  high: '官方权威',
  medium: '官方推算',
  low: '社区估算',
};

export function SchoolCard({ school }: Props) {
  const monthsText =
    school.program_length_months === 12
      ? '1 年制'
      : school.program_length_months === 18
        ? '1.5 年制'
        : '2 年制';

  return (
    <article
      data-testid="school-card"
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{school.name_zh}</h2>
          <p className="text-sm text-neutral-500">{school.name_en}</p>
        </div>
        <TierBadge tier={school.tier} size="lg" />
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="ACC 周数" value={`${school.acc_weeks} 周`} hint="开学到结课" />
        <Stat
          label="平均结课时间"
          value={formatDate(school.coursework_end_avg)}
          hint={`开学：${formatDate(school.academic_year_start)}`}
        />
        <Stat label="QS 排名" value={`#${school.qs_rank_2026}`} hint="2026 榜" />
        <Stat label="项目长度" value={monthsText} hint={`${termSystemText(school.term_system)}`} />
      </div>

      <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700">
        {TIER_DESCRIPTIONS[school.tier]}
      </p>

      {school.notes && (
        <p className="mt-3 text-sm text-neutral-600">
          <span className="font-semibold">备注：</span>
          {school.notes}
        </p>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
        <span>
          数据可信度：<span className="font-medium">{CONFIDENCE_TEXT[school.confidence]}</span>
          {' · '}
          最近核对：{formatDate(school.last_verified)}
        </span>
        <span className="flex flex-wrap gap-2">
          {school.data_sources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              来源 {i + 1} ↗
            </a>
          ))}
        </span>
      </footer>
    </article>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-3">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-neutral-900">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-neutral-400">{hint}</div>}
    </div>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}/${m}/${d}`;
}

function termSystemText(t: string): string {
  switch (t) {
    case 'semester':
      return '学期制';
    case '3-term':
      return '三学期制';
    case 'quarter':
      return '四学季制';
    default:
      return '其他';
  }
}
