# CFAuth - Cloudflare Workers B2B Platform

A modern, high-performance web application built for the Cloudflare ecosystem. It features a fully server-side rendered (SSR) frontend powered by HTMX and a robust backend API.

## 🚀 Tech Stack

- **Runtime:** [Bun](https://bun.sh/) & [Cloudflare Workers](https://workers.cloudflare.com/) 
- **Web Framework:** [Hono](https://hono.dev/)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Storage:** [Cloudflare R2](https://developers.cloudflare.com/r2/) (Object Storage for Media)
- **Authentication:** [Lucia Auth](https://lucia-auth.com/)
- **Frontend:** JSX (Server-Side Rendered) + [HTMX](https://htmx.org/) + [Tailwind CSS](https://tailwindcss.com/)

## ✨ Key Features

- **Robust Authentication:** Secure, cookie-based sessions with Lucia Auth.
- **Admin Dashboard:** Manage users, posts, and inquiries.
- **Content Management:** Create, edit, publish, and delete Markdown-powered blog posts, news, and services.
- **Media Uploads:** Direct uploads to Cloudflare R2 buckets.
- **Performance Optimized:** Database query optimization, edge caching via Hono Cache, and proper SQLite indexing.
- **HTMX Integration:** Dynamic, SPA-like interactions without the heavy client-side JavaScript bundle.

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- [Bun](https://bun.sh/)
- A [Cloudflare](https://dash.cloudflare.com/sign-up) account.
- Cloudflare Wrangler CLI (installed locally via dependencies, but global installation is good too).

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Login to Cloudflare** (if you haven't already):
   ```bash
   bunx wrangler login
   ```

3. **Set up the Database (Cloudflare D1):**
   Create a new D1 database for the project:
   ```bash
   bunx wrangler d1 create cfw-bun-hono-drizzle-d1
   ```
   *Note down the `database_name` and `database_id` outputted by this command.*

4. **Set up Media Storage (Cloudflare R2):**
   Create an R2 bucket for storing post cover images and uploaded media.
   ```bash
   bunx wrangler r2 bucket create media
   ```

5. **Configure Wrangler:**
   Update your `wrangler.toml` file with your specific `database_id` from Step 3.
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "cfw-bun-hono-drizzle-d1"
   database_id = "YOUR_DATABASE_ID_HERE"
   migrations_dir = "drizzle/migrations"
   
   [[r2_buckets]]
   binding = "MEDIA_BUCKET"
   bucket_name = "media"
   ```

6. **Apply Database Migrations (Local):**
   Run the Drizzle migrations against your local SQLite database:
   ```bash
   bun run db:generate # Generate any pending migrations (if schema changed)
   bunx wrangler d1 migrations apply cfw-bun-hono-drizzle-d1 --local
   ```

7. **Start the Development Server:**
   ```bash
   bun run dev
   ```
   The app will be available at `http://localhost:8787`.

---

## 🚀 Deployment (Production)

Deploying to Cloudflare Workers is seamless.

1. **Apply Migrations to Production D1:**
   Ensure your live database has the correct schema:
   ```bash
   bunx wrangler d1 migrations apply cfw-bun-hono-drizzle-d1 --remote
   ```

2. **Deploy the Worker:**
   Upload and deploy your application to Cloudflare's edge network:
   ```bash
   bun run deploy
   ```
   Your app will be live at `https://cfw-bun-hono.<your-subdomain>.workers.dev`.
