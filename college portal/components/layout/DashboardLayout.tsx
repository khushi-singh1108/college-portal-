"use client";

import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import type { UserRole } from "@/lib/data";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: UserRole;
    userName: string;
    userEmail: string;
}

export default function DashboardLayout({
    children,
    role,
    userName,
    userEmail,
}: DashboardLayoutProps) {
    useEffect(() => {
        // Initialize theme from localStorage
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar role={role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar userName={userName} userEmail={userEmail} />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
