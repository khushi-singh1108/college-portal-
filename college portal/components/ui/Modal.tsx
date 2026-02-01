"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative z-10 w-full rounded-xl bg-card p-6 shadow-lg",
                    {
                        "max-w-md": size === "sm",
                        "max-w-lg": size === "md",
                        "max-w-2xl": size === "lg",
                    }
                )}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ✕
                    </button>
                </div>
                <div className="mb-4">{children}</div>
                {footer && <div className="flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}
