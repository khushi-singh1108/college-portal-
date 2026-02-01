// Admin Dashboard Module
const AdminDashboard = {
    render(subPage = 'home') {
        const session = Auth.getSession();

        switch (subPage) {
            case 'home': return this.renderHome();
            case 'students': return this.renderStudents();
            case 'teachers': return this.renderTeachers();
            case 'system': return this.renderSystem();
            case 'profile': return this.renderProfile(session);
            default: return this.renderHome();
        }
    },

    renderHome() {
        const students = DATA.students;
        const teachers = DATA.teachers;
        const subjects = DATA.subjects;
        const pendingFees = DATA.fees.filter(f => f.status !== 'paid').length;

        return `
            <div class="dashboard-header" style="margin-bottom: 40px; animation: fadeInUp 0.6s ease">
                <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">System Administration</h1>
                <p style="color: var(--text-secondary);">College-wide overview and management tools.</p>
            </div>
            
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 32px;">
                ${Components.createCard('', Components.createStatItem('Total Students', students.length, 'Active enrollment'))}
                ${Components.createCard('', Components.createStatItem('Total Teachers', teachers.length, 'Faculty members'))}
                ${Components.createCard('', Components.createStatItem('Total Subjects', subjects.length, 'Courses offered'))}
                ${Components.createCard('', Components.createStatItem('Pending Fees', pendingFees, 'Payment required'))}
            </div>

            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 32px;">
                ${Components.createCard('System Status', `
                    <div style="display:flex; flex-direction:column; gap:20px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:white;">Database Server</span>
                            <span class="status-badge status-verified">Running</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:white;">Storage Capacity</span>
                            <span style="color:var(--primary); font-weight:700;">84% Full</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:white;">Last Backup</span>
                            <span style="color:var(--text-muted);">2 hours ago</span>
                        </div>
                    </div>
                `)}
                
                ${Components.createCard('Quick System Actions', `
                    <div style="display:grid; grid-template-columns:1fr; gap:12px;">
                        ${Components.createButton('Generate Semester Reports', 'primary', '', 'sm')}
                        ${Components.createButton('Export Faculty Data', 'secondary', '', 'sm')}
                        ${Components.createButton('System Audit Log', 'secondary', '', 'sm')}
                    </div>
                `)}
            </div>
        `;
    },

    renderStudents() {
        return Components.createCard('Manage Students', `
            <div style="margin-bottom:20px;">
                ${Components.createButton('+ Add New Student', 'primary', 'AdminDashboard.showAddStudentModal()', 'sm')}
            </div>
            ${Components.createModernTable(
            ['Enrollment', 'Name', 'Semester', 'Actions'],
            DATA.students.slice(0, 20).map(s => [
                `<span style="color:var(--primary); font-weight:700">${s.enrollmentNo}</span>`,
                `<span style="color:white; font-weight:600">${getUserById(s.userId).name}</span>`,
                s.semester,
                `<div style="display:flex; gap:8px;">
                        ${Components.createButton('Edit', 'secondary', '', 'sm')}
                        ${Components.createButton('Delete', 'danger', `AdminDashboard.deleteStudent('${s.id}')`, 'sm')}
                    </div>`
            ])
        )}
        `);
    },

    renderTeachers() {
        return Components.createCard('Manage Faculty', `
            <div style="margin-bottom:20px;">
                ${Components.createButton('+ Add New Teacher', 'primary', 'AdminDashboard.showAddTeacherModal()', 'sm')}
            </div>
            ${Components.createModernTable(
            ['Employee ID', 'Name', 'Department', 'Actions'],
            DATA.teachers.map(t => [
                `<span style="color:var(--accent-purple); font-weight:700">${t.employeeId}</span>`,
                `<span style="color:white; font-weight:600">${getUserById(t.userId).name}</span>`,
                t.department,
                Components.createButton('Manage', 'secondary', '', 'sm')
            ])
        )}
        `);
    },

    renderSystem() {
        return Components.createCard('Portal Settings', `
            <div style="max-width:600px;">
                <div style="margin-bottom:32px;">
                    <h4 style="color:white; margin-bottom:12px;">Academic Session</h4>
                    ${Components.createSelect('session-select', [
            { value: '2024-25', label: '2024-25 (Current)' },
            { value: '2023-24', label: '2023-24' }
        ])}
                </div>
                <div style="margin-bottom:32px;">
                    <h4 style="color:white; margin-bottom:12px;">Registration Status</h4>
                    <div style="display:flex; align-items:center; gap:16px;">
                        <span class="status-badge status-verified">Open</span>
                        ${Components.createButton('Close Registration', 'danger', '', 'sm')}
                    </div>
                </div>
                ${Components.createButton('Save System Settings', 'primary')}
            </div>
        `);
    },

    renderProfile(session) {
        return `
            <div style="max-width:800px; margin:0 auto;">
                ${Components.createCard('Admin Profile', `
                    <div style="display:flex; gap:40px; align-items:center; margin-bottom:32px;">
                        <div style="width:120px; height:120px; border-radius:30px; background:linear-gradient(135deg, var(--primary), var(--accent-blue)); display:flex; align-items:center; justify-content:center; font-size:48px; color:white; font-weight:800; box-shadow:0 10px 30px var(--primary-glow)">
                            ${Components.getInitials(session.name)}
                        </div>
                        <div>
                            <h2 style="font-size:24px; color:white; margin-bottom:4px;">${session.name}</h2>
                            <p style="color:var(--primary); font-weight:700;">System Administrator</p>
                            <p style="color:var(--text-secondary);">College Management Office</p>
                        </div>
                    </div>
                    <div class="grid" style="grid-template-columns:1fr 1fr; gap:24px;">
                        ${Components.createStatItem('Email Address', session.email)}
                        ${Components.createStatItem('Role', 'System Administrator')}
                        ${Components.createStatItem('Permissions', 'Full Read/Write')}
                        ${Components.createStatItem('Member Since', 'Oct 2023')}
                    </div>
                `)}
            </div>
        `;
    },

    init(subPage) {
        this.createModals();
    },

    createModals() {
        const modalContainer = document.getElementById('modal-container');

        const addStudentModal = Components.createModal(
            'add-student-modal',
            'Add New Student',
            `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    ${Components.createFormGroup('Full Name', Components.createInput('student-name', 'text', 'John Doe'))}
                    ${Components.createFormGroup('Email', Components.createInput('student-email', 'email', 'student@college.edu'))}
                    ${Components.createFormGroup('Password', Components.createInput('student-password', 'password', '********'))}
                    ${Components.createFormGroup('Enrollment', Components.createInput('student-enrollment', 'text', '2024CSXXX'))}
                    ${Components.createFormGroup('Department', Components.createSelect('student-department', [
                { value: 'Computer Science', label: 'Computer Science' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Mechanical', label: 'Mechanical' },
                { value: 'Civil', label: 'Civil' }
            ]))}
                    ${Components.createFormGroup('Semester', Components.createInput('student-semester', 'number', '1'))}
                </div>
            `,
            `
                ${Components.createButton('Cancel', 'secondary', "Components.closeModal('add-student-modal')", 'sm')}
                ${Components.createButton('Create Student', 'primary', 'AdminDashboard.submitStudent()', 'sm')}
            `
        );

        const addTeacherModal = Components.createModal(
            'add-teacher-modal',
            'Add New Faculty',
            `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    ${Components.createFormGroup('Full Name', Components.createInput('teacher-name', 'text', 'Dr. Smith'))}
                    ${Components.createFormGroup('Email', Components.createInput('teacher-email', 'email', 'prof@college.edu'))}
                    ${Components.createFormGroup('Employee ID', Components.createInput('teacher-employee-id', 'text', 'EMPXXX'))}
                    ${Components.createFormGroup('Designation', Components.createInput('teacher-designation', 'text', 'Professor'))}
                </div>
            `,
            `
                ${Components.createButton('Cancel', 'secondary', "Components.closeModal('add-teacher-modal')", 'sm')}
                ${Components.createButton('Create Faculty', 'primary', 'AdminDashboard.submitTeacher()', 'sm')}
            `
        );

        modalContainer.innerHTML = addStudentModal + addTeacherModal;
    },

    showAddStudentModal() { Components.showModal('add-student-modal'); },
    showAddTeacherModal() { Components.showModal('add-teacher-modal'); },

    submitStudent() {
        const data = {
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            password: document.getElementById('student-password').value,
            enrollmentNo: document.getElementById('student-enrollment').value,
            department: document.getElementById('student-department').value,
            semester: parseInt(document.getElementById('student-semester').value) || 1,
            year: 1, phone: '0000000000', dateOfBirth: '2000-01-01', address: 'Unknown'
        };

        if (!data.name || !data.email) return Components.showToast('Name and Email are required', 'error');

        addStudent(data);
        Components.closeModal('add-student-modal');
        Components.showToast('Student added successfully!');
        window.location.reload(); // Refresh to show new data
    },

    submitTeacher() {
        const data = {
            name: document.getElementById('teacher-name').value,
            email: document.getElementById('teacher-email').value,
            employeeId: document.getElementById('teacher-employee-id').value,
            designation: document.getElementById('teacher-designation').value,
            password: 'teacher123', department: 'Computer Science', phone: '0000000000'
        };

        addTeacher(data);
        Components.closeModal('add-teacher-modal');
        Components.showToast('Teacher added successfully!');
        window.location.reload();
    },

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student record?')) {
            deleteStudent(id);
            Components.showToast('Student record deleted');
            window.location.reload();
        }
    }
};
