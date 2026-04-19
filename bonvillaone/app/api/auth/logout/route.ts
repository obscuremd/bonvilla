// ════════════════════════════════════════════════
// app/api/auth/logout/route.ts
// POST — clear session cookie
// ════════════════════════════════════════════════

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("bon_session", "", { maxAge: 0 });
  return res;
}
