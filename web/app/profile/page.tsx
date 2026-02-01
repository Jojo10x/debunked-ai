"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BrainCircuit,
    Calendar,
    Database,
    Activity,
    User,
    Zap,
    CheckCircle2
} from "lucide-react";
import { ModelStats, fetchModelStats } from "@/src/services/api";
import { Header } from "@/src/components/header";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const [stats, setStats] = useState<ModelStats | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadStats = async () => {
            try {
                const data = await fetchModelStats();
                if (isMounted) {
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadStats();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Activity className="w-12 h-12 text-blue-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <Header />

            <main className="max-w-6xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                        System Diagnostics
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Real-time model performance and investigator profile overview
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-6 grid-cols-1 lg:grid-cols-3"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* User Profile Card */}
                    <motion.div variants={fadeInUp} className="lg:col-span-1">
                        <Card className="h-full shadow-xl border-slate-800/60 backdrop-blur-sm bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]"></div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

                            <CardHeader className="relative pt-8 pb-6">
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-40"></div>
                                        <Image
                                            src={user?.imageUrl || ""}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="relative w-24 h-24 rounded-full border-4 border-slate-700 shadow-xl"
                                        />
                                    </motion.div>
                                </div>
                                <CardTitle className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <span className="text-lg font-bold">Investigator Profile</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 relative">
                                <div className="text-center pb-4 border-b border-slate-700">
                                    <h2 className="font-bold text-xl mb-1">{user?.fullName}</h2>
                                    <p className="text-slate-400 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            Status
                                        </span>
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            ACTIVE
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            Member Since
                                        </span>
                                        <span className="text-sm font-bold">
                                            {new Date(user?.createdAt || "").toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* AI Model Diagnostics Card */}
                    <motion.div variants={fadeInUp} className="lg:col-span-2">
                        <Card className="h-full shadow-xl border-slate-800/60 backdrop-blur-sm bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                            <CardHeader className="relative">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
                                        <BrainCircuit className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold">AI Model Performance</div>
                                        <div className="text-sm font-normal text-slate-400 mt-0.5">
                                            Neural Network Telemetry
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6 relative">
                                {stats ? (
                                    <>
                                        {/* Main Accuracy Display */}
                                        <motion.div
                                            className="bg-linear-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex items-end justify-between mb-6">
                                                <div>
                                                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2 font-semibold">
                                                        Current Model Accuracy
                                                    </p>
                                                    <motion.div
                                                        className="text-6xl font-black bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        {stats.accuracy}%
                                                    </motion.div>
                                                </div>
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        rotate: [0, 5, -5, 0]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    <Activity className="w-12 h-12 text-green-400/30" />
                                                </motion.div>
                                            </div>

                                            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/50"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stats.accuracy}%` }}
                                                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                                ></motion.div>
                                            </div>
                                        </motion.div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <motion.div
                                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-blue-500/20">
                                                        <Database className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <span className="text-slate-400 text-sm font-semibold">Training Data</span>
                                                </div>
                                                <div className="text-3xl font-bold text-white">
                                                    {stats.total_samples.toLocaleString()}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">samples processed</p>
                                            </motion.div>

                                            <motion.div
                                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-purple-500/20">
                                                        <Calendar className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <span className="text-slate-400 text-sm font-semibold">Last Updated</span>
                                                </div>
                                                <div className="text-2xl font-bold text-white">
                                                    {stats.last_trained}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">model refresh</p>
                                            </motion.div>

                                            <motion.div
                                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-amber-500/20">
                                                        <Zap className="w-5 h-5 text-amber-400" />
                                                    </div>
                                                    <span className="text-slate-400 text-sm font-semibold">Architecture</span>
                                                </div>
                                                <div className="text-lg font-bold text-white font-mono">
                                                    {stats.model_version}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">neural network</p>
                                            </motion.div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-slate-400">Unable to load model statistics</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}