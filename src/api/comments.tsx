import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings, Variables } from "../bindings";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  pinComment,
  unpinComment,
} from "../functions/comments";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get("/", async (c) => {
  const postId = Number(c.req.query("postId"));
  if (!postId) {
    return c.json({ error: "Missing postId" }, 400);
  }

  const db = drizzle(c.env.DB);
  const comments = await getCommentsByPostId(db, postId);
  return c.json(comments);
});

app.post("/", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    const postId = Number(body.postId);
    const content = String(body.content ?? "").trim();

    if (!postId || !content) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    if (content.length > 1000) {
      return c.json({ error: "Comment too long" }, 400);
    }

    const db = drizzle(c.env.DB);
    const comment = await createComment(db, {
      postId,
      userId: user.id,
      content,
    });

    if (!comment) {
      return c.json({ error: "Failed to create comment" }, 500);
    }

    return c.json(comment, 201);
  } catch (err) {
    console.error("Error creating comment:", err);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

app.delete("/:id", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const success = await deleteComment(db, id, user.id);

  if (!success) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json({ success: true });
});

app.post("/:id/pin", async (c) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const comment = await pinComment(db, id);

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json(comment);
});

app.post("/:id/unpin", async (c) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const comment = await unpinComment(db, id);

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json(comment);
});

export default app;
