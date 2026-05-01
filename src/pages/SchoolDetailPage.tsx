import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadSchools } from '../data/loader';
import { SchoolCard } from '../components/SchoolCard';
import { NotFoundPage } from './NotFoundPage';

export function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const db = useMemo(() => loadSchools(), []);
  const school = useMemo(
    () => db.schools.find((s) => s.id === id),
    [db, id],
  );

  useEffect(() => {
    if (school) {
      document.title = `${school.name_zh} · ACC ${school.tier} ${school.tier_label}`;
    }
  }, [school]);

  if (!school) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← 返回搜索
      </Link>
      <div className="mt-4">
        <SchoolCard school={school} defaultMadOpen />
      </div>
    </div>
  );
}
