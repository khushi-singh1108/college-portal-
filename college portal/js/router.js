// Router Module
const Router = {
    init() {
        // Initialize theme
        this.initTheme();

        // Handle hash changes
        window.addEventListener('hashchange', () => this.loadRoute());

        // Load initial route
        this.loadRoute();

        // Setup event listeners
        this.setupEventListeners();
    },

    loadRoute() {
        const hash = window.location.hash || '#/login';
        const pathParts = hash.substring(1).split('/').filter(p => p); // #/dashboard/student/grades -> ['dashboard', 'student', 'grades']

        // Hide all views
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.add('hidden');

        if (pathParts[0] === 'login' || !pathParts[0]) {
            this.showLogin();
        } else if (pathParts[0] === 'dashboard') {
            if (!Auth.isAuthenticated()) {
                window.location.hash = '#/login';
                return;
            }
            const role = pathParts[1];
            const subPage = pathParts[2] || 'home';
            this.showDashboard(role, subPage);
        } else {
            // Default route
            if (Auth.isAuthenticated()) {
                const session = Auth.getSession();
                window.location.hash = `#/dashboard/${session.role}/home`;
            } else {
                window.location.hash = '#/login';
            }
        }
    },

    showLogin() {
        document.getElementById('login-view').classList.remove('hidden');
    },

    showDashboard(role, subPage) {
        const session = Auth.getSession();

        // Security check: ensure user is access their own role dashboard
        if (session.role !== role && session.role !== 'admin') {
            window.location.hash = `#/dashboard/${session.role}/home`;
            return;
        }

        // Update user info in navbar
        document.getElementById('user-name').textContent = session.name;
        document.getElementById('user-email').textContent = session.email;
        document.getElementById('user-avatar').textContent = Components.getInitials(session.name);

        // Update sidebar navigation
        this.updateSidebar(role, subPage);

        // Load dashboard content based on role and subPage
        const content = document.getElementById('dashboard-content');
        const pageTitle = document.getElementById('page-title');

        if (role === 'student') {
            pageTitle.textContent = subPage === 'home' ? 'Student Dashboard' : subPage.charAt(0).toUpperCase() + subPage.slice(1);
            content.innerHTML = StudentDashboard.render(subPage);
            StudentDashboard.init(subPage);
        } else if (role === 'teacher') {
            pageTitle.textContent = subPage === 'home' ? 'Teacher Dashboard' : subPage.charAt(0).toUpperCase() + subPage.slice(1);
            content.innerHTML = TeacherDashboard.render(subPage);
            TeacherDashboard.init(subPage);
        } else if (role === 'admin') {
            pageTitle.textContent = subPage === 'home' ? 'Admin Dashboard' : subPage.charAt(0).toUpperCase() + subPage.slice(1);
            content.innerHTML = AdminDashboard.render(subPage);
            AdminDashboard.init(subPage);
        }

        document.getElementById('dashboard-view').classList.remove('hidden');
    },

    updateSidebar(role, subPage) {
        const nav = document.getElementById('sidebar-nav');

        const menuItems = {
            student: [
                { name: 'Home', path: 'home', icon: '🏠' },
                { name: 'Courses', path: 'courses', icon: '📘' },
                { name: 'Schedule', path: 'schedule', icon: '📅' },
                { name: 'Grades', path: 'grades', icon: '🎓' },
                { name: 'Attendance', path: 'attendance', icon: '📈' },
                { name: 'Library', path: 'library', icon: '📚' },
                { name: 'Profile', path: 'profile', icon: '👤' },
                { name: 'Settings', path: 'settings', icon: '⚙️' }
            ],
            teacher: [
                { name: 'Home', path: 'home', icon: '🏠' },
                { name: 'My Classes', path: 'classes', icon: '📚' },
                { name: 'Attendance', path: 'attendance', icon: '📝' },
                { name: 'Grades', path: 'grades', icon: '📊' },
                { name: 'Profile', path: 'profile', icon: '👤' }
            ],
            admin: [
                { name: 'Home', path: 'home', icon: '🏠' },
                { name: 'Students', path: 'students', icon: '👥' },
                { name: 'Teachers', path: 'teachers', icon: '👨‍🏫' },
                { name: 'System', path: 'system', icon: '⚙️' },
                { name: 'Profile', path: 'profile', icon: '👤' }
            ]
        };

        const items = menuItems[role] || [];

        nav.innerHTML = items.map(item => `
            <div class="nav-item ${subPage === item.path ? 'active' : ''}" 
                 onclick="window.location.hash='#/dashboard/${role}/${item.path}'">
                <span class="nav-icon">${item.icon}</span>
                <span>${item.name}</span>
            </div>
        `).join('');
    },

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
                window.location.hash = '#/login';
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        const session = Auth.login(email, password);

        if (session) {
            errorDiv.classList.remove('show');
            window.location.hash = `#/dashboard/${session.role}/home`;
        } else {
            errorDiv.textContent = 'Invalid email or password';
            errorDiv.classList.add('show');
        }
    },

    initTheme() {
        const isLight = localStorage.getItem('lightMode') === 'true';
        if (isLight) {
            document.body.classList.add('light-mode');
            this.updateThemeIcon(true);
        }
    },

    toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('lightMode', isLight);
        this.updateThemeIcon(isLight);
    },

    updateThemeIcon(isLight) {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = isLight ? '🌙' : '☀️';
        }
    }
};

// Initialize router
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Router.init());
} else {
    Router.init();
}
