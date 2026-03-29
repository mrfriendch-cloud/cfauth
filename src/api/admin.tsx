import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";

import { Bindings, Variables } from "../bindings";
import { adminMiddleware } from "../middleware";
import { getUsers, updateUserRole, banUser } from "../functions/users";
import { deleteInquiry } from "../functions/inquiries";
import {
  updatePostStatus,
  deletePost,
  updatePostPinned,
} from "../functions/posts";

const adminRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

adminRouter.use("*", adminMiddleware);

// List all users
adminRouter.get("/users", async (c) => {
  const db = drizzle(c.env.DB);
  const users = await getUsers(db);
  return c.json(users);
});

// Update a user's role (accepts form data from htmx)
adminRouter.patch(
  "/users/:id/role",
  zValidator("form", z.object({ role: z.enum(["user", "admin"]) })),
  async (c) => {
    const db = drizzle(c.env.DB);
    const { id } = c.req.param();
    const { role } = c.req.valid("form");

    const updated = await updateUserRole(db, id, role);
    if (!updated) {
      return c.json({ error: "User not found" }, 404);
    }

    // Return updated row HTML for htmx swap
    return c.html(
      <tr class="border-b border-gray-700 hover:bg-gray-700">
        <td class="py-3 pr-4">{updated.email}</td>
        <td class="py-3 pr-4 text-gray-400 text-sm font-mono">{updated.id}</td>
        <td class="py-3">
          <form
            hx-patch={`/api/admin/users/${updated.id}/role`}
            hx-target="closest tr"
            hx-swap="outerHTML"
            class="flex items-center gap-2"
          >
            <select
              name="role"
              class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="user" selected={updated.role === "user"}>
                user
              </option>
              <option value="admin" selected={updated.role === "admin"}>
                admin
              </option>
            </select>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
            >
              Save
            </button>
          </form>
        </td>
      </tr>,
    );
  },
);

// Ban/unban a user
adminRouter.patch(
  "/users/:id/ban",
  zValidator("form", z.object({ banned: z.enum(["true", "false"]) })),
  async (c) => {
    const db = drizzle(c.env.DB);
    const { id } = c.req.param();
    const { banned } = c.req.valid("form");
    const isBanned = banned === "true";

    const updated = await banUser(db, id, isBanned);
    if (!updated) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ success: true, banned: updated.banned });
  },
);

// Pin/unpin a post
adminRouter.post("/posts/:id/pin", async (c) => {
  const db = drizzle(c.env.DB);
  const id = Number(c.req.param("id"));
  const updated = await updatePostPinned(db, id, true);
  if (!updated) return c.json({ error: "Post not found" }, 404);
  return c.json({ success: true, message: "Post pinned to homepage" });
});

adminRouter.post("/posts/:id/unpin", async (c) => {
  const db = drizzle(c.env.DB);
  const id = Number(c.req.param("id"));
  const updated = await updatePostPinned(db, id, false);
  if (!updated) return c.json({ error: "Post not found" }, 404);
  return c.json({ success: true, message: "Post unpinned" });
});

// Publish a post
adminRouter.post("/posts/:id/publish", async (c) => {
  const db = drizzle(c.env.DB);
  const id = Number(c.req.param("id"));
  const updated = await updatePostStatus(db, id, "published");
  if (!updated) return c.json({ error: "Post not found" }, 404);
  return c.json({ success: true, message: "Post published" });
});

// Delete a post (DELETE for API, POST /delete for form)
adminRouter.delete("/posts/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const bucket = c.env.MEDIA_BUCKET;
  const id = Number(c.req.param("id"));
  const deleted = await deletePost(db, id, bucket);
  if (!deleted) return c.json({ error: "Post not found" }, 404);
  return c.json({ success: true, message: "Post deleted" });
});

adminRouter.post("/posts/:id/delete", async (c) => {
  const db = drizzle(c.env.DB);
  const bucket = c.env.MEDIA_BUCKET;
  const id = Number(c.req.param("id"));
  const deleted = await deletePost(db, id, bucket);
  if (!deleted) return c.json({ error: "Post not found" }, 404);
  return c.json({ success: true, message: "Post deleted" });
});

// Delete an inquiry
adminRouter.delete("/inquiries/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const { id } = c.req.param();
  const deleted = await deleteInquiry(db, id);
  if (!deleted) {
    return c.json({ error: "Inquiry not found" }, 404);
  }
  return c.json({ success: true });
});

export default adminRouter;
