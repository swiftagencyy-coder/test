"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Copy, Trash2, Loader2 } from "lucide-react";
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

interface Template {
    id: string;
    name: string;
    content: string;
}

const TemplatesPage = () => {
    const { activeWorkspace } = useWorkspace();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: "", content: "" });

    const fetchTemplates = async () => {
        if (!activeWorkspace) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/templates?workspaceId=${activeWorkspace.id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setTemplates(data);
            }
        } catch (err) {
            console.error("Failed to fetch templates", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [activeWorkspace]);

    const handleCreate = async () => {
        if (!activeWorkspace) return;
        setIsCreating(true);
        try {
            const res = await fetch("/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newTemplate, workspaceId: activeWorkspace.id }),
            });
            if (res.ok) {
                setNewTemplate({ name: "", content: "" });
                fetchTemplates();
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
                        <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
                        <p className="text-muted-foreground">
                            Save and reuse your best performing outreach messages.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Save New Template
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Save New Template</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Template Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Casual Intro"
                                        value={newTemplate.name}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Hey {{first_name}}..."
                                        rows={6}
                                        value={newTemplate.content}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                    />
                                </div>
                                <Button onClick={handleCreate} disabled={isCreating} className="w-full">
                                    {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Save Template
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {templates.map((template) => (
                        <Card key={template.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                                    {template.name}
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => navigator.clipboard.writeText(template.content)}
                                    >
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-50 p-4 rounded-md text-sm border whitespace-pre-wrap">
                                    {template.content}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {templates.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No templates saved yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default TemplatesPage;
