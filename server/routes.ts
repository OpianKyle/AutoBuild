import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertLeadSchema, insertBookingSchema, insertInvestmentSchema } from "@shared/schema";
import Stripe from "stripe";

// Optional Stripe configuration - payment processing will be disabled if keys are not provided
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Lead routes
  app.post('/api/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      
      // Calculate lead score based on investment budget
      let score = 50; // base score
      if (leadData.investmentBudget === "500k+") score = 90;
      else if (leadData.investmentBudget === "100k-500k") score = 75;
      else if (leadData.investmentBudget === "50k-100k") score = 60;

      const lead = await storage.createLead({
        ...leadData,
        score,
      });

      res.json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ message: "Failed to create lead" });
    }
  });

  app.get('/api/leads', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const leads = await storage.getLeads(limit, offset);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.put('/api/leads/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const lead = await storage.updateLead(id, updates);
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(400).json({ message: "Failed to update lead" });
    }
  });

  // Investment routes
  app.post('/api/investments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const investmentData = insertInvestmentSchema.parse({
        ...req.body,
        userId,
      });
      
      const investment = await storage.createInvestment(investmentData);
      res.json(investment);
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(400).json({ message: "Failed to create investment" });
    }
  });

  app.get('/api/investments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const investments = await storage.getInvestmentsByUserId(userId);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  // Booking routes
  app.post('/api/bookings', async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: "Failed to create booking" });
    }
  });

  app.get('/api/bookings', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const bookings = await storage.getBookings(limit, offset);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Email routes
  app.get('/api/email-sequences', isAuthenticated, async (req, res) => {
    try {
      const sequences = await storage.getEmailSequences();
      res.json(sequences);
    } catch (error) {
      console.error("Error fetching email sequences:", error);
      res.status(500).json({ message: "Failed to fetch email sequences" });
    }
  });

  app.get('/api/email-templates/:sequenceId', isAuthenticated, async (req, res) => {
    try {
      const { sequenceId } = req.params;
      const templates = await storage.getEmailTemplatesBySequence(sequenceId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/leads', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getLeadStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      res.status(500).json({ message: "Failed to fetch lead stats" });
    }
  });

  app.get('/api/analytics/investments', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getInvestmentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching investment stats:", error);
      res.status(500).json({ message: "Failed to fetch investment stats" });
    }
  });

  app.get('/api/analytics/emails', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getEmailStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching email stats:", error);
      res.status(500).json({ message: "Failed to fetch email stats" });
    }
  });

  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is not configured. Please contact support." 
      });
    }
    
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "zar", // South African Rand
        metadata: {
          type: "investment",
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Sample data route for testing
  app.post('/api/admin/create-sample-data', isAuthenticated, async (req, res) => {
    try {
      // Create sample leads
      const sampleLeads = [
        {
          firstName: "Sarah",
          lastName: "Williams", 
          email: "sarah.williams@example.com",
          phone: "+27 82 123 4567",
          investmentBudget: "R500,000 - R1,000,000",
          status: "qualified" as const,
          score: 85,
          source: "Website"
        },
        {
          firstName: "Michael",
          lastName: "Roberts",
          email: "michael.roberts@example.com", 
          phone: "+27 83 234 5678",
          investmentBudget: "R1,000,000 - R5,000,000",
          status: "consultation" as const,
          score: 72,
          source: "Referral"
        },
        {
          firstName: "Lisa",
          lastName: "Chen",
          email: "lisa.chen@example.com",
          phone: "+27 84 345 6789", 
          investmentBudget: "R250,000 - R500,000",
          status: "new" as const,
          score: 68,
          source: "LinkedIn"
        },
        {
          firstName: "David",
          lastName: "Thompson",
          email: "david.thompson@example.com",
          phone: "+27 85 456 7890",
          investmentBudget: "R2,000,000+",
          status: "closed" as const,
          score: 95,
          source: "Website"
        }
      ];

      for (const leadData of sampleLeads) {
        await storage.createLead(leadData);
      }

      // Create sample bookings
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(14, 0, 0, 0);

      const sampleBookings = [
        {
          firstName: "Sarah",
          lastName: "Williams",
          email: "sarah.williams@example.com",
          phone: "+27 82 123 4567",
          meetingType: "investment_consultation",
          scheduledAt: tomorrow,
          duration: 60,
          status: "confirmed" as const
        },
        {
          firstName: "Michael", 
          lastName: "Roberts",
          email: "michael.roberts@example.com",
          phone: "+27 83 234 5678",
          meetingType: "portfolio_review",
          scheduledAt: nextWeek,
          duration: 45,
          status: "confirmed" as const
        }
      ];

      for (const bookingData of sampleBookings) {
        await storage.createBooking(bookingData);
      }

      // Create sample email sequence
      const emailSequence = await storage.createEmailSequence({
        name: "Welcome Series",
        description: "7-email sequence for new leads",
        isActive: true,
        triggerEvent: "lead_capture"
      });

      // Create sample email templates
      await storage.createEmailTemplate({
        sequenceId: emailSequence.id,
        subject: "Welcome to PE Capital - Your Investment Journey Starts Here",
        content: "Thank you for downloading our investment guide...",
        order: 1
      });

      await storage.createEmailTemplate({
        sequenceId: emailSequence.id,
        subject: "Private Equity 101: Understanding the Basics",
        content: "In this email, we'll cover the fundamentals of private equity...",
        order: 2
      });

      res.json({ message: "Sample data created successfully" });
    } catch (error) {
      console.error("Error creating sample data:", error);
      res.status(500).json({ message: "Failed to create sample data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
