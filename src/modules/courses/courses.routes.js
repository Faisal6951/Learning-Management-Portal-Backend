const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/roleCheck");
const {
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
} = require("./courses.controller");
const validate = require("../../middleware/validate");
const {
  createCourseSchema,
  updateCourseSchema,
  assignTeacherSchema,
  outlineSchema,
  enrollStudentSchema,
} = require("./courses.validation");

/**
 * @swagger
 * /api/courses/admin:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get("/admin", authenticate, authorizeRoles("ADMIN"), getAllCourses);

/**
 * @swagger
 * /api/courses/admin/{id}:
 *   get:
 *     summary: Get a single course by ID
 *     tags: [Courses]
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
 *         description: Course found
 *       404:
 *         description: Course not found
 */
router.get("/admin/:id", authenticate, authorizeRoles("ADMIN"), getCourseById);

/**
 * @swagger
 * /api/courses/admin:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(createCourseSchema),
  createCourse,
);

/**
 * @swagger
 * /api/courses/admin/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put(
  "/admin/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(updateCourseSchema),
  updateCourse,
);

/**
 * @swagger
 * /api/courses/admin/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete(
  "/admin/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteCourse,
);

router.patch(
  "/admin/:id/reactivate",
  authenticate,
  authorizeRoles("ADMIN"),
  reactivateCourse,
);

/**
 * @swagger
 * /api/courses/admin/{id}/assign:
 *   post:
 *     summary: Assign a teacher to a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *             properties:
 *               teacherId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Teacher assigned successfully
 *       404:
 *         description: Course or teacher not found
 */
router.post(
  "/admin/:id/assign",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(assignTeacherSchema),
  assignTeacher,
);

/**
 * @swagger
 * /api/courses/admin/{id}/outline:
 *   post:
 *     summary: Add or update course outline
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Week 1 - Intro, Week 2 - Advanced
 *     responses:
 *       200:
 *         description: Outline saved successfully
 *       404:
 *         description: Course not found
 */
router.post(
  "/admin/:id/outline",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(outlineSchema),
  upsertOutline,
);

/**
 * @swagger
 * /api/courses/admin/{id}/enroll:
 *   post:
 *     summary: Enroll a student into a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *       409:
 *         description: Student already enrolled
 */
router.post(
  "/admin/:id/enroll",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(enrollStudentSchema),
  enrollStudent,
);

/**
 * @swagger
 * /api/courses/teacher:
 *   get:
 *     summary: Get teacher's assigned courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned courses
 */
router.get(
  "/teacher",
  authenticate,
  authorizeRoles("TEACHER"),
  getTeacherCourses,
);

/**
 * @swagger
 * /api/courses/student:
 *   get:
 *     summary: Get student's enrolled courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 */
router.get(
  "/student",
  authenticate,
  authorizeRoles("STUDENT"),
  getStudentCourses,
);

module.exports = router;
