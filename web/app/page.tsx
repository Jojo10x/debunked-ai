"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { NewsAnalyzer } from "@/src/components/news-analyzer";
import { RecentActivity } from "@/src/components/recent-activity";
import { Header } from "@/src/components/header";
import { ShieldCheck, TrendingUp, Lock, ChevronRight } from "lucide-react";
import ErrorModal from "@/src/components/error";


export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userId, isLoaded, isSignedIn } = useAuth();

  const handleScanComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
    setErrorModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />

      <main className="relative">
        <motion.section
          className="relative py-8 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-3"
            >
              AI-Powered Media Verification
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 max-w-2xl mx-auto"
            >
              Advanced neural network system for detecting misinformation and media manipulation
            </motion.p>
          </div>
        </motion.section>

        <section className="px-4 md:px-6 pb-16">
          {!isLoaded && (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <TrendingUp className="w-12 h-12 text-blue-500" />
              </motion.div>
              <p className="text-slate-600 mt-4 font-medium">Initializing system...</p>
            </div>
          )}

          {isLoaded && !isSignedIn && (
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200/60 bg-white/80 backdrop-blur-sm shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-white to-purple-50/30 pointer-events-none"></div>

                <div className="relative p-10 text-center space-y-6">
                  <motion.div
                    className="inline-flex"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="p-5 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/40">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-slate-900">
                      Authentication Required
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                      Create an account to access the verification system and track your investigation history.
                    </p>
                  </div>

                  <div className="pt-4">
                    <motion.div
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 cursor-pointer group"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 50px -12px rgba(59, 130, 246, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Sign In to Continue</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure authentication powered by Clerk</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {isLoaded && isSignedIn && userId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <NewsAnalyzer
                onScanComplete={handleScanComplete}
                userId={userId}
                onError={handleError}
              />
              <RecentActivity refreshTrigger={refreshTrigger} userId={userId} />
            </motion.div>
          )}
        </section>

        <motion.footer
          className="py-12 px-6 border-t border-slate-200/60 bg-white/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-blue-600">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">Debunked AI</span>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              A research-grade platform leveraging advanced machine learning algorithms
              for media verification and misinformation detection.
            </p>
            <div className="text-xs text-slate-400">
              © {new Date().getFullYear()} Debunked AI. All rights reserved.
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}