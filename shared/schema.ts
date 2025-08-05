import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("lead"), // lead, investor, admin
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  investmentBudget: varchar("investment_budget"),
  leadSource: varchar("lead_source").default("website"),
  status: varchar("status").notNull().default("new"), // new, qualified, consultation, closed, lost
  score: integer("score").default(0),
  notes: text("notes"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Investments table
export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fundName: varchar("fund_name").notNull(),
  fundDescription: text("fund_description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }),
  returnPercentage: decimal("return_percentage", { precision: 5, scale: 2 }),
  status: varchar("status").notNull().default("active"), // active, closed, pending
  investmentDate: timestamp("investment_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email sequences table
export const emailSequences = pgTable("email_sequences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  triggerEvent: varchar("trigger_event").notNull(), // lead_capture, consultation_booked, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email templates table
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sequenceId: varchar("sequence_id").references(() => emailSequences.id),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  dayDelay: integer("day_delay").default(0),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email sends table
export const emailSends = pgTable("email_sends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => emailTemplates.id),
  leadId: varchar("lead_id").references(() => leads.id),
  userId: varchar("user_id").references(() => users.id),
  sentAt: timestamp("sent_at").defaultNow(),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  status: varchar("status").notNull().default("sent"), // sent, delivered, opened, clicked, failed
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  userId: varchar("user_id").references(() => users.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(30), // minutes
  type: varchar("type").notNull().default("consultation"), // consultation, portfolio_review
  status: varchar("status").notNull().default("scheduled"), // scheduled, completed, cancelled, no_show
  meetingLink: varchar("meeting_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  investments: many(investments),
  bookings: many(bookings),
  emailSends: many(emailSends),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  user: one(users, { fields: [leads.userId], references: [users.id] }),
  bookings: many(bookings),
  emailSends: many(emailSends),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, { fields: [investments.userId], references: [users.id] }),
}));

export const emailSequencesRelations = relations(emailSequences, ({ many }) => ({
  templates: many(emailTemplates),
}));

export const emailTemplatesRelations = relations(emailTemplates, ({ one, many }) => ({
  sequence: one(emailSequences, { fields: [emailTemplates.sequenceId], references: [emailSequences.id] }),
  sends: many(emailSends),
}));

export const emailSendsRelations = relations(emailSends, ({ one }) => ({
  template: one(emailTemplates, { fields: [emailSends.templateId], references: [emailTemplates.id] }),
  lead: one(leads, { fields: [emailSends.leadId], references: [leads.id] }),
  user: one(users, { fields: [emailSends.userId], references: [users.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  lead: one(leads, { fields: [bookings.leadId], references: [leads.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailSequenceSchema = createInsertSchema(emailSequences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertEmailSequence = z.infer<typeof insertEmailSequenceSchema>;
export type EmailSequence = typeof emailSequences.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type EmailSend = typeof emailSends.$inferSelect;
