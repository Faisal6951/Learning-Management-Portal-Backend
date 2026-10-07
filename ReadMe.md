# LMP Backend API Routes

Base URL: http://localhost:5000

Common rules:
- All protected routes require the Authorization header:
  - Authorization: Bearer <jwt_token>
- For JSON requests, send:
  - Content-Type: application/json
- If a route is marked as ADMIN, TEACHER, or STUDENT, the logged-in user must have that role.

---

## 1) Health and Docs

### GET /
- Purpose: Health check for the backend.
- Requires: Nothing.
- Body: None.
- Headers: None.
- Response: Confirms the server is running.

### GET /api/docs
- Purpose: Swagger UI for viewing and testing the API.
- Requires: Nothing.
- Body: None.
- Headers: None.
- Response: Swagger API documentation page.

---

## 2) Authentication

### POST /api/auth/login
- Purpose: Login with email and password.
- Requires: Email and password.
- Body:
  {
    "email": "user@example.com",
    "password": "123456"
  }
- Headers:
  - Content-Type: application/json
- Response: Returns success message and JWT token for authenticated APIs.

---

## 3) Admin User Routes

All of these routes require:
- Authorization: Bearer <admin_token>
- Role: ADMIN

### GET /api/admin/users
- Purpose: Get all users.
- Requires: Admin token.
- Body: None.
- Headers: Authorization
- Response: List of all users.

### GET /api/admin/users/:id
- Purpose: Get one user by ID.
- Requires: Admin token and user ID in URL.
- Body: None.
- Headers: Authorization
- Response: User details for that ID.

### POST /api/admin/users
- Purpose: Create a new user.
- Requires: Admin token.
- Body:
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "role": "TEACHER"
  }
- Headers: Authorization, Content-Type
- Response: Created user data.
- Note: role must be either TEACHER or STUDENT.

### PUT /api/admin/users/:id
- Purpose: Update user details.
- Requires: Admin token and user ID in URL.
- Body (at least one field):
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
- Headers: Authorization, Content-Type
- Response: Updated user data.

### DELETE /api/admin/users/:id
- Purpose: Delete a user.
- Requires: Admin token and user ID in URL.
- Body: None.
- Headers: Authorization
- Response: Delete confirmation or success message.

### PATCH /api/admin/users/:id/reactivate
- Purpose: Reactivate a user account.
- Requires: Admin token and user ID in URL.
- Body: None.
- Headers: Authorization
- Response: Reactivation success result.

### PATCH /api/admin/users/:id/reset-password
- Purpose: Reset a user's password.
- Requires: Admin token and user ID in URL.
- Body:
  {
    "newPassword": "newStrongPassword123"
  }
- Headers: Authorization, Content-Type
- Response: Password reset result.

---

## 4) Course Routes

### Admin Course Routes

All admin course routes require:
- Authorization: Bearer <admin_token>
- Role: ADMIN

### GET /api/courses/admin
- Purpose: Get all courses.
- Requires: Admin token.
- Body: None.
- Headers: Authorization
- Response: List of all courses.

### GET /api/courses/admin/:id
- Purpose: Get one course by ID.
- Requires: Admin token and course ID in URL.
- Body: None.
- Headers: Authorization
- Response: Course details.

### POST /api/courses/admin
- Purpose: Create a new course.
- Requires: Admin token.
- Body:
  {
    "name": "Math 101",
    "description": "Basic mathematics",
    "startDate": "2026-01-01",
    "endDate": "2026-05-30",
    "teacherId": 2
  }
- Headers: Authorization, Content-Type
- Response: Created course data.

### PUT /api/courses/admin/:id
- Purpose: Update a course.
- Requires: Admin token and course ID in URL.
- Body (optional fields):
  {
    "name": "Updated Course Name",
    "description": "Updated description",
    "startDate": "2026-01-10",
    "endDate": "2026-06-05"
  }
- Headers: Authorization, Content-Type
- Response: Updated course data.

### DELETE /api/courses/admin/:id
- Purpose: Delete a course.
- Requires: Admin token and course ID in URL.
- Body: None.
- Headers: Authorization
- Response: Delete success message.

### PATCH /api/courses/admin/:id/reactivate
- Purpose: Reactivate a soft-deleted course.
- Requires: Admin token and course ID in URL.
- Body: None.
- Headers: Authorization
- Response: Reactivation success result.

### POST /api/courses/admin/:id/assign
- Purpose: Assign a teacher to a course.
- Requires: Admin token and course ID in URL.
- Body:
  {
    "teacherId": 2
  }
- Headers: Authorization, Content-Type
- Response: Assignment success result.

### POST /api/courses/admin/:id/outline
- Purpose: Add or update the course outline.
- Requires: Admin token and course ID in URL.
- Body:
  {
    "content": "Week 1 - Intro; Week 2 - Modules; Week 3 - Assessment"
  }
- Headers: Authorization, Content-Type
- Response: Saved outline.

### POST /api/courses/admin/:id/enroll
- Purpose: Enroll a student into a course.
- Requires: Admin token and course ID in URL.
- Body:
  {
    "studentId": 3
  }
- Headers: Authorization, Content-Type
- Response: Enrollment success result.

### Teacher Course Route

### GET /api/courses/teacher
- Purpose: Get all courses assigned to the logged-in teacher.
- Requires:
  - Authorization: Bearer <teacher_token>
  - Role: TEACHER
- Body: None.
- Headers: Authorization
- Response: Teacher's assigned courses.

### Student Course Route

### GET /api/courses/student
- Purpose: Get all courses in which the logged-in student is enrolled.
- Requires:
  - Authorization: Bearer <student_token>
  - Role: STUDENT
- Body: None.
- Headers: Authorization
- Response: Student's enrolled courses.

---

## 5) Attendance Routes

### POST /api/attendance/teacher
- Purpose: Mark attendance for a course session.
- Requires:
  - Authorization: Bearer <teacher_token>
  - Role: TEACHER
- Body:
  {
    "courseId": 1,
    "date": "2026-08-19",
    "records": [
      { "studentId": 3, "present": true },
      { "studentId": 4, "present": false }
    ]
  }
- Headers: Authorization, Content-Type
- Response: Attendance marked successfully.

### GET /api/attendance/teacher/course/:id
- Purpose: View attendance report for one course as a teacher.
- Requires:
  - Authorization: Bearer <teacher_token>
  - Role: TEACHER
- Body: None.
- Headers: Authorization
- Response: Full course attendance summary and percentages.

### GET /api/attendance/student
- Purpose: View attendance summary across all courses for the logged-in student.
- Requires:
  - Authorization: Bearer <student_token>
  - Role: STUDENT
- Body: None.
- Headers: Authorization
- Response: Attendance summary for all enrolled courses.

### GET /api/attendance/student/course/:id
- Purpose: View attendance details for one course for the logged-in student.
- Requires:
  - Authorization: Bearer <student_token>
  - Role: STUDENT
- Body: None.
- Headers: Authorization
- Response: Attendance details for that specific course.

---

## Quick Example

Example authenticated request:

```http
GET /api/courses/student
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

Example login request:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

This file is a simple reference for what each route does and what data you need to send in headers/body.
