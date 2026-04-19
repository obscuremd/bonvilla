// ════════════════════════════════════════════════
// app/api/auth/me/route.ts
// GET — return current user from session cookie
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/models/model";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("bon_session")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
    );
    await connectDB();
    const user = await User.findById(payload.userId).select(
      "-passwordHash -activity",
    );
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
