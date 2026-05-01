import { NavLink, Link } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-3 py-1.5 text-sm font-medium transition',
    isActive
      ? 'bg-neutral-900 text-white'
      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
  ].join(' ');

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-black tracking-tight text-neutral-900"
          aria-label="ACC 指数 首页"
        >
          <Logo />
          <span>
            ACC <span className="text-rose-600">指数</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={linkClass}>
            搜索
          </NavLink>
          <NavLink to="/leaderboard" className={linkClass}>
            排行榜
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            简介
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden
      className="rounded-md bg-rose-600 p-1 text-white"
    >
      <path
        d="M5 18 L9 6 L13 18 M6.5 14 L11.5 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="17" cy="9" r="1.6" fill="currentColor" />
      <circle cx="17" cy="14" r="1.6" fill="currentColor" />
      <circle cx="17" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}
