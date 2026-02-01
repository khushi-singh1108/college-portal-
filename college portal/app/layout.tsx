import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "College Student Portal",
    description: "A modern student portal for college management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
