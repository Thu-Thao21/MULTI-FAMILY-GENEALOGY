// Xuất các trang dùng chung cho nhiều actor (Member, Clan Admin, Guest...)
// Đặt tên lại cho dễ hiểu khi import vào AppRoutes

// 1. Hồ sơ cá nhân (Profile)
export { ProfileLayout as ProfilePage } from './profile/ProfileLayout/ProfileLayout';
export { PrivacySettingsTab as PrivacyPage } from './profile/PrivacySettingsTab';

// 2. Cây gia phả (Genealogy Tree)
export { TreeLayout as GenealogyTreePage } from './tree/TreeLayout/TreeLayout';

// 3. Các chức năng từ Member Module (dùng chung cho Clan Admin)
export { ClanAIAssistantModule as AIPage } from '../member/ClanAIAssistantModule';
export { DigitalAncestralHallModule as WorshipSpacePage } from '../member/DigitalAncestralHallModule';
export { AncestralLibraryModule as Library3DPage } from '../member/AncestralLibraryModule';
export { AnniversariesModule as MemorialDaysPage } from '../member/AnniversariesModule';
export { ClanEventsModule as EventsPage } from '../member/ClanEventsModule';
export { ClanFundsModule as FundsPage } from '../member/ClanFundsModule';
export { ClanDocumentsModule as ArchivesPage } from '../member/ClanDocumentsModule';
