import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useEffect(() => {
    document.title = '404 · ACC 指数';
  }, []);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-7xl font-black text-rose-600">404</p>
      <p className="mt-4 text-lg font-semibold text-neutral-800">
        这页课表已经结束了
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        你要找的页面不存在，或者还没收录这所学校。
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
      >
        回到首页
      </Link>
    </div>
  );
}
