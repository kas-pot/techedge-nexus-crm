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
  status: 'active' | 'expired' | 'draft';
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
  channel: 'push' | 'email' | 'sms';
  status: 'scheduled' | 'running' | 'completed';
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