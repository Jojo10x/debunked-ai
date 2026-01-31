"use client";

import { NewsAnalyzer } from "@/src/components/news-analyzer";
import { RecentActivity } from "@/src/components/recent-activity";
import { useState } from "react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleScanComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-10 bg-slate-50 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
          Veritas AI
        </h1>
        <p className="leading-7 mt-4 text-slate-600">
          Upload a screenshot and headline to detect misinformation.
        </p>
      </div>

      <NewsAnalyzer onScanComplete={handleScanComplete} />

      <RecentActivity refreshTrigger={refreshTrigger} />
    </main>
  );
}