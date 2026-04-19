// ════════════════════════════════════════════════
// app/api/auth/login/route.ts
// POST — verify credentials, issue session cookie
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/models/model";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );

  const user = await User.findOne({ email, isActive: true }).select(
    "+passwordHash",
  );
  if (!user || !user.passwordHash)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Log login activity
  await User.findByIdAndUpdate(user._id, {
    lastLogin: new Date(),
    $push: {
      activity: {
        $each: [{ type: "login", timestamp: new Date() }],
        $slice: -200,
      },
    },
  });

  const sessionToken = await new SignJWT({
    userId: user._id.toString(),
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

  const response = NextResponse.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
  response.cookies.set("bon_session", sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
