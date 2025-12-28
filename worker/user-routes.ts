import { Hono } from "hono";
import type { Env } from './core-utils';
import { 
  UserEntity, ChatBoardEntity, TierEntity, VoucherEntity, VenueEntity, 
  OutletEntity, MissionEntity, CampaignEntity, InterestEntity, 
  LeaderboardEntity, ApprovalEntity, PartnerEntity, BadgeEntity, 
  SystemSettingsEntity, AdEntity, TicketEntity, NewsEntity, GiftCardEntity, FaqEntity 
} from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Nexus CRM API' }}));
  const createListRoute = (path: string, entity: any) => {
    app.get(path, async (c) => {
      await entity.ensureSeed(c.env);
      const cursor = c.req.query('cursor');
      const limit = c.req.query('limit');
      const page = await entity.list(c.env, cursor ?? null, limit ? Math.max(1, (Number(limit) | 0)) : undefined);
      return ok(c, page);
    });
  };
  createListRoute('/api/users', UserEntity);
  createListRoute('/api/chats', ChatBoardEntity);
  createListRoute('/api/tiers', TierEntity);
  createListRoute('/api/vouchers', VoucherEntity);
  createListRoute('/api/venues', VenueEntity);
  createListRoute('/api/outlets', OutletEntity);
  createListRoute('/api/missions', MissionEntity);
  createListRoute('/api/campaigns', CampaignEntity);
  createListRoute('/api/interests', InterestEntity);
  createListRoute('/api/leaderboards', LeaderboardEntity);
  createListRoute('/api/approvals', ApprovalEntity);
  createListRoute('/api/partners', PartnerEntity);
  createListRoute('/api/badges', BadgeEntity);
  // Phase 7 Routes
  createListRoute('/api/ads', AdEntity);
  createListRoute('/api/tickets', TicketEntity);
  createListRoute('/api/news', NewsEntity);
  createListRoute('/api/gift-cards', GiftCardEntity);
  createListRoute('/api/faqs', FaqEntity);
  // System Settings Singleton
  app.get('/api/system/settings', async (c) => ok(c, await SystemSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/settings', async (c) => {
    const data = await c.req.json();
    const inst = new SystemSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  // Specialized Routes
  app.post('/api/approvals/:id/decide', async (c) => {
    const { status } = await c.req.json() as { status: 'approved' | 'rejected' };
    const inst = new ApprovalEntity(c.env, c.req.param('id'));
    if (!await inst.exists()) return notFound(c);
    await inst.patch({ status });
    return ok(c, await inst.getState());
  });
  app.post('/api/gift-cards/generate', async (c) => {
    const { count, value, expiryDate } = await c.req.json();
    for(let i = 0; i < count; i++) {
      const serial = `NXS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await GiftCardEntity.create(c.env, {
        id: crypto.randomUUID(),
        serial,
        value: Number(value),
        balance: Number(value),
        status: 'active',
        expiryDate
      });
    }
    return ok(c, { generated: count });
  });
  app.post('/api/tickets/issue', async (c) => {
    const data = await c.req.json();
    const ticket = await TicketEntity.create(c.env, {
      ...data,
      id: crypto.randomUUID(),
      status: 'valid',
      issueDate: new Date().toISOString()
    });
    return ok(c, ticket);
  });
  app.post('/api/missions', async (c) => {
    const data = await c.req.json();
    if (!data.title) return bad(c, 'title required');
    const mission = await MissionEntity.create(c.env, { ...data, id: crypto.randomUUID() });
    return ok(c, mission);
  });
}