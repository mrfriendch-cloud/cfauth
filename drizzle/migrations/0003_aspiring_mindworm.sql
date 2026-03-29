CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Changing existing column type" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE posts ADD `description` text(512) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE posts ADD `tags` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE posts ADD `content_type` text DEFAULT 'markdown' NOT NULL;--> statement-breakpoint
ALTER TABLE posts ADD `status` text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE posts ADD `cover_image` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE posts ADD `category` text DEFAULT 'Products' NOT NULL;--> statement-breakpoint
ALTER TABLE posts ADD `pinned` integer DEFAULT false NOT NULL;