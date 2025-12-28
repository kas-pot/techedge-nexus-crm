import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Tier, Voucher, Venue, Outlet, Mission, Campaign, InterestTag, Leaderboard } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_TIERS, MOCK_VOUCHERS, MOCK_VENUES, MOCK_OUTLETS, MOCK_MISSIONS, MOCK_INTERESTS, MOCK_LEADERBOARDS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
export class TierEntity extends IndexedEntity<Tier> {
  static readonly entityName = "tier";
  static readonly indexName = "tiers";
  static readonly initialState: Tier = { id: "", name: "", minPoints: 0, benefits: [], color: "" };
  static seedData = MOCK_TIERS;
}
export class VoucherEntity extends IndexedEntity<Voucher> {
  static readonly entityName = "voucher";
  static readonly indexName = "vouchers";
  static readonly initialState: Voucher = { id: "", title: "", code: "", discountType: "fixed", value: 0, expiryDate: "", status: "draft" };
  static seedData = MOCK_VOUCHERS;
}
export class VenueEntity extends IndexedEntity<Venue> {
  static readonly entityName = "venue";
  static readonly indexName = "venues";
  static readonly initialState: Venue = { id: "", name: "", location: "", type: "Mall", isActive: true, pointClaimEligible: true };
  static seedData = MOCK_VENUES;
}
export class OutletEntity extends IndexedEntity<Outlet> {
  static readonly entityName = "outlet";
  static readonly indexName = "outlets";
  static readonly initialState: Outlet = { id: "", venueId: "", name: "", category: "", tenantName: "", floor: "" };
  static seedData = MOCK_OUTLETS;
}
export class MissionEntity extends IndexedEntity<Mission> {
  static readonly entityName = "mission";
  static readonly indexName = "missions";
  static readonly initialState: Mission = { id: "", title: "", type: "general", pointsReward: 0, status: "inactive", rewardType: "none" };
  static seedData = MOCK_MISSIONS;
}
export class CampaignEntity extends IndexedEntity<Campaign> {
  static readonly entityName = "campaign";
  static readonly indexName = "campaigns";
  static readonly initialState: Campaign = { id: "", name: "", startDate: "", endDate: "", channel: "push", status: "scheduled" };
  static seedData = [];
}
export class InterestEntity extends IndexedEntity<InterestTag> {
  static readonly entityName = "interest";
  static readonly indexName = "interests";
  static readonly initialState: InterestTag = { id: "", name: "", color: "#ccc", category: "Uncategorized", count: 0 };
  static seedData = MOCK_INTERESTS;
}
export class LeaderboardEntity extends IndexedEntity<Leaderboard> {
  static readonly entityName = "leaderboard";
  static readonly indexName = "leaderboards";
  static readonly initialState: Leaderboard = { id: "", title: "", period: "weekly", entries: [] };
  static seedData = MOCK_LEADERBOARDS;
}