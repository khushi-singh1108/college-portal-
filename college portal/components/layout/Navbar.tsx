"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { getInitials } from "@/lib/utils";

interface NavbarProps {
    userName: string;
    userEmail: string;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "logout" }),
            });
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="rounded-lg p-2 hover:bg-accent"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? "☀️" : "🌙"}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium">{userName}</p>
                            <p className="text-xs text-muted-foreground">{userEmail}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white font-semibold">
                            {getInitials(userName)}
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
