"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BrainCircuit,
    Calendar,
    Database,
    Activity,
    User,
    ShieldCheck
} from "lucide-react";
import { ModelStats, fetchModelStats } from "@/src/services/api";
import { Header } from "@/src/components/header";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const [stats, setStats] = useState<ModelStats | null>(null);

    useEffect(() => {
        fetchModelStats()
            .then(setStats)
            .catch((err) => console.error(err));
    }, []);

    if (!isLoaded) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">System Status & Profile</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Investigator Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={user?.imageUrl || ""}
                                    alt="Profile"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full border-2 border-slate-200"
                                />
                                <div>
                                    <h2 className="font-semibold text-lg">{user?.fullName}</h2>
                                    <p className="text-slate-500 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Account Status</span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-400">
                                <BrainCircuit className="w-5 h-5" />
                                AI Model Diagnostics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {stats ? (
                                <>
                                    <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Current Accuracy</p>
                                            <div className="text-4xl font-bold text-green-400">
                                                {stats.accuracy}%
                                            </div>
                                        </div>
                                        <Activity className="w-8 h-8 text-slate-600" />
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 flex items-center gap-2">
                                                <Database className="w-4 h-4" /> Training Samples
                                            </span>
                                            <span className="font-mono">{stats.total_samples}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Last Updated
                                            </span>
                                            <span className="font-mono">{stats.last_trained}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" /> Architecture
                                            </span>
                                            <span className="font-mono text-xs">{stats.model_version}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-slate-400">Loading AI telemetry...</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}