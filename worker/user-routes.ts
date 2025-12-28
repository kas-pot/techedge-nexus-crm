import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity, ChatBoardEntity, TierEntity, VoucherEntity, VenueEntity,
  OutletEntity, MissionEntity, CampaignEntity, InterestEntity,
  LeaderboardEntity, ApprovalEntity, PartnerEntity, BadgeEntity,
  SystemSettingsEntity, AdEntity, TicketEntity, NewsEntity, GiftCardEntity, FaqEntity
} from "./entities";
import { ok, bad, notFound, isStr, Index } from './core-utils';
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
  app.get('/api/:entityType', async (c) => {
    const type = c.req.param('entityType');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c, `Entity type ${type} not found`);
    await EntityClass.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const page = await EntityClass.list(c.env, cursor ?? null, limit ? Math.max(1, (Number(limit) | 0)) : undefined);
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
  app.post('/api/gift-cards/batch', async (c) => {
    const { count, value, expiryDate } = await c.req.json();
    if (!count || !value) return bad(c, 'count and value required');
    const batch = [];
    for (let i = 0; i < count; i++) {
      const id = crypto.randomUUID();
      const card = {
        id,
        serial: `NXS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        value: Number(value),
        balance: Number(value),
        status: 'active',
        expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
      await GiftCardEntity.create(c.env, card as any);
      batch.push(card);
    }
    return ok(c, batch);
  });
  app.post('/api/vouchers/sync-external', async (c) => {
    const { partnerId, count = 5 } = await c.req.json();
    if (!partnerId) return bad(c, 'partnerId required');
    const syncedVouchers = [];
    const partner = new PartnerEntity(c.env, partnerId);
    if (!await partner.exists()) return notFound(c, 'Partner not found');
    const pState = await partner.getState();
    for (let i = 0; i < count; i++) {
      const v = {
        id: crypto.randomUUID(),
        title: `${pState.name} Reward #${Math.floor(Math.random() * 1000)}`,
        code: `EXT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        discountType: Math.random() > 0.5 ? 'fixed' : 'percentage',
        value: Math.random() > 0.5 ? 50000 : 15,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        isExternal: true,
        sourcePartnerId: partnerId,
        syncDate: new Date().toISOString(),
        metadata: { imported: true, partnerType: pState.type }
      };
      await VoucherEntity.create(c.env, v as any);
      syncedVouchers.push(v);
    }
    return ok(c, { synced: syncedVouchers.length, items: syncedVouchers });
  });
  app.get('/api/system/settings', async (c) => ok(c, await SystemSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/settings', async (c) => {
    const data = await c.req.json();
    const inst = new SystemSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
}