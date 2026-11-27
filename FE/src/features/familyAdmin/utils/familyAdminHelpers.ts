import { type FamilyBranch, type FamilyPerson, type RelationType } from '../familyAdminStore';

export const relationLabels: Record<RelationType, string> = {
  father: 'Cha → con',
  mother: 'Mẹ → con',
  spouse: 'Vợ/chồng',
  adoptive_parent: 'Cha/mẹ nuôi → con',
  step_parent: 'Cha/mẹ kế → con',
};

export const genderLabels = { male: 'Nam', female: 'Nữ', other: 'Khác' } as const;

export const emptyPerson = (branchId: string): Omit<FamilyPerson, 'id'> => ({
  fullName: '',
  gender: 'male',
  birthDate: '',
  deathDate: '',
  branchId,
  generation: 1,
  phone: '',
  email: '',
  bio: '',
  hidden: false,
  visibility: 'family',
});

export const emptyBranch: Omit<FamilyBranch, 'id'> = {
  name: '',
  founderId: '',
  description: '',
};

export const clean = (value: string) => value.trim().toLocaleLowerCase('vi');

const AUDIT_ACTION_LABELS: Record<string, string> = {
  'ai_service.chat': 'Trò chuyện với Trợ lý AI gia phả',
  'person.create': 'Thêm thành viên mới vào cây',
  'person.update': 'Cập nhật hồ sơ thành viên',
  'person.delete': 'Xóa thành viên khỏi cây',
  'member.create': 'Thêm thành viên mới vào cây',
  'member.update': 'Cập nhật hồ sơ thành viên',
  'member.delete': 'Xóa thành viên khỏi cây',
  'relationship.create': 'Thiết lập quan hệ gia phả',
  'relationship.delete': 'Xóa quan hệ gia phả',
  'clan.update': 'Cập nhật hồ sơ dòng họ',
  'family.update': 'Cập nhật hồ sơ dòng họ',
  'branch.create': 'Tạo Chi / Nhánh mới',
  'branch.update': 'Cập nhật Chi / Nhánh',
  'join_request.approve': 'Phê duyệt yêu cầu gia nhập',
  'join_request.reject': 'Từ chối yêu cầu gia nhập',
  'clan_link.approve': 'Chấp thuận liên kết dòng họ',
  'clan_link.reject': 'Từ chối liên kết dòng họ',
  'auth.login': 'Đăng nhập hệ thống',
};

export function formatAuditActionLabel(action: string): string {
  if (!action) return 'Thao tác hệ thống';
  const key = action.trim().toLowerCase();
  return AUDIT_ACTION_LABELS[key] || action;
}

export function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob(['\ufeff', content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function csvEscape(value: string | number): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[i + 1] === '\n') i += 1;
      row.push(cell);
      if (row.some((part) => part.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (quoted) throw new Error('Tệp CSV có dấu ngoặc kép chưa đóng.');
  row.push(cell);
  if (row.some((part) => part.trim())) rows.push(row);
  return rows;
}
