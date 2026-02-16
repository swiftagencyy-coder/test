"use client";

import { UserButton } from "@/components/user-button";
import { MobileSidebar } from "@/components/mobile-sidebar";

export const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end">
                <UserButton />
            </div>
        </div>
    );
};
