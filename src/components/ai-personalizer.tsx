"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AIPersonalizerProps {
    handle: string;
    onDraftGenerated: (draft: string) => void;
}

export const AIPersonalizer = ({ handle, onDraftGenerated }: AIPersonalizerProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        bio: "",
        recentPost: "",
        tone: "Friendly",
    });

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ai/personalize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, handle }),
            });
            const result = await res.json();
            if (result.draft) {
                onDraftGenerated(result.draft);
                setOpen(false);
            }
        } catch (error) {
            console.error("AI Personalization failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-sky-600 border-sky-200 bg-sky-50 hover:bg-sky-100">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Personalize
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Message Assistant for {handle}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Lead's Bio</Label>
                        <Textarea
                            placeholder="Paste bio here..."
                            value={data.bio}
                            onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Recent Post Content</Label>
                        <Textarea
                            placeholder="What was their last post about?"
                            value={data.recentPost}
                            onChange={(e) => setData(prev => ({ ...prev, recentPost: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tone</Label>
                        <select
                            className="w-full p-2 border rounded-md text-sm"
                            value={data.tone}
                            onChange={(e) => setData(prev => ({ ...prev, tone: e.target.value }))}
                        >
                            <option>Professional</option>
                            <option>Friendly</option>
                            <option>Playful</option>
                            <option>Direct</option>
                        </select>
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Generate Draft
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
