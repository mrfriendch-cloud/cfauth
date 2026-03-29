import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";

import { Bindings, Variables } from "../bindings";
import { SelectPost } from "../db/schema";
import {
  getPosts,
  insertPost,
  updatePost,
  deletePostByOwner,
} from "../functions/posts";

import PostsList from "../components/PostsList";
import Post from "../components/Post";

const postsRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

postsRouter.get("/", async (c) => {
  const user = c.get("user");
  if (!user) return c.html(<></>);

  const db = drizzle(c.env.DB);
  const results: SelectPost[] = await getPosts(db, user.id);
  return c.html(<PostsList posts={results} />);
});

// Create post
postsRouter.post(
  "/",
  zValidator(
    "form",
    z.object({
      title: z.string().min(1).max(255),
      description: z.string().max(512).optional().default(""),
      tags: z.string().max(255).optional().default(""),
      cover_image: z.string().max(2048).optional().default(""),
      category: z
        .enum(["Products", "Services", "News"])
        .optional()
        .default("Products"),
      content: z.string().min(1).max(100000),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "User not found" }, 404);

    const db = drizzle(c.env.DB);
    const { title, description, tags, cover_image, category, content } =
      c.req.valid("form");

    const post = await insertPost(db, {
      title,
      description,
      tags,
      coverImage: cover_image,
      category,
      content,
      contentType: "markdown",
      authorId: user.id,
    });
    if (!post) return c.json({ error: "Failed to create post" }, 500);

    return c.redirect(`/posts/${post.id}`);
  },
);

// Edit post — owner only (POST used since HTML forms don't support PATCH)
postsRouter.post(
  "/:id/edit",
  zValidator(
    "form",
    z.object({
      title: z.string().min(1).max(255),
      description: z.string().max(512).optional().default(""),
      tags: z.string().max(255).optional().default(""),
      cover_image: z.string().max(2048).optional().default(""),
      category: z
        .enum(["Products", "Services", "News"])
        .optional()
        .default("Products"),
      content: z.string().min(1).max(100000),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const id = Number(c.req.param("id"));
    const { title, description, tags, cover_image, category, content } =
      c.req.valid("form");
    const db = drizzle(c.env.DB);

    const updated = await updatePost(db, id, user.id, {
      title,
      description,
      tags,
      coverImage: cover_image,
      category,
      content,
    });
    if (!updated) return c.json({ error: "Post not found or not yours" }, 404);

    return c.redirect(`/posts/${id}`);
  },
);

// Delete post — owner only
postsRouter.post("/:id/delete", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);
  const bucket = c.env.MEDIA_BUCKET;

  const deleted = await deletePostByOwner(db, id, user.id, bucket);
  if (!deleted) return c.json({ error: "Post not found or not yours" }, 404);

  return c.redirect("/posts");
});

export default postsRouter;
