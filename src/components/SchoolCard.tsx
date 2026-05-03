import { useState } from 'react';
import type { School } from '../lib/types';
import { TIER_DESCRIPTIONS } from '../lib/tier';
import { pickMadTalk } from '../lib/madTalk';
import { fuzzyMonthLabel, formatDateShort, formatMonthDay } from '../lib/dateFormat';
import { TierBadge } from './TierBadge';
import { CopyLinkButton } from './CopyLinkButton';

interface Props {
  school: School;
  /** 是否默认展开发疯解读（详情页用）*/
  defaultMadOpen?: boolean;
}

const CONFIDENCE_TEXT = {
  high: '官方权威',
  medium: '官方推算',
  low: '社区估算',
};

export function SchoolCard({ school, defaultMadOpen = false }: Props) {
  const [madOpen, setMadOpen] = useState(defaultMadOpen);
  // 每次打开都换一条文案
  const [madText, setMadText] = useState(() => pickMadTalk(school.tier));

  const toggleMad = () => {
    if (!madOpen) {
      setMadText(pickMadTalk(school.tier));
    }
    setMadOpen((v) => !v);
  };

  const monthsText =
    school.program_length_months === 12
      ? '1 年制'
      : school.program_length_months === 18
        ? '1.5 年制'
        : '2 年制';

  return (
    <article
      data-testid="school-card"
      data-school-id={school.id}
      className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">{school.name_zh}</h2>
          <p className="truncate text-sm text-neutral-500">{school.name_en}</p>
        </div>
        <button
          onClick={toggleMad}
          className="shrink-0 transition active:scale-95"
          aria-label="点击展开发疯解读"
          title="点击展开「发疯解读」"
        >
          <TierBadge tier={school.tier} size="lg" />
        </button>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {/*
         * 重排序：平均结课在第一格，作为 tier 划档的视觉锚点。
         * 主数字用模糊月份（"5 月中"），精确日期与开学日下沉到 hint。
         */}
        <Stat
          label="平均结课"
          value={fuzzyMonthLabel(school.coursework_end_avg)}
          hint={`${formatMonthDay(school.coursework_end_avg)} · ${formatMonthDay(school.academic_year_start)} 开学`}
        />
        <Stat
          label="ACC 周数"
          value={`${school.acc_weeks} 周`}
          hint="开学到结课"
        />
        <Stat label="QS 排名" value={`#${school.qs_rank_2026}`} hint="2026 榜" />
        <Stat label="项目长度" value={monthsText} hint={termSystemText(school.term_system)} />
      </div>

      <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700">
        {TIER_DESCRIPTIONS[school.tier]}
      </p>

      {madOpen && (
        <div
          data-testid="mad-talk"
          className="animate-fade-in mt-3 rounded-lg border-l-4 border-rose-400 bg-rose-50/60 p-3 text-sm leading-relaxed text-neutral-800"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600">发疯解读</span>
            <button
              onClick={toggleMad}
              className="text-xs text-neutral-400 hover:text-neutral-600"
              aria-label="收起"
            >
              收起 ✕
            </button>
          </div>
          {madText}
          <div className="mt-2 text-right">
            <button
              onClick={() => setMadText(pickMadTalk(school.tier))}
              className="text-xs text-rose-500 hover:text-rose-700"
            >
              换一条 ↻
            </button>
          </div>
        </div>
      )}

      {school.notes && (
        <p className="mt-3 text-sm text-neutral-600">
          <span className="font-semibold">备注：</span>
          {school.notes}
        </p>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
        <span>
          可信度：<span className="font-medium">{CONFIDENCE_TEXT[school.confidence]}</span>
          {' · '}
          核对于 {formatDateShort(school.last_verified)}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          {school.data_sources.slice(0, 2).map((src, i) => (
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
          <CopyLinkButton path={`/school/${school.id}`} />
        </span>
      </footer>
    </article>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-2.5 sm:p-3">
      <div className="text-[11px] text-neutral-500 sm:text-xs">{label}</div>
      <div className="mt-0.5 text-base font-semibold text-neutral-900 sm:text-lg">{value}</div>
      {hint && <div className="mt-0.5 text-[10px] text-neutral-400 sm:text-xs">{hint}</div>}
    </div>
  );
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
