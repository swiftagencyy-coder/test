"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { ImportLeadsModal } from "@/components/import-leads-modal";

interface Lead {
    id: string;
    handle: string;
    name: string | null;
    niche: string | null;
    stage: string;
}

const LeadsPage = () => {
    const { activeWorkspace } = useWorkspace();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeads = async () => {
        if (!activeWorkspace) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/leads?workspaceId=${activeWorkspace.id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads(data);
            }
        } catch (err) {
            console.error("Failed to fetch leads", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [activeWorkspace]);

    return (
        <MainLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Leads CRM</h2>
                        <p className="text-muted-foreground">
                            Manage and track your Instagram outreach prospects.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {activeWorkspace && (
                            <ImportLeadsModal
                                workspaceId={activeWorkspace.id}
                                onSuccess={fetchLeads}
                            />
                        )}
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lead
                        </Button>
                    </div>
                </div>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Handle</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Niche</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium text-sky-600">
                                        {lead.handle}
                                    </TableCell>
                                    <TableCell>{lead.name || "-"}</TableCell>
                                    <TableCell>{lead.niche || "-"}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            {lead.stage}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && leads.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No leads found. Start by importing a CSV!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </MainLayout>
    );
};

export default LeadsPage;
