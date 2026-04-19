// ════════════════════════════════════════════════
// app/api/auth/send-otp/route.ts
// POST — generate OTP, store in DB, send email
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/models/model";
import mongoose, { Schema, Document, model, models } from "mongoose";
import { sendMail } from "@/lib/mail";

// OTP token model — temporary, expires in 10 min
interface IOtpToken extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}
const OtpSchema = new Schema<IOtpToken>({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 }, // TTL index
});
const OtpToken = models.OtpToken || model<IOtpToken>("OtpToken", OtpSchema);

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, name } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Upsert OTP (one per email at a time)
  await OtpToken.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true },
  );

  await sendMail(
    email,
    "Your Bonvilla verification code",
    buildOtpEmail(name ?? email, otp),
  );

  return NextResponse.json({ success: true });
}

function buildOtpEmail(name: string, otp: string): string {
  return `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(244,214,164,0.4);">
      <div style="background:#5b1619;padding:28px 32px;">
        <p style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#f4d6a4;margin:0;letter-spacing:2px;">BONVILLA</p>
        <p style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:rgba(244,214,164,0.5);margin:4px 0 0;">Elevated Activewear</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:16px;color:#425362;margin:0 0 8px;">Hi ${name},</p>
        <p style="font-size:14px;color:rgba(66,83,98,0.7);line-height:1.6;margin:0 0 24px;">Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#faf8f5;border:1px solid rgba(244,214,164,0.5);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <p style="font-family:Georgia,serif;font-size:40px;font-weight:700;color:#5b1619;letter-spacing:12px;margin:0;">${otp}</p>
        </div>
        <p style="font-size:12px;color:rgba(66,83,98,0.45);margin:0;">If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div style="background:#faf8f5;padding:16px 32px;border-top:1px solid rgba(244,214,164,0.3);">
        <p style="font-size:11px;color:rgba(66,83,98,0.4);margin:0;">© 2025 Bonvilla. All rights reserved.</p>
      </div>
    </div>
  `;
}
