import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity, ChatBoardEntity, TierEntity, VoucherEntity, VenueEntity,
  OutletEntity, MissionEntity, CampaignEntity, InterestEntity,
  LeaderboardEntity, ApprovalEntity, PartnerEntity, BadgeEntity,
  SystemSettingsEntity, AdEntity, TicketEntity, NewsEntity, GiftCardEntity, FaqEntity,
  ContactSettingsEntity, TermsEntity, PrivacyEntity, WifiEntity, WeatherSettingsEntity
} from "./entities";
import { ok, bad, notFound, Index } from './core-utils';
const ENTITY_MAP: Record<string, any> = {
  users: UserEntity,
  tiers: TierEntity,
  vouchers: VoucherEntity,
  venues: VenueEntity,
  outlets: OutletEntity,
  missions: MissionEntity,
  campaigns: CampaignEntity,
  interests: InterestEntity,
  leaderboards: LeaderboardEntity,
  approvals: ApprovalEntity,
  partners: PartnerEntity,
  badges: BadgeEntity,
  ads: AdEntity,
  tickets: TicketEntity,
  news: NewsEntity,
  'gift-cards': GiftCardEntity,
  faqs: FaqEntity
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // 1. Specialized Batch Gift Card Generation
  app.post('/api/gift-cards/batch', async (c) => {
    const { count, value, expiryDate } = await c.req.json();
    if (!count || count <= 0) return bad(c, 'Invalid count');
    const results = [];
    for (let i = 0; i < count; i++) {
      const id = crypto.randomUUID();
      const serial = `NXS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const card = await GiftCardEntity.create(c.env, {
        id,
        serial,
        value: Number(value) || 0,
        balance: Number(value) || 0,
        status: 'active',
        expiryDate: expiryDate || '2025-12-31'
      });
      results.push(card);
    }
    return ok(c, results);
  });
  // 2. Specialized External Voucher Synchronization
  app.post('/api/vouchers/sync-external', async (c) => {
    const { partnerId, count } = await c.req.json();
    if (!partnerId) return bad(c, 'Partner ID required');
    const partnerInst = new PartnerEntity(c.env, partnerId);
    if (!await partnerInst.exists()) return notFound(c, 'Partner not found');
    const syncResults = [];
    const syncDate = new Date().toISOString();
    for (let i = 0; i < (count || 5); i++) {
      const id = crypto.randomUUID();
      const voucher = await VoucherEntity.create(c.env, {
        id,
        title: `Partner Reward ${i + 1}`,
        code: `EXT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        discountType: i % 2 === 0 ? 'percentage' : 'fixed',
        value: i % 2 === 0 ? 15 : 50000,
        expiryDate: '2025-12-31',
        status: 'active',
        isExternal: true,
        sourcePartnerId: partnerId,
        syncDate
      });
      syncResults.push(voucher);
    }
    return ok(c, { synced: syncResults.length, items: syncResults });
  });
  // Generic Entity Routes
  app.get('/api/:entityType', async (c) => {
    const type = c.req.param('entityType');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c, `Entity type ${type} not found`);
    await EntityClass.ensureSeed(c.env);
    const channel = c.req.query('channel');
    const cursor = c.req.query('cursor');
    const limitParam = c.req.query('limit');
    const limit = limitParam ? Math.max(1, (Number(limitParam) | 0)) : undefined;
    const page = await EntityClass.list(c.env, cursor ?? null, limit);
    // Filter if channel is provided (for campaigns)
    if (channel && type === 'campaigns') {
      page.items = page.items.filter((item: any) => item.channel === channel);
    }
    return ok(c, page);
  });
  app.get('/api/:entityType/:id', async (c) => {
    const type = c.req.param('entityType');
    const id = c.req.param('id');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const inst = new EntityClass(c.env, id);
    if (!await inst.exists()) return notFound(c);
    return ok(c, await inst.getState());
  });
  app.post('/api/:entityType', async (c) => {
    const type = c.req.param('entityType');
    const data = await c.req.json();
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const id = data.id || crypto.randomUUID();
    const result = await EntityClass.create(c.env, { ...data, id });
    return ok(c, result);
  });
  app.put('/api/:entityType/:id', async (c) => {
    const type = c.req.param('entityType');
    const id = c.req.param('id');
    const data = await c.req.json();
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const inst = new EntityClass(c.env, id);
    if (!await inst.exists()) return notFound(c);
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.delete('/api/:entityType/:id', async (c) => {
    const type = c.req.param('entityType');
    const id = c.req.param('id');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const deleted = await EntityClass.delete(c.env, id);
    return deleted ? ok(c, { success: true }) : notFound(c);
  });
  // Specialized System Routes
  app.get('/api/system/settings', async (c) => ok(c, await SystemSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/settings', async (c) => {
    const data = await c.req.json();
    const inst = new SystemSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/system/contact', async (c) => ok(c, await ContactSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/contact', async (c) => {
    const data = await c.req.json();
    const inst = new ContactSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/system/terms', async (c) => ok(c, await TermsEntity.getGlobal(c.env)));
  app.put('/api/system/terms', async (c) => {
    const data = await c.req.json();
    const inst = new TermsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/system/privacy', async (c) => ok(c, await PrivacyEntity.getGlobal(c.env)));
  app.put('/api/system/privacy', async (c) => {
    const data = await c.req.json();
    const inst = new PrivacyEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/system/wifi', async (c) => ok(c, await WifiEntity.getGlobal(c.env)));
  app.put('/api/system/wifi', async (c) => {
    const data = await c.req.json();
    const inst = new WifiEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/system/weather', async (c) => ok(c, await WeatherSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/weather', async (c) => {
    const data = await c.req.json();
    const inst = new WeatherSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/reseed-all', async (c) => {
    let count = 0;
    for (const [type, EntityClass] of Object.entries(ENTITY_MAP)) {
      const indexName = (EntityClass as any).indexName;
      if (indexName) {
        const idx = new Index<string>(c.env, indexName);
        await idx.clear();
        await EntityClass.ensureSeed(c.env);
        count++;
      }
    }
    return ok(c, { reseeded: count, message: 'All mock entities force-reseeded' });
  });
}