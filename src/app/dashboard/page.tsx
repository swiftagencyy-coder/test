"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Send,
    CheckCircle,
    MessageSquare,
    Loader2
} from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";

interface Stats {
    totalLeads: number;
    messagesDrafted: number;
    repliesLogged: number;
    qualifiedLeads: number;
}

const DashboardPage = () => {
    const { activeWorkspace } = useWorkspace();
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!activeWorkspace) return;
            setIsLoading(true);
            try {
                const res = await fetch(`/api/stats?workspaceId=${activeWorkspace.id}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [activeWorkspace]);

    const statConfig = [
        {
            label: "Total Leads",
            value: stats?.totalLeads || 0,
            icon: Users,
            color: "text-blue-600",
        },
        {
            label: "Messages Drafted",
            value: stats?.messagesDrafted || 0,
            icon: MessageSquare,
            color: "text-emerald-600",
        },
        {
            label: "Replies Logged",
            value: stats?.repliesLogged || 0,
            icon: Send,
            color: "text-sky-600",
        },
        {
            label: "Qualified Leads",
            value: stats?.qualifiedLeads || 0,
            icon: CheckCircle,
            color: "text-rose-600",
        },
    ];

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statConfig.map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
