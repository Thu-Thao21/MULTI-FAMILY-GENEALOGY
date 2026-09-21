export type AncestralMediaType = 'Ảnh 360°' | 'Ảnh tư liệu' | 'Video' | 'Tài liệu' | 'Âm thanh';

export interface AncestorRecord {
  id: string;
  name: string;
  initials: string;
  title: string;
  generation: number;
  branch: string;
  relationship: string;
  birthYear: string;
  deathYear: string;
  lifespan: string;
  memorialDate: string;
  memorialPlace: string;
  restingPlace: string;
  biography: string;
  legacy: string;
  portraitTone: 'indigo' | 'teal' | 'amber' | 'rose';
  incenseCount: number;
}

export interface AncestralMediaItem {
  id: string;
  ancestorId: string;
  title: string;
  type: AncestralMediaType;
  capturedAt: string;
  description: string;
  source: string;
  duration?: string;
  accent: 'indigo' | 'teal' | 'amber' | 'rose' | 'slate';
}

export interface MemorialMessageRecord {
  id: string;
  ancestorId: string;
  sender: string;
  initials: string;
  relationship: string;
  message: string;
  createdAt: string;
  isOwn: boolean;
}

export const ANCESTOR_RECORDS: AncestorRecord[] = [
  {
    id: 'ancestor-nguyen-van-an',
    name: 'Nguyễn Văn An',
    initials: 'NA',
    title: 'Cụ Khởi Tổ',
    generation: 1,
    branch: 'Thủy tổ tộc họ Nguyễn',
    relationship: 'Thủy tổ của dòng họ',
    birthYear: '1824',
    deathYear: '1891',
    lifespan: 'Hưởng thọ 67 tuổi',
    memorialDate: 'Ngày 12 tháng 8 Âm lịch',
    memorialPlace: 'Từ đường tộc Nguyễn · Nam Định',
    restingPlace: 'Khu lăng tổ, xã Xuân Hồng, Nam Định',
    biography:
      'Cụ Nguyễn Văn An là người khai lập chi họ tại Nam Định, dành trọn cuộc đời gây dựng nền nếp gia phong và khuyến học cho con cháu.',
    legacy: 'Đức trọng lưu quang · Gia phong trường tồn',
    portraitTone: 'indigo',
    incenseCount: 128,
  },
  {
    id: 'ancestor-nguyen-thi-binh',
    name: 'Nguyễn Thị Bình',
    initials: 'NB',
    title: 'Bà Tổ',
    generation: 2,
    branch: 'Chi Trưởng',
    relationship: 'Cao tổ mẫu',
    birthYear: '1851',
    deathYear: '1928',
    lifespan: 'Hưởng thọ 77 tuổi',
    memorialDate: 'Ngày 03 tháng 3 Âm lịch',
    memorialPlace: 'Từ đường Chi Trưởng · Nam Định',
    restingPlace: 'Nghĩa trang gia tộc, xã Xuân Hồng',
    biography:
      'Bà nổi tiếng nhân hậu, vun vén gia đình và gìn giữ nhiều câu chuyện truyền đời nay vẫn được con cháu ghi lại trong gia phả.',
    legacy: 'Phúc hậu truyền gia · Từ tâm dưỡng thế',
    portraitTone: 'rose',
    incenseCount: 94,
  },
  {
    id: 'ancestor-nguyen-van-cuong',
    name: 'Nguyễn Văn Cường',
    initials: 'NC',
    title: 'Tiên hiền',
    generation: 3,
    branch: 'Chi Hai',
    relationship: 'Cụ cố nội',
    birthYear: '1889',
    deathYear: '1965',
    lifespan: 'Hưởng thọ 76 tuổi',
    memorialDate: 'Ngày 19 tháng 11 Âm lịch',
    memorialPlace: 'Nhà thờ Chi Hai · Hà Nội',
    restingPlace: 'Khu mộ Chi Hai, Hà Nội',
    biography:
      'Cụ dành nhiều tâm huyết sưu tầm sắc phong, thư tịch và lập bản gia phả viết tay đầu tiên còn lưu giữ đến ngày nay.',
    legacy: 'Uống nước nhớ nguồn · Hiếu học truyền đời',
    portraitTone: 'teal',
    incenseCount: 73,
  },
  {
    id: 'ancestor-nguyen-thi-dao',
    name: 'Nguyễn Thị Đào',
    initials: 'NĐ',
    title: 'Tiền nhân',
    generation: 4,
    branch: 'Chi Ba',
    relationship: 'Bà cô tổ',
    birthYear: '1917',
    deathYear: '1999',
    lifespan: 'Hưởng thọ 82 tuổi',
    memorialDate: 'Ngày 07 tháng 6 Âm lịch',
    memorialPlace: 'Gia đường Chi Ba · Hải Phòng',
    restingPlace: 'Nghĩa trang quê nhà, Hải Phòng',
    biography:
      'Bà là người kết nối con cháu xa quê, duy trì ngày họp mặt thường niên và truyền lại nhiều bài gia huấn quý báu.',
    legacy: 'Tình thân gắn kết · Nếp nhà bền lâu',
    portraitTone: 'amber',
    incenseCount: 46,
  },
];

export const ANCESTRAL_MEDIA: AncestralMediaItem[] = [
  {
    id: 'media-altar-360',
    ancestorId: 'ancestor-nguyen-van-an',
    title: 'Không gian từ đường 360°',
    type: 'Ảnh 360°',
    capturedAt: '12/08/2025',
    description: 'Bản mô phỏng toàn cảnh gian thờ chính trong ngày giỗ tổ.',
    source: 'Ban tư liệu gia tộc',
    accent: 'indigo',
  },
  {
    id: 'media-portrait-an',
    ancestorId: 'ancestor-nguyen-van-an',
    title: 'Chân dung phục dựng Cụ Khởi Tổ',
    type: 'Ảnh tư liệu',
    capturedAt: 'Khoảng năm 1880',
    description: 'Chân dung được phục dựng từ ảnh lưu trữ và đối chiếu gia phả.',
    source: 'Kho lưu trữ Chi Trưởng',
    accent: 'amber',
  },
  {
    id: 'media-ancestral-book',
    ancestorId: 'ancestor-nguyen-van-an',
    title: 'Trang đầu gia phả cổ',
    type: 'Tài liệu',
    capturedAt: 'Năm 1890',
    description: 'Bản chụp trang khai tông từ cuốn gia phả chữ Hán Nôm.',
    source: 'Tủ sách từ đường',
    accent: 'slate',
  },
  {
    id: 'media-binh-portrait',
    ancestorId: 'ancestor-nguyen-thi-binh',
    title: 'Ảnh gia đình Bà Tổ Nguyễn Thị Bình',
    type: 'Ảnh tư liệu',
    capturedAt: 'Năm 1922',
    description: 'Ảnh gia đình được con cháu Chi Trưởng trao tặng cho kho tư liệu.',
    source: 'Gia đình ông Nguyễn Văn Minh',
    accent: 'rose',
  },
  {
    id: 'media-binh-story',
    ancestorId: 'ancestor-nguyen-thi-binh',
    title: 'Chuyện kể về nếp nhà xưa',
    type: 'Âm thanh',
    capturedAt: '02/03/2024',
    description: 'Lời kể của hậu duệ về những câu chuyện còn lưu truyền trong Chi Trưởng.',
    source: 'Nhóm lịch sử gia tộc',
    duration: '08:42',
    accent: 'teal',
  },
  {
    id: 'media-cuong-manuscript',
    ancestorId: 'ancestor-nguyen-van-cuong',
    title: 'Bản gia phả viết tay năm 1938',
    type: 'Tài liệu',
    capturedAt: 'Năm 1938',
    description: 'Bản thảo do Cụ Nguyễn Văn Cường sưu tầm và biên chép.',
    source: 'Kho lưu trữ Chi Hai',
    accent: 'slate',
  },
  {
    id: 'media-cuong-video',
    ancestorId: 'ancestor-nguyen-van-cuong',
    title: 'Phóng sự gìn giữ gia phả cổ',
    type: 'Video',
    capturedAt: '19/11/2025',
    description: 'Video giới thiệu quy trình bảo quản thư tịch và bản gia phả viết tay.',
    source: 'Ban truyền thông gia tộc',
    duration: '04:18',
    accent: 'indigo',
  },
  {
    id: 'media-dao-reunion',
    ancestorId: 'ancestor-nguyen-thi-dao',
    title: 'Ngày đoàn viên Chi Ba',
    type: 'Video',
    capturedAt: '07/06/2023',
    description: 'Thước phim họp mặt tưởng nhớ Bà Nguyễn Thị Đào và các bậc tiền nhân.',
    source: 'Chi Ba Hải Phòng',
    duration: '06:05',
    accent: 'amber',
  },
  {
    id: 'media-dao-house-360',
    ancestorId: 'ancestor-nguyen-thi-dao',
    title: 'Gia đường Chi Ba 360°',
    type: 'Ảnh 360°',
    capturedAt: '07/06/2025',
    description: 'Không gian mô phỏng gia đường và khu trưng bày gia huấn của Chi Ba.',
    source: 'Chi Ba Hải Phòng',
    accent: 'teal',
  },
];

export const INITIAL_MEMORIAL_MESSAGES: MemorialMessageRecord[] = [
  {
    id: 'message-001',
    ancestorId: 'ancestor-nguyen-van-an',
    sender: 'Nguyễn Văn Minh',
    initials: 'NM',
    relationship: 'Chắt nội · Đời thứ 5',
    message:
      'Kính nhớ công đức Cụ Tổ. Con cháu nguyện giữ gìn gia phong, yêu thương và nâng đỡ nhau qua mọi thế hệ.',
    createdAt: '12/09/2026 · 08:30',
    isOwn: false,
  },
  {
    id: 'message-002',
    ancestorId: 'ancestor-nguyen-van-an',
    sender: 'Võ Văn Thắng',
    initials: 'VT',
    relationship: 'Hậu duệ thông gia · Đời thứ 5',
    message: 'Thành kính dâng nén tâm hương, nguyện cầu gia tộc luôn bình an và đoàn kết.',
    createdAt: '11/09/2026 · 19:15',
    isOwn: true,
  },
  {
    id: 'message-003',
    ancestorId: 'ancestor-nguyen-thi-binh',
    sender: 'Nguyễn Thị Hương',
    initials: 'NH',
    relationship: 'Cháu ngoại · Đời thứ 5',
    message: 'Tưởng nhớ lòng nhân hậu của Bà. Những câu chuyện về Bà vẫn luôn sưởi ấm con cháu.',
    createdAt: '10/09/2026 · 14:20',
    isOwn: false,
  },
  {
    id: 'message-004',
    ancestorId: 'ancestor-nguyen-van-cuong',
    sender: 'Võ Văn Thắng',
    initials: 'VT',
    relationship: 'Hậu duệ thông gia · Đời thứ 5',
    message: 'Biết ơn Cụ đã gìn giữ những trang gia phả quý để thế hệ hôm nay hiểu về nguồn cội.',
    createdAt: '08/09/2026 · 20:05',
    isOwn: true,
  },
];

export const MEDIA_TYPE_OPTIONS: Array<'Tất cả' | AncestralMediaType> = [
  'Tất cả',
  'Ảnh 360°',
  'Ảnh tư liệu',
  'Video',
  'Tài liệu',
  'Âm thanh',
];

export function getAncestorById(ancestorId: string): AncestorRecord {
  return ANCESTOR_RECORDS.find((ancestor) => ancestor.id === ancestorId) || ANCESTOR_RECORDS[0];
}
