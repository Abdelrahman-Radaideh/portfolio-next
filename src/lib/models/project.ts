import z from "zod";

export const ProjectSchema = z.object({
    id: z.number().optional().nullable(),
    user_id: z.number(),
    title: z.string().min(2, "Title must be at least 2 characters long"),
    client: z.string().min(2, "Client must be at least 2 characters long"),
    role: z.string().min(2, "Role must be at least 2 characters long"),
    year: z.number().min(1000, "Year must be a valid 4-digit number").max(9999, "Year must be a valid 4-digit number"),
    status: z.string().min(2, "Status must be at least 2 characters long"),
    sort_order: z.number().min(1, "Sort order must be at least 1").max(100, "Sort order must be at most 100"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    github_url: z.union([z.literal(""), z.string().url("Invalid URL")]).optional().nullable(),
    live_url: z.union([z.literal(""), z.string().url("Invalid URL")]).optional().nullable(),
    technologies: z.string().min(2, "Please provide at least one technology"),
    images: z.array(z.string().url()).max(5, "Maximum 5 images allowed").optional().nullable()
});
export type Project = z.infer<typeof ProjectSchema>;

export const RequestProjectSchema = ProjectSchema.extend({
    user_id: z.number().optional(),
    new_images: z
        .array(
            z.instanceof(File)
                .refine((file) => file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
                .refine(
                    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                    "Only .jpg, .jpeg, .png and .webp formats are supported."
                )
        )
        .optional()
});
export type RequestProject = z.infer<typeof RequestProjectSchema>;