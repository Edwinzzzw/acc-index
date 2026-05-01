import { loadSchools } from '../data/loader';

export function Footer() {
  const db = loadSchools();
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-neutral-500">
        <p>
          共收录 {db.schools.length} 所学校 · 数据版本 {db.version} · 更新于 {db.updated_at}
        </p>
        <p className="mt-2">
          ACC 指数完全是项目维护者主观定义，不构成择校建议。所有数据基于学校公开 academic
          calendar 估算，与具体项目实际课表可能存在偏差。
        </p>
        <p className="mt-2">
          数据有误？欢迎到{' '}
          <a
            href="https://github.com/Edwinzzzw/acc-index"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 underline hover:text-neutral-900"
          >
            GitHub 仓库
          </a>{' '}
          提 PR 或 Issue。
        </p>
      </div>
    </footer>
  );
}
