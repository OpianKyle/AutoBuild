import {
  users,
  leads,
  investments,
  bookings,
  emailSequences,
  emailTemplates,
  emailSends,
  type User,
  type InsertUser,
  type Lead,
  type InsertLead,
  type Investment,
  type InsertInvestment,
  type Booking,
  type InsertBooking,
  type EmailSequence,
  type InsertEmailSequence,
  type EmailTemplate,
  type InsertEmailTemplate,
  type EmailSend,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(limit?: number, offset?: number): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | undefined>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead>;
  
  // Investment operations
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getInvestmentsByUserId(userId: string): Promise<Investment[]>;
  updateInvestment(id: string, updates: Partial<InsertInvestment>): Promise<Investment>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(limit?: number, offset?: number): Promise<Booking[]>;
  getBookingsByUserId(userId: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking>;
  
  // Email operations
  createEmailSequence(sequence: InsertEmailSequence): Promise<EmailSequence>;
  getEmailSequences(): Promise<EmailSequence[]>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  getEmailTemplatesBySequence(sequenceId: string): Promise<EmailTemplate[]>;
  createEmailSend(templateId: string, leadId?: string, userId?: string): Promise<EmailSend>;
  
  // Analytics operations
  getLeadStats(): Promise<any>;
  getInvestmentStats(): Promise<any>;
  getEmailStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeads(limit = 50, offset = 0): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  // Investment operations
  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  async getInvestmentsByUserId(userId: string): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.userId, userId))
      .orderBy(desc(investments.investmentDate));
  }

  async updateInvestment(id: string, updates: Partial<InsertInvestment>): Promise<Investment> {
    const [investment] = await db
      .update(investments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(investments.id, id))
      .returning();
    return investment;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBookings(limit = 50, offset = 0): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.scheduledAt))
      .limit(limit)
      .offset(offset);
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.scheduledAt));
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Email operations
  async createEmailSequence(sequence: InsertEmailSequence): Promise<EmailSequence> {
    const [newSequence] = await db.insert(emailSequences).values(sequence).returning();
    return newSequence;
  }

  async getEmailSequences(): Promise<EmailSequence[]> {
    return await db.select().from(emailSequences).orderBy(desc(emailSequences.createdAt));
  }

  async createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const [newTemplate] = await db.insert(emailTemplates).values(template).returning();
    return newTemplate;
  }

  async getEmailTemplatesBySequence(sequenceId: string): Promise<EmailTemplate[]> {
    return await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.sequenceId, sequenceId))
      .orderBy(emailTemplates.order);
  }

  async createEmailSend(templateId: string, leadId?: string, userId?: string): Promise<EmailSend> {
    const [emailSend] = await db
      .insert(emailSends)
      .values({
        templateId,
        leadId,
        userId,
      })
      .returning();
    return emailSend;
  }

  // Analytics operations
  async getLeadStats(): Promise<any> {
    const totalLeads = await db.select({ count: count() }).from(leads);
    const newLeads = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.status, "new"));
    const qualifiedLeads = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.status, "qualified"));
    const consultationLeads = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.status, "consultation"));
    const closedLeads = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.status, "closed"));

    return {
      total: totalLeads[0].count,
      new: newLeads[0].count,
      qualified: qualifiedLeads[0].count,
      consultation: consultationLeads[0].count,
      closed: closedLeads[0].count,
    };
  }

  async getInvestmentStats(): Promise<any> {
    const totalInvestments = await db
      .select({
        count: count(),
        totalAmount: sql<number>`COALESCE(SUM(${investments.amount}), 0)`,
        totalCurrentValue: sql<number>`COALESCE(SUM(${investments.currentValue}), 0)`,
      })
      .from(investments);

    const activeInvestors = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "investor"));

    return {
      totalInvestments: totalInvestments[0].count,
      totalAmount: totalInvestments[0].totalAmount,
      totalCurrentValue: totalInvestments[0].totalCurrentValue,
      activeInvestors: activeInvestors[0].count,
    };
  }

  async getEmailStats(): Promise<any> {
    const totalSent = await db.select({ count: count() }).from(emailSends);
    const totalOpened = await db
      .select({ count: count() })
      .from(emailSends)
      .where(sql`${emailSends.openedAt} IS NOT NULL`);
    const totalClicked = await db
      .select({ count: count() })
      .from(emailSends)
      .where(sql`${emailSends.clickedAt} IS NOT NULL`);

    const sent = totalSent[0].count;
    const opened = totalOpened[0].count;
    const clicked = totalClicked[0].count;

    return {
      totalSent: sent,
      totalOpened: opened,
      totalClicked: clicked,
      openRate: sent > 0 ? (opened / sent) * 100 : 0,
      clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
    };
  }
}

export const storage = new DatabaseStorage();
