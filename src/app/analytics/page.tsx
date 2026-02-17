"use client";

import React from "react";
import MainLayout from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, TrendingUp, Users, Target, Zap } from "lucide-react";

const AnalyticsPage = () => {
    return (
        <MainLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
                        <p className="text-muted-foreground">
                            Deep dive into your outreach conversion data and KPIs.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Outeach Efficiency", value: "84%", icon: Zap, color: "text-amber-500" },
                        { label: "Target Accuracy", value: "92%", icon: Target, color: "text-rose-500" },
                        { label: "New Prospects", value: "128", icon: TrendingUp, color: "text-emerald-500" },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">+4% from last week</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart className="h-5 w-5 text-sky-600" />
                                Outreach Volume
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center bg-slate-50/50 rounded-md border-2 border-dashed">
                            <p className="text-sm text-muted-foreground italic">
                                Daily outreach activity chart will appear here as you log tasks.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-indigo-600" />
                                Lead Conversion Funnel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center bg-slate-50/50 rounded-md border-2 border-dashed">
                            <p className="text-sm text-muted-foreground italic">
                                Visual breakdown of your CRM stages from New to Won.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default AnalyticsPage;
