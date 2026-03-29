import { z } from "zod";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { zValidator } from "@hono/zod-validator";

import { Bindings, Variables } from "../bindings";
import { createInquiry } from "../functions/inquiries";

const inquiriesRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

inquiriesRouter.post(
  "/",
  zValidator(
    "form",
    z.object({
      fullName: z.string().min(1),
      email: z.string().min(1).email(),
      organization: z.string().optional(),
      subject: z.string().min(1),
      message: z.string().min(1),
    }),
  ),
  async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { fullName, email, organization, subject, message } =
        await c.req.valid("form");
      const db = drizzle(c.env.DB);

      const success = await createInquiry(db, {
        userId: user.id,
        fullName,
        email,
        organization: organization || "",
        subject,
        message,
      });

      if (!success) {
        return c.json({ error: "Failed to create inquiry" }, 500);
      }

      // Redirect to contact page with success message
      return c.redirect("/contact?success=true");
    } catch (error) {
      console.error("[INQUIRIES] Error:", error);
      return c.json({ error: "An error occurred" }, 500);
    }
  },
);

export default inquiriesRouter;
