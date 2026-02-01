"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { getUserById } from "@/lib/data";
import { users } from "@/lib/data";

interface TeacherData {
    teacher: any;
    students: any[];
    subjects: string[];
}

export default function TeacherDashboard() {
    const [data, setData] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [showNoticeModal, setShowNoticeModal] = useState(false);

    // Form states
    const [selectedStudent, setSelectedStudent] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendanceStatus, setAttendanceStatus] = useState("present");
    const [selectedSubject, setSelectedSubject] = useState("");

    const [marksStudent, setMarksStudent] = useState("");
    const [marksSubject, setMarksSubject] = useState("");
    const [examType, setExamType] = useState("midterm");
    const [marksObtained, setMarksObtained] = useState("");
    const [totalMarks, setTotalMarks] = useState("");

    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");
    const [noticeAudience, setNoticeAudience] = useState("students");
    const [noticePriority, setNoticePriority] = useState("medium");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/teacher");
            const result = await response.json();
            setData(result);
            if (result.subjects.length > 0) {
                setSelectedSubject(result.subjects[0]);
                setMarksSubject(result.subjects[0]);
            }
        } catch (error) {
            console.error("Error fetching teacher data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        try {
            await fetch("/api/teacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "mark_attendance",
                    data: {
                        studentId: selectedStudent,
                        date: attendanceDate,
                        status: attendanceStatus,
                        subject: selectedSubject,
                    },
                }),
            });
            setShowAttendanceModal(false);
            alert("Attendance marked successfully!");
        } catch (error) {
            console.error("Error marking attendance:", error);
            alert("Failed to mark attendance");
        }
    };

    const handleAddMarks = async () => {
        try {
            await fetch("/api/teacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "add_mark",
                    data: {
                        studentId: marksStudent,
                        subject: marksSubject,
                        examType,
                        marksObtained: parseInt(marksObtained),
                        totalMarks: parseInt(totalMarks),
                    },
                }),
            });
            setShowMarksModal(false);
            setMarksObtained("");
            setTotalMarks("");
            alert("Marks added successfully!");
        } catch (error) {
            console.error("Error adding marks:", error);
            alert("Failed to add marks");
        }
    };

    const handlePostNotice = async () => {
        try {
            await fetch("/api/teacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "post_notice",
                    data: {
                        title: noticeTitle,
                        content: noticeContent,
                        targetAudience: noticeAudience,
                        priority: noticePriority,
                    },
                }),
            });
            setShowNoticeModal(false);
            setNoticeTitle("");
            setNoticeContent("");
            alert("Notice posted successfully!");
        } catch (error) {
            console.error("Error posting notice:", error);
            alert("Failed to post notice");
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher" userName="Loading..." userEmail="">
                <div className="flex items-center justify-center h-full">
                    <div className="text-lg">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout role="teacher" userName="Error" userEmail="">
                <div className="text-red-600">Failed to load data</div>
            </DashboardLayout>
        );
    }

    const teacherUser = users.find((u) => u.id === data.teacher.userId);

    return (
        <DashboardLayout
            role="teacher"
            userName={teacherUser?.name || "Teacher"}
            userEmail={teacherUser?.email || ""}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                    <p className="text-muted-foreground">Manage your classes and students</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.students.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Subjects Teaching
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.subjects.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.subjects.join(", ")}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Department
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.teacher.department}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.teacher.designation}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={() => setShowAttendanceModal(true)}>
                                📝 Mark Attendance
                            </Button>
                            <Button onClick={() => setShowMarksModal(true)} variant="secondary">
                                📊 Upload Marks
                            </Button>
                            <Button onClick={() => setShowNoticeModal(true)} variant="outline">
                                📢 Post Notice
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Student List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Enrollment No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Semester</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.students.map((student: any) => {
                                    const user = users.find((u) => u.id === student.userId);
                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.enrollmentNo}</TableCell>
                                            <TableCell>{user?.name || "N/A"}</TableCell>
                                            <TableCell>{student.department}</TableCell>
                                            <TableCell>{student.semester}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Mark Attendance Modal */}
            <Modal
                isOpen={showAttendanceModal}
                onClose={() => setShowAttendanceModal(false)}
                title="Mark Attendance"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowAttendanceModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleMarkAttendance}>Submit</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Student</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                            <option value="">Select student</option>
                            {data.students.map((s: any) => {
                                const user = users.find((u) => u.id === s.userId);
                                return (
                                    <option key={s.id} value={s.id}>
                                        {user?.name} ({s.enrollmentNo})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Subject</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            {data.subjects.map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={attendanceStatus}
                            onChange={(e) => setAttendanceStatus(e.target.value)}
                        >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Add Marks Modal */}
            <Modal
                isOpen={showMarksModal}
                onClose={() => setShowMarksModal(false)}
                title="Upload Marks"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowMarksModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddMarks}>Submit</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Student</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={marksStudent}
                            onChange={(e) => setMarksStudent(e.target.value)}
                        >
                            <option value="">Select student</option>
                            {data.students.map((s: any) => {
                                const user = users.find((u) => u.id === s.userId);
                                return (
                                    <option key={s.id} value={s.id}>
                                        {user?.name} ({s.enrollmentNo})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Subject</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={marksSubject}
                            onChange={(e) => setMarksSubject(e.target.value)}
                        >
                            {data.subjects.map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Exam Type</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="midterm">Midterm</option>
                            <option value="final">Final</option>
                            <option value="assignment">Assignment</option>
                            <option value="quiz">Quiz</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Marks Obtained</label>
                        <Input
                            type="number"
                            value={marksObtained}
                            onChange={(e) => setMarksObtained(e.target.value)}
                            placeholder="e.g., 85"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Total Marks</label>
                        <Input
                            type="number"
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(e.target.value)}
                            placeholder="e.g., 100"
                        />
                    </div>
                </div>
            </Modal>

            {/* Post Notice Modal */}
            <Modal
                isOpen={showNoticeModal}
                onClose={() => setShowNoticeModal(false)}
                title="Post Notice"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowNoticeModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePostNotice}>Post</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={noticeTitle}
                            onChange={(e) => setNoticeTitle(e.target.value)}
                            placeholder="Notice title"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Content</label>
                        <textarea
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 min-h-[100px]"
                            value={noticeContent}
                            onChange={(e) => setNoticeContent(e.target.value)}
                            placeholder="Notice content"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Target Audience</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={noticeAudience}
                            onChange={(e) => setNoticeAudience(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="students">Students</option>
                            <option value="teachers">Teachers</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Priority</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={noticePriority}
                            onChange={(e) => setNoticePriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
