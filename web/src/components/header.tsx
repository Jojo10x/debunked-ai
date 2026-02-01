"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:opacity-80 transition">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        Debunked AI
      </Link>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link
            href="/profile"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
          >
            System Status
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}