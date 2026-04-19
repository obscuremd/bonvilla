/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  Truck,
  Shield,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthDialog } from "@/components/localComponents/AuthDialog";

/* ═══════════════════════════════════════════
   CART STORE  (localStorage + event bus)
   Export these so ProductCard / ProductPage
   can call addToCart() without prop-drilling.
═══════════════════════════════════════════ */
const CART_KEY = "bon_cart";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  color: string;
  colorHex: string;
  size: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("bon_cart_update"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex(
    (c) =>
      c.productId === item.productId &&
      c.color === item.color &&
      c.size === item.size,
  );
  if (idx > -1) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

/* ═══════════════════════════════════════════
   ADDRESS TYPE
═══════════════════════════════════════════ */
interface Address {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  postCode: string;
  country: string;
}
const EMPTY_ADDRESS: Address = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  postCode: "",
  country: "Nigeria",
};

/* ═══════════════════════════════════════════
   PAYSTACK INLINE JS  — no npm wrapper needed
   We load @paystack/inline-js dynamically so
   it only runs client-side.
═══════════════════════════════════════════ */
declare global {
  interface Window {
    PaystackPop?: new () => {
      newTransaction: (opts: Record<string, unknown>) => void;
    };
  }
}

function usePaystack() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Already loaded
    if (window.PaystackPop) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  function pay(opts: {
    email: string;
    amount: number; // in kobo
    onSuccess: (ref: { reference: string }) => void;
    onCancel: () => void;
  }) {
    if (!window.PaystackPop) {
      alert("Payment not ready. Please refresh.");
      return;
    }
    const popup = new window.PaystackPop();
    popup.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
      email: opts.email,
      amount: opts.amount,
      onSuccess: opts.onSuccess,
      onCancel: opts.onCancel,
      onError: (err: { message: string }) =>
        console.error("Paystack error:", err.message),
    });
  }

  return { ready, pay };
}

/* ═══════════════════════════════════════════
   MAIN CART PAGE
═══════════════════════════════════════════ */
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "address" | "pay">("cart");
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [addrError, setAddrError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState<string | null>(null);
  const { ready: paystackReady, pay: paystackPay } = usePaystack();

  // Load cart from localStorage
  useEffect(() => {
    setItems(getCart());
    const update = () => setItems(getCart());
    window.addEventListener("bon_cart_update", update);
    return () => window.removeEventListener("bon_cart_update", update);
  }, []);

  // Check session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => {});
  }, []);

  /* ── Cart maths ── */
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  function changeQty(idx: number, delta: number) {
    const next = [...items];
    next[idx].quantity = Math.max(1, next[idx].quantity + delta);
    setItems(next);
    saveCart(next);
  }
  function removeItem(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    saveCart(next);
  }

  /* ── Address validation ── */
  function validateAddress(): boolean {
    if (
      !address.fullName ||
      !address.line1 ||
      !address.city ||
      !address.postCode ||
      !address.country
    ) {
      setAddrError("Please fill in all required fields.");
      return false;
    }
    setAddrError("");
    return true;
  }

  /* ── Paystack checkout ── */
  function handlePay() {
    if (!user) return;
    paystackPay({
      email: user.email,
      amount: Math.round(total * 100), // kobo
      onSuccess: async (ref) => {
        setPlacing(true);
        try {
          const payload = {
            user: user._id,
            items: items.map((i) => ({
              product: i.productId,
              name: i.name,
              color: i.color,
              size: i.size,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
            subtotal,
            shipping,
            total,
            shippingAddress: address,
            paymentRef: ref.reference,
            status: "confirmed",
          };
          const r = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (r.ok) {
            const d = await r.json();
            setOrderDone(d.orderNumber);
            saveCart([]);
            setItems([]);
          } else {
            alert(
              "Order could not be saved. Contact support with payment reference: " +
                ref.reference,
            );
          }
        } catch {
          alert(
            "Network error. Contact support with payment reference: " +
              ref.reference,
          );
        } finally {
          setPlacing(false);
        }
      },
      onCancel: () => {},
    });
  }

  /* ── Empty / confirmed ── */
  if (orderDone)
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto text-2xl">
          🎉
        </div>
        <h1 className="font-display text-4xl font-bold text-[#5b1619]">
          Order Confirmed!
        </h1>
        <p className="font-body text-sm text-[rgba(66,83,98,0.65)] leading-relaxed">
          Your order <strong className="text-[#5b1619]">{orderDone}</strong> has
          been placed successfully. We&apos;ve sent a confirmation to your
          email.
        </p>
        <Link href="/shop">
          <button className="btn-primary">Continue Shopping</button>
        </Link>
      </div>
    );

  if (items.length === 0 && step === "cart")
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <ShoppingBag size={40} className="text-[rgba(91,22,25,0.2)] mx-auto" />
        <h1 className="font-display text-3xl font-bold text-[#5b1619]">
          Your bag is empty
        </h1>
        <p className="font-body text-sm text-[rgba(66,83,98,0.55)]">
          Add some gymwear to get started.
        </p>
        <Link href="/shop">
          <button className="btn-primary">Shop Now</button>
        </Link>
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="section-label">Shopping</span>
        <h1 className="font-display text-4xl font-bold text-[#5b1619]">
          {step === "cart"
            ? "Your Bag"
            : step === "address"
              ? "Delivery Details"
              : "Review & Pay"}
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 font-body text-xs">
        {(["cart", "address", "pay"] as const).map((s, i) => {
          const done = ["cart", "address", "pay"].indexOf(step) > i;
          const active = step === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${active || done ? "bg-[#5b1619] text-white" : "bg-[rgba(244,214,164,0.3)] text-[rgba(66,83,98,0.5)]"}`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`capitalize ${active ? "text-[#5b1619] font-semibold" : "text-[rgba(66,83,98,0.4)]"}`}
              >
                {s === "cart"
                  ? "Bag"
                  : s === "address"
                    ? "Delivery"
                    : "Payment"}
              </span>
              {i < 2 && (
                <ArrowRight size={12} className="text-[rgba(66,83,98,0.25)]" />
              )}
            </div>
          );
        })}
      </div>

      <div className="divider-gold" />

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* ── STEP: CART ── */}
        {step === "cart" && (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="surface rounded-2xl p-4 flex gap-4 items-start"
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#faf8f5] flex-shrink-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-body text-[10px] tracking-widest uppercase text-[rgba(66,83,98,0.4)]">
                          {item.category}
                        </p>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-body font-semibold text-sm text-[rgba(66,83,98,0.85)] hover:text-[#5b1619] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-[rgba(244,214,164,0.5)]"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="font-body text-xs text-[rgba(66,83,98,0.5)]">
                            {item.color} · {item.size}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-[rgba(66,83,98,0.35)] hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[rgba(244,214,164,0.4)] rounded-full overflow-hidden">
                        <button
                          onClick={() => changeQty(idx, -1)}
                          className="w-8 h-8 flex items-center justify-center text-[rgba(66,83,98,0.5)] hover:text-[#5b1619] transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center font-body text-sm font-medium text-[rgba(66,83,98,0.7)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => changeQty(idx, 1)}
                          className="w-8 h-8 flex items-center justify-center text-[rgba(66,83,98,0.5)] hover:text-[#5b1619] transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="font-display font-bold text-base text-[#5b1619]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── STEP: ADDRESS ── */}
        {step === "address" && (
          <div className="surface rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="label-form">Full Name *</Label>
                <Input
                  className="input-field mt-1"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, fullName: e.target.value }))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="label-form">Address Line 1 *</Label>
                <Input
                  className="input-field mt-1"
                  placeholder="Street, building"
                  value={address.line1}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, line1: e.target.value }))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="label-form">Address Line 2 (optional)</Label>
                <Input
                  className="input-field mt-1"
                  placeholder="Apartment, suite…"
                  value={address.line2}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, line2: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="label-form">City *</Label>
                <Input
                  className="input-field mt-1"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="label-form">Postcode *</Label>
                <Input
                  className="input-field mt-1"
                  value={address.postCode}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, postCode: e.target.value }))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="label-form">Country *</Label>
                <Input
                  className="input-field mt-1"
                  value={address.country}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, country: e.target.value }))
                  }
                />
              </div>
            </div>
            {addrError && (
              <p className="font-body text-xs text-destructive">{addrError}</p>
            )}
          </div>
        )}

        {/* ── STEP: REVIEW ── */}
        {step === "pay" && (
          <div className="space-y-4">
            <div className="surface rounded-2xl p-5 space-y-3">
              <p className="font-body text-sm font-semibold text-foreground">
                Delivery Address
              </p>
              <div className="font-body text-sm text-[rgba(66,83,98,0.65)] leading-relaxed">
                <p>{address.fullName}</p>
                <p>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p>
                  {address.city}, {address.postCode}
                </p>
                <p>{address.country}</p>
              </div>
              <button
                className="btn-ghost text-xs -ml-1"
                onClick={() => setStep("address")}
              >
                ← Edit address
              </button>
            </div>
            <div className="surface rounded-2xl p-5 space-y-3">
              <p className="font-body text-sm font-semibold text-foreground">
                Items
              </p>
              {items.map((i) => (
                <div
                  key={`${i.productId}-${i.color}-${i.size}`}
                  className="flex justify-between font-body text-sm text-[rgba(66,83,98,0.65)]"
                >
                  <span className="truncate mr-3">
                    {i.name} · {i.color} · {i.size} × {i.quantity}
                  </span>
                  <span className="flex-shrink-0">
                    ${(i.unitPrice * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDER SUMMARY SIDEBAR ── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="surface rounded-2xl p-5 space-y-4">
            <p className="font-body text-sm font-semibold text-foreground">
              Order Total
            </p>
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm text-[rgba(66,83,98,0.6)]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-[rgba(66,83,98,0.6)]">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="font-body text-[11px] text-[rgba(66,83,98,0.4)]">
                  Free shipping on orders over $50
                </p>
              )}
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-display text-xl font-bold text-[#5b1619]">
                Total
              </span>
              <span className="font-display text-xl font-bold text-[#5b1619]">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Truck size={12} className="text-[rgba(91,22,25,0.4)]" />
              <span className="font-body text-[11px] text-[rgba(66,83,98,0.45)]">
                Free delivery over $50
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-[rgba(91,22,25,0.4)]" />
              <span className="font-body text-[11px] text-[rgba(66,83,98,0.45)]">
                Secure checkout · Paystack
              </span>
            </div>
          </div>

          {/* ── Step CTA buttons ── */}
          {step === "cart" &&
            (!user ? (
              <div className="space-y-2">
                <button
                  onClick={() => setAuthOpen(true)}
                  className="btn-primary w-full"
                >
                  Sign In to Checkout
                </button>
                <p className="font-body text-[11px] text-center text-[rgba(66,83,98,0.45)]">
                  You need an account to place an order.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setStep("address")}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue to Delivery <ArrowRight size={14} />
              </button>
            ))}

          {step === "address" && (
            <button
              onClick={() => {
                if (validateAddress()) setStep("pay");
              }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Review Order <ArrowRight size={14} />
            </button>
          )}

          {step === "pay" &&
            user &&
            (placing ? (
              <div className="btn-primary w-full flex items-center justify-center gap-2 opacity-70 cursor-not-allowed">
                <Loader2 size={14} className="animate-spin" />
                Processing…
              </div>
            ) : (
              <button
                onClick={handlePay}
                disabled={!paystackReady}
                className="btn-primary w-full"
              >
                {paystackReady ? (
                  "Pay Now"
                ) : (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1" />
                    Loading Payment…
                  </>
                )}
              </button>
            ))}

          {step !== "cart" && (
            <button
              onClick={() => setStep(step === "pay" ? "address" : "cart")}
              className="btn-ghost w-full text-center text-xs"
            >
              ← {step === "pay" ? "Back to Delivery" : "Back to Bag"}
            </button>
          )}
        </div>
      </div>

      {/* Auth dialog for unauthenticated checkout */}
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultMode="login"
        onSuccess={(u) => {
          setUser(u);
          setAuthOpen(false);
        }}
      />
    </div>
  );
}
