import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function handleRegister(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true }
  });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: UserRole.USER,
      dailyEmailOptIn: true
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function POST(req: Request) {
  try {
    return await handleRegister(req);
  } catch (error) {
    console.error("[REGISTER]", error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      // Retry once in case the database was resuming or the initial connection failed.
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        return await handleRegister(req);
      } catch (retryError) {
        console.error("[REGISTER][RETRY_FAILED]", retryError);
        return NextResponse.json(
          { error: "Database unavailable. Please try again in a moment." },
          { status: 503 }
        );
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to register" }, { status: 500 });
  }
}
