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

// Memory storage implementation for development
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private leads: Map<string, Lead> = new Map();
  private investments: Map<string, Investment> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private emailSequences: Map<string, EmailSequence> = new Map();
  private emailTemplates: Map<string, EmailTemplate> = new Map();
  private emailSends: Map<string, EmailSend> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async initializeDefaultData() {
    // Create default admin user for testing
    // Password is hashed version of "admin123"
    const defaultAdmin: User = {
      id: "admin-001",
      username: "admin",
      email: "admin@example.com",
      password: "c4b3fe69f256b17e292b5c7acca98def1dea48dcf442adf850d9baf7855049f411a30653934db7ddd7be8ca810b6509e9ba28c1e85fe5eeb4ddcda18ae64083d.350e8dc766dfab89ee6ad31f2bed8869",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      role: "admin",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create default investor user for testing  
    const defaultInvestor: User = {
      id: "investor-001",
      username: "investor",
      email: "investor@example.com", 
      password: "c4b3fe69f256b17e292b5c7acca98def1dea48dcf442adf850d9baf7855049f411a30653934db7ddd7be8ca810b6509e9ba28c1e85fe5eeb4ddcda18ae64083d.350e8dc766dfab89ee6ad31f2bed8869",
      firstName: "John",
      lastName: "Investor",
      profileImageUrl: null,
      role: "investor",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(defaultAdmin.id, defaultAdmin);
    this.users.set(defaultInvestor.id, defaultInvestor);
    
    console.log("Initialized default users: admin/admin123, investor/admin123");
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      role: userData.role ?? "lead",
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      stripeCustomerId: userData.stripeCustomerId ?? null,
      stripeSubscriptionId: userData.stripeSubscriptionId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = {
      ...user,
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId ?? null,
      updatedAt: new Date(),
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Lead operations
  async createLead(leadData: InsertLead): Promise<Lead> {
    const lead: Lead = {
      id: this.generateId(),
      ...leadData,
      status: leadData.status ?? "new",
      score: leadData.score ?? 0,
      lastName: leadData.lastName ?? null,
      phone: leadData.phone ?? null,
      investmentBudget: leadData.investmentBudget ?? null,
      source: leadData.source ?? null,
      notes: leadData.notes ?? null,
      userId: leadData.userId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(lead.id, lead);
    return lead;
  }

  async getLeads(limit = 50, offset = 0): Promise<Lead[]> {
    const allLeads = Array.from(this.leads.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return allLeads.slice(offset, offset + limit);
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = {
      ...lead,
      ...updates,
      updatedAt: new Date(),
    };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  // Investment operations
  async createInvestment(investmentData: InsertInvestment): Promise<Investment> {
    const investment: Investment = {
      id: this.generateId(),
      ...investmentData,
      fundDescription: investmentData.fundDescription ?? null,
      currentValue: investmentData.currentValue ?? null,
      returnPercentage: investmentData.returnPercentage ?? null,
      status: investmentData.status ?? "active",
      investmentDate: investmentData.investmentDate ?? new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.investments.set(investment.id, investment);
    return investment;
  }

  async getInvestmentsByUserId(userId: string): Promise<Investment[]> {
    return Array.from(this.investments.values())
      .filter(inv => inv.userId === userId)
      .sort((a, b) => b.investmentDate!.getTime() - a.investmentDate!.getTime());
  }

  async updateInvestment(id: string, updates: Partial<InsertInvestment>): Promise<Investment> {
    const investment = this.investments.get(id);
    if (!investment) throw new Error("Investment not found");
    
    const updatedInvestment = {
      ...investment,
      ...updates,
      updatedAt: new Date(),
    };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      id: this.generateId(),
      ...bookingData,
      leadId: bookingData.leadId ?? null,
      userId: bookingData.userId ?? null,
      duration: bookingData.duration ?? 30,
      type: bookingData.type ?? "consultation",
      status: bookingData.status ?? "scheduled",
      meetingLink: bookingData.meetingLink ?? null,
      notes: bookingData.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async getBookings(limit = 50, offset = 0): Promise<Booking[]> {
    const allBookings = Array.from(this.bookings.values())
      .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
    return allBookings.slice(offset, offset + limit);
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId)
      .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) throw new Error("Booking not found");
    
    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date(),
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Email operations
  async createEmailSequence(sequenceData: InsertEmailSequence): Promise<EmailSequence> {
    const sequence: EmailSequence = {
      id: this.generateId(),
      ...sequenceData,
      description: sequenceData.description ?? null,
      isActive: sequenceData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emailSequences.set(sequence.id, sequence);
    return sequence;
  }

  async getEmailSequences(): Promise<EmailSequence[]> {
    return Array.from(this.emailSequences.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createEmailTemplate(templateData: InsertEmailTemplate): Promise<EmailTemplate> {
    const template: EmailTemplate = {
      id: this.generateId(),
      ...templateData,
      sequenceId: templateData.sequenceId ?? null,
      dayDelay: templateData.dayDelay ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emailTemplates.set(template.id, template);
    return template;
  }

  async getEmailTemplatesBySequence(sequenceId: string): Promise<EmailTemplate[]> {
    return Array.from(this.emailTemplates.values())
      .filter(template => template.sequenceId === sequenceId)
      .sort((a, b) => a.order - b.order);
  }

  async createEmailSend(templateId: string, leadId?: string, userId?: string): Promise<EmailSend> {
    const emailSend: EmailSend = {
      id: this.generateId(),
      templateId,
      leadId: leadId || null,
      userId: userId || null,
      sentAt: new Date(),
      openedAt: null,
      clickedAt: null,
      status: "sent",
    };
    this.emailSends.set(emailSend.id, emailSend);
    return emailSend;
  }

  // Analytics operations
  async getLeadStats(): Promise<any> {
    const allLeads = Array.from(this.leads.values());
    const stats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === "new").length,
      qualified: allLeads.filter(l => l.status === "qualified").length,
      consultation: allLeads.filter(l => l.status === "consultation").length,
      closed: allLeads.filter(l => l.status === "closed").length,
    };
    return stats;
  }

  async getInvestmentStats(): Promise<any> {
    const allInvestments = Array.from(this.investments.values());
    const allUsers = Array.from(this.users.values());
    
    const totalAmount = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalCurrentValue = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.currentValue || "0"), 0);
    const activeInvestors = allUsers.filter(u => u.role === "investor").length;

    return {
      totalInvestments: allInvestments.length,
      totalAmount,
      totalCurrentValue,
      activeInvestors,
    };
  }

  async getEmailStats(): Promise<any> {
    const allSends = Array.from(this.emailSends.values());
    const opened = allSends.filter(s => s.openedAt).length;
    const clicked = allSends.filter(s => s.clickedAt).length;

    return {
      totalSent: allSends.length,
      totalOpened: opened,
      totalClicked: clicked,
      openRate: allSends.length > 0 ? (opened / allSends.length) * 100 : 0,
      clickRate: allSends.length > 0 ? (clicked / allSends.length) * 100 : 0,
    };
  }
}

// Use memory storage for development, database storage for production
export const storage = process.env.NODE_ENV === "production" 
  ? new DatabaseStorage() 
  : new MemoryStorage();
