export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
// Enterprise Modules
export interface Tier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}
export interface Voucher {
  id: string;
  title: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  value: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'draft' | 'syncing';
  isExternal?: boolean;
  sourcePartnerId?: string;
  syncDate?: string;
  metadata?: Record<string, any>;
}
export interface Member {
  id: string;
  name: string;
  email: string;
  tier: string;
  points: number;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  metadata?: Record<string, any>;
}
export interface Venue {
  id: string;
  name: string;
  location: string;
  type: 'Mall' | 'Residential' | 'Office';
  imageUrl?: string;
  logoUrl?: string;
  socialUrl?: string;
  isActive: boolean;
  pointClaimEligible: boolean;
  metadata?: Record<string, any>;
}
export interface Outlet {
  id: string;
  venueId: string;
  name: string;
  category: string;
  tenantName: string;
  floor: string;
}
export interface Mission {
  id: string;
  title: string;
  type: 'onboarding' | 'general' | 'tier' | 'referral';
  pointsReward: number;
  status: 'active' | 'inactive';
  rewardType: 'none' | 'points' | 'voucher';
  rewardValue?: string | number;
  instructions?: string;
  terms?: string;
  referralMessage?: string;
}
export interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  channel: 'push' | 'email' | 'sms' | 'video' | 'ads';
  status: 'scheduled' | 'running' | 'completed';
  reach?: number;
  openRate?: number;
  ctr?: number;
}
export interface InterestTag {
  id: string;
  name: string;
  color: string;
  category: string;
  count: number;
}
export interface LeaderboardEntry {
  rank: number;
  memberName: string;
  points: number;
  avatar?: string;
  change?: 'up' | 'down' | 'neutral';
}
export interface Leaderboard {
  id: string;
  title: string;
  period: 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
}
export interface TransactionInsight {
  date: string;
  transactions: number;
  revenueIdr: number;
}
export interface ApprovalTask {
  id: string;
  type: 'points_claim' | 'membership' | 'voucher_redeem';
  memberName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  proofUrl?: string;
  description?: string;
}
export interface Partner {
  id: string;
  name: string;
  type: 'bank' | 'retail' | 'service';
  logo?: string;
  status: 'active' | 'inactive';
  contactEmail: string;
  agreementLevel: 'Platinum' | 'Gold' | 'Standard';
  joinedDate: string;
}
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirementPoints: number;
  earnedCount: number;
}
export interface Ad {
  id: string;
  name: string;
  imageUrl: string;
  placement: 'banner' | 'popup' | 'sidebar';
  targetTier: string;
  targetCategory: string;
  status: 'active' | 'inactive';
}
export interface MarketingTicket {
  id: string;
  eventName: string;
  memberName: string;
  ticketCode: string;
  status: 'valid' | 'used' | 'cancelled';
  issueDate: string;
}
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'Promotion' | 'Announcement' | 'Maintenance';
  publishDate: string;
  status: 'published' | 'draft';
}
export interface GiftCard {
  id: string;
  serial: string;
  value: number;
  balance: number;
  status: 'active' | 'redeemed' | 'expired';
  expiryDate: string;
}
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Points' | 'Membership' | 'Technical' | 'Security';
}
// System Excellence Specialized Interfaces
export interface ContactSettings {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  websiteUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
}
export interface LegalDocument {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}
export interface WifiSettings {
  id: string;
  ssid: string;
  password?: string;
  isVisible: boolean;
}
export interface WeatherConfig {
  id: string;
  isEnabled: boolean;
  locationName: string;
  activeCondition: 'sunny' | 'rainy' | 'cloudy' | 'humid';
  autoRotation: boolean;
  lastUpdated: string;
}
export interface WeatherRecommendation {
  condition: string;
  tips: string[];
  icon: string;
}
export interface SystemSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  ssoEnabled: boolean;
  ssoEntityId?: string;
  ssoMetadataUrl?: string;
  ocrPrecision: 'high' | 'medium' | 'low';
  wifiSsid: string;
  notificationEmail: string;
  splashImageUrl?: string;
  splashBgColor?: string;
}