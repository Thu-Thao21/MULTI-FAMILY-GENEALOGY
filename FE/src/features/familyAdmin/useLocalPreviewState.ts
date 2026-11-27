import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

const LEGACY_MOCK_SIGNATURES = [
  'Cụ Nguyễn Văn Tông',
  'Cụ Nguyễn Văn Phúc',
  'Bà Lê Thị Mai',
  'Cụ Nguyễn Văn Đức',
  'Nguyễn Văn Tông',
  'Nguyễn Văn Phúc',
  'Nguyễn Văn Đức',
  'Lê Thị Mai',
  'Giỗ Tổ chi trưởng',
  'Họp dòng họ đầu năm',
];

function stripLegacyMockItems<T>(parsed: T): T {
  if (!Array.isArray(parsed)) return parsed;
  return parsed.filter((item) => {
    if (!item || typeof item !== 'object') return true;
    const id = String((item as Record<string, unknown>).id || '');
    if (/^(mem|evt|doc|fund|demo)-\d+$/i.test(id)) return false;
    const serialized = JSON.stringify(item);
    return !LEGACY_MOCK_SIGNATURES.some((sig) => serialized.includes(sig));
  }) as unknown as T;
}

/** Browser-only preview persistence; never use this for credentials or access control. */
export function useLocalPreviewState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storageKey = `mfgms.familyAdmin.preview.${key}`;
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return initial;
      const parsed = JSON.parse(saved) as T;
      const cleaned = stripLegacyMockItems(parsed);
      if (Array.isArray(parsed) && Array.isArray(cleaned) && cleaned.length !== parsed.length) {
        window.localStorage.setItem(storageKey, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(`mfgms.familyAdmin.preview.${key}`, JSON.stringify(value));
    } catch {
      /* Still usable in this tab. */
    }
  }, [key, value]);

  return [value, setValue];
}
