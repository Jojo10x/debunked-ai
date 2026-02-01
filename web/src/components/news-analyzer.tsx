"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Loader2
} from "lucide-react";
import { PredictionResult, predictNews, predictUrl } from "../services/api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

export function NewsAnalyzer({ onScanComplete, userId }: { onScanComplete?: () => void, userId: string }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [result, setResult] = useState<(PredictionResult & { scraped_headline?: string }) | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);

    try {
      let data;

      if (activeTab === "upload") {
        if (!file) return;
        data = await predictNews(text || "", file, userId);
      } else {
        if (!url) return;
        data = await predictUrl(url, userId);
      }

      setResult(data);
      if (onScanComplete) onScanComplete();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error analyzing news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-3xl mx-auto mt-10 shadow-2xl border-slate-200/60 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-6 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                {activeTab === "upload" ? (
                  <UploadCloud className="w-6 h-6 text-white" />
                ) : (
                  <LinkIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900">Misinformation Detection System</div>
                <div className="text-sm font-normal text-slate-500 mt-0.5">
                  AI-Powered Media Verification Analysis
                </div>
              </div>
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 px-4 sm:px-6">
          <Tabs defaultValue="url" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-slate-100/80 rounded-xl h-auto">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium">Image Upload</span>
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 transition-all"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="font-medium">URL Analysis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-5 mt-0">
              <motion.div
                key="upload-tab"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Article Headline
                  </label>
                  <textarea
                    className="w-full p-4 border border-slate-200 rounded-xl min-h-30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none bg-slate-50/50 hover:bg-slate-50 font-mono text-sm"
                    placeholder="Paste the news headline or article text here for analysis..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Supporting Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors cursor-pointer border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 hover:border-blue-300 transition-colors"
                    />
                    {file && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 text-xs text-slate-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100"
                      >
                        Selected: <span className="font-semibold">{file.name}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="url" className="space-y-5 mt-0">
              <motion.div
                key="url-tab"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Article URL
                  </label>
                  <input
                    type="url"
                    className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 font-mono text-sm"
                    placeholder="https://example.com/news-article..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <Sparkles className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                  <p>Our system will automatically extract the headline and featured image from the provided URL for comprehensive analysis.</p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              className="w-full py-6 text-base font-semibold bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              onClick={handlePredict}
              disabled={loading || (activeTab === "upload" ? !file : !url)}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Content...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Initiate Verification Analysis
                </span>
              )}
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`mt-8 rounded-2xl border-2 overflow-hidden shadow-xl ${result.label === "Fake"
                    ? "bg-linear-to-br from-red-50 via-red-50/50 to-orange-50/30 border-red-200/60"
                    : "bg-linear-to-br from-green-50 via-green-50/50 to-emerald-50/30 border-green-200/60"
                  }`}
              >
                <div className="p-6">
                  <motion.div
                    className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className={`p-3 rounded-xl shadow-lg shrink-0 ${result.label === "Fake"
                        ? "bg-linear-to-br from-red-500 to-red-600 shadow-red-500/30"
                        : "bg-linear-to-br from-green-500 to-green-600 shadow-green-500/30"
                      }`}>
                      {result.label === "Fake" ? (
                        <AlertTriangle className="w-7 h-7 text-white" />
                      ) : (
                        <CheckCircle className="w-7 h-7 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <motion.h3
                        className={`text-lg sm:text-xl font-bold mb-1 ${result.label === "Fake" ? "text-red-900" : "text-green-900"
                          }`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {result.label === "Fake"
                          ? "⚠️ Potential Misinformation Detected"
                          : "✓ Content Appears Authentic"}
                      </motion.h3>
                      {result.scraped_headline && (
                        <motion.p
                          className="text-sm text-slate-600 italic leading-relaxed bg-white/60 px-3 py-2 rounded-lg mt-2 border border-slate-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className="font-semibold text-slate-700">Analyzed content:</span> &quot;{result.scraped_headline}&quot;
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {result.summary && (
                    <motion.div
                      className="mb-5 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        AI-Generated Assessment
                      </h4>
                      <p className="leading-relaxed text-slate-700 text-sm">
                        {result.summary}
                      </p>
                    </motion.div>
                  )}

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                      <span>Confidence Level</span>
                      <span className={`text-base ${result.label === "Fake" ? "text-red-700" : "text-green-700"
                        }`}>
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={result.confidence}
                        className={`h-3 bg-slate-200/60 rounded-full overflow-hidden ${result.label === "Fake"
                            ? "[&>div]:bg-linear-to-r [&>div]:from-red-500 [&>div]:to-red-600"
                            : "[&>div]:bg-linear-to-r [&>div]:from-green-500 [&>div]:to-green-600"
                          }`}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          background: result.label === "Fake"
                            ? "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3), transparent)"
                            : "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)",
                          width: `${result.confidence}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Low Confidence</span>
                      <span>High Confidence</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}