import type { User, Chat, ChatMessage } from './types';
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
  ]
};
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