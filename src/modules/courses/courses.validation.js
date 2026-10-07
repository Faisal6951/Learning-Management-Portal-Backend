const { z } = require("zod");

const createCourseSchema = z
  .object({
    name: z
      .string()
      .min(3, "Course name must be at least 3 characters")
      .max(100, "Course name cannot exceed 100 characters"),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "startDate must be a valid date (YYYY-MM-DD)",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "endDate must be a valid date (YYYY-MM-DD)",
    }),
    teacherId: z.number().int().positive().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

const updateCourseSchema = z.object({
  name: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name cannot exceed 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "startDate must be a valid date",
    })
    .optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "endDate must be a valid date",
    })
    .optional(),
});

const assignTeacherSchema = z.object({
  teacherId: z.number().int().positive("teacherId must be a positive number"),
});

const outlineSchema = z.object({
  content: z.string().min(10, "Outline content must be at least 10 characters"),
});

const enrollStudentSchema = z.object({
  studentId: z.number().int().positive("studentId must be a positive number"),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  assignTeacherSchema,
  outlineSchema,
  enrollStudentSchema,
};
