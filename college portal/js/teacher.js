// Teacher Dashboard Module
const TeacherDashboard = {
    render(subPage = 'home') {
        const session = Auth.getSession();
        const teacher = getTeacherByUserId(session.userId);

        if (!teacher) {
            return '<div style="color:white; text-align:center; padding:100px;"><h1>Teacher Data Not Found</h1></div>';
        }

        switch (subPage) {
            case 'home': return this.renderHome(teacher, session);
            case 'classes': return this.renderClasses(teacher);
            case 'attendance': return this.renderAttendance(teacher);
            case 'grades': return this.renderGrades(teacher);
            case 'profile': return this.renderProfile(teacher, session);
            default: return this.renderHome(teacher, session);
        }
    },

    renderHome(teacher, session) {
        const students = DATA.students.filter(s => s.department === teacher.department);

        return `
            <div class="dashboard-header" style="margin-bottom: 40px; animation: fadeInUp 0.6s ease">
                <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">Hello, ${teacher.designation} ${session.name.split(' ').pop()}!</h1>
                <p style="color: var(--text-secondary);">Manage your students, subjects, and departmental activities.</p>
            </div>
            
            <div class="grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 32px;">
                ${Components.createCard('', Components.createStatItem('Total Students', students.length, 'In your department'))}
                ${Components.createCard('', Components.createStatItem('Subjects Teaching', teacher.subjects.length, teacher.subjects.join(', ')))}
                ${Components.createCard('', Components.createStatItem('Department', teacher.department, teacher.designation))}
            </div>

            <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 32px;">
                <!-- Quick Actions Card -->
                ${Components.createCard('Quick Department Actions', `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div onclick="TeacherDashboard.showAttendanceModal()" style="cursor:pointer; padding:24px; border-radius:16px; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.2); transition:transform 0.2s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <span style="font-size:24px; margin-bottom:12px; display:block;">📝</span>
                            <h4 style="color:white; margin-bottom:4px;">Mark Attendance</h4>
                            <p style="font-size:12px; color:var(--text-secondary);">Register daily attendance for your subjects.</p>
                        </div>
                        <div onclick="TeacherDashboard.showMarksModal()" style="cursor:pointer; padding:24px; border-radius:16px; background:rgba(59, 130, 246, 0.1); border:1px solid rgba(59, 130, 246, 0.2); transition:transform 0.2s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <span style="font-size:24px; margin-bottom:12px; display:block;">📊</span>
                            <h4 style="color:white; margin-bottom:4px;">Upload Marks</h4>
                            <p style="font-size:12px; color:var(--text-secondary);">Submit internal and final exam results.</p>
                        </div>
                        <div onclick="TeacherDashboard.showNoticeModal()" style="cursor:pointer; padding:24px; border-radius:16px; background:rgba(139, 92, 246, 0.1); border:1px solid rgba(139, 92, 246, 0.2); grid-column: span 2; transition:transform 0.2s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <span style="font-size:24px; margin-bottom:12px; display:block;">📢</span>
                            <h4 style="color:white; margin-bottom:4px;">Post Department Notice</h4>
                            <p style="font-size:12px; color:var(--text-secondary);">Blast announcements to all students in your department.</p>
                        </div>
                    </div>
                `)}

                <!-- Student List Preview -->
                ${Components.createCard('Enrolled Students', `
                    <div style="max-height: 400px; overflow-y:auto;">
                        ${students.slice(0, 10).map(s => `
                            <div style="display:flex; align-items:center; gap:12px; padding:12px; border-radius:12px; background:rgba(255,255,255,0.02); margin-bottom:8px;">
                                <div style="width:32px; height:32px; border-radius:8px; background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">${Components.getInitials(getUserById(s.userId).name)}</div>
                                <div>
                                    <div style="color:white; font-size:13px; font-weight:600;">${getUserById(s.userId).name}</div>
                                    <div style="color:var(--text-muted); font-size:11px;">Sem ${s.semester} | CS</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${Components.createButton('View All Students', 'secondary', "window.location.hash='#/dashboard/teacher/classes'", 'sm', 'width:100%; margin-top:16px;')}
                `)}
            </div>
        `;
    },

    renderClasses(teacher) {
        const students = DATA.students.filter(s => s.department === teacher.department);
        return Components.createCard('Departmental Student Records',
            Components.createModernTable(
                ['Enrollment No', 'Name', 'Semester', 'Action'],
                students.map(s => [
                    `<span style="color:var(--primary); font-weight:700">${s.enrollmentNo}</span>`,
                    `<span style="color:white; font-weight:600">${getUserById(s.userId).name}</span>`,
                    s.semester,
                    Components.createButton('Details', 'secondary', `TeacherDashboard.showStudentDetails('${s.id}')`, 'sm')
                ])
            )
        );
    },

    renderAttendance(teacher) {
        // Show recent attendance log for teacher
        return Components.createCard('Recent Attendance Marked',
            Components.createModernTable(
                ['Date', 'Subject', 'Student', 'Status'],
                DATA.attendance.filter(a => teacher.subjects.includes(a.subject)).slice(0, 20).map(a => {
                    const student = DATA.students.find(s => s.id === a.studentId);
                    const userName = student ? getUserById(student.userId).name : 'Unknown';
                    return [
                        Components.formatDate(a.date),
                        a.subject,
                        userName,
                        Components.createStatusBadge(a.status.toUpperCase(), a.status === 'present' ? 'verified' : 'pending')
                    ];
                })
            )
        );
    },

    renderGrades(teacher) {
        return Components.createCard('Mark Entry Statistics', `
            <div style="text-align:center; padding:100px; color:var(--text-muted);">
                <span style="font-size:48px; display:block; margin-bottom:20px;">🚧</span>
                <h3>Detailed Analytics Coming Soon</h3>
                <p>Use the "Upload Marks" action on the home page to enter new results.</p>
            </div>
        `);
    },

    renderProfile(teacher, session) {
        return `
            <div style="max-width:800px; margin:0 auto;">
                ${Components.createCard('Faculty Profile', `
                    <div style="display:flex; gap:40px; align-items:center; margin-bottom:32px;">
                        <div style="width:120px; height:120px; border-radius:30px; background:linear-gradient(135deg, var(--accent-pink), var(--accent-purple)); display:flex; align-items:center; justify-content:center; font-size:48px; color:white; font-weight:800; box-shadow:0 10px 30px var(--primary-glow)">
                            ${Components.getInitials(session.name)}
                        </div>
                        <div>
                            <h2 style="font-size:24px; color:white; margin-bottom:4px;">${session.name}</h2>
                            <p style="color:var(--primary); font-weight:700;">${teacher.employeeId}</p>
                            <p style="color:var(--text-secondary);">${teacher.designation} | ${teacher.department}</p>
                        </div>
                    </div>
                    <div class="grid" style="grid-template-columns:1fr 1fr; gap:24px;">
                        ${Components.createStatItem('Email Address', session.email)}
                        ${Components.createStatItem('Phone Number', teacher.phone)}
                        ${Components.createStatItem('Department', teacher.department)}
                        ${Components.createStatItem('Position', teacher.designation)}
                    </div>
                `)}
            </div>
        `;
    },

    init(subPage) {
        this.createModals();
    },

    createModals() {
        const session = Auth.getSession();
        const teacher = getTeacherByUserId(session.userId);
        if (!teacher) return;
        const students = DATA.students.filter(s => s.department === teacher.department);

        const modalContainer = document.getElementById('modal-container');

        const attendanceModal = Components.createModal(
            'attendance-modal',
            'Mark Attendance',
            `
                ${Components.createFormGroup('Student', Components.createSelect('att-student', [
                { value: '', label: 'Select student' },
                ...students.map(s => ({ value: s.id, label: `${getUserById(s.userId).name} (${s.enrollmentNo})` }))
            ]))}
                ${Components.createFormGroup('Subject', Components.createSelect('att-subject', teacher.subjects.map(sub => ({ value: sub, label: sub }))))}
                ${Components.createFormGroup('Date', Components.createInput('att-date', 'date', '', new Date().toISOString().split('T')[0]))}
                ${Components.createFormGroup('Status', Components.createSelect('att-status', [
                { value: 'present', label: 'Present' },
                { value: 'absent', label: 'Absent' },
                { value: 'late', label: 'Late' }
            ]))}
            `,
            `
                ${Components.createButton('Cancel', 'secondary', "Components.closeModal('attendance-modal')", 'sm')}
                ${Components.createButton('Submit Attendance', 'primary', 'TeacherDashboard.submitAttendance()', 'sm')}
            `
        );

        const marksModal = Components.createModal(
            'marks-modal',
            'Upload Marks',
            `
                ${Components.createFormGroup('Student', Components.createSelect('marks-student', [
                { value: '', label: 'Select student' },
                ...students.map(s => ({ value: s.id, label: `${getUserById(s.userId).name} (${s.enrollmentNo})` }))
            ]))}
                ${Components.createFormGroup('Subject', Components.createSelect('marks-subject', teacher.subjects.map(sub => ({ value: sub, label: sub }))))}
                ${Components.createFormGroup('Exam Type', Components.createSelect('marks-exam-type', [
                { value: 'midterm', label: 'Midterm' },
                { value: 'final', label: 'Final' },
                { value: 'assignment', label: 'Assignment' },
                { value: 'quiz', label: 'Quiz' }
            ]))}
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                    ${Components.createFormGroup('Obtained', Components.createInput('marks-obtained', 'number', 'e.g., 85'))}
                    ${Components.createFormGroup('Total', Components.createInput('marks-total', 'number', 'e.g., 100'))}
                </div>
            `,
            `
                ${Components.createButton('Cancel', 'secondary', "Components.closeModal('marks-modal')", 'sm')}
                ${Components.createButton('Save Marks', 'primary', 'TeacherDashboard.submitMarks()', 'sm')}
            `
        );

        const noticeModal = Components.createModal(
            'notice-modal',
            'Post Department Notice',
            `
                ${Components.createFormGroup('Title', Components.createInput('notice-title', 'text', 'Notice title'))}
                ${Components.createFormGroup('Content', Components.createTextarea('notice-content', 'Notice content'))}
                ${Components.createFormGroup('Target Audience', Components.createSelect('notice-audience', [
                { value: 'students', label: 'Department Students' },
                { value: 'teachers', label: 'Department Faculty' },
                { value: 'all', label: 'Everyone' }
            ]))}
                ${Components.createFormGroup('Priority', Components.createSelect('notice-priority', [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
            ]))}
            `,
            `
                ${Components.createButton('Cancel', 'secondary', "Components.closeModal('notice-modal')", 'sm')}
                ${Components.createButton('Post Notice', 'primary', 'TeacherDashboard.submitNotice()', 'sm')}
            `
        );

        modalContainer.innerHTML = attendanceModal + marksModal + noticeModal;
    },

    showAttendanceModal() { Components.showModal('attendance-modal'); },
    showMarksModal() { Components.showModal('marks-modal'); },
    showNoticeModal() { Components.showModal('notice-modal'); },

    submitAttendance() {
        const studentId = document.getElementById('att-student').value;
        const subject = document.getElementById('att-subject').value;
        const date = document.getElementById('att-date').value;
        const status = document.getElementById('att-status').value;

        if (!studentId) return Components.showToast('Please select a student', 'error');

        markAttendance({ studentId, subject, date, status });
        Components.closeModal('attendance-modal');
        Components.showToast('Attendance marked successfully!');
        window.location.hash = '#/dashboard/teacher/attendance';
    },

    submitMarks() {
        const studentId = document.getElementById('marks-student').value;
        const subject = document.getElementById('marks-subject').value;
        const examType = document.getElementById('marks-exam-type').value;
        const marksObtained = parseInt(document.getElementById('marks-obtained').value);
        const totalMarks = parseInt(document.getElementById('marks-total').value);

        if (!studentId || isNaN(marksObtained)) return Components.showToast('Please fill all fields', 'error');

        addMark({ studentId, subject, examType, marksObtained, totalMarks });
        Components.closeModal('marks-modal');
        Components.showToast('Marks added successfully!');
        window.location.hash = '#/dashboard/teacher/home';
    },

    submitNotice() {
        const session = Auth.getSession();
        const title = document.getElementById('notice-title').value;
        const content = document.getElementById('notice-content').value;
        const targetAudience = document.getElementById('notice-audience').value;
        const priority = document.getElementById('notice-priority').value;

        if (!title || !content) return Components.showToast('Please fill all fields', 'error');

        postNotice({ title, content, targetAudience, priority }, session.userId);
        Components.closeModal('notice-modal');
        Components.showToast('Notice posted successfully!');
        window.location.hash = '#/dashboard/teacher/home';
    },

    showStudentDetails(id) {
        const student = DATA.students.find(s => s.id === id);
        const user = getUserById(student.userId);
        Components.showToast(`Viewing details for ${user.name}`);
    }
};
