import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, TierEntity, VoucherEntity, VenueEntity, OutletEntity, MissionEntity, CampaignEntity, InterestEntity, LeaderboardEntity } from "./entities";
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
  app.post('/api/missions', async (c) => {
    const data = await c.req.json();
    if (!data.title) return bad(c, 'title required');
    const mission = await MissionEntity.create(c.env, { ...data, id: crypto.randomUUID() });
    return ok(c, mission);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
}