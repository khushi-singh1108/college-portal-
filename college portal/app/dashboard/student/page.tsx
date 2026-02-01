"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { formatDate, calculatePercentage } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StudentData {
    student: any;
    attendance: any;
    marks: any[];
    fee: any;
    timetable: any[];
    notices: any[];
}

export default function StudentDashboard() {
    const [data, setData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/student");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching student data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="student" userName="Loading..." userEmail="">
                <div className="flex items-center justify-center h-full">
                    <div className="text-lg">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout role="student" userName="Error" userEmail="">
                <div className="text-red-600">Failed to load data</div>
            </DashboardLayout>
        );
    }

    // Prepare attendance chart data (last 7 days)
    const attendanceByDate = data.attendance.records
        .slice(0, 21)
        .reduce((acc: any, record: any) => {
            const date = record.date;
            if (!acc[date]) {
                acc[date] = { date, present: 0, absent: 0 };
            }
            if (record.status === "present" || record.status === "late") {
                acc[date].present++;
            } else {
                acc[date].absent++;
            }
            return acc;
        }, {});

    const chartData = Object.values(attendanceByDate).slice(0, 7).reverse();

    // Today's timetable
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayClasses = data.timetable.filter((t: any) => t.day === today);

    return (
        <DashboardLayout
            role="student"
            userName={data.student.name}
            userEmail={data.student.email}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {data.student.name}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.attendance.percentage}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.attendance.present} / {data.attendance.total} classes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Enrollment No
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.student.enrollmentNo}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.student.department}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Fee Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${data.fee?.status === "paid" ? "text-green-600" : "text-orange-600"}`}>
                                {data.fee?.status?.toUpperCase() || "N/A"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.fee ? `₹${data.fee.paid} / ₹${data.fee.amount}` : "No fee record"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Overview (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="present" fill="#3b82f6" name="Present" />
                                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Marks Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Marks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Exam Type</TableHead>
                                    <TableHead>Marks</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.marks.slice(0, 10).map((mark: any) => (
                                    <TableRow key={mark.id}>
                                        <TableCell className="font-medium">{mark.subject}</TableCell>
                                        <TableCell className="capitalize">{mark.examType}</TableCell>
                                        <TableCell>
                                            {mark.marksObtained} / {mark.totalMarks}
                                        </TableCell>
                                        <TableCell>
                                            {calculatePercentage(mark.marksObtained, mark.totalMarks)}%
                                        </TableCell>
                                        <TableCell>{formatDate(mark.date)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Today's Timetable and Notices */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Today&apos;s Classes ({today})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {todayClasses.length > 0 ? (
                                <div className="space-y-3">
                                    {todayClasses.map((cls: any) => (
                                        <div key={cls.id} className="flex justify-between items-start p-3 rounded-lg bg-muted">
                                            <div>
                                                <p className="font-medium">{cls.subject}</p>
                                                <p className="text-sm text-muted-foreground">{cls.teacher}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{cls.startTime} - {cls.endTime}</p>
                                                <p className="text-xs text-muted-foreground">{cls.room}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No classes today</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Notices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.notices.slice(0, 5).map((notice: any) => (
                                    <div key={notice.id} className="p-3 rounded-lg bg-muted">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-medium text-sm">{notice.title}</p>
                                            <span className={`text-xs px-2 py-1 rounded ${notice.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                                                    notice.priority === "medium" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                                                        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                }`}>
                                                {notice.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{notice.content.slice(0, 100)}...</p>
                                        <p className="text-xs text-muted-foreground mt-1">{formatDate(notice.date)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
