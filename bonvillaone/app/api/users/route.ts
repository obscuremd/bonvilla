// ══════════════════════════════════════════════
// app/api/users/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/models/model";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const role = searchParams.get("role");

  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-passwordHash -activity")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return NextResponse.json({ users, total });
}
