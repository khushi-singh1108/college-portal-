// Student Dashboard Module
const StudentDashboard = {
    render(subPage = 'home') {
        const session = Auth.getSession();
        const student = getStudentByUserId(session.userId);

        if (!student) {
            return '<div style="color:white; text-align:center; padding:100px;"><h1>Data Not Found</h1><p>Please contact admin.</p></div>';
        }

        switch (subPage) {
            case 'home': return this.renderHome(student, session);
            case 'courses': return this.renderCourses(student);
            case 'schedule': return this.renderSchedule(student);
            case 'grades': return this.renderGrades(student);
            case 'attendance': return this.renderAttendance(student);
            case 'library': return this.renderLibrary();
            case 'profile': return this.renderProfile(student, session);
            case 'settings': return this.renderSettings();
            default: return this.renderHome(student, session);
        }
    },

    renderHome(student, session) {
        const attendancePercentage = calculateAttendancePercentage(student.id);
        const marks = getStudentMarks(student.id);
        const timetable = getTimetable(student.department, student.semester);
        const notices = getNotices('students');
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayClasses = timetable.filter(t => t.day === today);

        return `
            <div class="dashboard-header" style="margin-bottom: 40px; animation: fadeInUp 0.6s ease">
                <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">Welcome back, ${session.name.split(' ')[0]}!</h1>
                <p style="color: var(--text-secondary);">Here is what's happening with your studies today.</p>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 2fr; margin-bottom: 32px;">
                ${Components.createCard('', Components.createCircularProgress(attendancePercentage, 'Overall Attendance'))}
                ${Components.createCard('Weekly Attendance', `<div class="chart-container"><canvas id="attendanceChart"></canvas></div>`)}
            </div>

            <div class="grid" style="grid-template-columns: 1fr;">
                ${Components.createCard('Recent Subject Marks',
            Components.createModernTable(
                ['Subject', 'Date', 'Assessment', 'Grade', 'Status'],
                marks.slice(0, 5).map(m => [
                    `<span style="color:white; font-weight:600">${m.subject}</span>`,
                    `<span>${Components.formatDate(m.date)}</span>`,
                    `<span>${m.examType.charAt(0).toUpperCase() + m.examType.slice(1)} Exam</span>`,
                    `<span style="color:white; font-weight:700">${Components.calculatePercentage(m.marksObtained, m.totalMarks)}%</span>`,
                    Components.createStatusBadge('Verified', 'verified')
                ])
            )
        )}
            </div>

            <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top: 32px;">
                ${Components.createCard('Daily Schedule',
            todayClasses.length > 0
                ? todayClasses.map(c => Components.createTimetableItem(c)).join('')
                : '<div style="text-align:center; padding:40px; color:var(--text-muted)">No classes scheduled for today.</div>'
        )}
                ${Components.createCard('Recent Notices', notices.slice(0, 3).map(n => Components.createNoticeItem(n)).join(''))}
            </div>
        `;
    },

    renderCourses(student) {
        const subjects = DATA.subjects.filter(s => s.department === student.department && s.semester === student.semester);
        return `
            <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
                ${subjects.map(s => Components.createCard(s.name, `
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span style="color:var(--text-muted)">Code</span>
                        <span style="color:white; font-weight:700">${s.code}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span style="color:var(--text-muted)">Credits</span>
                        <span style="color:var(--primary); font-weight:700">${s.credits}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-muted)">Semester</span>
                        <span style="color:white">${s.semester}</span>
                    </div>
                `, `<span class="status-badge status-verified">Active</span>`)).join('')}
            </div>
        `;
    },

    renderSchedule(student) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timetable = getTimetable(student.department, student.semester);

        return `
            <div class="grid" style="grid-template-columns: 1fr;">
                ${days.map(day => {
            const classes = timetable.filter(t => t.day === day);
            return Components.createCard(day,
                classes.length > 0
                    ? classes.map(c => Components.createTimetableItem(c)).join('')
                    : '<p style="color:var(--text-muted)">No classes scheduled.</p>'
            );
        }).join('')}
            </div>
        `;
    },

    renderGrades(student) {
        const marks = getStudentMarks(student.id);
        const subjects = [...new Set(marks.map(m => m.subject))];

        return subjects.map(subject => {
            const subjectMarks = marks.filter(m => m.subject === subject);
            return Components.createCard(subject,
                Components.createModernTable(
                    ['Assessment', 'Date', 'Obtained', 'Total', 'Percentage'],
                    subjectMarks.map(m => [
                        m.examType.toUpperCase(),
                        Components.formatDate(m.date),
                        m.marksObtained,
                        m.totalMarks,
                        `<span style="color:var(--primary); font-weight:700">${Components.calculatePercentage(m.marksObtained, m.totalMarks)}%</span>`
                    ])
                )
            );
        }).join('<div style="height:24px;"></div>');
    },

    renderAttendance(student) {
        const attendance = getStudentAttendance(student.id);
        const subjects = [...new Set(attendance.map(a => a.subject))];

        return `
            <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-bottom:32px;">
                ${subjects.map(sub => {
            const subAtt = attendance.filter(a => a.subject === sub);
            const present = subAtt.filter(a => a.status === 'present' || a.status === 'late').length;
            const percent = Math.round((present / subAtt.length) * 100);
            return Components.createCard('', Components.createCircularProgress(percent, sub));
        }).join('')}
            </div>
            ${Components.createCard('Recent Attendance Log',
            Components.createModernTable(
                ['Date', 'Subject', 'Status'],
                attendance.slice(0, 20).map(a => [
                    Components.formatDate(a.date),
                    a.subject,
                    `<span class="status-badge ${a.status === 'present' ? 'status-verified' : 'status-pending'}">${a.status.toUpperCase()}</span>`
                ])
            )
        )}
        `;
    },

    renderLibrary() {
        return Components.createCard('Academic Library',
            Components.createModernTable(
                ['Book Title', 'Author', 'Category', 'Status'],
                DATA.library.map(b => [
                    `<span style="color:white; font-weight:600">${b.title}</span>`,
                    b.author,
                    b.category,
                    `<span class="status-badge ${b.status === 'Available' ? 'status-verified' : 'status-pending'}">${b.status}</span>`
                ])
            )
        );
    },

    renderProfile(student, session) {
        return `
            <div style="max-width:800px; margin:0 auto;">
                ${Components.createCard('Personal Information', `
                    <div style="display:flex; gap:40px; align-items:center; margin-bottom:32px;">
                        <div style="width:120px; height:120px; border-radius:30px; background:linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); display:flex; align-items:center; justify-content:center; font-size:48px; color:white; font-weight:800; box-shadow:0 10px 30px var(--primary-glow)">
                            ${Components.getInitials(session.name)}
                        </div>
                        <div>
                            <h2 style="font-size:24px; color:white; margin-bottom:4px;">${session.name}</h2>
                            <p style="color:var(--primary); font-weight:700;">${student.enrollmentNo}</p>
                            <p style="color:var(--text-secondary);">${student.department} | Year ${student.year}</p>
                        </div>
                    </div>
                    <div class="grid" style="grid-template-columns:1fr 1fr; gap:24px;">
                        ${Components.createStatItem('Email Address', session.email)}
                        ${Components.createStatItem('Phone Number', student.phone)}
                        ${Components.createStatItem('Date of Birth', student.dateOfBirth)}
                        ${Components.createStatItem('Semester', student.semester)}
                    </div>
                `)}
            </div>
        `;
    },

    renderSettings() {
        return `
            <div style="max-width:800px; margin:0 auto;">
                ${Components.createCard('Account Settings', `
                    <div style="margin-bottom:32px;">
                        <h3 style="color:white; margin-bottom:16px;">Theme Preferences</h3>
                        <div style="display:flex; gap:16px;">
                            ${Components.createButton('Dark Mode', 'primary', 'Router.toggleTheme()')}
                            ${Components.createButton('Enable Notifications', 'secondary')}
                        </div>
                    </div>
                    <hr style="border:0; border-top:1px solid var(--glass-border); margin-bottom:32px;">
                    <div>
                        <h3 style="color:white; margin-bottom:16px;">Security</h3>
                        ${Components.createButton('Change Password', 'secondary')}
                        <p style="color:var(--text-muted); font-size:12px; margin-top:12px;">Last login: ${new Date().toLocaleString()}</p>
                    </div>
                `)}
            </div>
        `;
    },

    init(subPage) {
        if (subPage === 'home') {
            setTimeout(() => this.renderHomeChart(), 100);
        }
    },

    renderHomeChart() {
        const canvas = document.getElementById('attendanceChart');
        if (!canvas) return;

        // Similar to previous renderChart logic but wrapped here
        const session = Auth.getSession();
        const student = getStudentByUserId(session.userId);
        const attendance = getStudentAttendance(student.id);

        const last7Days = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
                date: date.toISOString().split('T')[0],
                label: dayNames[(date.getDay() + 6) % 7]
            });
        }

        const chartData = last7Days.map(d => {
            const dayRecords = attendance.filter(a => a.date === d.date);
            const present = dayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
            const total = dayRecords.length || 1;
            return Math.round((present / total) * 100);
        });

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: last7Days.map(d => d.label),
                datasets: [{
                    label: 'Attendance %',
                    data: chartData,
                    backgroundColor: gradient,
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 8,
                    barThickness: 15,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: '600' } } }
                }
            }
        });
    }
};
