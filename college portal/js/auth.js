// Authentication Module
const Auth = {
    // Get current session from localStorage
    getSession() {
        const sessionData = localStorage.getItem('session');
        return sessionData ? JSON.parse(sessionData) : null;
    },

    // Create session
    createSession(user) {
        const session = {
            userId: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
            timestamp: Date.now()
        };
        localStorage.setItem('session', JSON.stringify(session));
        return session;
    },

    // Delete session
    deleteSession() {
        localStorage.removeItem('session');
    },

    // Login
    login(email, password) {
        const user = DATA.users.find(u => u.email === email && u.password === password);
        if (user) {
            return this.createSession(user);
        }
        return null;
    },

    // Logout
    logout() {
        this.deleteSession();
        window.location.hash = '#/login';
    },

    // Check if user is authenticated
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;

        // Check if session is expired (24 hours)
        const now = Date.now();
        const sessionAge = now - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge > maxAge) {
            this.deleteSession();
            return false;
        }

        return true;
    },

    // Check if user has specific role
    hasRole(role) {
        const session = this.getSession();
        return session && session.role === role;
    },

    // Require authentication
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.hash = '#/login';
            return false;
        }
        return true;
    }
};
