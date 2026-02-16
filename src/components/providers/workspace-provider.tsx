"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Workspace {
    id: string;
    name: string;
    slug: string;
}

interface WorkspaceContextType {
    activeWorkspace: Workspace | null;
    isLoading: boolean;
    workspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const res = await fetch("/api/workspaces");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setWorkspaces(data);
                    setActiveWorkspace(data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch workspaces", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspaces();
    }, []);

    return (
        <WorkspaceContext.Provider value={{ activeWorkspace, workspaces, isLoading }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
};
