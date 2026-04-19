// ════════════════════════════════════════════════
// app/api/auth/register/route.ts
// POST — verify OTP + create user account
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/models/model";
import mongoose, { model, models, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

interface IOtpToken extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}
const OtpSchema = new Schema<IOtpToken>({
  email: String,
  otp: String,
  expiresAt: Date,
});
const OtpToken = models.OtpToken || model<IOtpToken>("OtpToken", OtpSchema);

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password, otp, avatarUrl } = await req.json();

  if (!name || !email || !password || !otp) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  // Check OTP
  const token = await OtpToken.findOne({ email });
  if (!token || token.otp !== otp || token.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 },
    );
  }

  // Check email not already registered
  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 },
    );

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    name,
    email,
    role: "customer",
    passwordHash,
    avatarUrl: avatarUrl ?? null,
    isActive: true,
  });

  // Delete OTP
  await OtpToken.deleteOne({ email });

  // Issue JWT session token
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
