# Nexus CRM Backoffice

[cloudflarebutton]

A production-ready full-stack CRM backoffice application built on Cloudflare Workers. Features a modern React frontend with shadcn/ui, TailwindCSS, and a robust backend using Hono, Durable Objects for entity storage (Users, ChatBoards), and indexed listings.

## ✨ Key Features

- **Scalable Backend**: Cloudflare Workers with Durable Objects for multi-tenant entity storage (Users, Chats, Messages).
- **Real-time Chat**: Persistent chat boards with message history stored per chat.
- **Indexed Entities**: Efficient listing and pagination using DO-backed indexes.
- **Modern UI**: Responsive design with shadcn/ui components, TailwindCSS, dark mode, and animations.
- **Type-Safe API**: Shared types between frontend/backend, TanStack Query integration.
- **Production-Ready**: CORS, error handling, health checks, client error reporting.
- **Zero-Cold-Start**: Durable Objects ensure instant state access.

## 🛠️ Technology Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects, TypeScript
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Lucide icons
- **State/Data**: TanStack Query, Zustand, Immer
- **UI Utils**: Framer Motion, Headless UI, React Hook Form, Zod
- **DevOps**: Bun, Wrangler, ESLint, Cloudflare Pages integration

## 🚀 Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd nexus-crm-backoffice-pypnqia6hgu5p15avjc7a
   bun install
   ```

2. **Run Locally**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (frontend) with Worker proxying `/api/*`.

3. **Type Generation** (for IDE support):
   ```bash
   bun cf-typegen
   ```

## 🧪 Local Development

- **Development Server**: `bun dev` - Hot reload for frontend, Worker auto-rebuilds.
- **Build & Preview**: `bun build && bun preview` - Static preview.
- **Lint**: `bun lint`.
- **API Testing**: Use `/api/health`, `/api/users`, etc. (see API section).
- **Seed Data**: Auto-seeds mock users/chats on first API call.

Add custom routes in `worker/user-routes.ts` - hot-reloads automatically.

## 📋 API Endpoints

All endpoints return `{ success: boolean, data?: T, error?: string }`.

### Users
- `GET /api/users?cursor=&limit=` - List users (paginated)
- `POST /api/users` - `{ name: string }` → Create user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/deleteMany` - `{ ids: string[] }`

### Chats
- `GET /api/chats?cursor=&limit=` - List chats
- `POST /api/chats` - `{ title: string }` → Create chat
- `DELETE /api/chats/:id`
- `POST /api/chats/deleteMany` - `{ ids: string[] }`

### Messages
- `GET /api/chats/:chatId/messages` - List messages
- `POST /api/chats/:chatId/messages` - `{ userId: string, text: string }`

Test with `curl` or frontend demo.

## 🚀 Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun deploy
```

- Configured in `wrangler.jsonc` (Durable Objects, assets SPA handling).
- Auto-deploys Worker + frontend assets.
- Custom domain, env vars via Wrangler dashboard.

[cloudflarebutton]

## 🤝 Contributing

1. Fork & PR.
2. Use `bun install` for consistency.
3. Follow TypeScript + ESLint rules.
4. Test changes: `bun dev` + API calls.
5. Update `shared/types.ts` for frontend/backend sync.

## 📄 License

MIT - see [LICENSE](LICENSE) (add if needed).