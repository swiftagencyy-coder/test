"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Play, Pause, Edit, Loader2 } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Campaign {
    id: string;
    name: string;
    goal: string | null;
    status: string;
    _count: {
        leads: number;
    };
}

const CampaignsPage = () => {
    const { activeWorkspace } = useWorkspace();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: "",
        goal: "",
        messagingRules: "",
    });

    const fetchCampaigns = async () => {
        if (!activeWorkspace) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/campaigns?workspaceId=${activeWorkspace.id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setCampaigns(data);
            }
        } catch (err) {
            console.error("Failed to fetch campaigns", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [activeWorkspace]);

    const handleCreate = async () => {
        if (!activeWorkspace) return;
        setIsCreating(true);
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newCampaign,
                    workspaceId: activeWorkspace.id,
                    steps: [{ template: "Hi {{first_name}}!", delayDays: 0 }],
                }),
            });
            if (res.ok) {
                setNewCampaign({ name: "", goal: "", messagingRules: "" });
                fetchCampaigns();
            }
        } catch (err) {
            console.error("Create failed", err);
        } finally {
            setIsCreating(false);
        }
    };

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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
                        <p className="text-muted-foreground">
                            Create and manage your outreach messaging sequences.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Campaign</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Campaign Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Q1 Fitness Outreach"
                                        value={newCampaign.name}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="goal">Goal</Label>
                                    <Input
                                        id="goal"
                                        placeholder="e.g., Book meetings"
                                        value={newCampaign.goal}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, goal: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rules">Messaging Rules</Label>
                                    <Textarea
                                        id="rules"
                                        placeholder="e.g., Don't mention price in first DM"
                                        value={newCampaign.messagingRules}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, messagingRules: e.target.value }))}
                                    />
                                </div>
                                <Button onClick={handleCreate} disabled={isCreating} className="w-full">
                                    {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Create Campaign
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    {campaign.name}
                                </CardTitle>
                                <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${campaign.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {campaign.status || "ACTIVE"}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-4">
                                    Goal: {campaign.goal || "Not set"}
                                </div>
                                <div className="flex justify-between text-sm mb-4">
                                    <div>Leads: <strong>{campaign._count?.leads || 0}</strong></div>
                                    <div>Replies: <strong>0</strong></div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Edit className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Pause className="h-3 w-3 mr-1" /> Pause
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {campaigns.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No campaigns yet. Create your first one!</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default CampaignsPage;
