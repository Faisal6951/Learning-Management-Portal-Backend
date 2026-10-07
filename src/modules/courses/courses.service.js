const prisma = require("../../config/db");
const AppError = require("../../utils/AppError");

// Get all courses
const getAllCourses = async () => {
  return await prisma.course.findMany({
    // where: {
    //   isActive: true,
    // },
    include: {
      teacher: {
        select: { id: true, name: true, email: true },
      },
      outline: true,
      _count: {
        select: { enrollments: true },
      },
    },
  });
};

// Get single course
const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id), isActive: true },
    include: {
      teacher: {
        select: { id: true, name: true, email: true },
      },
      outline: true,
      enrollments: {
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!course) throw new Error("COURSE_NOT_FOUND");
  return course;
};

// Create course
const createCourse = async ({
  name,
  description,
  startDate,
  endDate,
  teacherId,
}) => {
  // If teacherId provided, verify teacher exists
  if (teacherId) {
    const teacher = await prisma.user.findUnique({
      where: { id: parseInt(teacherId) },
    });
    if (!teacher || teacher.role !== "TEACHER") {
      throw new Error("TEACHER_NOT_FOUND");
    }
  }

  return await prisma.course.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      teacherId: teacherId ? parseInt(teacherId) : null,
    },
    include: {
      teacher: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// Update course
const updateCourse = async (id, { name, description, startDate, endDate }) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
  });
  if (!course) throw new Error("COURSE_NOT_FOUND");

  return await prisma.course.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    },
    include: {
      teacher: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// Delete course
const deleteCourse = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
  });
  if (!course) throw new AppError("Course not found", 404);
  if (!course.isActive)
    throw new AppError("Course is already deactivated", 400);

  await prisma.course.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
  });
  return { message: "Course deactivated successfully" };
};

// Assign teacher to course
const assignTeacher = async (courseId, teacherId) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(courseId) },
  });
  if (!course) throw new Error("COURSE_NOT_FOUND");

  const teacher = await prisma.user.findUnique({
    where: { id: parseInt(teacherId) },
  });
  if (!teacher || teacher.role !== "TEACHER") {
    throw new Error("TEACHER_NOT_FOUND");
  }

  return await prisma.course.update({
    where: { id: parseInt(courseId) },
    data: { teacherId: parseInt(teacherId) },
    include: {
      teacher: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// Add or update course outline
const upsertOutline = async (courseId, content) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(courseId) },
  });
  if (!course) throw new Error("COURSE_NOT_FOUND");

  return await prisma.courseOutline.upsert({
    where: { courseId: parseInt(courseId) },
    update: { content },
    create: { courseId: parseInt(courseId), content },
  });
};

// Enroll student into course
const enrollStudent = async (courseId, studentId) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(courseId) },
  });
  if (!course) throw new Error("COURSE_NOT_FOUND");
  if (!course.isActive) throw new Error("Course is deactivated");

  const student = await prisma.user.findUnique({
    where: { id: parseInt(studentId) },
  });
  if (!student || student.role !== "STUDENT") {
    throw new Error("STUDENT_NOT_FOUND");
  }

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: parseInt(studentId),
        courseId: parseInt(courseId),
      },
    },
  });
  if (existing) throw new Error("ALREADY_ENROLLED");

  return await prisma.enrollment.create({
    data: {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
    },
  });
};

// Get teacher's courses
const getTeacherCourses = async (teacherId) => {
  return await prisma.course.findMany({
    where: { teacherId: parseInt(teacherId), isActive: true },
    include: {
      outline: true,
      _count: { select: { enrollments: true } },
    },
  });
};

// Get student's enrolled courses
const getStudentCourses = async (studentId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: parseInt(studentId) },
    include: {
      course: {
        include: {
          teacher: {
            select: { id: true, name: true, email: true },
          },
          outline: true,
        },
      },
    },
  });

  // Filter inactive courses after fetching
  return enrollments
    .filter((e) => e.course && e.course.isActive === true)
    .map((e) => e.course);
};

const reactivateCourse = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
  });
  if (!course) throw new AppError("Course not found", 404);
  if (course.isActive) throw new AppError("Course is already activate", 400);

  await prisma.course.update({
    where: { id: parseInt(id) },
    data: { isActive: true },
  });

  return { message: `${course.name} has been reactivated successfully` };
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTeacher,
  upsertOutline,
  enrollStudent,
  getTeacherCourses,
  getStudentCourses,
  reactivateCourse,
};
