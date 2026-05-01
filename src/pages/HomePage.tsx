import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadSchools } from '../data/loader';
import { createSearcher, search } from '../lib/search';
import { useDebounced } from '../lib/useDebounced';
import { SearchBox } from '../components/SearchBox';
import { SchoolCard } from '../components/SchoolCard';
import { TIER_LABELS } from '../lib/tier';
import type { Tier } from '../lib/types';

export function HomePage() {
  const db = useMemo(() => loadSchools(), []);
  const fuse = useMemo(() => createSearcher(db.schools), [db]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounced(query, 120);

  const hits = useMemo(() => search(fuse, debouncedQuery), [fuse, debouncedQuery]);
  const showResults = debouncedQuery.trim().length > 0;

  useEffect(() => {
    document.title = 'ACC 指数 · 研究生友好度评级';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
          研究生平均结课
          <br className="sm:hidden" />
          早晚指数
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          废除 QS、US News、THE。
          <br className="sm:hidden" />
          唯一指标：从开学到所有理论课结束的周数。
        </p>
        <p className="mt-2 text-xs text-neutral-400">
          结课越早 = 越早摆脱排课和早八 = 越早投入科研、实习、求职。
        </p>
      </header>

      <section className="mt-8 sm:mt-10">
        <SearchBox value={query} onChange={setQuery} />
      </section>

      <section className="mt-6 sm:mt-8">
        {!showResults && <TierLegend />}

        {showResults && hits.length === 0 && (
          <div
            data-testid="no-results"
            className="animate-fade-in rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-8 text-center"
          >
            <p className="text-lg font-semibold text-neutral-700">没找到这所学校</p>
            <p className="mt-2 text-sm text-neutral-500">
              可能的原因：该校不在 QS 前 100 / 不提供 1–2 年制申请制授课型研究生 /
              我们还没收录。
            </p>
            <Link
              to="/leaderboard"
              className="mt-4 inline-block text-sm text-blue-600 hover:underline"
            >
              查看完整排行榜 →
            </Link>
          </div>
        )}

        {showResults && hits.length > 0 && (
          <div className="space-y-3 sm:space-y-4" data-testid="results">
            {hits.map((hit) => (
              <SchoolCard key={hit.school.id} school={hit.school} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TierLegend() {
  const tiers: Tier[] = ['T0', 'T1', 'T2', 'T3'];
  const ranges: Record<Tier, string> = {
    T0: '次年 1–2 月结课',
    T1: '次年 3–4 月结课',
    T2: '次年 5 月结课',
    T3: '次年 6 月或更晚',
  };
  const colors: Record<Tier, string> = {
    T0: 'bg-rose-500',
    T1: 'bg-amber-500',
    T2: 'bg-blue-500',
    T3: 'bg-neutral-500',
  };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6">
      <h2 className="text-sm font-semibold text-neutral-700">评级标准</h2>
      <ul className="mt-4 space-y-2">
        {tiers.map((t) => (
          <li key={t} className="flex items-center gap-3 text-sm">
            <span
              className={`inline-flex w-24 justify-center rounded-full px-2 py-0.5 text-xs font-semibold text-white ${colors[t]}`}
            >
              {t} {TIER_LABELS[t]}
            </span>
            <span className="text-neutral-600">{ranges[t]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-neutral-500">
        想看全部学校的排名？
        <Link to="/leaderboard" className="ml-1 text-blue-600 hover:underline">
          查看完整排行榜 →
        </Link>
      </p>
    </div>
  );
}
