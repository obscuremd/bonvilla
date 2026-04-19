"use client";

import { useState } from "react";
import { Loader2, Mail, Eye, EyeOff, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { uploadImages } from "@/lib/uploadImages";

/* ── shared types ── */
type AuthMode = "login" | "register" | "verify";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultMode?: "login" | "register";
  onSuccess?: (user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  }) => void;
}

/* ── small helper ── */
function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

/* ════════════════════════════════════
   MAIN AUTH DIALOG
════════════════════════════════════ */
export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "login",
  onSuccess,
}: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function reset() {
    setMode(defaultMode);
    setEmail("");
    setName("");
    setPassword("");
    setOtp("");
    setAvatarFile(null);
    setAvatarPreview(null);
    setError("");
    setInfo("");
  }

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  /* ── LOGIN flow ── */
  async function handleLogin() {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Login failed.");
        return;
      }
      onSuccess?.(d.user);
      onOpenChange(false);
      reset();
      // Redirect admins to CMS
      if (d.user.role === "admin" || d.user.role === "super_admin") {
        window.location.href = "/cms";
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  /* ── REGISTER flow: send OTP first ── */
  async function handleRegister() {
    if (!name.trim() || !email || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!avatarFile) {
      setError("A profile photo is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Failed to send OTP.");
        return;
      }
      setInfo(`A 6-digit code was sent to ${email}`);
      setMode("verify");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  /* ── VERIFY OTP and complete registration ── */
  async function handleVerify() {
    if (!otp || otp.length < 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (!avatarFile) {
      setError("Profile photo missing.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 1. Upload avatar
      setUploading(true);
      const uploadResult = await uploadImages([avatarFile]);
      setUploading(false);
      if (uploadResult.message === "error") {
        setError("Avatar upload failed.");
        return;
      }
      const avatarUrl = uploadResult.data[0];

      // 2. Verify OTP + create account
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp, avatarUrl }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Registration failed.");
        return;
      }
      onSuccess?.(d.user);
      onOpenChange(false);
      reset();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  const title =
    mode === "verify"
      ? "Verify your email"
      : mode === "register"
        ? "Create account"
        : "Welcome back";
  const description =
    mode === "verify"
      ? `Enter the 6-digit code sent to ${email}`
      : mode === "register"
        ? "A quick sign-up to unlock your cart and order history."
        : "Sign in to your Bonvilla account.";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="surface max-w-sm w-full p-0 overflow-hidden">
        {/* Brand header */}
        <div className="bg-[#5b1619] px-6 py-5">
          <p className="font-display text-2xl font-bold text-[#f4d6a4] tracking-wide">
            BONVILLA
          </p>
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-[rgba(244,214,164,0.5)] mt-0.5">
            Elevated Activewear
          </p>
        </div>

        <div className="px-6 pt-5 pb-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#5b1619]">
              {title}
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="font-body text-xs text-red-600">{error}</p>
            </div>
          )}
          {info && !error && (
            <div className="bg-[rgba(244,214,164,0.2)] border border-[rgba(244,214,164,0.5)] rounded-lg px-3 py-2">
              <p className="font-body text-xs text-[#5b1619]">{info}</p>
            </div>
          )}

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <div className="space-y-3">
              <div>
                <Label className="label-form">Email</Label>
                <Input
                  className="input-field mt-1"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="label-form">Password</Label>
                <div className="mt-1">
                  <PasswordInput value={password} onChange={setPassword} />
                </div>
              </div>
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="btn-primary w-full mt-1"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : (
                  <Mail size={14} className="mr-1" />
                )}
                {loading ? "Signing in…" : "Sign In"}
              </Button>
              <p className="font-body text-xs text-center text-muted-foreground">
                No account?{" "}
                <button
                  className="text-[#5b1619] font-semibold hover:underline"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER ── */}
          {mode === "register" && (
            <div className="space-y-3">
              {/* Avatar */}
              <div>
                <Label className="label-form">
                  Profile Photo <span className="text-[#5b1619]">*</span>
                </Label>
                <div className="mt-2 flex items-center gap-3">
                  {avatarPreview ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[rgba(244,214,164,0.5)]">
                      <img
                        src={avatarPreview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="absolute top-0 right-0 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[rgba(244,214,164,0.5)] flex items-center justify-center bg-[#faf8f5]">
                      <Upload size={16} className="text-muted-foreground" />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarPick}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      asChild
                    >
                      <span>
                        {avatarPreview ? "Change Photo" : "Upload Photo"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
              <div>
                <Label className="label-form">Full Name</Label>
                <Input
                  className="input-field mt-1"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label className="label-form">Email</Label>
                <Input
                  className="input-field mt-1"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="label-form">Password</Label>
                <div className="mt-1">
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : null}
                {loading ? "Sending code…" : "Continue →"}
              </Button>
              <p className="font-body text-xs text-center text-muted-foreground">
                Have an account?{" "}
                <button
                  className="text-[#5b1619] font-semibold hover:underline"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* ── OTP VERIFY ── */}
          {mode === "verify" && (
            <div className="space-y-3">
              <div>
                <Label className="label-form">6-digit Code</Label>
                <Input
                  className="input-field mt-1 text-center text-2xl tracking-[0.5em] font-display"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={loading || uploading}
                className="btn-primary w-full"
              >
                {loading || uploading ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : null}
                {uploading
                  ? "Uploading photo…"
                  : loading
                    ? "Creating account…"
                    : "Create Account"}
              </Button>
              <button
                className="font-body text-xs text-center w-full text-muted-foreground hover:text-[#5b1619]"
                onClick={() => {
                  setMode("register");
                  setOtp("");
                  setError("");
                  setInfo("");
                }}
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
