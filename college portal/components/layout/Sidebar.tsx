"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/data";

interface SidebarProps {
    role: UserRole;
}

const menuItems = {
    student: [
        { name: "Dashboard", href: "/dashboard/student", icon: "📊" },
    ],
    teacher: [
        { name: "Dashboard", href: "/dashboard/teacher", icon: "📚" },
    ],
    admin: [
        { name: "Dashboard", href: "/dashboard/admin", icon: "⚙️" },
    ],
};

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const items = menuItems[role] || [];

    return (
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary-600">College Portal</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                    © 2024 College Portal
                </p>
            </div>
        </aside>
    );
}
