import type {
  User, Chat, ChatMessage, TransactionInsight, Tier, Voucher,
  Venue, Outlet, Mission, InterestTag, Leaderboard, ApprovalTask,
  Partner, Badge, SystemSettings, Ad, MarketingTicket, NewsItem, GiftCard, FaqItem, Member
} from './types';
// Diverse list of names for realism
const FIRST_NAMES = ["James", "Sarah", "Michael", "Elena", "David", "Ahmad", "Siti", "Budi", "Dewi", "Kevin", "Rina", "Aditya", "Jessica", "Robert", "Linda", "Maya", "Oscar", "Zoe", "Liam", "Hana"];
const LAST_NAMES = ["Wilson", "Chen", "Scott", "Rodriguez", "Kim", "Pratama", "Sari", "Wijaya", "Kusuma", "Tan", "Lau", "Nguyen", "Murphy", "Santoso", "Hidayat", "Zhuang", "Lee", "Miller", "Garcia", "Wong"];
export const MOCK_USERS: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `u${i + 1}`,
  name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`
}));
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General Support' },
  { id: 'c2', title: 'Tier Upgrade Assistance' },
  { id: 'c3', title: 'Voucher Redemptions' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello, I need help with my points.', ts: Date.now() - 100000 },
  { id: 'm2', chatId: 'c1', userId: 'u2', text: 'Where can I see my history?', ts: Date.now() - 50000 },
];
// 12 Months of Data for Analytics
export const MOCK_TRANSACTION_INSIGHTS: TransactionInsight[] = [
  { date: 'Jul 23', transactions: 950, revenueIdr: 320000000 },
  { date: 'Aug 23', transactions: 1100, revenueIdr: 380000000 },
  { date: 'Sep 23', transactions: 1050, revenueIdr: 350000000 },
  { date: 'Oct 23', transactions: 1400, revenueIdr: 480000000 },
  { date: 'Nov 23', transactions: 1800, revenueIdr: 590000000 },
  { date: 'Dec 23', transactions: 2500, revenueIdr: 850000000 },
  { date: 'Jan 24', transactions: 1200, revenueIdr: 450000000 },
  { date: 'Feb 24', transactions: 1500, revenueIdr: 520000000 },
  { date: 'Mar 24', transactions: 1100, revenueIdr: 390000000 },
  { date: 'Apr 24', transactions: 1800, revenueIdr: 610000000 },
  { date: 'May 24', transactions: 2100, revenueIdr: 750000000 },
  { date: 'Jun 24', transactions: 1900, revenueIdr: 680000000 },
];
export const MOCK_DASHBOARD_STATS = {
  totalMembers: [
    { name: 'Gold', value: 850, fill: '#4F46E5' },
    { name: 'Silver', value: 2400, fill: '#818CF8' },
    { name: 'Bronze', value: 6800, fill: '#C7D2FE' },
  ],
  activeMembers: MOCK_TRANSACTION_INSIGHTS.map(item => ({
    date: item.date,
    active: Math.floor(item.transactions * 2.2),
    new: Math.floor(item.transactions / 4)
  })),
  pointsLog: [
    { date: 'Mon', earned: 4500, burnt: 2100 },
    { date: 'Tue', earned: 5200, burnt: 1800 },
    { date: 'Wed', earned: 4800, burnt: 3200 },
    { date: 'Thu', earned: 6100, burnt: 2800 },
    { date: 'Fri', earned: 5900, burnt: 4100 },
    { date: 'Sat', earned: 8200, burnt: 5500 },
    { date: 'Sun', earned: 7500, burnt: 4800 },
  ],
  insights: MOCK_TRANSACTION_INSIGHTS
};
export const MOCK_TIERS: Tier[] = [
  { id: 't1', name: 'Bronze', minPoints: 0, benefits: ['Standard support', 'Birthday treat'], color: '#CD7F32' },
  { id: 't2', name: 'Silver', minPoints: 5000, benefits: ['Standard support', '5% discount', 'Early sale access'], color: '#C0C0C0' },
  { id: 't3', name: 'Gold', minPoints: 15000, benefits: ['Priority support', '10% discount', 'Lounge access', 'Concierge service'], color: '#FFD700' },
];
// 50+ Vouchers
export const MOCK_VOUCHERS: Voucher[] = Array.from({ length: 50 }, (_, i) => ({
  id: `v-${i + 1}`,
  title: i % 2 === 0 ? `Brand Reward ${i + 1}` : `Partner Discount ${i + 1}`,
  code: `REWARD-${1000 + i}`,
  discountType: i % 3 === 0 ? 'percentage' : 'fixed',
  value: i % 3 === 0 ? (i % 2 === 0 ? 10 : 20) : (i % 2 === 0 ? 50000 : 100000),
  expiryDate: `2025-${(i % 12) + 1 < 10 ? '0' : ''}${(i % 12) + 1}-28`,
  status: i % 10 === 0 ? 'expired' : 'active',
  isExternal: i % 5 === 0,
  sourcePartnerId: i % 5 === 0 ? `p${(i % 2) + 1}` : undefined
}));
// 10+ Venues
export const MOCK_VENUES: Venue[] = [
  { id: 'ven1', name: 'Sedayu Mall A', location: 'Jakarta North', type: 'Mall', isActive: true, pointClaimEligible: true },
  { id: 'ven2', name: 'Nexus Tower', location: 'Jakarta CBD', type: 'Office', isActive: true, pointClaimEligible: false },
  { id: 'ven3', name: 'The Residency Plaza', location: 'Jakarta South', type: 'Residential', isActive: true, pointClaimEligible: true },
  { id: 'ven4', name: 'Coastal Walk', location: 'Bali', type: 'Mall', isActive: true, pointClaimEligible: true },
  { id: 'ven5', name: 'Summit Office Park', location: 'Surabaya', type: 'Office', isActive: true, pointClaimEligible: false },
  { id: 'ven6', name: 'West Gate Mall', location: 'Tangerang', type: 'Mall', isActive: true, pointClaimEligible: true },
  { id: 'ven7', name: 'Harbor Point', location: 'Semarang', type: 'Mall', isActive: true, pointClaimEligible: true },
  { id: 'ven8', name: 'Echo Hub', location: 'Jakarta West', type: 'Office', isActive: true, pointClaimEligible: false },
  { id: 'ven9', name: 'Lakeside Living', location: 'Bogor', type: 'Residential', isActive: true, pointClaimEligible: true },
  { id: 'ven10', name: 'Urban Green Square', location: 'Bandung', type: 'Mall', isActive: true, pointClaimEligible: true },
];
// 50+ Outlets
const CATEGORIES = ["F&B Dining", "Fashion & Accessories", "Electronics", "Supermarket", "Cosmetics & Beauty", "Home & Living"];
export const MOCK_OUTLETS: Outlet[] = Array.from({ length: 60 }, (_, i) => ({
  id: `out-${i + 1}`,
  venueId: `ven${(i % 10) + 1}`,
  name: `${CATEGORIES[i % CATEGORIES.length]} Outlet ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  tenantName: `${LAST_NAMES[i % LAST_NAMES.length]} Corp`,
  floor: i % 5 === 0 ? 'G' : `${i % 5}th`
}));
export const MOCK_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Complete Profile', type: 'onboarding', pointsReward: 100, status: 'active', rewardType: 'points', rewardValue: 100, instructions: 'Fill in all mandatory fields.' },
  { id: 'm2', title: 'Invite a Friend', type: 'referral', pointsReward: 500, status: 'active', rewardType: 'points', rewardValue: 500, instructions: 'Your friend must sign up.' },
  { id: 'm3', title: 'Daily Login Streak', type: 'general', pointsReward: 50, status: 'active', rewardType: 'points', rewardValue: 50, instructions: 'Login for 5 consecutive days.' },
  { id: 'm4', title: 'First Purchase', type: 'onboarding', pointsReward: 200, status: 'active', rewardType: 'points', rewardValue: 200, instructions: 'Make your first transaction.' },
  { id: 'm5', title: 'Elite Membership', type: 'tier', pointsReward: 1000, status: 'active', rewardType: 'points', rewardValue: 1000, instructions: 'Reach Gold tier status.' },
];
export const MOCK_INTERESTS: InterestTag[] = [
  { id: 'int1', name: 'Coffee', color: '#78350f', category: 'F&B', count: 4200 },
  { id: 'int2', name: 'Fashion', color: '#065f46', category: 'Lifestyle', count: 3100 },
  { id: 'int3', name: 'Tech', color: '#1e40af', category: 'Tech', count: 2800 },
  { id: 'int4', name: 'Hiking', color: '#15803d', category: 'Lifestyle', count: 1200 },
  { id: 'int5', name: 'Luxury', color: '#b45309', category: 'Shopping', count: 950 },
];
export const MOCK_LEADERBOARDS: Leaderboard[] = [
  {
    id: 'lb-weekly',
    title: 'Weekly Top Earners',
    period: 'weekly',
    entries: Array.from({ length: 20 }, (_, i) => ({
      rank: i + 1,
      memberName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
      points: 5000 - i * 150,
      change: i % 3 === 0 ? 'up' : i % 3 === 1 ? 'down' : 'neutral'
    }))
  }
];
// 100 Members
export const MOCK_MEMBERS: Member[] = Array.from({ length: 100 }, (_, i) => ({
  id: `MEM-${1000 + i}`,
  name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}${i}@example.com`,
  tier: i % 10 === 0 ? 'Gold' : i % 4 === 0 ? 'Silver' : 'Bronze',
  points: Math.floor(Math.random() * 50000),
  status: Math.random() > 0.05 ? 'Active' : 'Inactive',
  joinedDate: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString()
}));
export const MOCK_APPROVALS: ApprovalTask[] = Array.from({ length: 30 }, (_, i) => ({
  id: `apr-${i + 1}`,
  type: i % 2 === 0 ? 'points_claim' : 'membership',
  memberName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  amount: i % 2 === 0 ? 500 : 0,
  status: i < 5 ? 'pending' : i < 20 ? 'approved' : 'rejected',
  date: '2024-06-' + ((i % 15) + 1).toString().padStart(2, '0'),
  description: i % 2 === 0 ? 'Receipt Scan Claim' : 'Tier Upgrade Request'
}));
export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Global Bank Inc', type: 'bank', status: 'active', contactEmail: 'partnerships@globalbank.com', agreementLevel: 'Platinum', joinedDate: '2022-01-15' },
  { id: 'p2', name: 'Retail Union', type: 'retail', status: 'active', contactEmail: 'ops@retailunion.net', agreementLevel: 'Gold', joinedDate: '2023-05-20' },
  { id: 'p3', name: 'Sky Airline', type: 'service', status: 'active', contactEmail: 'loyalty@sky.com', agreementLevel: 'Standard', joinedDate: '2023-11-10' },
];
export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Early Bird', description: 'Joined in the first month', icon: 'zap', color: '#4F46E5', requirementPoints: 0, earnedCount: 1240 },
  { id: 'b2', name: 'High Spender', description: 'Spent over $10k', icon: 'trending-up', color: '#F59E0B', requirementPoints: 10000, earnedCount: 85 },
  { id: 'b3', name: 'Referral King', description: 'Invited 10+ friends', icon: 'users', color: '#10B981', requirementPoints: 0, earnedCount: 42 },
];
export const MOCK_ADS: Ad[] = Array.from({ length: 15 }, (_, i) => ({
  id: `ad${i + 1}`,
  name: `Campaign Asset ${i + 1}`,
  imageUrl: `https://images.unsplash.com/photo-${1483985988000 + i * 100000}?q=80&w=800`,
  placement: i % 3 === 0 ? 'banner' : i % 3 === 1 ? 'popup' : 'sidebar',
  targetTier: i % 2 === 0 ? 'Gold' : 'Silver',
  targetCategory: CATEGORIES[i % CATEGORIES.length],
  status: 'active'
}));
export const MOCK_TICKETS: MarketingTicket[] = Array.from({ length: 20 }, (_, i) => ({
  id: `tk${i + 1}`,
  eventName: i % 2 === 0 ? 'VIP Gala' : 'Store Opening',
  memberName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  ticketCode: `T-${10000 + i}`,
  status: i % 5 === 0 ? 'used' : 'valid',
  issueDate: '2024-06-01'
}));
export const MOCK_NEWS: NewsItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `nw${i + 1}`,
  title: `News Update ${i + 1}`,
  content: `Content for enterprise news update ${i + 1}. High-fidelity mock content for CRM.`,
  category: i % 2 === 0 ? 'Announcement' : 'Promotion',
  publishDate: '2024-06-' + ((i % 15) + 1).toString().padStart(2, '0'),
  status: i < 10 ? 'published' : 'draft'
}));
export const MOCK_GIFT_CARDS: GiftCard[] = Array.from({ length: 50 }, (_, i) => ({
  id: `gc${i + 1}`,
  serial: `NXS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  value: (i % 5 + 1) * 100000,
  balance: i % 3 === 0 ? 0 : (i % 5 + 1) * 100000,
  status: i % 3 === 0 ? 'redeemed' : 'active',
  expiryDate: '2025-12-31'
}));
export const MOCK_FAQ: FaqItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `fq${i + 1}`,
  question: `Frequently Asked Question #${i + 1}?`,
  answer: `This is a detailed answer for the knowledge base item #${i + 1}. It explains enterprise CRM logic.`,
  category: i % 4 === 0 ? 'Points' : i % 4 === 1 ? 'Membership' : i % 4 === 2 ? 'Technical' : 'Security'
}));
export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  id: 'global',
  theme: 'system',
  language: 'English',
  ssoEnabled: true,
  ssoEntityId: 'nexus-crm-main-id',
  ssoMetadataUrl: 'https://idp.nexus.com/metadata',
  ocrPrecision: 'high',
  wifiSsid: 'Nexus_Guest_WiFi',
  notificationEmail: 'admin@nexus-crm.com',
  splashBgColor: '#4F46E5'
};
export const MOCK_CATEGORIES = CATEGORIES;