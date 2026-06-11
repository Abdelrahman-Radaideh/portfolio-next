"use server";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { getActiveUserAction } from "./user-action";
import { getActiveProjectsAction } from "./project-action";
import { getActiveSkillsAction } from "./skill-action";
import { getActiveExperiencesAction } from "./experience-action";

export async function getExportDataAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_code')?.value;
        if (!token) {
            return { success: false, message: "Unauthorized", status: 401 };
        }
        const auth = await checkAuth(token);
        if (!auth) {
            return { success: false, message: "Unauthorized", status: 401 };
        }
        const [activeUser, activeProjects, activeSkills, activeExperiences] = await Promise.all([
            getActiveUserAction(),
            getActiveProjectsAction(),
            getActiveSkillsAction(),
            getActiveExperiencesAction(),
        ]);


        return {
            user: activeUser,
            projects: activeProjects,
            skills: activeSkills,
            experiences: activeExperiences,
            exportedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error generating export data:", error);
        throw new Error("Failed to export complete user data.");
    }
}
