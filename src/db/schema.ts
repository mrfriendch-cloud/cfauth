import { sql } from "drizzle-orm";
import { generateId } from "lucia";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
    title: text("title", { length: 256 }).notNull(),
    description: text("description", { length: 512 }).notNull().default(""),
    tags: text("tags").notNull().default(""),
    content: text("content").notNull(),
    contentType: text("content_type").notNull().default("markdown"),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    coverImage: text("cover_image").notNull().default(""),
    category: text("category", { enum: ["Products", "Services", "News"] })
      .notNull()
      .default("Products"),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    // Speeds up all public listing queries (most common pattern)
    statusCategoryIdx: index("posts_status_category_idx").on(
      table.status,
      table.category,
    ),
    // Speeds up user-specific post lookups (/posts page, getUserPosts)
    authorIdx: index("posts_author_idx").on(table.authorId),
    // Speeds up pinned post query on homepage
    pinnedIdx: index("posts_pinned_idx").on(table.pinned),
    // Speeds up date-ordered listing queries
    createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  }),
);

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] })
    .notNull()
    .default("user"),
  banned: integer("banned", { mode: "boolean" }).notNull().default(false),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => ({
    // Speeds up session validation on every authenticated request
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

export const inquiries = sqliteTable("inquiries", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull().default(""),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertInquiry = typeof inquiries.$inferInsert;
export type SelectInquiry = typeof inquiries.$inferSelect;

export const comments = sqliteTable("comments", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertComment = typeof comments.$inferInsert;
export type SelectComment = typeof comments.$inferSelect;
