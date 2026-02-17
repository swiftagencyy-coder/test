"use client";

import React from "react";
import MainLayout from "@/components/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const InboxPage = () => {
    return (
        <MainLayout>
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                <div className="p-8 pb-4">
                    <h2 className="text-3xl font-bold tracking-tight">Unified Inbox</h2>
                    <p className="text-muted-foreground">
                        Manage your Instagram conversations and outreach replies.
                    </p>
                </div>

                <div className="flex-1 flex overflow-hidden border-t mx-8 mb-8 rounded-xl bg-white shadow-sm border">
                    {/* Inbox Sidebar */}
                    <div className="w-80 border-r flex flex-col bg-slate-50/50">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search conversations..."
                                    className="pl-9 bg-white"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                <Inbox className="h-12 w-12 mb-4" />
                                <p className="text-sm font-medium">No active conversations</p>
                                <p className="text-xs">Incoming replies will appear here.</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                        <div className="max-w-md">
                            <div className="bg-sky-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="h-10 w-10 text-sky-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
                            <p className="text-muted-foreground">
                                Click on a lead from the list to view your interaction history and respond.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default InboxPage;
