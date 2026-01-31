"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock } from "lucide-react";

interface Scan {
  id: string;
  text: string;
  label: "Real" | "Fake";
  confidence: number;
  created_at: string;
}

export function RecentActivity({ refreshTrigger }: { refreshTrigger: number }) {
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history")
      .then((res) => res.json())
      .then((data) => setScans(data))
      .catch((err) => console.error("Failed to load history", err));
  }, [refreshTrigger]); 

  return (
    <Card className="w-full max-w-xl mx-auto mt-6 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-slate-500" />
          Recent Scans
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scans.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">No recent activity.</p>
        ) : (
          scans.map((scan) => (
            <div 
              key={scan.id} 
              className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm line-clamp-1 text-slate-800" title={scan.text}>
                  {scan.text.length > 50 ? scan.text.substring(0, 50) + "..." : scan.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {new Date(scan.created_at).toLocaleDateString()} • {new Date(scan.created_at).toLocaleTimeString()}
                </div>
              </div>
              
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                scan.label === "Fake" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-green-100 text-green-700"
              }`}>
                {scan.label} ({Math.round(scan.confidence)}%)
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}