import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadSchools } from '../data/loader';
import { TIER_COLORS, TIER_LABELS } from '../lib/tier';
import type { School, Tier } from '../lib/types';

export function LeaderboardPage() {
  const db = useMemo(() => loadSchools(), []);
  const sorted = useMemo(
    () => [...db.schools].sort((a, b) => a.acc_weeks - b.acc_weeks),
    [db],
  );

  useEffect(() => {
    document.title = 'ACC 排行榜 · 谁结课最早';
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
          ACC 排行榜
        </h1>
        <p className="mt-2 text-sm text-neutral-500 sm:text-base">
          按「开学到结课的周数」从短到长排序。越靠前 = 越早放飞。
        </p>
      </header>

      <ol className="mt-8 space-y-2">
        {sorted.map((s, i) => (
          <Row key={s.id} school={s} rank={i + 1} />
        ))}
      </ol>

      <p className="mt-10 text-center text-xs text-neutral-400">
        共 {sorted.length} 所学校 · Phase 3 上线后将扩充至 QS 前 100（剔除中国大陆）
      </p>
    </div>
  );
}

function Row({ school, rank }: { school: School; rank: number }) {
  const tierColor = TIER_COLORS[school.tier];
  return (
    <Link
      to={`/school/${school.id}`}
      data-testid="leaderboard-row"
      className="group flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-neutral-200 transition hover:ring-neutral-400 sm:p-4"
    >
      <span className="w-8 shrink-0 text-center text-sm font-bold text-neutral-400 sm:w-10 sm:text-base">
        {rank}
      </span>
      <span
        className="hidden h-10 w-1 shrink-0 rounded-full sm:block"
        style={{ backgroundColor: tierColor }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-neutral-900">{school.name_zh}</span>
          <TinyTier tier={school.tier} />
        </div>
        <div className="truncate text-xs text-neutral-500">{school.name_en}</div>
      </div>
      <div className="text-right">
        <div className="text-base font-bold text-neutral-900 sm:text-lg">{school.acc_weeks} 周</div>
        <div className="text-[10px] text-neutral-400 sm:text-xs">QS #{school.qs_rank_2026}</div>
      </div>
    </Link>
  );
}

function TinyTier({ tier }: { tier: Tier }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
      style={{ backgroundColor: TIER_COLORS[tier] }}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
