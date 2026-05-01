import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AboutPage } from './pages/AboutPage';
import { SchoolDetailPage } from './pages/SchoolDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  // import.meta.env.BASE_URL 是 Vite 注入的，与 vite.config.ts 中的 base 一致：
  //   - 本地 dev: '/'
  //   - GitHub Pages: '/acc-index/'
  // 末尾的 / 需要去掉，react-router 的 basename 不接受尾斜杠
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/school/:id" element={<SchoolDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
