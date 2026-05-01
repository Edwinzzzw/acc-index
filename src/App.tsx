import { useMemo, useState } from 'react';
import { loadSchools } from './data/loader';
import { createSearcher, search } from './lib/search';
import { SearchBox } from './components/SearchBox';
import { SchoolCard } from './components/SchoolCard';
import { TIER_LABELS } from './lib/tier';
import type { Tier } from './lib/types';

export default function App() {
  const db = useMemo(() => loadSchools(), []);
  const fuse = useMemo(() => createSearcher(db.schools), [db]);
  const [query, setQuery] = useState('');

  const hits = useMemo(() => search(fuse, query), [fuse, query]);
  const showResults = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
          ACC <span className="text-rose-600">指数</span>
        </h1>
        <p className="mt-2 text-base text-neutral-600">
          研究生平均结课早晚指数 · 废除 QS，拥抱 ACC
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
          评估各高校授课型研究生「完成所有理论课程」所需的时间跨度。
          <br />
          结课越早，越能尽早投入科研、实习与求职。
        </p>
      </header>

      <section className="mt-10">
        <SearchBox value={query} onChange={setQuery} />
      </section>

      <section className="mt-8">
        {!showResults && <TierLegend />}

        {showResults && hits.length === 0 && (
          <div
            data-testid="no-results"
            className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-8 text-center"
          >
            <p className="text-lg font-semibold text-neutral-700">没找到这所学校</p>
            <p className="mt-2 text-sm text-neutral-500">
              可能的原因：该校不在 QS 前 100 / 不提供 1–2 年制申请制授课型研究生 / 我们还没收录。
            </p>
          </div>
        )}

        {showResults && hits.length > 0 && (
          <div className="space-y-4" data-testid="results">
            {hits.map((hit) => (
              <SchoolCard key={hit.school.id} school={hit.school} />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-16 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-400">
        共收录 {db.schools.length} 所学校 · 数据版本 {db.version} · 更新于 {db.updated_at}
        <br />
        <a
          href="https://github.com/"
          className="hover:text-neutral-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          数据有误？欢迎 PR
        </a>
      </footer>
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
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
      <h2 className="text-sm font-semibold text-neutral-700">评级标准</h2>
      <ul className="mt-4 space-y-2">
        {tiers.map((t) => (
          <li key={t} className="flex items-center gap-3 text-sm">
            <span
              className={`inline-flex w-20 justify-center rounded-full px-2 py-0.5 text-xs font-semibold text-white ${colors[t]}`}
            >
              {t} {TIER_LABELS[t]}
            </span>
            <span className="text-neutral-600">{ranges[t]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
