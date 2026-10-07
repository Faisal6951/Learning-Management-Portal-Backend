const { z } = require("zod");

const markAttendanceSchema = z.object({
  courseId: z.number().int().positive("courseId must be a positive number"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "date must be a valid date (YYYY-MM-DD)",
  }),
  records: z
    .array(
      z.object({
        studentId: z
          .number()
          .int()
          .positive("studentId must be a positive number"),
        present: z.boolean({
          errorMap: () => ({ message: "present must be true or false" }),
        }),
      }),
    )
    .min(1, "At least one attendance record is required"),
});

module.exports = { markAttendanceSchema };
