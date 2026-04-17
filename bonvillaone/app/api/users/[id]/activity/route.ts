// ══════════════════════════════════════════════
// app/api/users/[id]/activity/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/models/model";

// GET recent activity for a user
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const user = await User.findById(params.id)
    .select("activity name email")
    .lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

// POST — log a new activity event
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const event = await req.json();
  await User.findByIdAndUpdate(params.id, {
    $push: {
      activity: { $each: [{ ...event, timestamp: new Date() }], $slice: -200 },
    },
    ...(event.type === "login" && { lastLogin: new Date() }),
  });
  return NextResponse.json({ success: true });
}
