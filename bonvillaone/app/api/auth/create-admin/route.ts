// ────────────────────────────────────────────
// app/api/auth/create-admin/route.ts
// POST — super_admin creates a new admin account directly
// ────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/models/model";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/session";
import { sendMail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  // Only super_admins can call this
  const caller = await requireAdmin();
  if (caller.role !== "super_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 },
    );

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    role: role ?? "admin",
    passwordHash,
    isActive: true,
  });

  // Notify admin of their account
  await sendMail(
    email,
    "Your Bonvilla Admin Account",
    `
    <p style="font-size:16px;font-weight:600;color:#425362;margin:0 0 16px;">Welcome to the team, ${name}!</p>
    <p style="font-size:14px;color:rgba(66,83,98,0.7);margin:0 0 16px;">Your admin account has been created. Sign in with your company email and the temporary password you were given.</p>
    <a href="https://bonvilla.com/cms" style="display:inline-block;background:#5b1619;color:#f4d6a4;text-decoration:none;padding:12px 28px;border-radius:99px;font-size:13px;font-weight:600;">Access CMS →</a>
    <p style="font-size:12px;color:rgba(66,83,98,0.4);margin:20px 0 0;">Please change your password after your first login.</p>
  `,
  );

  return NextResponse.json(
    { user: { _id: user._id, name, email, role: user.role } },
    { status: 201 },
  );
}
