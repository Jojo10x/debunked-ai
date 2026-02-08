import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X, FileText } from "lucide-react";


function ErrorModal({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="bg-red-50/50 p-6 flex items-start gap-4 border-b border-red-100">
              <div className="p-3 bg-red-100 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-slate-900">Scan Unsuccessful</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {message.toLowerCase().includes("scrape") 
                    ? "We couldn't access this website directly. It likely has strict security (like a paywall or bot blocker)."
                    : "Something went wrong while analyzing this content."}
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-white space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 flex gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <p>
                  <span className="font-semibold text-slate-900">Recommendation:</span>
                  <br />
                  Copy the text from the article manually and paste it into the 
                  <span className="font-semibold text-blue-600"> Text Analysis</span> tab.
                </p>
              </div>
              
              <Button onClick={onClose} className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200">
                I Understand, I&apos;ll Paste the Text
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ErrorModal;