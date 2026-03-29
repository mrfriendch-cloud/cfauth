import { DrizzleD1Database } from "drizzle-orm/d1";
import { InsertPost, SelectPost, posts } from "../db/schema";
import { eq, and, like, or, desc, asc, sql, count } from "drizzle-orm";

/**
 * Extract image URLs from markdown content and cover image
 * Returns array of R2 object keys to delete
 */
function extractImageKeys(post: SelectPost): string[] {
  const keys: string[] = [];

  // Extract cover image key
  if (post.coverImage) {
    const coverMatch = post.coverImage.match(/\/media\/([^?]+)/);
    if (coverMatch) {
      keys.push(coverMatch[1]);
    }
  }

  // Extract images from markdown content
  if (post.content) {
    // Match markdown images: ![alt](url)
    const markdownImages = post.content.match(/!\[.*?\]\((.*?)\)/g) || [];
    markdownImages.forEach((img) => {
      const urlMatch = img.match(/!\[.*?\]\((.*?)\)/);
      if (urlMatch && urlMatch[1]) {
        const keyMatch = urlMatch[1].match(/\/media\/([^?]+)/);
        if (keyMatch) {
          keys.push(keyMatch[1]);
        }
      }
    });

    // Match HTML img tags: <img src="url">
    const htmlImages = post.content.match(/<img[^>]+src="([^"]+)"/g) || [];
    htmlImages.forEach((img) => {
      const urlMatch = img.match(/src="([^"]+)"/);
      if (urlMatch && urlMatch[1]) {
        const keyMatch = urlMatch[1].match(/\/media\/([^?]+)/);
        if (keyMatch) {
          keys.push(keyMatch[1]);
        }
      }
    });
  }

  // Remove duplicates
  return [...new Set(keys)];
}

/**
 * Delete images from R2 bucket
 */
async function deleteImagesFromR2(
  bucket: R2Bucket,
  keys: string[],
): Promise<void> {
  if (keys.length === 0) return;

  try {
    await Promise.all(keys.map((key) => bucket.delete(key)));
    console.log(`Deleted ${keys.length} images from R2:`, keys);
  } catch (error) {
    console.error("Error deleting images from R2:", error);
    // Don't throw - we still want to delete the post even if image deletion fails
  }
}

export async function getPosts(
  db: DrizzleD1Database,
  userId: string,
): Promise<SelectPost[]> {
  return await db.select().from(posts).where(eq(posts.authorId, userId));
}

export async function getUserPosts(
  db: DrizzleD1Database,
  userId: string,
  opts: {
    search?: string;
    category?: string;
    tag?: string;
    page?: number;
  } = {},
): Promise<SelectPost[]> {
  const { search, category, tag, page = 1 } = opts;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;

  // Build conditions pushed to DB
  const conditions: ReturnType<typeof eq>[] = [eq(posts.authorId, userId)];

  if (category) {
    conditions.push(
      eq(posts.category, category as "Products" | "Services" | "News"),
    );
  }

  // Tag filtering: stored as comma-separated, use LIKE on DB side
  if (tag) {
    conditions.push(
      or(
        like(posts.tags, `%${tag}%`),
      ) as ReturnType<typeof eq>,
    );
  }

  // Search: push LIKE conditions to DB for title, description, and tags
  if (search) {
    conditions.push(
      or(
        like(posts.title, `%${search}%`),
        like(posts.description, `%${search}%`),
        like(posts.tags, `%${search}%`),
      ) as ReturnType<typeof eq>,
    );
  }

  return await db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.createdAt))
    .limit(pageSize)
    .offset(offset);
}

export async function getUserPostsCount(
  db: DrizzleD1Database,
  userId: string,
  opts: { search?: string; category?: string; tag?: string } = {},
): Promise<number> {
  const { search, category, tag } = opts;

  const conditions: ReturnType<typeof eq>[] = [eq(posts.authorId, userId)];

  if (category) {
    conditions.push(
      eq(posts.category, category as "Products" | "Services" | "News"),
    );
  }

  if (tag) {
    conditions.push(
      or(like(posts.tags, `%${tag}%`)) as ReturnType<typeof eq>,
    );
  }

  if (search) {
    conditions.push(
      or(
        like(posts.title, `%${search}%`),
        like(posts.description, `%${search}%`),
        like(posts.tags, `%${search}%`),
      ) as ReturnType<typeof eq>,
    );
  }

  const [result] = await db
    .select({ total: count() })
    .from(posts)
    .where(and(...conditions));

  return result?.total ?? 0;
}

export async function getPinnedPost(
  db: DrizzleD1Database,
): Promise<SelectPost | null> {
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.pinned, true), eq(posts.status, "published")))
    .limit(1);
  return result[0] ?? null;
}

export async function getPost(
  db: DrizzleD1Database,
  id: number,
): Promise<SelectPost | null> {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] ?? null;
}

export async function insertPost(
  db: DrizzleD1Database,
  data: InsertPost,
): Promise<SelectPost | null> {
  const result = await db.insert(posts).values(data).returning();
  if (!result || result.length === 0) {
    return null;
  }
  return result[0];
}

export async function updatePostPinned(
  db: DrizzleD1Database,
  id: number,
  pinned: boolean,
): Promise<SelectPost | null> {
  const result = await db
    .update(posts)
    .set({ pinned })
    .where(eq(posts.id, id))
    .returning();
  return result[0] ?? null;
}

export async function updatePostStatus(
  db: DrizzleD1Database,
  id: number,
  status: "draft" | "published",
): Promise<SelectPost | null> {
  const result = await db
    .update(posts)
    .set({ status })
    .where(eq(posts.id, id))
    .returning();
  return result[0] ?? null;
}

export async function updatePost(
  db: DrizzleD1Database,
  id: number,
  authorId: string,
  data: Partial<
    Pick<
      InsertPost,
      "title" | "description" | "tags" | "coverImage" | "category" | "content"
    >
  >,
): Promise<SelectPost | null> {
  const result = await db
    .update(posts)
    .set(data)
    .where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
    .returning();
  return result[0] ?? null;
}

export async function deletePostByOwner(
  db: DrizzleD1Database,
  id: number,
  authorId: string,
  bucket?: R2Bucket,
): Promise<boolean> {
  // Get the post first to extract image URLs
  const post = await getPost(db, id);
  if (!post || post.authorId !== authorId) {
    return false;
  }

  // Delete images from R2 if bucket is provided
  if (bucket) {
    const imageKeys = extractImageKeys(post);
    await deleteImagesFromR2(bucket, imageKeys);
  }

  // Delete the post
  const result = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
    .returning();
  return result.length > 0;
}

export async function deletePost(
  db: DrizzleD1Database,
  id: number,
  bucket?: R2Bucket,
): Promise<boolean> {
  // Get the post first to extract image URLs
  const post = await getPost(db, id);
  if (!post) {
    return false;
  }

  // Delete images from R2 if bucket is provided
  if (bucket) {
    const imageKeys = extractImageKeys(post);
    await deleteImagesFromR2(bucket, imageKeys);
  }

  // Delete the post
  const result = await db.delete(posts).where(eq(posts.id, id)).returning();
  return result.length > 0;
}

export async function getPublishedPosts(
  db: DrizzleD1Database,
  opts: {
    search?: string;
    category?: string;
    tag?: string;
    author?: string;
    page?: number;
  } = {},
): Promise<SelectPost[]> {
  const { search, category, tag, author, page = 1 } = opts;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;

  // Build all conditions pushed to the DB
  const conditions: ReturnType<typeof eq>[] = [eq(posts.status, "published")];

  if (category && category !== "All") {
    conditions.push(
      eq(posts.category, category as "Products" | "Services" | "News"),
    );
  }

  if (author) {
    conditions.push(eq(posts.authorId, author));
  }

  // Tag: stored as comma-separated string — use LIKE on DB side
  if (tag) {
    conditions.push(
      or(like(posts.tags, `%${tag}%`)) as ReturnType<typeof eq>,
    );
  }

  // Full-text search via SQL LIKE pushed to D1
  if (search) {
    conditions.push(
      or(
        like(posts.title, `%${search}%`),
        like(posts.description, `%${search}%`),
        like(posts.tags, `%${search}%`),
      ) as ReturnType<typeof eq>,
    );
  }

  return await db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(asc(posts.createdAt))
    .limit(pageSize)
    .offset(offset);
}

export async function getPublishedPostsCount(
  db: DrizzleD1Database,
  opts: {
    search?: string;
    category?: string;
    tag?: string;
    author?: string;
  } = {},
): Promise<number> {
  const { search, category, tag, author } = opts;

  const conditions: ReturnType<typeof eq>[] = [eq(posts.status, "published")];

  if (category && category !== "All") {
    conditions.push(
      eq(posts.category, category as "Products" | "Services" | "News"),
    );
  }

  if (author) {
    conditions.push(eq(posts.authorId, author));
  }

  if (tag) {
    conditions.push(
      or(like(posts.tags, `%${tag}%`)) as ReturnType<typeof eq>,
    );
  }

  if (search) {
    conditions.push(
      or(
        like(posts.title, `%${search}%`),
        like(posts.description, `%${search}%`),
        like(posts.tags, `%${search}%`),
      ) as ReturnType<typeof eq>,
    );
  }

  // Use aggregate COUNT(*) — single lightweight query instead of full row fetch
  const [result] = await db
    .select({ total: count() })
    .from(posts)
    .where(and(...conditions));

  return result?.total ?? 0;
}

/**
 * Fetch all unique tags. Projects only the tags column to minimize data transfer.
 */
export async function getAllTags(db: DrizzleD1Database): Promise<string[]> {
  // Only select the tags column — avoids pulling full post rows across the wire
  const rows = await db.select({ tags: posts.tags }).from(posts);
  const tagSet = new Set<string>();
  for (const row of rows) {
    if (row.tags) {
      row.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => tagSet.add(t));
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Fetch unique tags for a given category. Projects only the tags column.
 */
export async function getTagsByCategory(
  db: DrizzleD1Database,
  category: "Products" | "Services" | "News",
): Promise<string[]> {
  const rows = await db
    .select({ tags: posts.tags })
    .from(posts)
    .where(and(eq(posts.category, category), eq(posts.status, "published")));
  const tagSet = new Set<string>();
  for (const row of rows) {
    if (row.tags) {
      row.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => tagSet.add(t));
    }
  }
  return Array.from(tagSet).sort();
}
