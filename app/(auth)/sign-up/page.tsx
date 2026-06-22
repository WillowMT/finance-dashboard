"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import { IOSButton } from "@/components/ui/IOSButton";
import { IOSInput } from "@/components/ui/IOSInput";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#007AFF] rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#007AFF]/30">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1C1C1E]">Get Started</h1>
          <p className="text-[#8E8E93] mt-1">Create your account</p>
        </div>

        <form action={handleSubmit} className="space-y-3">
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <IOSInput
                name="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>
            <div className="h-px bg-[#F2F2F7] mx-4" />
            <div className="px-4 py-2">
              <IOSInput
                name="email"
                type="email"
                label="Email"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="h-px bg-[#F2F2F7] mx-4" />
            <div className="px-4 pb-4 pt-2">
              <IOSInput
                name="password"
                type="password"
                label="Password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl px-4 py-3">
              <p className="text-sm text-[#FF3B30]">{error}</p>
            </div>
          )}

          <IOSButton
            type="submit"
            fullWidth
            disabled={loading}
            size="lg"
          >
            {loading ? "Creating account…" : "Create Account"}
          </IOSButton>
        </form>

        <p className="text-center mt-6 text-sm text-[#8E8E93]">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#007AFF] font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
