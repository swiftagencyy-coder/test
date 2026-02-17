"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Shield, User, Bell, ExternalLink, Loader2, Check } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";

const SettingsPage = () => {
    const { activeWorkspace } = useWorkspace();
    const [workspaceName, setWorkspaceName] = useState("");
    const [isUpdatingWorkspace, setIsUpdatingWorkspace] = useState(false);
    const [justUpdated, setJustUpdated] = useState<string | null>(null);

    useEffect(() => {
        if (activeWorkspace) {
            setWorkspaceName(activeWorkspace.name);
        }
    }, [activeWorkspace]);

    const handleUpdateWorkspace = async () => {
        if (!activeWorkspace || !workspaceName) return;
        setIsUpdatingWorkspace(true);
        try {
            const res = await fetch("/api/workspaces", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: activeWorkspace.id, name: workspaceName }),
            });
            if (res.ok) {
                setJustUpdated("workspace");
                setTimeout(() => setJustUpdated(null), 3000);
                // In a real app, you'd trigger a global refresh here too
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdatingWorkspace(false);
        }
    };

    const handleFakeSave = (id: string) => {
        setJustUpdated(id);
        setTimeout(() => setJustUpdated(null), 3000);
    };

    return (
        <MainLayout>
            <div className="p-8">
                <div className="mb-8 text-sky-600">
                    <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                    <p className="text-muted-foreground">
                        Configure your workspace, AI preferences, and account security.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 max-w-4xl">
                    <Card className="border-l-4 border-l-sky-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-sky-600" />
                                Workspace Configuration
                            </CardTitle>
                            <CardDescription>
                                Manage your outreach environment settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Workspace Name</Label>
                                    <Input
                                        placeholder="Main Workspace"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Outreach Speed</Label>
                                    <select className="w-full p-2 border rounded-md text-sm bg-white">
                                        <option>Conservative (5-10/day)</option>
                                        <option>Normal (15-25/day)</option>
                                        <option>Aggressive (40-50/day)</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-sky-600 hover:bg-sky-700"
                                onClick={handleUpdateWorkspace}
                                disabled={isUpdatingWorkspace}
                            >
                                {isUpdatingWorkspace ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : justUpdated === "workspace" ? (
                                    <Check className="h-4 w-4 mr-2" />
                                ) : null}
                                Update Workspace
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-emerald-600" />
                                API Integrations
                            </CardTitle>
                            <CardDescription>
                                Connect your third-party services.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black text-white p-2 rounded-md">AI</div>
                                    <div>
                                        <p className="text-sm font-bold">OpenAI Personalizer</p>
                                        <p className="text-xs text-muted-foreground">Connected using environment key</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFakeSave("ai")}
                                >
                                    {justUpdated === "ai" ? <Check className="h-4 w-4 mr-1" /> : null}
                                    Configure
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-pink-600 text-white p-2 rounded-md">IG</div>
                                    <div>
                                        <p className="text-sm font-bold">Instagram Connection</p>
                                        <p className="text-xs text-muted-foreground">Manual Human-in-the-Loop Mode</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                    Guidelines <ExternalLink className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-amber-500" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Select when you want to be notified about outreach activities.
                            </p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                                    <span className="text-sm group-hover:text-sky-600 transition">Email digest of new replies</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                                    <span className="text-sm group-hover:text-sky-600 transition">Reminder to complete daily queue</span>
                                </label>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFakeSave("notif")}
                            >
                                {justUpdated === "notif" ? <Check className="h-4 w-4 mr-1" /> : null}
                                Save Notifications
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default SettingsPage;
