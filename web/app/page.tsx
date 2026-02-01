"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { NewsAnalyzer } from "@/src/components/news-analyzer";
import { RecentActivity } from "@/src/components/recent-activity";
import { Header } from "@/src/components/header";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { userId, isLoaded, isSignedIn } = useAuth();

  const handleScanComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="flex flex-col items-center py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
            Truth in the Age of AI
          </h1>
          <p className="leading-7 mt-4 text-slate-600 max-w-2xl">
            Detect fake news, misinformation, and AI-generated articles instantly.
          </p>
        </div>

        {!isLoaded && <p>Loading...</p>}

        {isLoaded && !isSignedIn && (
          <div className="text-center mt-10 p-8 border rounded-lg bg-white shadow-sm max-w-md">
            <h3 className="text-xl font-bold mb-2">Join to Start Scanning</h3>
            <p className="text-slate-500 mb-4">You need an account to track your investigation history.</p>
            <div className="text-blue-600 font-semibold">Please Sign In above ↗</div>
          </div>
        )}

        {isLoaded && isSignedIn && userId && (
          <>
            <NewsAnalyzer onScanComplete={handleScanComplete} userId={userId} />
            <RecentActivity refreshTrigger={refreshTrigger} userId={userId} />
          </>
        )}
      </main>
    </div>
  );
}