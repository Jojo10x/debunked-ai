import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        Veritas AI
      </div>
      
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}