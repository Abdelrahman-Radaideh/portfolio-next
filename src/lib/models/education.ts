import z from "zod";

export const EducationSchema = z.object({
    id: z.number().optional(),
    user_id: z.number().optional(),
    institution: z.string().min(2, "Institution must be at least 2 characters long"),
    degree: z.string().optional().nullable(),
    period: z.string().optional().nullable(),
    grade: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    sort_order: z.number().min(1, "Sort order must be at least 1").max(100, "Sort order must be at most 100").optional().default(1),
});

export type Education = z.infer<typeof EducationSchema>;
