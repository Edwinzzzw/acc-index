import type { SchoolsDatabase } from '../lib/types';
import schoolsRaw from '../../data/schools.json';

/**
 * 从仓库内置 JSON 加载学校数据。
 * Vite 会在构建时把 JSON 内联到 bundle，所以不会有运行时 fetch。
 */
export function loadSchools(): SchoolsDatabase {
  return schoolsRaw as unknown as SchoolsDatabase;
}
