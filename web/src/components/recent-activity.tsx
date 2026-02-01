"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  History,
  Clock,
  AlertTriangle,
  Bot,
  CheckCircle,
  Database,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchHistory } from "../services/api";

interface Scan {
  id: string;
  text: string;
  label: "Real" | "Fake";
  confidence: number;
  summary?: string;
  created_at: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function RecentActivity({ refreshTrigger, userId }: { refreshTrigger: number, userId: string }) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

    let isMounted = true;

    const loadHistory = async () => {
      try {
        console.log("Fetching history for user:", userId);
        const data = await fetchHistory(userId);
        console.log("Received data:", data);
        if (isMounted) {
          setScans(data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, userId]);

  const fakeCount = scans.filter(s => s.label === "Fake").length;
  const realCount = scans.filter(s => s.label === "Real").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full max-w-3xl mx-auto mt-8 shadow-xl border-slate-200/60 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4 pb-6 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-linear-to-br from-slate-700 to-slate-800 shadow-lg shadow-slate-700/30">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Analysis History</div>
                <div className="text-sm font-normal text-slate-500 mt-0.5">
                  Review past verification results
                </div>
              </div>
            </CardTitle>
          </motion.div>

          {scans.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Total Scans</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{scans.length}</div>
              </div>

              <div className="bg-linear-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200/60">
                <div className="flex items-center gap-2 text-red-700 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Misinformation</span>
                </div>
                <div className="text-2xl font-bold text-red-900">{fakeCount}</div>
              </div>

              <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/60">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Authentic</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{realCount}</div>
              </div>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {scans.length === 0 ? (
            <motion.div
              className="text-center py-16 px-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <History className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Analysis History</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Your verification history will appear here once you begin analyzing content.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {scans.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl border-2 transition-all ${scan.label === "Fake"
                    ? "bg-linear-to-br from-red-50 to-orange-50/30 border-red-200/60 hover:border-red-300"
                    : "bg-linear-to-br from-green-50 to-emerald-50/30 border-green-200/60 hover:border-green-300"
                    }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 flex-1 w-full">
                        <div className={`p-2 rounded-lg shrink-0 ${scan.label === "Fake"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                          }`}>
                          {scan.label === "Fake" ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                            {scan.text.replace("[URL] ", "").replace("[OCR] ", "")}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {new Date(scan.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={scan.label === "Fake" ? "destructive" : "outline"}
                        className={`${scan.label === "Real"
                          ? "text-green-700 border-green-300 bg-green-50 font-semibold"
                          : "font-semibold"
                          } px-3 py-1 shrink-0 self-start sm:self-auto`}
                      >
                        {scan.confidence.toFixed(1)}%
                      </Badge>
                    </div>

                    {scan.summary && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedId(expandedId === scan.id ? null : scan.id)}
                          className="w-full flex items-center justify-between p-3 bg-white/60 hover:bg-white/80 rounded-lg border border-slate-200 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                            <Bot className="w-4 h-4 text-blue-600" />
                            AI Analysis
                          </div>
                          {expandedId === scan.id ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </button>

                        {expandedId === scan.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 p-4 bg-white/80 rounded-lg border border-slate-200"
                          >
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {scan.summary}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}