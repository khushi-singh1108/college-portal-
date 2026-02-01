import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
    getStudentByUserId,
    getAttendanceByStudentId,
    getMarksByStudentId,
    getFeeByStudentId,
    getTimetableByDepartmentAndSemester,
    getNoticesForRole,
    getUserById,
} from "@/lib/data";

export async function GET() {
    try {
        const session = await requireRole("student");
        const student = getStudentByUserId(session.userId);

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const user = getUserById(session.userId);
        const attendance = getAttendanceByStudentId(student.id);
        const marks = getMarksByStudentId(student.id);
        const fee = getFeeByStudentId(student.id);
        const timetable = getTimetableByDepartmentAndSemester(
            student.department,
            student.semester
        );
        const notices = getNoticesForRole("student");

        // Calculate attendance percentage
        const totalClasses = attendance.length;
        const presentClasses = attendance.filter(
            (a) => a.status === "present" || a.status === "late"
        ).length;
        const attendancePercentage =
            totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

        return NextResponse.json({
            student: {
                ...student,
                name: user?.name,
                email: user?.email,
            },
            attendance: {
                records: attendance.slice(0, 30), // Last 30 days
                percentage: attendancePercentage,
                total: totalClasses,
                present: presentClasses,
            },
            marks,
            fee,
            timetable,
            notices: notices.slice(0, 10), // Latest 10 notices
        });
    } catch (error) {
        console.error("Student data error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
