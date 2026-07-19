import z from "zod";

export const CourseSchema = z.object({
    id: z.number().optional(),
    user_id: z.number().optional(),
    title: z.string().min(2, "Title must be at least 2 characters long"),
    provider: z.string().min(2, "Provider must be at least 2 characters long"),
    credential_id: z.string().optional().nullable(),
    certificate_url: z.union([z.literal(""), z.string().url("Invalid URL")]).optional().nullable(),
    description: z.string().optional().nullable(),
    sort_order: z.number().min(1, "Sort order must be at least 1").max(100, "Sort order must be at most 100").optional().default(1),
    year: z.coerce.number().min(1900, "Year is required"),
    type: z.enum(["course", "certificate"], { required_error: "Type is required" }),
    hours: z.coerce.number().min(1, "Hours must be at least 1"),
});

export type Course = z.infer<typeof CourseSchema>;
