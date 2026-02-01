import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
    students,
    teachers,
    subjects,
    fees,
    users,
    addStudent,
    updateStudent,
    deleteStudent,
    updateFee,
    type Student,
    type User,
    type Teacher,
    type Subject,
} from "@/lib/data";

// GET /api/admin - Get all admin data
export async function GET() {
    try {
        await requireRole("admin");

        // Get students with user info
        const studentsWithUsers = students.map((s) => {
            const user = users.find((u) => u.id === s.userId);
            return {
                ...s,
                name: user?.name,
                email: user?.email,
            };
        });

        // Get teachers with user info
        const teachersWithUsers = teachers.map((t) => {
            const user = users.find((u) => u.id === t.userId);
            return {
                ...t,
                name: user?.name,
                email: user?.email,
            };
        });

        return NextResponse.json({
            students: studentsWithUsers,
            teachers: teachersWithUsers,
            subjects,
            fees,
            stats: {
                totalStudents: students.length,
                totalTeachers: teachers.length,
                totalSubjects: subjects.length,
                pendingFees: fees.filter((f) => f.status !== "paid").length,
            },
        });
    } catch (error) {
        console.error("Admin data error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/admin - Handle admin actions
export async function POST(request: NextRequest) {
    try {
        await requireRole("admin");
        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case "add_student": {
                const { name, email, password, enrollmentNo, department, semester, year, phone, dateOfBirth, address } = data;
                const userId = `u${Date.now()}`;
                const studentId = `s${Date.now()}`;

                const user: User = {
                    id: userId,
                    email,
                    password,
                    role: "student",
                    name,
                };

                const student: Student = {
                    id: studentId,
                    userId,
                    enrollmentNo,
                    department,
                    semester,
                    year,
                    phone,
                    dateOfBirth,
                    address,
                };

                addStudent(student, user);
                return NextResponse.json({ success: true, student: { ...student, name, email } });
            }

            case "update_student": {
                const { id, ...updates } = data;
                updateStudent(id, updates);
                return NextResponse.json({ success: true });
            }

            case "delete_student": {
                const { id } = data;
                deleteStudent(id);
                return NextResponse.json({ success: true });
            }

            case "add_teacher": {
                const { name, email, password, employeeId, department, designation, phone, subjects: teacherSubjects } = data;
                const userId = `u${Date.now()}`;
                const teacherId = `t${Date.now()}`;

                const user: User = {
                    id: userId,
                    email,
                    password,
                    role: "teacher",
                    name,
                };

                const teacher: Teacher = {
                    id: teacherId,
                    userId,
                    employeeId,
                    department,
                    designation,
                    phone,
                    subjects: teacherSubjects,
                };

                users.push(user);
                teachers.push(teacher);
                return NextResponse.json({ success: true, teacher: { ...teacher, name, email } });
            }

            case "add_subject": {
                const { code, name, department, semester, credits } = data;
                const subject: Subject = {
                    id: `sub${Date.now()}`,
                    code,
                    name,
                    department,
                    semester,
                    credits,
                };
                subjects.push(subject);
                return NextResponse.json({ success: true, subject });
            }

            case "update_fee": {
                const { id, paid, status } = data;
                updateFee(id, { paid, status });
                return NextResponse.json({ success: true });
            }

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Admin action error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
