import { cookies } from "next/headers";
import { getUserByEmail, getUserById, type User, type UserRole } from "./data";

export interface Session {
    userId: string;
    role: UserRole;
    email: string;
    name: string;
}

export async function createSession(user: User): Promise<void> {
    const session: Session = {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
    };

    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function getSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");

        if (!sessionCookie) {
            return null;
        }

        const session = JSON.parse(sessionCookie.value) as Session;
        return session;
    } catch {
        return null;
    }
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function validateCredentials(
    email: string,
    password: string
): Promise<User | null> {
    const user = getUserByEmail(email);

    if (!user) {
        return null;
    }

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
        return null;
    }

    return user;
}

export async function requireAuth(): Promise<Session> {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthorized");
    }

    return session;
}

export async function requireRole(role: UserRole): Promise<Session> {
    const session = await requireAuth();

    if (session.role !== role) {
        throw new Error("Forbidden");
    }

    return session;
}
