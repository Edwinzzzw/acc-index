import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
