import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
    students,
    teachers,
    subjects,
    notices,
    getStudentByUserId,
    getTeacherByUserId,
    getAttendanceByStudentId,
    getMarksByStudentId,
} from "@/lib/data";

export async function GET() {
    try {
        const session = await requireAuth();

        switch (session.role) {
            case "student": {
                const student = getStudentByUserId(session.userId);
                if (!student) {
                    return NextResponse.json({ error: "Student not found" }, { status: 404 });
                }

                const attendance = getAttendanceByStudentId(student.id);
                const marks = getMarksByStudentId(student.id);
                const presentCount = attendance.filter((a) => a.status === "present" || a.status === "late").length;
                const attendancePercentage = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

                return NextResponse.json({
                    role: "student",
                    stats: {
                        attendancePercentage,
                        totalSubjects: marks.reduce((acc, m) => {
                            if (!acc.includes(m.subject)) acc.push(m.subject);
                            return acc;
                        }, [] as string[]).length,
                        recentNotices: notices.filter((n) => n.targetAudience === "all" || n.targetAudience === "students").length,
                    },
                });
            }

            case "teacher": {
                const teacher = getTeacherByUserId(session.userId);
                if (!teacher) {
                    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
                }

                return NextResponse.json({
                    role: "teacher",
                    stats: {
                        totalStudents: students.length,
                        subjectsTaught: teacher.subjects.length,
                        department: teacher.department,
                    },
                });
            }

            case "admin": {
                return NextResponse.json({
                    role: "admin",
                    stats: {
                        totalStudents: students.length,
                        totalTeachers: teachers.length,
                        totalSubjects: subjects.length,
                        recentNotices: notices.length,
                    },
                });
            }

            default:
                return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
