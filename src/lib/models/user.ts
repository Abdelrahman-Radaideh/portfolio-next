import z from "zod";

export const UserSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, "Name must be at least 2 characters long"),
    job_title: z.string().min(2, "Job title must be at least 2 characters long"),
    email: z.string().email("Invalid email"),
    hero_description: z.string().min(10, "Hero description must be at least 10 characters long"),
    about_description: z.string().min(10, "About description must be at least 10 characters long"),
    capabilities_description: z.string().min(10, "Capabilities description must be at least 10 characters long"),
    about_title: z.string().min(2, "About title must be at least 2 characters long"),
    linkedin_url: z.string().url("Invalid URL"),
    github_url: z.string().url("Invalid URL"),
    resume_url: z.string().url("Invalid URL"),
    picture_url: z.string().url().nullable().optional(),
    portfolio_name: z.string().min(2, "Portfolio name must be at least 2 characters long"),
    is_active: z.boolean().optional()
});
export type User = z.infer<typeof UserSchema>;

export const requestUserSchema = UserSchema
    .omit({ picture_url: true, is_active: true })
    .extend({
        picture: z.any()
            .transform((val) => {
                if (typeof window !== "undefined" && val instanceof window.FileList) {
                    return val.length > 0 ? val[0] : null;
                }
                return val;
            })
            .refine((file) => !file || (typeof window !== "undefined" ? file instanceof window.File : true), "Expected a file")
            .refine((file) => !file || file.size < 1024 * 1024 * 10, "Picture must be less than 10MB")
            .refine((file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Picture must be a JPEG, PNG, or WebP")
            .nullable()
    });

export type RequestUser = z.infer<typeof requestUserSchema>;