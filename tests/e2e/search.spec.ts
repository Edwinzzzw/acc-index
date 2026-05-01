import { test, expect } from '@playwright/test';

test.describe('ACC Index 搜索流程', () => {
  test('页面加载，标题与等级图例可见', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('ACC');
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

  test('T0 学校显示「夯爆了」徽章', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('港大');
    const card = page.getByTestId('school-card').first();
    await expect(card).toContainText('夯爆了');
    await expect(card).toContainText('15 周');
  });

  test('T3 学校显示「NPC」徽章', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('TUM');
    const card = page.getByTestId('school-card').first();
    await expect(card).toContainText('NPC');
  });

  test('清空按钮恢复初始状态', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('UCL');
    await expect(page.getByTestId('results')).toBeVisible();
    await page.getByLabel('清空').click();
    await expect(page.getByTestId('search-input')).toHaveValue('');
    await expect(page.locator('text=评级标准')).toBeVisible();
  });
});
