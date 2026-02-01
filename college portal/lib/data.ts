// Types
export type UserRole = "student" | "teacher" | "admin";

export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    name: string;
}

export interface Student {
    id: string;
    userId: string;
    enrollmentNo: string;
    department: string;
    semester: number;
    year: number;
    phone: string;
    dateOfBirth: string;
    address: string;
}

export interface Teacher {
    id: string;
    userId: string;
    employeeId: string;
    department: string;
    designation: string;
    phone: string;
    subjects: string[];
}

export interface Attendance {
    id: string;
    studentId: string;
    date: string;
    status: "present" | "absent" | "late";
    subject: string;
}

export interface Mark {
    id: string;
    studentId: string;
    subject: string;
    examType: "midterm" | "final" | "assignment" | "quiz";
    marksObtained: number;
    totalMarks: number;
    date: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    author: string;
    authorRole: UserRole;
    targetAudience: "all" | "students" | "teachers";
    date: string;
    priority: "low" | "medium" | "high";
}

export interface Fee {
    id: string;
    studentId: string;
    semester: number;
    amount: number;
    paid: number;
    dueDate: string;
    status: "paid" | "pending" | "overdue";
}

export interface TimetableEntry {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
    department: string;
    semester: number;
}

export interface Subject {
    id: string;
    code: string;
    name: string;
    department: string;
    semester: number;
    credits: number;
}

// Mock Data
export const users: User[] = [
    // Admin
    {
        id: "u1",
        email: "admin@college.edu",
        password: "admin123",
        role: "admin",
        name: "Dr. Sarah Johnson",
    },
    // Teachers
    {
        id: "u2",
        email: "john.smith@college.edu",
        password: "teacher123",
        role: "teacher",
        name: "Prof. John Smith",
    },
    {
        id: "u3",
        email: "emily.davis@college.edu",
        password: "teacher123",
        role: "teacher",
        name: "Dr. Emily Davis",
    },
    {
        id: "u4",
        email: "michael.brown@college.edu",
        password: "teacher123",
        role: "teacher",
        name: "Prof. Michael Brown",
    },
    // Students (50+)
    ...Array.from({ length: 55 }, (_, i) => ({
        id: `u${i + 5}`,
        email: `student${i + 1}@college.edu`,
        password: "student123",
        role: "student" as UserRole,
        name: generateStudentName(i),
    })),
];

export const students: Student[] = users
    .filter((u) => u.role === "student")
    .map((u, i) => ({
        id: `s${i + 1}`,
        userId: u.id,
        enrollmentNo: `EN${2024}${String(i + 1).padStart(4, "0")}`,
        department: ["Computer Science", "Electronics", "Mechanical", "Civil"][
            i % 4
        ],
        semester: (i % 8) + 1,
        year: Math.floor((i % 8) / 2) + 1,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        dateOfBirth: `200${i % 6}-0${(i % 9) + 1}-${(i % 28) + 1}`,
        address: `${i + 100} College Street, City, State`,
    }));

export const teachers: Teacher[] = [
    {
        id: "t1",
        userId: "u2",
        employeeId: "EMP001",
        department: "Computer Science",
        designation: "Professor",
        phone: "+1-555-1001",
        subjects: ["Data Structures", "Algorithms"],
    },
    {
        id: "t2",
        userId: "u3",
        employeeId: "EMP002",
        department: "Computer Science",
        designation: "Associate Professor",
        phone: "+1-555-1002",
        subjects: ["Database Systems", "Web Development"],
    },
    {
        id: "t3",
        userId: "u4",
        employeeId: "EMP003",
        department: "Electronics",
        designation: "Professor",
        phone: "+1-555-1003",
        subjects: ["Digital Electronics", "Microprocessors"],
    },
];

export const subjects: Subject[] = [
    {
        id: "sub1",
        code: "CS101",
        name: "Data Structures",
        department: "Computer Science",
        semester: 3,
        credits: 4,
    },
    {
        id: "sub2",
        code: "CS102",
        name: "Algorithms",
        department: "Computer Science",
        semester: 4,
        credits: 4,
    },
    {
        id: "sub3",
        code: "CS201",
        name: "Database Systems",
        department: "Computer Science",
        semester: 5,
        credits: 3,
    },
    {
        id: "sub4",
        code: "CS202",
        name: "Web Development",
        department: "Computer Science",
        semester: 5,
        credits: 3,
    },
    {
        id: "sub5",
        code: "EC101",
        name: "Digital Electronics",
        department: "Electronics",
        semester: 3,
        credits: 4,
    },
    {
        id: "sub6",
        code: "EC102",
        name: "Microprocessors",
        department: "Electronics",
        semester: 4,
        credits: 4,
    },
    {
        id: "sub7",
        code: "ME101",
        name: "Thermodynamics",
        department: "Mechanical",
        semester: 3,
        credits: 4,
    },
    {
        id: "sub8",
        code: "CE101",
        name: "Structural Analysis",
        department: "Civil",
        semester: 3,
        credits: 4,
    },
];

// Generate attendance for last 30 days
export const attendance: Attendance[] = [];
const today = new Date();
for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    students.slice(0, 10).forEach((student) => {
        subjects.slice(0, 3).forEach((subject) => {
            const random = Math.random();
            attendance.push({
                id: `att${attendance.length + 1}`,
                studentId: student.id,
                date: dateStr,
                status: random > 0.15 ? "present" : random > 0.05 ? "late" : "absent",
                subject: subject.name,
            });
        });
    });
}

export const marks: Mark[] = [];
students.slice(0, 10).forEach((student) => {
    subjects.slice(0, 4).forEach((subject) => {
        ["midterm", "final", "assignment", "quiz"].forEach((examType, idx) => {
            const totalMarks = examType === "quiz" ? 10 : examType === "assignment" ? 20 : 50;
            const marksObtained = Math.floor(totalMarks * (0.6 + Math.random() * 0.4));
            marks.push({
                id: `m${marks.length + 1}`,
                studentId: student.id,
                subject: subject.name,
                examType: examType as Mark["examType"],
                marksObtained,
                totalMarks,
                date: new Date(2024, 0, idx * 30 + 15).toISOString().split("T")[0],
            });
        });
    });
});

export const notices: Notice[] = [
    {
        id: "n1",
        title: "Semester Examination Schedule Released",
        content: "The final examination schedule for the current semester has been published. Please check the notice board for details.",
        author: "Dr. Sarah Johnson",
        authorRole: "admin",
        targetAudience: "all",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "high",
    },
    {
        id: "n2",
        title: "Library Timing Extended",
        content: "The library will remain open until 10 PM during examination period.",
        author: "Dr. Sarah Johnson",
        authorRole: "admin",
        targetAudience: "students",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
    },
    {
        id: "n3",
        title: "Faculty Meeting - January 15",
        content: "All faculty members are requested to attend the monthly meeting on January 15 at 2 PM in the conference hall.",
        author: "Dr. Sarah Johnson",
        authorRole: "admin",
        targetAudience: "teachers",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "high",
    },
    {
        id: "n4",
        title: "Sports Day Announcement",
        content: "Annual sports day will be held on February 20. Students interested in participating should register by February 10.",
        author: "Prof. John Smith",
        authorRole: "teacher",
        targetAudience: "students",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
    },
    {
        id: "n5",
        title: "Workshop on AI and Machine Learning",
        content: "A two-day workshop on AI and ML will be conducted on January 25-26. Registration is open for all students.",
        author: "Dr. Emily Davis",
        authorRole: "teacher",
        targetAudience: "students",
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "low",
    },
];

export const fees: Fee[] = students.slice(0, 10).map((student, i) => ({
    id: `f${i + 1}`,
    studentId: student.id,
    semester: student.semester,
    amount: 5000,
    paid: i % 3 === 0 ? 5000 : i % 3 === 1 ? 2500 : 0,
    dueDate: new Date(2024, 1, 15).toISOString().split("T")[0],
    status: (i % 3 === 0 ? "paid" : i % 3 === 1 ? "pending" : "overdue") as Fee["status"],
}));

export const timetable: TimetableEntry[] = [
    {
        id: "tt1",
        day: "Monday",
        startTime: "09:00",
        endTime: "10:00",
        subject: "Data Structures",
        teacher: "Prof. John Smith",
        room: "CS-101",
        department: "Computer Science",
        semester: 3,
    },
    {
        id: "tt2",
        day: "Monday",
        startTime: "10:00",
        endTime: "11:00",
        subject: "Database Systems",
        teacher: "Dr. Emily Davis",
        room: "CS-102",
        department: "Computer Science",
        semester: 5,
    },
    {
        id: "tt3",
        day: "Tuesday",
        startTime: "09:00",
        endTime: "10:00",
        subject: "Algorithms",
        teacher: "Prof. John Smith",
        room: "CS-101",
        department: "Computer Science",
        semester: 4,
    },
    {
        id: "tt4",
        day: "Tuesday",
        startTime: "11:00",
        endTime: "12:00",
        subject: "Web Development",
        teacher: "Dr. Emily Davis",
        room: "CS-103",
        department: "Computer Science",
        semester: 5,
    },
    {
        id: "tt5",
        day: "Wednesday",
        startTime: "09:00",
        endTime: "10:00",
        subject: "Data Structures",
        teacher: "Prof. John Smith",
        room: "CS-101",
        department: "Computer Science",
        semester: 3,
    },
    {
        id: "tt6",
        day: "Thursday",
        startTime: "10:00",
        endTime: "11:00",
        subject: "Database Systems",
        teacher: "Dr. Emily Davis",
        room: "CS-102",
        department: "Computer Science",
        semester: 5,
    },
    {
        id: "tt7",
        day: "Friday",
        startTime: "09:00",
        endTime: "10:00",
        subject: "Algorithms",
        teacher: "Prof. John Smith",
        room: "CS-101",
        department: "Computer Science",
        semester: 4,
    },
];

// Helper function
function generateStudentName(index: number): string {
    const firstNames = [
        "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
        "William", "Barbara", "David", "Elizabeth", "Richard", "Susan", "Joseph", "Jessica",
        "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
        "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
        "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
        "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa",
        "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon",
    ];
    const lastNames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
        "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    ];
    return `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`;
}

// CRUD Helper Functions
export function getUserByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
}

export function getStudentByUserId(userId: string): Student | undefined {
    return students.find((s) => s.userId === userId);
}

export function getTeacherByUserId(userId: string): Teacher | undefined {
    return teachers.find((t) => t.userId === userId);
}

export function getAttendanceByStudentId(studentId: string): Attendance[] {
    return attendance.filter((a) => a.studentId === studentId);
}

export function getMarksByStudentId(studentId: string): Mark[] {
    return marks.filter((m) => m.studentId === studentId);
}

export function getFeeByStudentId(studentId: string): Fee | undefined {
    return fees.find((f) => f.studentId === studentId);
}

export function getTimetableByDepartmentAndSemester(
    department: string,
    semester: number
): TimetableEntry[] {
    return timetable.filter(
        (t) => t.department === department && t.semester === semester
    );
}

export function getNoticesForRole(role: UserRole): Notice[] {
    return notices.filter(
        (n) => n.targetAudience === "all" || n.targetAudience === `${role}s`
    );
}

export function addStudent(student: Student, user: User): void {
    users.push(user);
    students.push(student);
}

export function updateStudent(id: string, updates: Partial<Student>): void {
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...updates };
    }
}

export function deleteStudent(id: string): void {
    const student = students.find((s) => s.id === id);
    if (student) {
        const userIndex = users.findIndex((u) => u.id === student.userId);
        if (userIndex !== -1) users.splice(userIndex, 1);
        const studentIndex = students.findIndex((s) => s.id === id);
        if (studentIndex !== -1) students.splice(studentIndex, 1);
    }
}

export function addAttendance(att: Attendance): void {
    attendance.push(att);
}

export function addMark(mark: Mark): void {
    marks.push(mark);
}

export function updateMark(id: string, updates: Partial<Mark>): void {
    const index = marks.findIndex((m) => m.id === id);
    if (index !== -1) {
        marks[index] = { ...marks[index], ...updates };
    }
}

export function addNotice(notice: Notice): void {
    notices.unshift(notice);
}

export function updateFee(id: string, updates: Partial<Fee>): void {
    const index = fees.findIndex((f) => f.id === id);
    if (index !== -1) {
        fees[index] = { ...fees[index], ...updates };
    }
}
