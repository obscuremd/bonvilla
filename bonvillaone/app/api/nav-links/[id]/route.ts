// ══════════════════════════════════════════════════════
// app/api/nav-links/[id]/route.ts
// PATCH  /api/nav-links/[id]
// DELETE /api/nav-links/[id]
// ══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB, NavLink } from "@/models/model";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const link = await NavLink.findByIdAndUpdate(params.id, await req.json(), {
    new: true,
  });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(link);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  await NavLink.findByIdAndUpdate(params.id, { isActive: false });
  return NextResponse.json({ success: true });
}
