-- Performance indexes for posts table
-- Composite index: covers all public listing queries (status + category filter + date sort)
CREATE INDEX IF NOT EXISTS posts_status_category_idx ON posts (status, category);

-- Author index: speeds up getUserPosts and user-specific lookups
CREATE INDEX IF NOT EXISTS posts_author_idx ON posts (author_id);

-- Pinned index: speeds up getPinnedPost query on homepage
CREATE INDEX IF NOT EXISTS posts_pinned_idx ON posts (pinned);

-- created_at index: speeds up date-ordered listing queries
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at);

-- Sessions user_id index: speeds up session validation on every authenticated request
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
