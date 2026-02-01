"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock, AlertTriangle, Bot, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchHistory } from "../services/api";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";

interface Scan {
  id: string;
  text: string;
  label: "Real" | "Fake";
  confidence: number;
  summary?: string;
  created_at: string;
}

export function RecentActivity({ refreshTrigger, userId }: { refreshTrigger: number, userId: string }) {
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchHistory(userId)
      .then((data) => setScans(data))
      .catch((err) => console.error(err));
  }, [refreshTrigger, userId]);

  return (
    <Card className="w-full max-w-xl mx-auto mt-8 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Scans
        </CardTitle>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <p className="text-center text-slate-500 py-4">No history yet.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {scans.map((scan) => (
              <AccordionItem key={scan.id} value={scan.id}>
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {scan.label === "Fake" ? (
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        ) : (
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                        
                        <span className="text-sm text-left truncate max-w-[200px] sm:max-w-[300px] font-medium text-slate-700">
                            {scan.text.replace("[URL] ", "").replace("[OCR] ", "")}
                        </span>
                    </div>

                    <Badge variant={scan.label === "Fake" ? "destructive" : "outline"} className={scan.label === "Real" ? "text-green-700 border-green-200 bg-green-50" : ""}>
                        {scan.confidence.toFixed(1)}%
                    </Badge>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="bg-slate-50/50 p-4 rounded-md border-t">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <Clock className="w-3 h-3" />
                        {new Date(scan.created_at).toLocaleString()}
                    </div>

                    {scan.summary ? (
                        <div className="text-sm text-slate-700 space-y-1">
                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                <Bot className="w-4 h-4 text-blue-500" />
                                AI Analysis
                            </div>
                            <p className="leading-relaxed pl-6">
                                {scan.summary}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic pl-6">
                            No AI summary available for this scan.
                        </p>
                    )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}