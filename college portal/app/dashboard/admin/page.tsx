"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface AdminData {
    students: any[];
    teachers: any[];
    subjects: any[];
    fees: any[];
    stats: any;
}

export default function AdminDashboard() {
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

    // Form states for adding student
    const [studentName, setStudentName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentPassword, setStudentPassword] = useState("");
    const [studentEnrollment, setStudentEnrollment] = useState("");
    const [studentDepartment, setStudentDepartment] = useState("Computer Science");
    const [studentSemester, setStudentSemester] = useState("1");
    const [studentPhone, setStudentPhone] = useState("");

    // Form states for adding teacher
    const [teacherName, setTeacherName] = useState("");
    const [teacherEmail, setTeacherEmail] = useState("");
    const [teacherPassword, setTeacherPassword] = useState("");
    const [teacherEmployeeId, setTeacherEmployeeId] = useState("");
    const [teacherDepartment, setTeacherDepartment] = useState("Computer Science");
    const [teacherDesignation, setTeacherDesignation] = useState("Professor");
    const [teacherPhone, setTeacherPhone] = useState("");

    // Form states for adding subject
    const [subjectCode, setSubjectCode] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [subjectDepartment, setSubjectDepartment] = useState("Computer Science");
    const [subjectSemester, setSubjectSemester] = useState("1");
    const [subjectCredits, setSubjectCredits] = useState("3");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/admin");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async () => {
        try {
            await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "add_student",
                    data: {
                        name: studentName,
                        email: studentEmail,
                        password: studentPassword,
                        enrollmentNo: studentEnrollment,
                        department: studentDepartment,
                        semester: parseInt(studentSemester),
                        year: Math.floor(parseInt(studentSemester) / 2) + 1,
                        phone: studentPhone,
                        dateOfBirth: "2000-01-01",
                        address: "Address",
                    },
                }),
            });
            setShowAddStudentModal(false);
            fetchData();
            alert("Student added successfully!");
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student");
        }
    };

    const handleAddTeacher = async () => {
        try {
            await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "add_teacher",
                    data: {
                        name: teacherName,
                        email: teacherEmail,
                        password: teacherPassword,
                        employeeId: teacherEmployeeId,
                        department: teacherDepartment,
                        designation: teacherDesignation,
                        phone: teacherPhone,
                        subjects: [],
                    },
                }),
            });
            setShowAddTeacherModal(false);
            fetchData();
            alert("Teacher added successfully!");
        } catch (error) {
            console.error("Error adding teacher:", error);
            alert("Failed to add teacher");
        }
    };

    const handleAddSubject = async () => {
        try {
            await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "add_subject",
                    data: {
                        code: subjectCode,
                        name: subjectName,
                        department: subjectDepartment,
                        semester: parseInt(subjectSemester),
                        credits: parseInt(subjectCredits),
                    },
                }),
            });
            setShowAddSubjectModal(false);
            fetchData();
            alert("Subject added successfully!");
        } catch (error) {
            console.error("Error adding subject:", error);
            alert("Failed to add subject");
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "delete_student",
                    data: { id },
                }),
            });
            fetchData();
            alert("Student deleted successfully!");
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student");
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="admin" userName="Loading..." userEmail="">
                <div className="flex items-center justify-center h-full">
                    <div className="text-lg">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout role="admin" userName="Error" userEmail="">
                <div className="text-red-600">Failed to load data</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin" userName="Admin" userEmail="admin@college.edu">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your college portal</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.stats.totalStudents}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Teachers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.stats.totalTeachers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Subjects
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.stats.totalSubjects}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending Fees
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">
                                {data.stats.pendingFees}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Student Management */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Management</CardTitle>
                        <Button onClick={() => setShowAddStudentModal(true)} size="sm">
                            + Add Student
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Enrollment No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.students.slice(0, 10).map((student: any) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.enrollmentNo}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.department}</TableCell>
                                        <TableCell>{student.semester}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDeleteStudent(student.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Teacher Management */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Teacher Management</CardTitle>
                        <Button onClick={() => setShowAddTeacherModal(true)} size="sm">
                            + Add Teacher
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Designation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.teachers.map((teacher: any) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-medium">{teacher.employeeId}</TableCell>
                                        <TableCell>{teacher.name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.department}</TableCell>
                                        <TableCell>{teacher.designation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Subject Management */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Subject Management</CardTitle>
                        <Button onClick={() => setShowAddSubjectModal(true)} size="sm">
                            + Add Subject
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Credits</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.subjects.map((subject: any) => (
                                    <TableRow key={subject.id}>
                                        <TableCell className="font-medium">{subject.code}</TableCell>
                                        <TableCell>{subject.name}</TableCell>
                                        <TableCell>{subject.department}</TableCell>
                                        <TableCell>{subject.semester}</TableCell>
                                        <TableCell>{subject.credits}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Add Student Modal */}
            <Modal
                isOpen={showAddStudentModal}
                onClose={() => setShowAddStudentModal(false)}
                title="Add New Student"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowAddStudentModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddStudent}>Add Student</Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Enrollment No</label>
                        <Input value={studentEnrollment} onChange={(e) => setStudentEnrollment(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Department</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={studentDepartment}
                            onChange={(e) => setStudentDepartment(e.target.value)}
                        >
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                            <option>Civil</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Semester</label>
                        <Input type="number" value={studentSemester} onChange={(e) => setStudentSemester(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} />
                    </div>
                </div>
            </Modal>

            {/* Add Teacher Modal */}
            <Modal
                isOpen={showAddTeacherModal}
                onClose={() => setShowAddTeacherModal(false)}
                title="Add New Teacher"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowAddTeacherModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddTeacher}>Add Teacher</Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Employee ID</label>
                        <Input value={teacherEmployeeId} onChange={(e) => setTeacherEmployeeId(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Department</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={teacherDepartment}
                            onChange={(e) => setTeacherDepartment(e.target.value)}
                        >
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                            <option>Civil</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Designation</label>
                        <Input value={teacherDesignation} onChange={(e) => setTeacherDesignation(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} />
                    </div>
                </div>
            </Modal>

            {/* Add Subject Modal */}
            <Modal
                isOpen={showAddSubjectModal}
                onClose={() => setShowAddSubjectModal(false)}
                title="Add New Subject"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowAddSubjectModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddSubject}>Add Subject</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Subject Code</label>
                        <Input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="e.g., CS101" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Subject Name</label>
                        <Input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g., Data Structures" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Department</label>
                        <select
                            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                            value={subjectDepartment}
                            onChange={(e) => setSubjectDepartment(e.target.value)}
                        >
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                            <option>Civil</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Semester</label>
                        <Input type="number" value={subjectSemester} onChange={(e) => setSubjectSemester(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Credits</label>
                        <Input type="number" value={subjectCredits} onChange={(e) => setSubjectCredits(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
