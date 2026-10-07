const asyncHandler = require("../../utils/asyncHandler");
const coursesService = require("./courses.service");

const getAllCourses = async (req, res) => {
  try {
    const courses = await coursesService.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await coursesService.getCourseById(req.params.id);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    if (error.message === "COURSE_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, description, startDate, endDate, teacherId } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Name, startDate and endDate are required",
      });
    }

    const course = await coursesService.createCourse({
      name,
      description,
      startDate,
      endDate,
      teacherId,
    });
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    if (error.message === "TEACHER_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await coursesService.updateCourse(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    if (error.message === "COURSE_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteCourse = asyncHandler(async (req, res) => {
  const result = await coursesService.deleteCourse(req.params.id);
  res.status(200).json({ success: true, message: result.message });
});

const assignTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) {
      return res
        .status(400)
        .json({ success: false, message: "teacherId is required" });
    }
    const course = await coursesService.assignTeacher(req.params.id, teacherId);
    res.status(200).json({
      success: true,
      message: "Teacher assigned successfully",
      data: course,
    });
  } catch (error) {
    if (error.message === "COURSE_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (error.message === "TEACHER_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const upsertOutline = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }
    const outline = await coursesService.upsertOutline(req.params.id, content);
    res.status(200).json({
      success: true,
      message: "Outline saved successfully",
      data: outline,
    });
  } catch (error) {
    if (error.message === "COURSE_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "studentId is required" });
    }
    const enrollment = await coursesService.enrollStudent(
      req.params.id,
      studentId,
    );
    res.status(201).json({
      success: true,
      message: "Student enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    if (error.message === "COURSE_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (error.message === "STUDENT_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    if (error.message === "ALREADY_ENROLLED") {
      return res.status(409).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const courses = await coursesService.getTeacherCourses(req.user.userId);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const courses = await coursesService.getStudentCourses(req.user.userId);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const reactivateCourse = asyncHandler(async (req, res) => {
  try {
    const course = await coursesService.reactivateCourse(req.user.userId);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

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
