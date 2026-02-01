import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("session");
    const { pathname } = request.nextUrl;

    // Public routes
    if (pathname === "/login") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Protected routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
        if (!session && !pathname.startsWith("/api/auth")) {
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*", "/login"],
};
