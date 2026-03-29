import { Hono } from "hono";

import posts from "./posts";
import auth from "./auth";
import admin from "./admin";
import mediaRouter from "./media";
import inquiriesRouter from "./inquiries";
import commentsRouter from "./comments";

const api = new Hono();
api.route("/posts", posts);
api.route("/auth", auth);
api.route("/admin", admin);
api.route("/media", mediaRouter);
api.route("/inquiries", inquiriesRouter);
api.route("/comments", commentsRouter);

export default api;
