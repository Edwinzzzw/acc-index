import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../../src/pages/HomePage';
import { LeaderboardPage } from '../../src/pages/LeaderboardPage';
import { AboutPage } from '../../src/pages/AboutPage';
import { SchoolDetailPage } from '../../src/pages/SchoolDetailPage';
import { NotFoundPage } from '../../src/pages/NotFoundPage';

/**
 * 这些是 smoke test，只验证页面组件能成功渲染，不抛错；
 * 真正的交互测试在 tests/e2e/ 里用 Playwright 跑。
 */

describe('页面组件 smoke', () => {
  it('HomePage 渲染', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(container.textContent).toContain('研究生平均结课');
    expect(container.textContent).toContain('评级标准');
  });

  it('LeaderboardPage 渲染并按 acc_weeks 排序', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>,
    );
    const rows = getAllByTestId('leaderboard-row');
    expect(rows.length).toBeGreaterThan(0);
    // 第一行应该是 T0 学校（港大，15 周）
    expect(rows[0].textContent).toContain('15 周');
  });

  it('AboutPage 渲染', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );
    expect(container.textContent).toContain('废除 QS');
    expect(container.textContent).toContain('夯爆了');
  });

  it('SchoolDetailPage 渲染存在的学校', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/school/ucl']}>
        <Routes>
          <Route path="/school/:id" element={<SchoolDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container.textContent).toContain('伦敦大学学院');
  });

  it('SchoolDetailPage 不存在的学校 fallback 到 404', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/school/no-such-school']}>
        <Routes>
          <Route path="/school/:id" element={<SchoolDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container.textContent).toContain('404');
  });

  it('NotFoundPage 渲染', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(container.textContent).toContain('404');
    expect(container.textContent).toContain('回到首页');
  });
});
