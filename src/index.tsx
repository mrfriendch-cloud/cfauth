import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { drizzle } from "drizzle-orm/d1";

import api from "./api";
import { Bindings, Variables } from "./bindings";
import { authMiddleware } from "./middleware";
import {
  getPosts,
  getPost,
  getPinnedPost,
  getAllTags,
  getTagsByCategory,
  getPublishedPosts,
  getPublishedPostsCount,
  getUserPosts,
  getUserPostsCount,
} from "./functions/posts";
import { getUsers } from "./functions/users";
import { getAllInquiries } from "./functions/inquiries";

import Home from "./pages/Home";
import { HomePostCards } from "./pages/Home";
import Services from "./pages/Services";
import { ServicePostCards } from "./pages/Services";
import News from "./pages/News";
import { NewsPostCards } from "./pages/News";
import Posts from "./pages/PostsList";
import { PostListCards } from "./pages/PostsList";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import WritePost from "./pages/WritePost";
import PostDetail from "./pages/PostDetail";
import Contact from "./pages/Contact";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", authMiddleware);

// Apply CSRF to all routes except /api/auth/* (password auth is inherently secure)
app.use("/*", (c, next) => {
  if (c.req.path.startsWith("/api/auth/")) {
    return next();
  }
  return csrf({
    origin: (origin, c) => {
      // Allow same-host requests and requests with no origin (native mobile browsers)
      if (!origin) return true;
      const host = c.req.header("host") ?? "";
      try {
        return new URL(origin).host === host;
      } catch {
        return false;
      }
    },
  })(c, next);
});

app.route("/api", api);

app.get("/", async (c) => {
  const user = c.get("user");
  const search = c.req.query("search") ?? "";
  const category = c.req.query("category") ?? "All";
  const tag = c.req.query("tag") ?? "";
  const author = c.req.query("author") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const [pinnedPost, publishedPosts, allTags, totalCount] = await Promise.all([
    getPinnedPost(db),
    getPublishedPosts(db, { search, category, tag, author, page }),
    getAllTags(db),
    getPublishedPostsCount(db, { search, category, tag, author }),
  ]);

  return c.html(
    <Home
      pinnedPost={pinnedPost}
      publishedPosts={publishedPosts}
      allTags={allTags}
      activeSearch={search}
      activeCategory={category}
      activeTag={tag}
      currentPage={page}
      totalCount={totalCount}
      isLoggedIn={!!user}
      isAdmin={user?.role === "admin"}
    />,
  );
});

// HTMX endpoint — search/filter posts for homepage
app.get("/api/home/posts", async (c) => {
  const search = c.req.query("search") ?? "";
  const category = c.req.query("category") ?? "All";
  const tag = c.req.query("tag") ?? "";
  const author = c.req.query("author") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const results = await getPublishedPosts(db, {
    search,
    category,
    tag,
    author,
    page,
  });
  return c.html(<HomePostCards posts={results} />);
});

app.get("/services", async (c) => {
  const user = c.get("user");
  const search = c.req.query("search") ?? "";
  const tag = c.req.query("tag") ?? "";
  const author = c.req.query("author") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const [posts, allTags, totalCount] = await Promise.all([
    getPublishedPosts(db, { search, category: "Services", tag, author, page }),
    getTagsByCategory(db, "Services"),
    getPublishedPostsCount(db, { search, category: "Services", tag, author }),
  ]);
  return c.html(
    <Services
      posts={posts}
      allTags={allTags}
      activeSearch={search}
      activeTag={tag}
      currentPage={page}
      totalCount={totalCount}
      isLoggedIn={!!user}
      isAdmin={user?.role === "admin"}
    />,
  );
});

app.get("/api/services/posts", async (c) => {
  const search = c.req.query("search") ?? "";
  const tag = c.req.query("tag") ?? "";
  const author = c.req.query("author") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const results = await getPublishedPosts(db, {
    search,
    category: "Services",
    tag,
    author,
    page,
  });
  return c.html(<ServicePostCards posts={results} />);
});

app.get("/news", async (c) => {
  const user = c.get("user");
  const search = c.req.query("search") ?? "";
  const tag = c.req.query("tag") ?? "";
  const author = c.req.query("author") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const [posts, allTags, totalCount] = await Promise.all([
    getPublishedPosts(db, { search, category: "News", tag, author, page }),
    getTagsByCategory(db, "News"),
    getPublishedPostsCount(db, { search, category: "News", tag, author }),
  ]);
  return c.html(
    <News
      posts={posts}
      allTags={allTags}
      activeSearch={search}
      activeTag={tag}
      currentPage={page}
      totalCount={totalCount}
      isLoggedIn={!!user}
      isAdmin={user?.role === "admin"}
    />,
  );
});

app.get("/api/news/posts", async (c) => {
  const search = c.req.query("search") ?? "";
  const tag = c.req.query("tag") ?? "";
  const author = c.req.query("author") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const results = await getPublishedPosts(db, {
    search,
    category: "News",
    tag,
    author,
    page,
  });
  return c.html(<NewsPostCards posts={results} />);
});

app.get("/posts", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.redirect("/");
  }

  const search = c.req.query("search") ?? "";
  const category = c.req.query("category") ?? "";
  const tag = c.req.query("tag") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const [userPosts, allTags, totalCount] = await Promise.all([
    getUserPosts(db, user.id, { search, category, tag, page }),
    getAllTags(db),
    getUserPostsCount(db, user.id, { search, category, tag }),
  ]);

  return c.html(
    <Posts
      posts={userPosts}
      allTags={allTags}
      activeSearch={search}
      activeCategory={category}
      activeTag={tag}
      currentPage={page}
      totalCount={totalCount}
      isAdmin={user.role === "admin"}
    />,
  );
});

// HTMX endpoint for posts list filtering
app.get("/api/posts/list", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const search = c.req.query("search") ?? "";
  const category = c.req.query("category") ?? "";
  const tag = c.req.query("tag") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  const db = drizzle(c.env.DB);
  const results = await getUserPosts(db, user.id, {
    search,
    category,
    tag,
    page,
  });
  return c.html(<PostListCards posts={results} />);
});

app.get("/login", async (c) => {
  const user = c.get("user");
  if (user) return c.redirect("/");
  const redirect = c.req.query("redirect");
  return c.html(<LogIn redirect={redirect} />);
});

app.get("/signup", async (c) => {
  const user = c.get("user");
  if (user) return c.redirect("/");
  return c.html(<SignUp />);
});

app.get("/admin", async (c) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.redirect("/");
  }

  const db = drizzle(c.env.DB);
  const [users, inquiries] = await Promise.all([
    getUsers(db),
    getAllInquiries(db),
  ]);

  return c.html(<Admin users={users} inquiries={inquiries} />);
});

app.get("/write", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.redirect("/");
  }

  const db = drizzle(c.env.DB);
  const existingTags = await getAllTags(db);

  return c.html(
    <WritePost isAdmin={user.role === "admin"} existingTags={existingTags} />,
  );
});

app.get("/posts/:id", async (c) => {
  const user = c.get("user");
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);
  const post = await getPost(db, id);

  if (!post) return c.notFound();

  // Drafts only visible to author or admin
  if (
    post.status === "draft" &&
    post.authorId !== user?.id &&
    user?.role !== "admin"
  ) {
    return c.redirect("/");
  }

  return c.html(
    <PostDetail
      post={post}
      isAdmin={user?.role === "admin"}
      userId={user?.id ?? ""}
    />,
  );
});

app.get("/contact", async (c) => {
  const user = c.get("user");
  return c.html(
    <Contact
      isLoggedIn={!!user}
      isAdmin={user?.role === "admin"}
      userEmail={user?.email ?? ""}
    />,
  );
});

export default app;
