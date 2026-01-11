import {
  PaymentProvider,
  PrismaClient,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bookinsights.test" },
    update: {},
    create: {
      email: "admin@bookinsights.test",
      name: "Admin",
      role: UserRole.ADMIN,
      passwordHash: adminPassword
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "reader@bookinsights.test" },
    update: {},
    create: {
      email: "reader@bookinsights.test",
      name: "Reader One",
      role: UserRole.USER,
      passwordHash: userPassword
    }
  });

  await prisma.subscription.upsert({
    where: { id: "seed-daily" },
    update: {},
    create: {
      id: "seed-daily",
      userId: user.id,
      plan: SubscriptionPlan.DAILY_99,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      razorpayCustomerId: "cust_seed_daily",
      razorpaySubscriptionId: "sub_seed_daily",
      lastPaymentAt: new Date(),
      nextChargeAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28)
    }
  });

  await prisma.paymentEvent.createMany({
    data: [
      {
        id: "seed-payment-1",
        userId: user.id,
        subscriptionId: "seed-daily",
        provider: PaymentProvider.RAZORPAY,
        eventType: "subscription.activated",
        providerEventId: "evt_seed_1",
        payloadJson: { seed: true, reason: "Activated for demo" }
      },
      {
        id: "seed-payment-2",
        userId: user.id,
        subscriptionId: "seed-daily",
        provider: PaymentProvider.RAZORPAY,
        eventType: "payment.captured",
        providerEventId: "evt_seed_2",
        payloadJson: { amount: 9900, currency: "INR" }
      }
    ],
    skipDuplicates: true
  });

  await prisma.insight.createMany({
    data: [
      {
        id: "insight-atomic-habits",
        slug: "atomic-habits",
        title: "Atomic Habits",
        bookName: "Atomic Habits",
        author: "James Clear",
        dayNumber: 1,
        shortSummary: "Practical framework to build habits that stick using small, consistent improvements.",
        content:
          "# Atomic Habits\n\nTiny habits compound over time. Focus on systems, not goals. Identity-based habits create lasting change.",
        keyTakeaways: ["Focus on systems", "Use habit stacking", "Make it obvious, attractive, easy, satisfying"],
        audioUrl: "https://example.com/audio/atomic-habits.mp3",
        publishAt: new Date(),
        status: "PUBLISHED",
        createdById: admin.id
      },
      {
        id: "insight-deep-work",
        slug: "deep-work",
        title: "Deep Work",
        bookName: "Deep Work",
        author: "Cal Newport",
        dayNumber: 2,
        shortSummary: "Why intense focus is a superpower and how to cultivate it in a distracted world.",
        content:
          "# Deep Work\n\nSchedule focus blocks, embrace boredom, and prioritize craftsman mindset to produce high quality work.",
        keyTakeaways: ["Protect focus blocks", "Embrace boredom", "Measure output, not hours"],
        publishAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "PUBLISHED",
        createdById: admin.id
      },
      {
        id: "insight-show-your-work",
        slug: "show-your-work",
        title: "Show Your Work",
        bookName: "Show Your Work",
        author: "Austin Kleon",
        dayNumber: 3,
        shortSummary: "Sharing your process attracts opportunity and community.",
        content: "# Show Your Work\n\nShare in public, document the journey, and stay consistent.",
        keyTakeaways: ["Share daily", "Teach what you learn", "Build in public"],
        publishAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        status: "PUBLISHED",
        createdById: admin.id
      },
      {
        id: "insight-so-good",
        slug: "so-good-they-cant-ignore-you",
        title: "So Good They Can't Ignore You",
        bookName: "So Good They Can't Ignore You",
        author: "Cal Newport",
        dayNumber: 4,
        shortSummary: "Career capital beats passion; build rare and valuable skills.",
        content: "# Career Capital\n\nDeliberate practice compounds; control follows competence.",
        keyTakeaways: ["Deliberate practice", "Pursue autonomy", "Value control"],
        publishAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        status: "PUBLISHED",
        createdById: admin.id
      },
      {
        id: "insight-lean-startup",
        slug: "the-lean-startup",
        title: "The Lean Startup",
        bookName: "The Lean Startup",
        author: "Eric Ries",
        dayNumber: 5,
        shortSummary: "Build-measure-learn feedback loops reduce waste and speed learning.",
        content: "# Lean Startup\n\nValidated learning > vanity metrics; ship MVPs and iterate quickly.",
        keyTakeaways: ["Build-measure-learn", "MVP first", "Actionable metrics"],
        publishAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        status: "PUBLISHED",
        createdById: admin.id
      },
      {
        id: "insight-7-habits",
        slug: "the-7-habits",
        title: "The 7 Habits",
        bookName: "The 7 Habits of Highly Effective People",
        author: "Stephen Covey",
        dayNumber: 6,
        shortSummary: "Principle-centered habits for personal and interpersonal effectiveness.",
        content:
          "# 7 Habits\n\nBe proactive, begin with the end in mind, put first things first, think win-win, seek first to understand, synergize, sharpen the saw.",
        keyTakeaways: ["Proactivity", "Prioritize", "Think win-win"],
        publishAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        status: "PUBLISHED",
        createdById: admin.id
      },
      {
        id: "insight-draft",
        slug: "draft-leadership",
        title: "Leaders Eat Last",
        bookName: "Leaders Eat Last",
        author: "Simon Sinek",
        dayNumber: 7,
        shortSummary: "How leaders build trust and safety within teams.",
        content: "# Leadership\n\nTrust and empathy create resilient teams.",
        keyTakeaways: ["Build safety", "Serve your team", "Lead with empathy"],
        publishAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        status: "DRAFT",
        createdById: admin.id
      }
    ],
    skipDuplicates: true
  });

  await prisma.liveClass.createMany({
    data: [
      {
        id: "class-1",
        title: "How to read faster",
        description: "Premium live class on speed reading and note taking.",
        meetingLink: "https://meet.example.com/fast-reading",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        duration: 60,
        status: "SCHEDULED",
        recordingUrl: null,
        createdById: admin.id
      },
      {
        id: "class-2",
        title: "Building a daily reading habit",
        description: "Strategies to stay consistent with reading.",
        meetingLink: "https://meet.example.com/daily-reading",
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        duration: 50,
        status: "COMPLETED",
        recordingUrl: "https://example.com/recordings/reading-habit",
        createdById: admin.id
      }
    ],
    skipDuplicates: true
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
