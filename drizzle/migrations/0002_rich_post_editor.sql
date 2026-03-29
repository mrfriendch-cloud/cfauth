-- D1/SQLite does not support modifying column constraints directly.
-- We recreate the posts table to remove the content length cap and add content_type.
PRAGMA foreign_keys=OFF;

CREATE TABLE `posts_new` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `author_id` text NOT NULL,
  `title` text(256) NOT NULL,
  `content` text NOT NULL,
  `content_type` text NOT NULL DEFAULT 'markdown',
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
);

INSERT INTO `posts_new` (`id`, `author_id`, `title`, `content`, `created_at`)
  SELECT `id`, `author_id`, `title`, `content`, `created_at` FROM `posts`;

DROP TABLE `posts`;
ALTER TABLE `posts_new` RENAME TO `posts`;

PRAGMA foreign_keys=ON;
