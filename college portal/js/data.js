// Mock Data Store
const DATA = {
    users: [
        // Admin
        { id: 'u1', email: 'admin@college.edu', password: 'admin123', role: 'admin', name: 'Dr. Sarah Johnson' },
        // Teachers
        { id: 'u2', email: 'john.smith@college.edu', password: 'teacher123', role: 'teacher', name: 'Prof. John Smith' },
        { id: 'u3', email: 'emily.davis@college.edu', password: 'teacher123', role: 'teacher', name: 'Dr. Emily Davis' },
        { id: 'u4', email: 'michael.brown@college.edu', password: 'teacher123', role: 'teacher', name: 'Prof. Michael Brown' },
        // Students (50+)
        ...Array.from({ length: 55 }, (_, i) => ({
            id: `u${i + 5}`,
            email: `student${i + 1}@college.edu`,
            password: 'student123',
            role: 'student',
            name: `Student ${i + 1}`
        }))
    ],

    students: Array.from({ length: 55 }, (_, i) => ({
        id: `s${i + 1}`,
        userId: `u${i + 5}`,
        enrollmentNo: `2024CS${String(i + 1).padStart(3, '0')}`,
        department: ['Computer Science', 'Electronics', 'Mechanical', 'Civil'][i % 4],
        semester: (i % 8) + 1,
        year: Math.floor((i % 8) / 2) + 1,
        phone: `+91 ${9000000000 + i}`,
        dateOfBirth: `200${i % 5}-0${(i % 12) + 1}-15`,
        address: `${i + 1} Student Street, College Town`
    })),

    teachers: [
        { id: 't1', userId: 'u2', employeeId: 'EMP001', department: 'Computer Science', designation: 'Professor', phone: '+91 9876543210', subjects: ['Data Structures', 'Algorithms', 'Database Systems'] },
        { id: 't2', userId: 'u3', employeeId: 'EMP002', department: 'Computer Science', designation: 'Associate Professor', phone: '+91 9876543211', subjects: ['Operating Systems', 'Computer Networks'] },
        { id: 't3', userId: 'u4', employeeId: 'EMP003', department: 'Electronics', designation: 'Assistant Professor', phone: '+91 9876543212', subjects: ['Digital Electronics', 'Microprocessors'] }
    ],

    subjects: [
        { id: 'sub1', code: 'CS101', name: 'Data Structures', department: 'Computer Science', semester: 3, credits: 4 },
        { id: 'sub2', code: 'CS102', name: 'Algorithms', department: 'Computer Science', semester: 4, credits: 4 },
        { id: 'sub3', code: 'CS103', name: 'Database Systems', department: 'Computer Science', semester: 5, credits: 3 },
        { id: 'sub4', code: 'CS104', name: 'Operating Systems', department: 'Computer Science', semester: 5, credits: 4 },
        { id: 'sub5', code: 'CS105', name: 'Computer Networks', department: 'Computer Science', semester: 6, credits: 3 },
        { id: 'sub6', code: 'EC101', name: 'Digital Electronics', department: 'Electronics', semester: 3, credits: 4 },
        { id: 'sub7', code: 'EC102', name: 'Microprocessors', department: 'Electronics', semester: 4, credits: 4 },
        { id: 'sub8', code: 'ME101', name: 'Thermodynamics', department: 'Mechanical', semester: 3, credits: 4 }
    ],

    attendance: [],
    marks: [],
    notices: [],
    fees: [],
    timetable: [],
    library: [
        { id: 'b1', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', category: 'Computer Science', status: 'Available' },
        { id: 'b2', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', category: 'Computer Science', status: 'Borrowed' },
        { id: 'b3', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', category: 'Computer Science', status: 'Available' },
        { id: 'b4', title: 'Computer Networking: A Top-Down Approach', author: 'Kurose, Ross', category: 'Computer Science', status: 'Available' },
        { id: 'b5', title: 'Digital Design', author: 'M. Morris Mano', category: 'Electronics', status: 'Available' }
    ]
};

// Generate attendance records (last 30 days)
const generateAttendance = () => {
    const records = [];
    const subjects = ['Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'];

    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        DATA.students.forEach(student => {
            subjects.forEach(subject => {
                const status = Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late');
                records.push({
                    id: `att_${student.id}_${subject}_${dateStr}`,
                    studentId: student.id,
                    subject,
                    date: dateStr,
                    status
                });
            });
        });
    }
    return records;
};

// Generate marks
const generateMarks = () => {
    const marks = [];
    const subjects = ['Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'];
    const examTypes = ['midterm', 'final', 'assignment', 'quiz'];

    DATA.students.forEach(student => {
        subjects.forEach(subject => {
            examTypes.forEach(examType => {
                const totalMarks = examType === 'quiz' ? 20 : examType === 'assignment' ? 30 : 100;
                const marksObtained = Math.floor(Math.random() * (totalMarks - totalMarks * 0.5) + totalMarks * 0.5);

                marks.push({
                    id: `mark_${student.id}_${subject}_${examType}`,
                    studentId: student.id,
                    subject,
                    examType,
                    marksObtained,
                    totalMarks,
                    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
                });
            });
        });
    });
    return marks;
};

// Generate notices
DATA.notices = [
    { id: 'n1', title: 'Semester Exam Schedule Released', content: 'The semester examination schedule has been released. Please check the academic portal for details.', date: '2024-01-15', priority: 'high', targetAudience: 'all', postedBy: 'u1' },
    { id: 'n2', title: 'Library Timings Extended', content: 'Library will remain open till 10 PM during exam season.', date: '2024-01-14', priority: 'medium', targetAudience: 'students', postedBy: 'u1' },
    { id: 'n3', title: 'Faculty Meeting on Friday', content: 'All faculty members are requested to attend the meeting at 3 PM in Conference Hall.', date: '2024-01-13', priority: 'high', targetAudience: 'teachers', postedBy: 'u1' },
    { id: 'n4', title: 'Sports Day Next Week', content: 'Annual sports day will be held next week. Students are encouraged to participate.', date: '2024-01-12', priority: 'low', targetAudience: 'students', postedBy: 'u2' },
    { id: 'n5', title: 'Workshop on AI/ML', content: 'A workshop on Artificial Intelligence and Machine Learning will be conducted this Saturday.', date: '2024-01-11', priority: 'medium', targetAudience: 'all', postedBy: 'u3' }
];

// Generate fees
DATA.fees = DATA.students.map((student, i) => ({
    id: `fee_${student.id}`,
    studentId: student.id,
    semester: student.semester,
    amount: 50000,
    paid: i % 3 === 0 ? 50000 : (i % 3 === 1 ? 25000 : 0),
    status: i % 3 === 0 ? 'paid' : (i % 3 === 1 ? 'partial' : 'pending'),
    dueDate: '2024-02-28'
}));

// Generate timetable
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' }
];

DATA.timetable = [];
days.forEach((day, dayIndex) => {
    times.forEach((time, timeIndex) => {
        const subjects = ['Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'];
        const teachers = ['Prof. John Smith', 'Dr. Emily Davis', 'Prof. Michael Brown'];

        DATA.timetable.push({
            id: `tt_${dayIndex}_${timeIndex}`,
            day,
            startTime: time.start,
            endTime: time.end,
            subject: subjects[timeIndex % subjects.length],
            teacher: teachers[timeIndex % teachers.length],
            room: `Room ${101 + timeIndex}`,
            department: 'Computer Science',
            semester: 3
        });
    });
});

// Initialize data
DATA.attendance = generateAttendance();
DATA.marks = generateMarks();

// Helper functions
const getStudentByUserId = (userId) => DATA.students.find(s => s.userId === userId);
const getTeacherByUserId = (userId) => DATA.teachers.find(t => t.userId === userId);
const getUserById = (userId) => DATA.users.find(u => u.id === userId);
const getStudentAttendance = (studentId) => DATA.attendance.filter(a => a.studentId === studentId);
const getStudentMarks = (studentId) => DATA.marks.filter(m => m.studentId === studentId);
const getStudentFee = (studentId) => DATA.fees.find(f => f.studentId === studentId);
const getTimetable = (department, semester) => DATA.timetable.filter(t => t.department === department && t.semester === semester);
const getNotices = (audience) => DATA.notices.filter(n => n.targetAudience === audience || n.targetAudience === 'all');

// Calculate attendance percentage
const calculateAttendancePercentage = (studentId) => {
    const records = getStudentAttendance(studentId);
    if (records.length === 0) return 0;
    const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
    return Math.round((present / records.length) * 100);
};

// Add new student
const addStudent = (data) => {
    const userId = `u${DATA.users.length + 1}`;
    const studentId = `s${DATA.students.length + 1}`;

    DATA.users.push({
        id: userId,
        email: data.email,
        password: data.password,
        role: 'student',
        name: data.name
    });

    DATA.students.push({
        id: studentId,
        userId,
        enrollmentNo: data.enrollmentNo,
        department: data.department,
        semester: data.semester,
        year: data.year,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address
    });

    return studentId;
};

// Delete student
const deleteStudent = (studentId) => {
    const student = DATA.students.find(s => s.id === studentId);
    if (student) {
        DATA.students = DATA.students.filter(s => s.id !== studentId);
        DATA.users = DATA.users.filter(u => u.id !== student.userId);
        DATA.attendance = DATA.attendance.filter(a => a.studentId !== studentId);
        DATA.marks = DATA.marks.filter(m => m.studentId !== studentId);
        DATA.fees = DATA.fees.filter(f => f.studentId !== studentId);
    }
};

// Add teacher
const addTeacher = (data) => {
    const userId = `u${DATA.users.length + 1}`;
    const teacherId = `t${DATA.teachers.length + 1}`;

    DATA.users.push({
        id: userId,
        email: data.email,
        password: data.password,
        role: 'teacher',
        name: data.name
    });

    DATA.teachers.push({
        id: teacherId,
        userId,
        employeeId: data.employeeId,
        department: data.department,
        designation: data.designation,
        phone: data.phone,
        subjects: data.subjects || []
    });

    return teacherId;
};

// Add subject
const addSubject = (data) => {
    const subjectId = `sub${DATA.subjects.length + 1}`;
    DATA.subjects.push({
        id: subjectId,
        code: data.code,
        name: data.name,
        department: data.department,
        semester: data.semester,
        credits: data.credits
    });
    return subjectId;
};

// Mark attendance
const markAttendance = (data) => {
    const id = `att_${data.studentId}_${data.subject}_${data.date}`;
    const existing = DATA.attendance.find(a => a.id === id);

    if (existing) {
        existing.status = data.status;
    } else {
        DATA.attendance.push({
            id,
            studentId: data.studentId,
            subject: data.subject,
            date: data.date,
            status: data.status
        });
    }
};

// Add marks
const addMark = (data) => {
    const id = `mark_${data.studentId}_${data.subject}_${data.examType}_${Date.now()}`;
    DATA.marks.push({
        id,
        studentId: data.studentId,
        subject: data.subject,
        examType: data.examType,
        marksObtained: data.marksObtained,
        totalMarks: data.totalMarks,
        date: new Date().toISOString().split('T')[0]
    });
};

// Post notice
const postNotice = (data, userId) => {
    const id = `n${DATA.notices.length + 1}`;
    DATA.notices.unshift({
        id,
        title: data.title,
        content: data.content,
        date: new Date().toISOString().split('T')[0],
        priority: data.priority,
        targetAudience: data.targetAudience,
        postedBy: userId
    });
};
