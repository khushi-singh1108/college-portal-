import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession, getSession, validateCredentials } from "@/lib/auth";

// POST /api/auth - Login
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, action } = body;

        if (action === "logout") {
            await deleteSession();
            return NextResponse.json({ success: true });
        }

        if (action === "login") {
            if (!email || !password) {
                return NextResponse.json(
                    { error: "Email and password are required" },
                    { status: 400 }
                );
            }

            const user = await validateCredentials(email, password);

            if (!user) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            await createSession(user);

            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET /api/auth - Get current session
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        return NextResponse.json({ session });
    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
