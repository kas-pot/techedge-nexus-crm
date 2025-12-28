import { IndexedEntity, Entity } from "./core-utils";
import type {
  User, Chat, ChatMessage, Tier, Voucher, Venue, Outlet,
  Mission, Campaign, InterestTag, Leaderboard, ApprovalTask,
  Partner, Badge, SystemSettings, Ad, MarketingTicket, NewsItem,
  GiftCard, FaqItem, Member, ContactSettings, LegalDocument, WifiSettings, WeatherConfig,
  SplashScreenConfig, HeroBannerConfig, ActivityLog
} from "@shared/types";
import type { PushCampaign } from "@shared/types";
import {
  MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_TIERS,
  MOCK_VOUCHERS, MOCK_VENUES, MOCK_OUTLETS, MOCK_MISSIONS,
  MOCK_INTERESTS, MOCK_LEADERBOARDS, MOCK_APPROVALS,
  MOCK_PARTNERS, MOCK_BADGES, MOCK_SYSTEM_SETTINGS,
  MOCK_ADS, MOCK_TICKETS, MOCK_NEWS, MOCK_GIFT_CARDS, MOCK_FAQ, MOCK_MEMBERS,
  MOCK_CONTACT_SETTINGS, MOCK_TERMS_CONTENT, MOCK_PRIVACY_CONTENT, MOCK_WIFI_SETTINGS,
  MOCK_CAMPAIGNS, MOCK_WEATHER_CONFIG, MOCK_SPLASH_CONFIG, MOCK_HERO_BANNER_CONFIG,
  MOCK_PUSH_CAMPAIGNS, MOCK_ACTIVITY_LOGS
} from "@shared/mock-data";
export class UserEntity extends IndexedEntity<Member> {
  static readonly entityName = "member";
  static readonly indexName = "members";
  static readonly initialState: Member = { id: "", name: "", email: "", tier: "Bronze", points: 0, status: "Active", joinedDate: "" };
  static seedData = MOCK_MEMBERS;
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
  static seedData = MOCK_CAMPAIGNS;
}
export class PushCampaignEntity extends IndexedEntity<PushCampaign> {
  static readonly entityName = "push_campaign";
  static readonly indexName = "push_campaigns";
  static readonly initialState: PushCampaign = { id: "", name: "", startDate: "", endDate: "", channel: "push", status: "draft", category: "General", messageTitle: "", messageBody: "", targetSegment: "All Members", targetingType: "Global Broadcast", triggerType: "Manual", scheduledFor: "" };
  static seedData = MOCK_PUSH_CAMPAIGNS;
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
export class ApprovalEntity extends IndexedEntity<ApprovalTask> {
  static readonly entityName = "approval";
  static readonly indexName = "approvals";
  static readonly initialState: ApprovalTask = { id: "", type: "points_claim", memberName: "", amount: 0, status: "pending", date: "" };
  static seedData = MOCK_APPROVALS;
}
export class ActivityLogEntity extends IndexedEntity<ActivityLog> {
  static readonly entityName = "activity_log";
  static readonly indexName = "activity_logs";
  static readonly initialState: ActivityLog = { id: "", action: "Joined", entityType: "system", entityId: "", userName: "System", timestamp: "" };
  static seedData = MOCK_ACTIVITY_LOGS;
}
export class PartnerEntity extends IndexedEntity<Partner> {
  static readonly indexName = "partners";
  static readonly entityName = "partner";
  static readonly initialState: Partner = { id: "", name: "", type: "retail", status: "inactive", contactEmail: "", agreementLevel: "Standard", joinedDate: "" };
  static seedData = MOCK_PARTNERS;
}
export class BadgeEntity extends IndexedEntity<Badge> {
  static readonly entityName = "badge";
  static readonly indexName = "badges";
  static readonly initialState: Badge = { id: "", name: "", description: "", icon: "star", color: "#ccc", requirementPoints: 0, earnedCount: 0 };
  static seedData = MOCK_BADGES;
}
export class AdEntity extends IndexedEntity<Ad> {
  static readonly entityName = "ad";
  static readonly indexName = "ads";
  static readonly initialState: Ad = { id: "", name: "", imageUrl: "", placement: "banner", targetTier: "Bronze", targetCategory: "", status: "inactive" };
  static seedData = MOCK_ADS;
}
export class TicketEntity extends IndexedEntity<MarketingTicket> {
  static readonly entityName = "ticket";
  static readonly indexName = "tickets";
  static readonly initialState: MarketingTicket = { id: "", eventName: "", memberName: "", ticketCode: "", status: "valid", issueDate: "" };
  static seedData = MOCK_TICKETS;
}
export class NewsEntity extends IndexedEntity<NewsItem> {
  static readonly entityName = "news";
  static readonly indexName = "news_list";
  static readonly initialState: NewsItem = { id: "", title: "", content: "", category: "Announcement", publishDate: "", status: "draft" };
  static seedData = MOCK_NEWS;
}
export class GiftCardEntity extends IndexedEntity<GiftCard> {
  static readonly entityName = "gift_card";
  static readonly indexName = "gift_cards";
  static readonly initialState: GiftCard = { id: "", serial: "", value: 0, balance: 0, status: "active", expiryDate: "" };
  static seedData = MOCK_GIFT_CARDS;
}
export class FaqEntity extends IndexedEntity<FaqItem> {
  static readonly entityName = "faq";
  static readonly indexName = "faqs";
  static readonly initialState: FaqItem = { id: "", question: "", answer: "", category: "Points" };
  static seedData = MOCK_FAQ;
}
// Global System Singletons
export class SystemSettingsEntity extends Entity<SystemSettings> {
  static readonly entityName = "system_settings";
  static readonly initialState: SystemSettings = MOCK_SYSTEM_SETTINGS;
  static async getGlobal(env: any): Promise<SystemSettings> {
    const inst = new SystemSettingsEntity(env, "global");
    return inst.getState();
  }
}
export class ContactSettingsEntity extends Entity<ContactSettings> {
  static readonly entityName = "contact_settings";
  static readonly initialState: ContactSettings = MOCK_CONTACT_SETTINGS;
  static async getGlobal(env: any): Promise<ContactSettings> {
    const inst = new ContactSettingsEntity(env, "global");
    return inst.getState();
  }
}
export class TermsEntity extends Entity<LegalDocument> {
  static readonly entityName = "terms_conditions";
  static readonly initialState: LegalDocument = MOCK_TERMS_CONTENT;
  static async getGlobal(env: any): Promise<LegalDocument> {
    const inst = new TermsEntity(env, "global");
    return inst.getState();
  }
}
export class PrivacyEntity extends Entity<LegalDocument> {
  static readonly entityName = "privacy_policy";
  static readonly initialState: LegalDocument = MOCK_PRIVACY_CONTENT;
  static async getGlobal(env: any): Promise<LegalDocument> {
    const inst = new PrivacyEntity(env, "global");
    return inst.getState();
  }
}
export class WifiEntity extends Entity<WifiSettings> {
  static readonly entityName = "wifi_config";
  static readonly initialState: WifiSettings = MOCK_WIFI_SETTINGS;
  static async getGlobal(env: any): Promise<WifiSettings> {
    const inst = new WifiEntity(env, "global");
    return inst.getState();
  }
}
export class WeatherSettingsEntity extends Entity<WeatherConfig> {
  static readonly entityName = "weather_settings";
  static readonly initialState: WeatherConfig = MOCK_WEATHER_CONFIG;
  static async getGlobal(env: any): Promise<WeatherConfig> {
    const inst = new WeatherSettingsEntity(env, "global");
    return inst.getState();
  }
}
export class SplashScreenEntity extends Entity<SplashScreenConfig> {
  static readonly entityName = "splash_screen_config";
  static readonly initialState: SplashScreenConfig = MOCK_SPLASH_CONFIG;
  static async getGlobal(env: any): Promise<SplashScreenConfig> {
    const inst = new SplashScreenEntity(env, "global");
    return inst.getState();
  }
}
export class HeroBannerEntity extends Entity<HeroBannerConfig> {
  static readonly entityName = "hero_banner_config";
  static readonly initialState: HeroBannerConfig = MOCK_HERO_BANNER_CONFIG;
  static async getGlobal(env: any): Promise<HeroBannerConfig> {
    const inst = new HeroBannerEntity(env, "global");
    return inst.getState();
  }
}