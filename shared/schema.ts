import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const fixedExtensions = pgTable("fixed_extensions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  extension: text("extension").notNull().unique(),
  blocked: boolean("blocked").notNull().default(false),
  category: text("category").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customExtensions = pgTable("custom_extensions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  extension: text("extension").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFixedExtensionSchema = createInsertSchema(fixedExtensions).omit({
  id: true,
  updatedAt: true,
});

export const insertCustomExtensionSchema = createInsertSchema(customExtensions).omit({
  id: true,
  createdAt: true,
});

export const updateFixedExtensionSchema = z.object({
  extension: z.string(),
  blocked: z.boolean(),
});

export const bulkUpdateFixedExtensionsSchema = z.object({
  updates: z.array(updateFixedExtensionSchema),
});

export type FixedExtension = typeof fixedExtensions.$inferSelect;
export type CustomExtension = typeof customExtensions.$inferSelect;
export type InsertFixedExtension = z.infer<typeof insertFixedExtensionSchema>;
export type InsertCustomExtension = z.infer<typeof insertCustomExtensionSchema>;
export type UpdateFixedExtension = z.infer<typeof updateFixedExtensionSchema>;
export type BulkUpdateFixedExtensions = z.infer<typeof bulkUpdateFixedExtensionsSchema>;
