"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Send, SkipForward, ExternalLink, Loader2, Copy } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { AIPersonalizer } from "@/components/ai-personalizer";

interface Lead {
    id: string;
    handle: string;
}

interface Task {
    id: string;
    leadId: string;
    type: string;
    draftMessage: string | null;
    lead: Lead;
}

const QueuePage = () => {
    const { activeWorkspace } = useWorkspace();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        if (!activeWorkspace) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/queue?workspaceId=${activeWorkspace.id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setTasks(data);
            }
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [activeWorkspace]);

    const updateDraft = (taskId: string, newDraft: string) => {
        setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, draftMessage: newDraft } : t));
    };

    const logOutcome = async (taskId: string, outcome: string) => {
        try {
            const res = await fetch("/api/queue/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, outcome }),
            });
            if (res.ok) {
                setTasks((prev) => prev.filter((t) => t.id !== taskId));
            } else {
                alert("Failed to log task");
            }
        } catch (err) {
            console.error("Log error", err);
        }
    };

    const generateTasks = async () => {
        if (!activeWorkspace) return;
        try {
            await fetch("/api/queue/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workspaceId: activeWorkspace.id }),
            });
            fetchTasks();
        } catch (err) {
            console.error("Generation error", err);
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
                        <h2 className="text-3xl font-bold tracking-tight">Daily Outreach Queue</h2>
                        <p className="text-muted-foreground">
                            Complete your daily assisted outreach tasks manually.
                        </p>
                    </div>
                    <Button onClick={generateTasks} variant="outline">
                        Generate Tasks
                    </Button>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                    {tasks.map((task) => (
                        <Card key={task.id} className="overflow-hidden border-l-4 border-l-sky-500">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Instagram className="h-4 w-4 text-pink-600" />
                                            <span className="font-bold text-lg text-sky-600 cursor-pointer hover:underline">
                                                {task.lead.handle}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {task.type}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <AIPersonalizer
                                            handle={task.lead.handle}
                                            onDraftGenerated={(draft) => updateDraft(task.id, draft)}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`https://instagram.com/${task.lead.handle.replace("@", "")}`, "_blank")}
                                        >
                                            <ExternalLink className="h-3 w-3 mr-2" />
                                            Open Profile
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-md mb-4 text-sm border italic relative group">
                                    "{task.draftMessage || "No draft message available."}"
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition"
                                        onClick={() => navigator.clipboard.writeText(task.draftMessage || "")}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => logOutcome(task.id, "SKIPPED")}
                                    >
                                        <SkipForward className="h-4 w-4 mr-2" />
                                        Skip
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => logOutcome(task.id, "SENT")}
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Log as Sent
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed">
                            <p className="text-muted-foreground">All caught up! No tasks for today.</p>
                            <Button onClick={generateTasks} className="mt-4" variant="link">
                                Try generating more tasks
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default QueuePage;
