import { test, expect } from '@playwright/test';

test.describe('ACC Index · 主流程', () => {
  test('首页加载', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('研究生平均结课');
    await expect(page.locator('text=评级标准')).toBeVisible();
  });

  test('搜中文校名 - 帝国理工', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('帝国理工');
    const card = page.getByTestId('school-card').first();
    await expect(card).toContainText('Imperial College London');
    await expect(card).toContainText('顶级');
  });

  test('搜英文别名 - UCL', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('UCL');
    const card = page.getByTestId('school-card').first();
    await expect(card).toContainText('伦敦大学学院');
  });

  test('搜不存在的学校 - 显示空状态', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('麦当劳工坊学院');
    await expect(page.getByTestId('no-results')).toBeVisible();
  });

  test('清空按钮', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('UCL');
    await expect(page.getByTestId('results')).toBeVisible();
    await page.getByLabel('清空').click();
    await expect(page.getByTestId('search-input')).toHaveValue('');
    await expect(page.locator('text=评级标准')).toBeVisible();
  });
});

test.describe('排行榜', () => {
  test('点导航进入排行榜，按 ACC 周数排序', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '排行榜' }).click();
    await expect(page).toHaveURL(/\/leaderboard$/);

    const rows = page.getByTestId('leaderboard-row');
    await expect(rows.first()).toContainText('港大'); // T0 应排第一
    // 验证至少有 9 个学校
    await expect(rows).toHaveCount(9);
  });

  test('点排行榜行进入详情页', async ({ page }) => {
    await page.goto('/leaderboard');
    await page.getByTestId('leaderboard-row').first().click();
    await expect(page).toHaveURL(/\/school\/hku$/);
    await expect(page.getByTestId('school-card')).toContainText('香港大学');
    // 详情页默认展开发疯解读
    await expect(page.getByTestId('mad-talk')).toBeVisible();
  });
});

test.describe('发疯解读', () => {
  test('点击 tier 徽章展开发疯解读', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('TUM');
    const card = page.getByTestId('school-card').first();
    await expect(card).toContainText('NPC');
    await expect(page.getByTestId('mad-talk')).not.toBeVisible();

    // 点徽章
    await card.getByLabel('点击展开发疯解读').click();
    await expect(page.getByTestId('mad-talk')).toBeVisible();
  });
});

test.describe('简介页', () => {
  test('点导航进入简介页', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '简介' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText('废除 QS');
    await expect(page.locator('text=研究生平均结课早晚指数')).toBeVisible();
  });
});

test.describe('404', () => {
  test('未知路径显示 404 页面', async ({ page }) => {
    await page.goto('/nonexistent-route');
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=回到首页')).toBeVisible();
  });

  test('未知学校 ID 显示 404', async ({ page }) => {
    await page.goto('/school/nonexistent-school');
    await expect(page.locator('text=404')).toBeVisible();
  });
});
