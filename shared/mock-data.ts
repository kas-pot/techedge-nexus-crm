import type {
  User, Chat, ChatMessage, TransactionInsight, Tier, Voucher,
  Venue, Outlet, Mission, InterestTag, Leaderboard, ApprovalTask,
  Partner, Badge, SystemSettings, Ad, MarketingTicket, NewsItem, GiftCard, FaqItem, Member,
  ContactSettings, LegalDocument, WifiSettings, Campaign, WeatherConfig, WeatherRecommendation,
  SplashScreenConfig, HeroBannerConfig, PushCampaign, ActivityLog
} from './types';
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
export const MOCK_CAMPAIGNS: Campaign[] = Array.from({ length: 22 }, (_, i) => ({
  id: `camp-${i + 1}`,
  name: i % 3 === 0 ? `Summer Flash Sale ${Math.floor(i / 3) + 1}` : i % 3 === 1 ? `Weekend Points Boost ${Math.floor(i / 3) + 1}` : `Exclusive Member Invite ${Math.floor(i / 3) + 1}`,
  startDate: `2024-06-${(i % 15) + 1 < 10 ? '0' : ''}${(i % 15) + 1}`,
  endDate: `2024-07-${(i % 15) + 1 < 10 ? '0' : ''}${(i % 15) + 1}`,
  channel: i % 4 === 0 ? 'push' : i % 4 === 1 ? 'email' : i % 4 === 2 ? 'sms' : 'ads',
  status: i < 5 ? 'running' : i < 15 ? 'completed' : 'scheduled',
  reach: 5000 + Math.floor(Math.random() * 10000),
  openRate: 5 + Math.random() * 20,
  ctr: 1 + Math.random() * 7
}));
export const MOCK_WEATHER_CONFIG: WeatherConfig = {
  id: 'global',
  isEnabled: true,
  locationName: 'PIK, Jakarta North',
  activeCondition: 'sunny',
  autoRotation: true,
  lastUpdated: new Date().toISOString()
};
export const WEATHER_PRESETS: Record<string, WeatherRecommendation> = {
  sunny: {
    condition: 'Sunny',
    tips: ["Stay hydrated - visit our water stations", "Apply sunscreen for outdoor events", "Enjoy rooftop dining at Venue A"],
    icon: 'Sun'
  },
  rainy: {
    condition: 'Rainy',
    tips: ["Umbrella rentals available at Concierge", "Enjoy indoor workshops at Sedayu Mall", "Check out the indoor cinema promos"],
    icon: 'CloudRain'
  },
  cloudy: {
    condition: 'Cloudy',
    tips: ["Perfect weather for a mall stroll", "Outdoor park is open for member activities", "Check out the new garden seating"],
    icon: 'Cloud'
  },
  humid: {
    condition: 'Humid',
    tips: ["Cool off with 20% off all cold drinks", "Air-conditioned lounges are available", "Visit our indoor F&B outlets"],
    icon: 'Droplets'
  }
};
export const MOCK_SPLASH_CONFIG: SplashScreenConfig = {
  id: 'global',
  imageUrl: 'https://images.unsplash.com/photo-1549212628-971c26f02213?q=80&w=800',
  backgroundColor: '#4F46E5',
  displayDuration: 3000
};
export const MOCK_HERO_BANNER_CONFIG: HeroBannerConfig = {
  id: 'global',
  isEnabled: true,
  autoRotationSpeed: 5000,
  banners: [
    { id: 'h1', title: 'Summer Festival 2024', subtitle: 'Exclusive rewards await you at PIK Avenue.', imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200', actionUrl: '/marketing/events', order: 1 },
    { id: 'h2', title: 'Double Points Weekend', subtitle: 'Earn 2x XP on all F&B Dining this weekend only.', imageUrl: 'https://images.unsplash.com/photo-1550966841-3ee5ad6070d8?q=80&w=1200', actionUrl: '/loyalty/earn-points', order: 2 },
    { id: 'h3', title: 'VIP Lounge Access', subtitle: 'New Gold Tier benefit unlocked. Visit Nexus Tower.', imageUrl: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1200', actionUrl: '/tiers', order: 3 },
  ]
};
export const MOCK_TIERS: Tier[] = [
  { id: 't1', name: 'Bronze', minPoints: 0, benefits: ['Standard support', 'Birthday treat'], color: '#CD7F32' },
  { id: 't2', name: 'Silver', minPoints: 5000, benefits: ['Standard support', '5% discount', 'Early sale access'], color: '#C0C0C0' },
  { id: 't3', name: 'Gold', minPoints: 15000, benefits: ['Priority support', '10% discount', 'Lounge access', 'Concierge service'], color: '#FFD700' },
];
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
export const MOCK_VENUES: Venue[] = [
  { id: 'ven1', name: 'Sedayu Mall A', location: 'Jakarta North', type: 'Mall', isActive: true, pointClaimEligible: true },
  { id: 'ven2', name: 'Nexus Tower', location: 'Jakarta CBD', type: 'Office', isActive: true, pointClaimEligible: false },
  { id: 'ven3', name: 'The Residency Plaza', location: 'Jakarta South', type: 'Residential', isActive: true, pointClaimEligible: true },
];
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
];
export const MOCK_INTERESTS: InterestTag[] = [
  { id: 'int1', name: 'Coffee', color: '#78350f', category: 'F&B', count: 4200 },
  { id: 'int2', name: 'Fashion', color: '#065f46', category: 'Lifestyle', count: 3100 },
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
  description: i % 2 === 0 ? 'Receipt Scan Claim' : 'Tier Upgrade Request',
  ocrResult: i % 2 === 0 ? {
    mallName: 'Sedayu Mall A',
    totalAmount: 500,
    receiptDate: '2024-06-' + ((i % 15) + 1).toString().padStart(2, '0'),
    receiptId: `REC-${10000 + i}`,
    confidenceScore: i % 4 === 0 ? 0.98 : 0.65
  } : undefined
}));
export const MOCK_ACTIVITY_LOGS: ActivityLog[] = Array.from({ length: 25 }, (_, i) => ({
  id: `log-${i + 1}`,
  action: (['Created', 'Updated', 'Redeemed', 'Sent', 'Approved', 'Joined'] as const)[i % 6],
  entityType: (['member', 'voucher', 'campaign', 'approval'] as const)[i % 4],
  entityId: `id-${i}`,
  userName: FIRST_NAMES[i % FIRST_NAMES.length],
  timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
  details: `System event related to ${(['member', 'voucher', 'campaign', 'approval'] as const)[i % 4]} entity processing.`
}));
export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Global Bank Inc', type: 'bank', status: 'active', contactEmail: 'partnerships@globalbank.com', agreementLevel: 'Platinum', joinedDate: '2022-01-15' },
];
export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Early Bird', description: 'Joined in the first month', icon: 'zap', color: '#4F46E5', requirementPoints: 0, earnedCount: 1240 },
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
  content: `Content for enterprise news update ${i + 1}.`,
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
  answer: `This is a detailed answer for the knowledge base item #${i + 1}.`,
  category: i % 4 === 0 ? 'Points' : i % 4 === 1 ? 'Membership' : i % 4 === 2 ? 'Technical' : 'Security'
}));
export const MOCK_CONTACT_SETTINGS: ContactSettings = {
  id: 'global',
  email: 'pik.experience@agungsedyu.com',
  phone: '+622150982122',
  whatsapp: '+628123456789',
  whatsappUrl: 'https://wa.me/628123456789',
  websiteUrl: 'https://amantara.com/',
  facebookUrl: 'https://facebook.com/techedge.nexus',
  instagramUrl: 'https://instagram.com/techedge.nexus'
};
export const MOCK_TERMS_CONTENT: LegalDocument = {
  id: 'terms',
  title: 'Loyalty Program Terms & Conditions',
  content: `LOYALTY PROGRAM TERMS & CONDITIONS MEMBERSHIP
1. Acceptance of Terms
By registering for the TechEdge Nexus Loyalty Program, members agree to be bound by these terms and conditions.
2. Membership Eligibility
Membership is open to individuals aged 17 and above. Corporations and legal entities are not eligible for individual membership.
3. Earning Points
Points are earned based on qualifying purchases at participating venues. The current earning rate is defined in the Loyalty Rules Engine.
4. Point Expiration
Points remain valid for a period of 12 months from the date of earn unless otherwise specified.
5. Redemption
Members may redeem points for vouchers, gift cards, or other rewards available in the reward catalog.`,
  lastUpdated: '2024-06-01'
};
export const MOCK_PRIVACY_CONTENT: LegalDocument = {
  id: 'privacy',
  title: 'Data Privacy Policy',
  content: `PRIVACY POLICY
1. Information Collection
We collect personal information including name, email, and transaction history to provide personalized loyalty services.
2. Data Usage
Your data is used to process rewards, improve our services, and send targeted marketing communications if opted-in.
3. Data Security
We implement enterprise-grade security measures to protect your personal information from unauthorized access.
4. Third-Party Sharing
We do not sell your personal data. Data may be shared with authorized partners only to facilitate reward fulfillment.`,
  lastUpdated: '2024-06-01'
};
export const MOCK_WIFI_SETTINGS: WifiSettings = {
  id: 'global',
  ssid: 'TechEdge_Guest_WiFi',
  password: 'techedge_loyalty_2024',
  isVisible: true
};
export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  id: 'global',
  theme: 'system',
  language: 'English',
  ssoEnabled: true,
  ssoEntityId: 'techedge-nexus-main-id',
  ssoMetadataUrl: 'https://idp.techedge-nexus.com/metadata',
  ocrPrecision: 'high',
  wifiSsid: 'TechEdge_Guest_WiFi',
  notificationEmail: 'admin@techedge-nexus.com',
  splashBgColor: '#4F46E5'
};
export const MOCK_CATEGORIES = CATEGORIES;
export const MOCK_PUSH_CAMPAIGNS: PushCampaign[] = [
  {
    id: "push-1", name: "Weekend Flash Sale", channel: "push", status: "sent", reach: 12050, openRate: 32.4, ctr: 8.1,
    category: "Announcement", startDate: "2024-05-10", endDate: "2024-05-12", messageTitle: "Flash Sale is LIVE! 🛍️", messageBody: "Get 20% off all fashion brands this weekend only. Open to see your exclusive codes.",
    targetSegment: "All Members", targetingType: "Global Broadcast", triggerType: "Scheduled", scheduledFor: "2024-05-10T09:00:00Z", sentAt: "2024-05-10T09:00:05Z",
    imageUrl: "https://images.unsplash.com/photo-1483985988000-0e9567e62ef5?q=80&w=800"
  },
  {
    id: "push-2", name: "Gold Tier Exclusive", channel: "push", status: "sent", reach: 850, openRate: 58.2, ctr: 14.5,
    category: "Announcement", startDate: "2024-05-15", endDate: "2024-05-15", messageTitle: "Private Lounge Access ", messageBody: "As a Gold Member, enjoy complimentary snacks at the VIP Lounge today.",
    targetSegment: "Gold Tier", targetingType: "Segmented", triggerType: "Manual", scheduledFor: "2024-05-15T14:00:00Z", sentAt: "2024-05-15T14:00:02Z",
    imageUrl: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1200"
  },
  {
    id: "push-3", name: "Birthday Shoutout", channel: "push", status: "scheduled", reach: 120, openRate: 0, ctr: 0,
    category: "Birthday", startDate: "2024-06-01", endDate: "2024-06-01", messageTitle: "Happy Birthday! 🎂", messageBody: "Enjoy a complimentary coffee and 500 bonus XP on your special day.",
    targetSegment: "All Members", targetingType: "Segmented", triggerType: "Event-Based", scheduledFor: "2024-06-01T08:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800"
  },
  {
    id: "push-4", name: "Mission: Mystery Shopper", channel: "push", status: "draft", reach: 0, openRate: 0, ctr: 0,
    category: "Mission", startDate: "2024-06-10", endDate: "2024-06-12", messageTitle: "New Mission: Shopper 🕵️", messageBody: "Complete 3 purchases at PIK Avenue to unlock the secret badge.",
    targetSegment: "Silver Tier", targetingType: "Segmented", triggerType: "Scheduled", scheduledFor: "2024-06-10T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800"
  },
  {
    id: "push-5", name: "Points Claim Approved", channel: "push", status: "sent", reach: 1, openRate: 100, ctr: 85,
    category: "Approval", startDate: "2024-05-20", endDate: "2024-05-20", messageTitle: "Claim Approved! ✅", messageBody: "Your receipt scan from Sedayu Mall has been verified. 250 XP added.",
    targetSegment: "All Members", targetingType: "Segmented", triggerType: "Event-Based", scheduledFor: "2024-05-20T12:00:00Z", sentAt: "2024-05-20T12:00:01Z"
  }
];
export const PUSH_ANALYTICS_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  openRate: 15 + Math.sin(i * 0.5) * 10 + Math.random() * 10,
  deliverySuccess: 95 + Math.random() * 4,
}));