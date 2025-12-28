import type { User, Chat, ChatMessage, TransactionInsight, Tier, Voucher, Venue, Outlet, Mission, InterestTag, Leaderboard, ApprovalTask, Partner, Badge, SystemSettings } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'James Wilson' },
  { id: 'u2', name: 'Sarah Chen' },
  { id: 'u3', name: 'Michael Scott' },
  { id: 'u4', name: 'Elena Rodriguez' },
  { id: 'u5', name: 'David Kim' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General Support' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello, I need help with my points.', ts: Date.now() },
];
export const MOCK_TRANSACTION_INSIGHTS: TransactionInsight[] = [
  { date: 'Jan', transactions: 1200, revenueIdr: 450000000 },
  { date: 'Feb', transactions: 1500, revenueIdr: 520000000 },
  { date: 'Mar', transactions: 1100, revenueIdr: 390000000 },
  { date: 'Apr', transactions: 1800, revenueIdr: 610000000 },
  { date: 'May', transactions: 2100, revenueIdr: 750000000 },
  { date: 'Jun', transactions: 1900, revenueIdr: 680000000 },
];
export const MOCK_DASHBOARD_STATS = {
  totalMembers: [
    { name: 'Gold', value: 450, fill: '#4F46E5' },
    { name: 'Silver', value: 1200, fill: '#818CF8' },
    { name: 'Bronze', value: 3400, fill: '#C7D2FE' },
  ],
  activeMembers: [
    { date: '2024-01', active: 2400, new: 400 },
    { date: '2024-02', active: 2800, new: 600 },
    { date: '2024-03', active: 3200, new: 800 },
    { date: '2024-04', active: 3100, new: 450 },
    { date: '2024-05', active: 3800, new: 1100 },
    { date: '2024-06', active: 4200, new: 900 },
  ],
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
  { id: 't1', name: 'Bronze', minPoints: 0, benefits: ['Standard support'], color: '#CD7F32' },
  { id: 't2', name: 'Silver', minPoints: 5000, benefits: ['Standard support', '5% discount'], color: '#C0C0C0' },
  { id: 't3', name: 'Gold', minPoints: 15000, benefits: ['Priority support', '10% discount', 'Lounge access'], color: '#FFD700' },
];
export const MOCK_VOUCHERS: Voucher[] = [
  { id: 'v1', title: 'Welcome Gift', code: 'WELCOME10', discountType: 'fixed', value: 10, expiryDate: '2025-12-31', status: 'active' },
  { id: 'v2', title: 'Flash Sale', code: 'FLASH20', discountType: 'percentage', value: 20, expiryDate: '2025-06-30', status: 'active' },
  { id: 'v3', title: 'Nike Store Credit', code: 'NIKE50', discountType: 'fixed', value: 50, expiryDate: '2025-08-15', status: 'active', isExternal: true },
];
export const MOCK_VENUES: Venue[] = [
  { id: 'ven1', name: 'Sedayu Mall A', location: 'Jakarta North', type: 'Mall', isActive: true, pointClaimEligible: true },
  { id: 'ven2', name: 'Nexus Tower', location: 'Jakarta CBD', type: 'Office', isActive: true, pointClaimEligible: false },
];
export const MOCK_OUTLETS: Outlet[] = [
  { id: 'out1', venueId: 'ven1', name: 'Coffee Lab', category: 'F&B Dining', tenantName: 'Coffee Lab Ltd', floor: 'G' },
  { id: 'out2', venueId: 'ven1', name: 'Urban Fashion', category: 'Fashion & Accessories', tenantName: 'Urban Group', floor: '1st' },
];
export const MOCK_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Complete Profile', type: 'onboarding', pointsReward: 100, status: 'active', rewardType: 'points', rewardValue: 100, instructions: 'Fill in all mandatory fields in your profile settings.' },
  { id: 'm2', title: 'Invite a Friend', type: 'referral', pointsReward: 500, status: 'active', rewardType: 'points', rewardValue: 500, referralMessage: 'Hey! Join Nexus CRM and get exclusive rewards using my code: {code}', instructions: 'Your friend must sign up and complete their first transaction.' },
];
export const MOCK_INTERESTS: InterestTag[] = [
  { id: 'int1', name: 'Coffee', color: '#78350f', category: 'F&B', count: 1240 },
  { id: 'int2', name: 'Sustainable Fashion', color: '#065f46', category: 'Lifestyle', count: 850 },
  { id: 'int3', name: 'Gadgets', color: '#1e40af', category: 'Tech', count: 2100 },
];
export const MOCK_LEADERBOARDS: Leaderboard[] = [
  {
    id: 'lb-weekly',
    title: 'Weekly Top Earners',
    period: 'weekly',
    entries: [
      { rank: 1, memberName: 'James Wilson', points: 4500, change: 'neutral' },
      { rank: 2, memberName: 'Sarah Chen', points: 4200, change: 'up' },
    ]
  },
];
export const MOCK_MEMBERS = Array.from({ length: 25 }, (_, i) => ({
  id: `MEM-${1000 + i}`,
  name: `Member ${i + 1}`,
  email: `member${i + 1}@example.com`,
  tier: i % 3 === 0 ? 'Gold' : i % 2 === 0 ? 'Silver' : 'Bronze',
  points: Math.floor(Math.random() * 10000),
  status: Math.random() > 0.1 ? 'Active' : 'Inactive',
  joinedDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toLocaleDateString()
}));
export const MOCK_CATEGORIES = [
  "Fashion & Accessories",
  "Cosmetics & Beauty",
  "F&B Dining",
  "Supermarket",
  "Electronics",
  "Home & Living",
  "Entertainment"
];
// New Phase 5 Mocks
export const MOCK_APPROVALS: ApprovalTask[] = [
  { id: 'apr-1', type: 'points_claim', memberName: 'James Wilson', amount: 500, status: 'pending', date: '2024-06-12', description: 'Coffee Lab Receipt Claim' },
  { id: 'apr-2', type: 'membership', memberName: 'Sarah Chen', amount: 0, status: 'pending', date: '2024-06-11', description: 'Elite Membership Upgrade Request' },
  { id: 'apr-3', type: 'voucher_redeem', memberName: 'David Kim', amount: 1000, status: 'approved', date: '2024-06-10', description: 'Point Redemption for Mall Voucher' },
];
export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Global Bank Inc', type: 'bank', status: 'active', contactEmail: 'partnerships@globalbank.com', agreementLevel: 'Platinum', joinedDate: '2022-01-15' },
  { id: 'p2', name: 'Retail Union', type: 'retail', status: 'active', contactEmail: 'ops@retailunion.net', agreementLevel: 'Gold', joinedDate: '2023-05-20' },
  { id: 'p3', name: 'Sky Services', type: 'service', status: 'inactive', contactEmail: 'support@sky.co', agreementLevel: 'Standard', joinedDate: '2024-02-10' },
];
export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Early Bird', description: 'Joined in the first month of launch', icon: 'zap', color: '#4F46E5', requirementPoints: 0, earnedCount: 1240 },
  { id: 'b2', name: 'High Spender', description: 'Spent over $10,000 in a year', icon: 'trending-up', color: '#F59E0B', requirementPoints: 10000, earnedCount: 85 },
  { id: 'b3', name: 'Tech Enthusiast', description: 'Completed 5 tech-related missions', icon: 'monitor', color: '#10B981', requirementPoints: 500, earnedCount: 450 },
];
export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  id: 'global',
  theme: 'system',
  language: 'English',
  ssoEnabled: true,
  ocrPrecision: 'high',
  wifiSsid: 'Nexus_Guest_WiFi',
  notificationEmail: 'admin@nexus-crm.com'
};