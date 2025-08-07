import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  json,
  mysqlTable,
  timestamp,
  varchar,
  text,
  int,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 1000 }),
  role: varchar("role", { length: 50 }).notNull().default("lead"), // lead, investor, admin
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads table
export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  age: varchar("age", { length: 10 }).notNull(),
  investmentBudget: varchar("investment_budget", { length: 100 }),
  moneyReadyAvailable: varchar("money_ready_available", { length: 100 }).notNull(),
  source: varchar("source", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("new"), // new, qualified, consultation, closed, lost
  score: int("score").default(0),
  notes: text("notes"),
  userId: varchar("user_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Investments table
export const investments = mysqlTable("investments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  fundName: varchar("fund_name", { length: 255 }).notNull(),
  fundDescription: text("fund_description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }),
  returnPercentage: decimal("return_percentage", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, closed, pending
  investmentDate: timestamp("investment_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email sequences table
export const emailSequences = mysqlTable("email_sequences", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  triggerEvent: varchar("trigger_event", { length: 100 }).notNull(), // lead_capture, consultation_booked, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email templates table
export const emailTemplates = mysqlTable("email_templates", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sequenceId: varchar("sequence_id", { length: 36 }),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  content: text("content").notNull(),
  dayDelay: int("day_delay").default(0),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email sends table
export const emailSends = mysqlTable("email_sends", {
  id: varchar("id", { length: 36 }).primaryKey(),
  templateId: varchar("template_id", { length: 36 }).notNull(),
  leadId: varchar("lead_id", { length: 36 }),
  userId: varchar("user_id", { length: 36 }),
  sentAt: timestamp("sent_at").defaultNow(),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  status: varchar("status", { length: 50 }).notNull().default("sent"), // sent, delivered, opened, clicked, failed
});

// Bookings table
export const bookings = mysqlTable("bookings", {
  id: varchar("id", { length: 36 }).primaryKey(),
  leadId: varchar("lead_id", { length: 36 }),
  userId: varchar("user_id", { length: 36 }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: int("duration").default(30), // minutes
  type: varchar("type", { length: 50 }).notNull().default("consultation"), // consultation, portfolio_review
  status: varchar("status", { length: 50 }).notNull().default("scheduled"), // scheduled, completed, cancelled, no_show
  meetingLink: varchar("meeting_link", { length: 1000 }),
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

// Analytics types
export type LeadStats = {
  total: number;
  new: number;
  qualified: number;
  consultation: number;
  closed: number;
};

export type InvestmentStats = {
  totalInvestments: number;
  totalAmount: number;
  totalCurrentValue: number;
  activeInvestors: number;
};

export type EmailStats = {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: number;
  clickRate: number;
};
