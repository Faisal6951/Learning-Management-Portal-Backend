const prisma = require("../../config/db");

// Teacher marks attendance
const markAttendance = async (teacherId, { courseId, date, records }) => {
  // Verify course belongs to this teacher
  const course = await prisma.course.findUnique({
    where: { id: parseInt(courseId) },
  });

  if (!course) throw new Error("COURSE_NOT_FOUND");
  if (course.teacherId !== parseInt(teacherId)) {
    throw new Error("UNAUTHORIZED_COURSE");
  }

  // records = [{ studentId: 1, present: true }, ...]
  const attendanceData = records.map((record) => ({
    courseId: parseInt(courseId),
    studentId: parseInt(record.studentId),
    date: new Date(date),
    present: record.present,
  }));

  // Create all attendance records at once
  await prisma.attendance.createMany({
    data: attendanceData,
    skipDuplicates: true,
  });

  return { message: "Attendance marked successfully", total: records.length };
};

// Teacher views full attendance for their course
const getCourseAttendance = async (teacherId, courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(courseId) },
  });

  if (!course) throw new Error("COURSE_NOT_FOUND");
  if (course.teacherId !== parseInt(teacherId)) {
    throw new Error("UNAUTHORIZED_COURSE");
  }

  // Get all enrolled students
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: parseInt(courseId) },
    include: {
      student: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Get all attendance records for this course
  const attendanceRecords = await prisma.attendance.findMany({
    where: { courseId: parseInt(courseId) },
    orderBy: { date: "asc" },
  });

  // Count unique session dates
  const uniqueDates = [
    ...new Set(
      attendanceRecords.map((r) => r.date.toISOString().split("T")[0]),
    ),
  ];
  const totalSessions = uniqueDates.length;

  // Calculate per student using THEIR OWN records only
  const report = enrollments.map((enrollment) => {
    const studentRecords = attendanceRecords.filter(
      (r) => r.studentId === enrollment.student.id,
    );

    // Count only THIS student's present records
    const presentCount = studentRecords.filter((r) => r.present).length;
    const absentCount = studentRecords.filter((r) => !r.present).length;

    const percentage =
      studentRecords.length > 0
        ? Math.round((presentCount / studentRecords.length) * 100)
        : 0;

    return {
      student: enrollment.student,
      totalSessions: studentRecords.length,
      present: presentCount,
      absent: absentCount,
      percentage,
      lowAttendance: percentage < 70,
    };
  });

  return { course: course.name, report };
};

// Student views their own attendance for one course
const getStudentCourseAttendance = async (studentId, courseId) => {
  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: parseInt(studentId),
        courseId: parseInt(courseId),
      },
    },
  });

  if (!enrollment) throw new Error("NOT_ENROLLED");

  const records = await prisma.attendance.findMany({
    where: {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
    },
    orderBy: { date: "asc" },
  });

  const totalSessions = records.length;
  const presentCount = records.filter((r) => r.present).length;
  const percentage =
    totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  return {
    courseId: parseInt(courseId),
    totalSessions,
    present: presentCount,
    absent: totalSessions - presentCount,
    percentage,
    lowAttendance: percentage < 70,
    records,
  };
};

// Student views attendance across all their courses
const getStudentAllAttendance = async (studentId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: parseInt(studentId) },
    include: { course: true },
  });

  const summary = await Promise.all(
    enrollments.map(async (enrollment) => {
      const records = await prisma.attendance.findMany({
        where: {
          studentId: parseInt(studentId),
          courseId: enrollment.courseId,
        },
      });

      const totalSessions = records.length;
      const presentCount = records.filter((r) => r.present).length;
      const percentage =
        totalSessions > 0
          ? Math.round((presentCount / totalSessions) * 100)
          : 0;

      return {
        course: {
          id: enrollment.course.id,
          name: enrollment.course.name,
        },
        totalSessions,
        present: presentCount,
        absent: totalSessions - presentCount,
        percentage,
        lowAttendance: percentage < 70,
      };
    }),
  );

  return summary;
};

module.exports = {
  markAttendance,
  getCourseAttendance,
  getStudentCourseAttendance,
  getStudentAllAttendance,
};
