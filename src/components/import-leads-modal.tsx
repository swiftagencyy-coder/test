"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ImportLeadsModalProps {
    workspaceId: string;
    onSuccess: () => void;
}

export const ImportLeadsModal = ({ workspaceId, onSuccess }: ImportLeadsModalProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const res = await fetch("/api/leads/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            leads: results.data,
                            workspaceId,
                        }),
                    });

                    if (res.ok) {
                        onSuccess();
                        setOpen(false);
                    } else {
                        const err = await res.json();
                        alert(err.error || "Failed to import leads");
                    }
                } catch (error) {
                    console.error("Import failed", error);
                    alert("Network error tijdens importeren");
                } finally {
                    setIsUploading(false);
                }
            },
            error: (error) => {
                console.error("CSV Parse error", error);
                alert("Failed to parse CSV file");
                setIsUploading(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Import Leads from CSV</AlertDialogTitle>
                    <AlertDialogDescription>
                        Upload a CSV file with headers: handle, name, niche, city, bio.
                        Duplicates will be automatically skipped or updated.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <input
                        type="file"
                        accept=".csv"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-sky-50 file:text-sky-700
              hover:file:bg-sky-100 cursor-pointer"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUploading}>Cancel</AlertDialogCancel>
                    {isUploading && (
                        <div className="flex items-center text-sm text-muted-foreground mr-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Importing...
                        </div>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
