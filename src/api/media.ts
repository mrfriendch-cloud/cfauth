import { Hono } from "hono";
import { Bindings, Variables } from "../bindings";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const KEY_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z]+$/;

const mediaRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// POST /upload
mediaRouter.post("/upload", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let formData: FormData;
  try {
    formData = await c.req.formData();
  } catch {
    return c.json(
      { error: "Unsupported file type. Allowed: jpeg, png, gif, webp" },
      400,
    );
  }

  const file = formData.get("file") as File | null;
  if (!file || typeof file.arrayBuffer !== "function") {
    return c.json(
      { error: "Unsupported file type. Allowed: jpeg, png, gif, webp" },
      400,
    );
  }

  const contentType = file.type;
  const ext = ALLOWED_MIME_TYPES[contentType];
  if (!ext) {
    return c.json(
      { error: "Unsupported file type. Allowed: jpeg, png, gif, webp" },
      400,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: "File too large. Maximum size is 5 MB" }, 413);
  }

  const key = `${crypto.randomUUID()}.${ext}`;

  try {
    await c.env.MEDIA_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType },
    });
  } catch {
    return c.json({ error: "Failed to store media. Please try again." }, 500);
  }

  const url = c.env.MEDIA_PUBLIC_DOMAIN
    ? `${c.env.MEDIA_PUBLIC_DOMAIN}/${key}`
    : `/api/media/${key}`;

  return c.json({ url });
});

// GET /:key
mediaRouter.get("/:key", async (c) => {
  const key = c.req.param("key");

  if (!KEY_PATTERN.test(key)) {
    return c.text("Not Found", 404);
  }

  const object = await c.env.MEDIA_BUCKET.get(key);
  if (!object) {
    return c.text("Not Found", 404);
  }

  const contentType =
    object.httpMetadata?.contentType ?? "application/octet-stream";

  return new Response(object.body, {
    headers: { "Content-Type": contentType },
  });
});

export default mediaRouter;
