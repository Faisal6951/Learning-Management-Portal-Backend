const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/roleCheck");
const {
  markAttendance,
  getCourseAttendance,
  getStudentCourseAttendance,
  getStudentAllAttendance,
} = require("./attendance.controller");
const validate = require("../../middleware/validate");
const { markAttendanceSchema } = require("./attendance.validation");

/**
 * @swagger
 * /api/attendance/teacher:
 *   post:
 *     summary: Mark attendance for a course session
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkAttendanceRequest'
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       403:
 *         description: Course not assigned to this teacher
 */
router.post(
  "/teacher",
  authenticate,
  authorizeRoles("TEACHER"),
  validate(markAttendanceSchema),
  markAttendance,
);

/**
 * @swagger
 * /api/attendance/teacher/course/{id}:
 *   get:
 *     summary: View full attendance report for a course
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance report with percentages
 *       403:
 *         description: Course not assigned to this teacher
 */
router.get(
  "/teacher/course/:id",
  authenticate,
  authorizeRoles("TEACHER"),
  getCourseAttendance,
);

/**
 * @swagger
 * /api/attendance/student:
 *   get:
 *     summary: Student views attendance across all courses
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance summary for all enrolled courses
 */
router.get(
  "/student",
  authenticate,
  authorizeRoles("STUDENT"),
  getStudentAllAttendance,
);

/**
 * @swagger
 * /api/attendance/student/course/{id}:
 *   get:
 *     summary: Student views attendance for one course
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance record for that course
 *       403:
 *         description: Not enrolled in this course
 */
router.get(
  "/student/course/:id",
  authenticate,
  authorizeRoles("STUDENT"),
  getStudentCourseAttendance,
);

module.exports = router;
