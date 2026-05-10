import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity, ChatBoardEntity, TierEntity, VoucherEntity, VenueEntity,
  OutletEntity, MissionEntity, CampaignEntity, InterestEntity,
  LeaderboardEntity, ApprovalEntity, PartnerEntity, BadgeEntity,
  SystemSettingsEntity, AdEntity, TicketEntity, NewsEntity, GiftCardEntity, FaqEntity,
  ContactSettingsEntity, TermsEntity, PrivacyEntity, WifiEntity, WeatherSettingsEntity,
  SplashScreenEntity, HeroBannerEntity,
  PushCampaignEntity, ActivityLogEntity
} from "./entities";
import { ok, bad, notFound, Index } from './core-utils';
import {
  MOCK_SPLASH_CONFIG,
  MOCK_HERO_BANNER_CONFIG,
  MOCK_WIFI_SETTINGS
} from '@shared/mock-data';
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
  'push-campaigns': PushCampaignEntity,
  'activity-logs': ActivityLogEntity,
  faqs: FaqEntity
};
async function logActivity(env: Env, action: any, type: string, id: string) {
  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    try {
      await ActivityLogEntity.create(env, {
        id: crypto.randomUUID(),
        action,
        entityType: type,
        entityId: id,
        userName: "Nexus Admin",
        timestamp: new Date().toISOString(),
        details: `Automatic audit for ${action} event on ${type}:${id}`
      });
      return;
    } catch (e) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.error("Logging failed after", maxAttempts, "attempts:", e);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Specialized Batch Gift Card Generation
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
    await logActivity(c.env, 'Created', 'gift_card_batch', 'batch_mint');
    return ok(c, results);
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
    if (channel && type === 'campaigns') {
      page.items = page.items.filter((item: any) => item.channel === channel);
    }
    return ok(c, page);
  });
  app.post('/api/:entityType', async (c) => {
    const type = c.req.param('entityType');
    const data = await c.req.json();
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const id = data.id || crypto.randomUUID();
    const result = await EntityClass.create(c.env, { ...data, id });
    await logActivity(c.env, 'Created', type, id);
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
    await logActivity(c.env, 'Updated', type, id);
    return ok(c, await inst.getState());
  });
  app.delete('/api/:entityType/:id', async (c) => {
    const type = c.req.param('entityType');
    const id = c.req.param('id');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const deleted = await EntityClass.delete(c.env, id);
    if (deleted) await logActivity(c.env, 'Deleted', type, id);
    return deleted ? ok(c, { success: true }) : notFound(c);
  });
  // System Singleton Routes
  app.get('/api/system/settings', async (c) => ok(c, await SystemSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/settings', async (c) => {
    const data = await c.req.json();
    const inst = new SystemSettingsEntity(c.env, "global");
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
        if (type === 'activity-logs') continue;
        const idx = new Index<string>(c.env, indexName);
        await idx.clear();
        await EntityClass.ensureSeed(c.env);
        count++;
      }
    }
    await new SplashScreenEntity(c.env, "global").save(MOCK_SPLASH_CONFIG);
    await new HeroBannerEntity(c.env, "global").save(MOCK_HERO_BANNER_CONFIG);
    await new WifiEntity(c.env, "global").save(MOCK_WIFI_SETTINGS);
    return ok(c, { reseeded: count, message: 'All mock entities force-reseeded' });
  });

  // ─── The Pot App — Live D1 Routes ─────────────────────────────────────────
  // All routes are guarded: if THEPOT_DB binding is absent (production), return 404.
  function getDb(c: any): D1Database | null {
    return (c.env as any).THEPOT_DB ?? null;
  }

  // Users
  app.get('/api/thepot/users', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const page = Number(c.req.query('page') ?? 1);
    const limit = Number(c.req.query('limit') ?? 50);
    const offset = (page - 1) * limit;
    const search = c.req.query('search') ?? '';
    const where = search ? `WHERE u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?` : '';
    const params = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const [rows, total] = await Promise.all([
      db.prepare(`SELECT * FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all(),
      db.prepare(`SELECT COUNT(*) as cnt FROM users ${where}`).bind(...params).first<{ cnt: number }>(),
    ]);
    return ok(c, { items: rows.results, total: total?.cnt ?? 0, page, limit });
  });

  app.get('/api/thepot/users/:id', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first();
    return user ? ok(c, user) : notFound(c);
  });

  app.post('/api/thepot/users', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { first_name, last_name, email, birth_date, gender, user_role, is_active } = await c.req.json();
    if (!first_name || !last_name || !email) return bad(c, 'first_name, last_name and email are required');
    const existing = await db.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
    if (existing) return bad(c, 'A user with this email already exists');
    await db.prepare(
      `INSERT INTO users (email, first_name, last_name, birth_date, gender, is_email_verified, is_active, user_role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, datetime('now'), datetime('now'))`
    ).bind(email, first_name, last_name, birth_date ?? null, gender ?? null, is_active ?? 1, user_role ?? 'user').run();
    const created = await db.prepare('SELECT * FROM users WHERE email=? ORDER BY id DESC LIMIT 1').bind(email).first();
    return ok(c, created);
  });

  app.put('/api/thepot/users/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { first_name, last_name, email, birth_date, gender, is_active, user_role } = await c.req.json();
    await db.prepare(
      `UPDATE users SET first_name=?, last_name=?, email=?, birth_date=?, gender=?, is_active=?, user_role=?, updated_at=datetime('now') WHERE id=?`
    ).bind(first_name, last_name, email, birth_date ?? null, gender ?? null, is_active ?? 1, user_role ?? 'user', c.req.param('id')).run();
    const updated = await db.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first();
    return ok(c, updated);
  });

  app.delete('/api/thepot/users/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare(`UPDATE users SET is_active=0, updated_at=datetime('now') WHERE id=?`).bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Games
  app.get('/api/thepot/games', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const page = Number(c.req.query('page') ?? 1);
    const limit = Number(c.req.query('limit') ?? 50);
    const offset = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      db.prepare(`
        SELECT g.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name,
          (SELECT COUNT(*) FROM game_rounds gr WHERE gr.game_id = g.id) as round_count
        FROM games g
        LEFT JOIN users u ON u.id = g.user_id
        ORDER BY g.id DESC LIMIT ? OFFSET ?
      `).bind(limit, offset).all(),
      db.prepare('SELECT COUNT(*) as cnt FROM games').first<{ cnt: number }>(),
    ]);
    return ok(c, { items: rows.results, total: total?.cnt ?? 0, page, limit });
  });

  app.get('/api/thepot/games/:id', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const [game, teams, rounds] = await Promise.all([
      db.prepare(`
        SELECT g.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
        FROM games g LEFT JOIN users u ON u.id = g.user_id WHERE g.id=?
      `).bind(c.req.param('id')).first(),
      db.prepare('SELECT * FROM game_teams WHERE game_id=? ORDER BY team_index').bind(c.req.param('id')).all(),
      db.prepare('SELECT * FROM game_rounds WHERE game_id=? ORDER BY round_number').bind(c.req.param('id')).all(),
    ]);
    if (!game) return notFound(c);
    return ok(c, { ...game as object, teams: teams.results, rounds: rounds.results });
  });

  app.delete('/api/thepot/games/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare('DELETE FROM games WHERE id=?').bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Challenges
  app.get('/api/thepot/challenges', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const rows = await db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM sub_challenges sc WHERE sc.challenge_id = c.challenge_id) as sub_challenge_count
      FROM challenges c ORDER BY c.is_default DESC, c.id ASC
    `).all();
    return ok(c, { items: rows.results, total: rows.results.length });
  });

  app.post('/api/thepot/challenges', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name, user_id } = await c.req.json();
    if (!name) return bad(c, 'name is required');
    const challenge_id = Date.now().toString();
    await db.prepare(
      `INSERT INTO challenges (challenge_id, name, is_active, is_default, user_id, created_at, updated_at) VALUES (?, ?, 0, 0, ?, datetime('now'), datetime('now'))`
    ).bind(challenge_id, name, user_id ?? null).run();
    const created = await db.prepare('SELECT * FROM challenges WHERE challenge_id=?').bind(challenge_id).first();
    return ok(c, created);
  });

  app.put('/api/thepot/challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name, is_active } = await c.req.json();
    await db.prepare(
      `UPDATE challenges SET name=?, is_active=?, updated_at=datetime('now') WHERE id=?`
    ).bind(name, is_active ?? 0, c.req.param('id')).run();
    const updated = await db.prepare('SELECT * FROM challenges WHERE id=?').bind(c.req.param('id')).first();
    return ok(c, updated);
  });

  app.delete('/api/thepot/challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare('DELETE FROM challenges WHERE id=? AND is_default=0').bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Sub-Challenges
  app.get('/api/thepot/challenges/:challengeId/sub-challenges', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const rows = await db.prepare(
      'SELECT * FROM sub_challenges WHERE challenge_id=? ORDER BY id ASC'
    ).bind(c.req.param('challengeId')).all();
    return ok(c, { items: rows.results, total: rows.results.length });
  });

  app.post('/api/thepot/challenges/:challengeId/sub-challenges', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name } = await c.req.json();
    if (!name) return bad(c, 'name is required');
    const sub_challenge_id = `custom-${Date.now()}`;
    const challengeId = c.req.param('challengeId');
    await db.prepare(
      `INSERT INTO sub_challenges (sub_challenge_id, challenge_id, name, is_default, created_at, updated_at) VALUES (?, ?, ?, 0, datetime('now'), datetime('now'))`
    ).bind(sub_challenge_id, challengeId, name).run();
    const created = await db.prepare('SELECT * FROM sub_challenges WHERE sub_challenge_id=?').bind(sub_challenge_id).first();
    return ok(c, created);
  });

  app.put('/api/thepot/sub-challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name } = await c.req.json();
    await db.prepare(
      `UPDATE sub_challenges SET name=?, updated_at=datetime('now') WHERE id=?`
    ).bind(name, c.req.param('id')).run();
    const updated = await db.prepare('SELECT * FROM sub_challenges WHERE id=?').bind(c.req.param('id')).first();
    return ok(c, updated);
  });

  app.delete('/api/thepot/sub-challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare('DELETE FROM sub_challenges WHERE id=? AND is_default=0').bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Stats overview
  app.get('/api/thepot/stats', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const [users, games, challenges, subChallenges] = await Promise.all([
      db.prepare('SELECT COUNT(*) as cnt FROM users').first<{ cnt: number }>(),
      db.prepare('SELECT COUNT(*) as cnt FROM games').first<{ cnt: number }>(),
      db.prepare('SELECT COUNT(*) as cnt FROM challenges').first<{ cnt: number }>(),
      db.prepare('SELECT COUNT(*) as cnt FROM sub_challenges').first<{ cnt: number }>(),
    ]);
    return ok(c, {
      users: users?.cnt ?? 0,
      games: games?.cnt ?? 0,
      challenges: challenges?.cnt ?? 0,
      subChallenges: subChallenges?.cnt ?? 0,
    });
  });
}