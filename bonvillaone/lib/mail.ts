// lib/mail.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
    pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  },
});

export async function sendMail(to: string, subject: string, htmlBody: string) {
  await transporter.sendMail({
    from: `"Bonvilla" <${process.env.NEXT_PUBLIC_SMTP_USERNAME}>`,
    to,
    subject,
    html: wrapTemplate(htmlBody),
  });
}

/* ════════════════════════════════════════
   BRAND WRAPPER — all emails share this shell
════════════════════════════════════════ */
function wrapTemplate(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Bonvilla</title>
</head>
<body style="margin:0;padding:0;background:#f5f2ee;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation"
        style="max-width:520px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(244,214,164,0.4);">

        <!-- Header -->
        <tr><td style="background:#5b1619;padding:28px 32px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#f4d6a4;letter-spacing:3px;">BONVILLA</p>
          <p style="margin:4px 0 0;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:rgba(244,214,164,0.45);">Elevated Activewear</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px;">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#faf8f5;padding:20px 32px;border-top:1px solid rgba(244,214,164,0.35);">
          <p style="margin:0 0 6px;font-size:12px;color:rgba(66,83,98,0.5);line-height:1.6;">
            You are receiving this email from Bonvilla. If you have questions, reply to this email or visit <a href="https://bonvilla.com/contact" style="color:#5b1619;text-decoration:none;">bonvilla.com</a>.
          </p>
          <p style="margin:0;font-size:11px;color:rgba(66,83,98,0.35);">© 2025 Bonvilla. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ════════════════════════════════════════
   EMAIL TEMPLATES
════════════════════════════════════════ */

// ── OTP verification ──
export function otpEmail(name: string, otp: string): string {
  return `
    <p style="margin:0 0 6px;font-size:17px;font-weight:600;color:#425362;">Hi ${name},</p>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(66,83,98,0.7);line-height:1.7;">Here's your Bonvilla verification code. It expires in <strong>10 minutes</strong>.</p>

    <div style="background:#faf8f5;border:1px solid rgba(244,214,164,0.5);border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(66,83,98,0.4);">Verification Code</p>
      <p style="margin:0;font-family:Georgia,serif;font-size:44px;font-weight:700;color:#5b1619;letter-spacing:14px;">${otp}</p>
    </div>

    <p style="margin:0;font-size:12px;color:rgba(66,83,98,0.4);">Didn't request this? You can safely ignore this email.</p>
  `;
}

// ── Order confirmation (customer) ──
export function orderConfirmationCustomer(opts: {
  name: string;
  orderNumber: string;
  items: {
    name: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    country: string;
  };
}): string {
  const itemRows = opts.items
    .map(
      (i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(244,214,164,0.3);">
        <p style="margin:0;font-size:14px;font-weight:600;color:#425362;">${i.name}</p>
        <p style="margin:2px 0 0;font-size:12px;color:rgba(66,83,98,0.55);">${i.color} · ${i.size} · Qty ${i.quantity}</p>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(244,214,164,0.3);text-align:right;font-size:14px;font-weight:600;color:#5b1619;">
        $${(i.unitPrice * i.quantity).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <p style="margin:0 0 6px;font-size:17px;font-weight:600;color:#425362;">Hi ${opts.name},</p>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(66,83,98,0.7);line-height:1.7;">Thank you for your order! We've received it and will begin processing shortly.</p>

    <div style="background:#faf8f5;border:1px solid rgba(244,214,164,0.4);border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(66,83,98,0.4);">Order Number</p>
      <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:20px;font-weight:700;color:#5b1619;">${opts.orderNumber}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      ${itemRows}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:4px 0;font-size:13px;color:rgba(66,83,98,0.55);">Subtotal</td><td style="text-align:right;font-size:13px;color:rgba(66,83,98,0.55);">$${opts.subtotal.toFixed(2)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:rgba(66,83,98,0.55);">Shipping</td><td style="text-align:right;font-size:13px;color:rgba(66,83,98,0.55);">${opts.shipping === 0 ? "Free" : "$" + opts.shipping.toFixed(2)}</td></tr>
      <tr><td style="padding:8px 0 0;font-size:16px;font-weight:700;color:#5b1619;border-top:1px solid rgba(244,214,164,0.4);">Total</td><td style="padding:8px 0 0;text-align:right;font-size:16px;font-weight:700;color:#5b1619;border-top:1px solid rgba(244,214,164,0.4);">$${opts.total.toFixed(2)}</td></tr>
    </table>

    <div style="background:#faf8f5;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(66,83,98,0.4);">Delivering To</p>
      <p style="margin:0;font-size:14px;color:#425362;line-height:1.7;">
        ${opts.shippingAddress.fullName}<br/>
        ${opts.shippingAddress.line1}<br/>
        ${opts.shippingAddress.city}, ${opts.shippingAddress.country}
      </p>
    </div>

    <a href="https://bonvilla.com/orders" style="display:inline-block;background:#5b1619;color:#f4d6a4;text-decoration:none;padding:12px 28px;border-radius:99px;font-size:13px;font-weight:600;letter-spacing:1px;">Track Your Order →</a>
  `;
}

// ── Order confirmation (company internal) ──
export function orderConfirmationInternal(opts: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { name: string; quantity: number; size: string; color: string }[];
}): string {
  return `
    <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#425362;">New order received!</p>
    <div style="background:#faf8f5;border:1px solid rgba(244,214,164,0.4);border-radius:10px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;"><strong style="color:#5b1619;">${opts.orderNumber}</strong></p>
      <p style="margin:0 0 4px;font-size:13px;color:#425362;"><strong>Customer:</strong> ${opts.customerName} (${opts.customerEmail})</p>
      <p style="margin:0;font-size:13px;color:#5b1619;font-weight:700;">Total: $${opts.total.toFixed(2)}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${opts.items
        .map(
          (i) => `
        <tr><td style="padding:6px 0;border-bottom:1px solid rgba(244,214,164,0.25);font-size:13px;color:#425362;">
          ${i.name} — ${i.color} · ${i.size} × ${i.quantity}
        </td></tr>
      `,
        )
        .join("")}
    </table>
    <p style="margin:20px 0 0;"><a href="https://bonvilla.com/cms/orders" style="background:#5b1619;color:#f4d6a4;text-decoration:none;padding:10px 24px;border-radius:99px;font-size:13px;font-weight:600;">View in CMS →</a></p>
  `;
}

// ── Order status update ──
export function orderStatusEmail(opts: {
  name: string;
  orderNumber: string;
  status: string;
  message?: string;
}): string {
  const statusMessages: Record<
    string,
    { label: string; emoji: string; body: string }
  > = {
    confirmed: {
      label: "Order Confirmed",
      emoji: "✅",
      body: "Your order has been confirmed and is being prepared.",
    },
    shipped: {
      label: "Order Shipped",
      emoji: "📦",
      body: "Great news — your order is on its way!",
    },
    delivered: {
      label: "Order Delivered",
      emoji: "🎉",
      body: "Your order has been delivered. We hope you love it!",
    },
    cancelled: {
      label: "Order Cancelled",
      emoji: "❌",
      body: "Your order has been cancelled. If you have questions, please contact us.",
    },
    refunded: {
      label: "Refund Processed",
      emoji: "💳",
      body: "Your refund has been processed. It may take 3–5 business days to appear.",
    },
  };

  const info = statusMessages[opts.status] ?? {
    label: `Order ${opts.status}`,
    emoji: "📋",
    body: opts.message ?? "",
  };

  return `
    <p style="margin:0 0 6px;font-size:17px;font-weight:600;color:#425362;">Hi ${opts.name},</p>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(66,83,98,0.7);">We have an update on your order.</p>

    <div style="background:#faf8f5;border:1px solid rgba(244,214,164,0.4);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:32px;">${info.emoji}</p>
      <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#5b1619;">${info.label}</p>
      <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(66,83,98,0.4);">${opts.orderNumber}</p>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:rgba(66,83,98,0.7);line-height:1.7;">${info.body}${opts.message ? "<br/><br/>" + opts.message : ""}</p>

    <a href="https://bonvilla.com/orders" style="display:inline-block;background:#5b1619;color:#f4d6a4;text-decoration:none;padding:12px 28px;border-radius:99px;font-size:13px;font-weight:600;">View Order →</a>
  `;
}
