// ════════════════════════════════════════════════
// lib/session.ts — helper used in server components
// ════════════════════════════════════════════════
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB, User } from "@/models/model";

export async function getSession() {
  const token = (await cookies()).get("bon_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
    );
    await connectDB();
    const user = await User.findById(payload.userId)
      .select("-passwordHash -activity")
      .lean();
    return user ?? null;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const user = await getSession();
  if (!user) throw new Error("Unauthenticated");
  return user;
}

export async function requireAdmin() {
  const user = await requireSession();
  if (user.role !== "admin" && user.role !== "super_admin")
    throw new Error("Forbidden");
  return user;
}
