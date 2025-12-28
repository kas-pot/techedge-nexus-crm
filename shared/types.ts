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
  type: 'onboarding' | 'general' | 'tier';
  pointsReward: number;
  status: 'active' | 'inactive';
}
export interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  channel: 'push' | 'email' | 'sms';
  status: 'scheduled' | 'running' | 'completed';
}
export interface TransactionInsight {
  date: string;
  transactions: number;
  revenueIdr: number;
}