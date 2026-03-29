import { DrizzleD1Database } from "drizzle-orm/d1";
import { InsertComment, SelectComment, comments } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function getCommentsByPostId(
  db: DrizzleD1Database,
  postId: number,
): Promise<SelectComment[]> {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.pinned), desc(comments.createdAt));
}

export async function createComment(
  db: DrizzleD1Database,
  data: InsertComment,
): Promise<SelectComment | null> {
  const result = await db.insert(comments).values(data).returning();
  if (!result || result.length === 0) {
    return null;
  }
  return result[0];
}

export async function deleteComment(
  db: DrizzleD1Database,
  id: string,
  userId: string,
): Promise<boolean> {
  const result = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return result.length > 0;
}

export async function pinComment(
  db: DrizzleD1Database,
  id: string,
): Promise<SelectComment | null> {
  const result = await db
    .update(comments)
    .set({ pinned: true })
    .where(eq(comments.id, id))
    .returning();
  return result[0] ?? null;
}

export async function unpinComment(
  db: DrizzleD1Database,
  id: string,
): Promise<SelectComment | null> {
  const result = await db
    .update(comments)
    .set({ pinned: false })
    .where(eq(comments.id, id))
    .returning();
  return result[0] ?? null;
}
