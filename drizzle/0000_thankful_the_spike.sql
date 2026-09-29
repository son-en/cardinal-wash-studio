CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`vehicle_size` text NOT NULL,
	`vehicle_model` text NOT NULL,
	`service_type` text NOT NULL,
	`requested_datetime` integer NOT NULL,
	`payment_status` text DEFAULT 'UNPAID' NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`downpayment_amount` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `franchise_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_info` text NOT NULL,
	`preferred_city` text NOT NULL,
	`model_interest` text DEFAULT 'FULL_STUDIO' NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`before_image_url` text NOT NULL,
	`after_image_url` text NOT NULL,
	`category` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`email` text,
	`phone` text,
	`channel` text DEFAULT 'WEBSITE' NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`replied_at` integer
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`items` text NOT NULL,
	`total` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`stock_quantity` integer DEFAULT 0 NOT NULL,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tier` integer DEFAULT 1 NOT NULL,
	`price` integer NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'ADMIN' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);