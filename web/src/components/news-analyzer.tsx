"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Link as LinkIcon, AlertTriangle, CheckCircle, Image as ImageIcon } from "lucide-react";
import { PredictionResult, predictNews, predictUrl } from "../services/api";

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
    <Card className="w-full max-w-xl mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {activeTab === "upload" ? <UploadCloud className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
          Fake News Detector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <Tabs defaultValue="upload" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Upload Image
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Paste URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <textarea
              className="w-full p-3 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the news headline here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <input
              type="url"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://cnn.com/article/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              We will automatically extract the headline and image from the article.
            </p>
          </TabsContent>
        </Tabs>

        <Button 
          className="w-full" 
          onClick={handlePredict} 
          disabled={loading || (activeTab === "upload" ? !file : !url)} 
        >
          {loading ? "Analyzing..." : "Check Veracity"}
        </Button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-4 ${
            result.label === "Fake" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center gap-4 mb-3">
              {result.label === "Fake" ? (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
              
              <div>
                <h3 className={`text-lg font-bold ${
                  result.label === "Fake" ? "text-red-700" : "text-green-700"
                }`}>
                  {result.label === "Fake" ? "Warning: Likely Misinformation" : "Likely Authentic"}
                </h3>
                {result.scraped_headline && (
                  <p className="text-xs text-slate-500 italic mt-1 line-clamp-2">
                    Analyzed: &quot;{result.scraped_headline}&quot;
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>Confidence Score</span>
                <span>{result.confidence}%</span>
              </div>
              <Progress 
                value={result.confidence} 
                className={`h-2 ${result.label === "Fake" ? "[&>div]:bg-red-600" : "[&>div]:bg-green-600"}`} 
              />
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}