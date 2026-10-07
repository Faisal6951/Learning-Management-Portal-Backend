const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Management Portal API",
      version: "1.0.0",
      description: "Complete REST API documentation for the LMP backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Auth
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@lmp.com" },
            password: { type: "string", example: "admin123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    email: { type: "string" },
                    role: {
                      type: "string",
                      enum: ["ADMIN", "TEACHER", "STUDENT"],
                    },
                  },
                },
              },
            },
          },
        },
        // User
        CreateUserRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", example: "John Teacher" },
            email: { type: "string", example: "john@lmp.com" },
            password: { type: "string", example: "teacher123" },
            role: { type: "string", enum: ["TEACHER", "STUDENT"] },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // Course
        CreateCourseRequest: {
          type: "object",
          required: ["name", "startDate", "endDate"],
          properties: {
            name: { type: "string", example: "Web Development Bootcamp" },
            description: { type: "string", example: "Learn HTML, CSS, JS" },
            startDate: { type: "string", example: "2026-09-01" },
            endDate: { type: "string", example: "2026-12-01" },
            teacherId: { type: "integer", example: 2 },
          },
        },
        // Attendance
        MarkAttendanceRequest: {
          type: "object",
          required: ["courseId", "date", "records"],
          properties: {
            courseId: { type: "integer", example: 1 },
            date: { type: "string", example: "2026-08-19" },
            records: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  studentId: { type: "integer", example: 3 },
                  present: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        // Error
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message here" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.js"],
};

module.exports = swaggerJsdoc(options);
