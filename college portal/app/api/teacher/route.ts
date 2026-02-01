import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
    getTeacherByUserId,
    students,
    addAttendance,
    addMark,
    updateMark,
    addNotice,
    marks,
    type Attendance,
    type Mark,
    type Notice,
} from "@/lib/data";

// GET /api/teacher - Get teacher data and students
export async function GET() {
    try {
        const session = await requireRole("teacher");
        const teacher = getTeacherByUserId(session.userId);

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        // Get all students (in a real app, filter by teacher's subjects/department)
        const studentList = students.slice(0, 20).map((s) => ({
            id: s.id,
            enrollmentNo: s.enrollmentNo,
            department: s.department,
            semester: s.semester,
            userId: s.userId,
        }));

        return NextResponse.json({
            teacher,
            students: studentList,
            subjects: teacher.subjects,
        });
    } catch (error) {
        console.error("Teacher data error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/teacher - Handle teacher actions
export async function POST(request: NextRequest) {
    try {
        const session = await requireRole("teacher");
        const teacher = getTeacherByUserId(session.userId);

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case "mark_attendance": {
                const { studentId, date, status, subject } = data;
                const attendance: Attendance = {
                    id: `att${Date.now()}`,
                    studentId,
                    date,
                    status,
                    subject,
                };
                addAttendance(attendance);
                return NextResponse.json({ success: true, attendance });
            }

            case "add_mark": {
                const { studentId, subject, examType, marksObtained, totalMarks } = data;
                const mark: Mark = {
                    id: `m${Date.now()}`,
                    studentId,
                    subject,
                    examType,
                    marksObtained,
                    totalMarks,
                    date: new Date().toISOString().split("T")[0],
                };
                addMark(mark);
                return NextResponse.json({ success: true, mark });
            }

            case "update_mark": {
                const { id, marksObtained } = data;
                updateMark(id, { marksObtained });
                return NextResponse.json({ success: true });
            }

            case "post_notice": {
                const { title, content, targetAudience, priority } = data;
                const notice: Notice = {
                    id: `n${Date.now()}`,
                    title,
                    content,
                    author: session.name,
                    authorRole: "teacher",
                    targetAudience,
                    date: new Date().toISOString(),
                    priority,
                };
                addNotice(notice);
                return NextResponse.json({ success: true, notice });
            }

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Teacher action error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
