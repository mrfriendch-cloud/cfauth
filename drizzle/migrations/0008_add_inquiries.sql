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
