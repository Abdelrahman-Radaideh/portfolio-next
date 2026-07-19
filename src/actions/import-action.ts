"use server";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { addUser } from "@/lib/services/user-service";
import { addProject } from "@/lib/services/project-service";
import { addSkill } from "@/lib/services/skills-service";
import { addExperience } from "@/lib/services/experience-service";
import { addCourse } from "@/lib/services/course-service";
import { addEducation } from "@/lib/services/education-service";
import { revalidatePath } from "next/cache";

export async function importDataAction(data: any) {
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
        if (!data.user || !data.projects || !data.skills || !data.experiences) {
            throw new Error("Invalid import data format.");
        }
        const newUserToInsert = {
            name: data.user.name,
            job_title: data.user.job_title,
            email: data.user.email,
            hero_description: data.user.hero_description,
            about_description: data.user.about_description,
            capabilities_description: data.user.capabilities_description,
            about_title: data.user.about_title,
            linkedin_url: data.user.linkedin_url,
            github_url: data.user.github_url,
            resume_url: data.user.resume_url,
            picture_url: data.user.picture_url,
            portfolio_name: data.user.portfolio_name,
            is_active: false
        };
        let newUserId: number;
        try {
            const newUser = await addUser(newUserToInsert);
            newUserId = newUser.id;
        } catch (error) {
            console.error("Error adding user:", error);
            throw new Error("Failed to add user.");
        }

        // 3. Prepare and add projects
        if (Array.isArray(data.projects)) {
            for (const proj of data.projects) {
                const newProj = {
                    user_id: newUserId,
                    title: proj.title,
                    client: proj.client,
                    role: proj.role,
                    year: proj.year,
                    status: proj.status,
                    sort_order: proj.sort_order,
                    description: proj.description,
                    github_url: proj.github_url,
                    technologies: proj.technologies,
                    images: proj.images,
                };
                try {
                    await addProject(newProj);
                } catch (error) {
                    console.error("Error adding project:", error);
                    throw new Error("Failed to add project.");
                }
            }
            const { reorderProjects } = await import("@/lib/services/project-service");
            await reorderProjects(newUserId);
        }

        // 4. Prepare and add skills
        if (Array.isArray(data.skills)) {
            for (const skill of data.skills) {
                const newSkill = {
                    user_id: newUserId,
                    name: skill.name,
                    type: skill.type,
                };
                try {
                    await addSkill(newSkill);
                } catch (error) {
                    console.error("Error adding skill:", error);
                    throw new Error("Failed to add skill.");
                }
            }
        }

        // 5. Prepare and add experiences
        if (Array.isArray(data.experiences)) {
            for (const exp of data.experiences) {
                const newExp = {
                    user_id: newUserId,
                    role: exp.role,
                    period: exp.period,
                    description: exp.description,
                    company: exp.company,
                };
                try {
                    await addExperience(newExp);
                } catch (error) {
                    console.error("Error adding experience:", error);
                    throw new Error("Failed to add experience.");
                }
            }
        }

        // 6. Prepare and add courses
        if (Array.isArray(data.courses)) {
            for (const course of data.courses) {
                const newCourse = {
                    user_id: newUserId,
                    title: course.title,
                    provider: course.provider,
                    credential_id: course.credential_id,
                    certificate_url: course.certificate_url,
                    description: course.description,
                    sort_order: course.sort_order,
                    year: course.year,
                    type: course.type,
                    hours: course.hours,
                };
                try {
                    await addCourse(newCourse);
                } catch (error) {
                    console.error("Error adding course:", error);
                    throw new Error("Failed to add course.");
                }
            }
        }

        // 7. Prepare and add education
        if (Array.isArray(data.education)) {
            for (const edu of data.education) {
                const newEdu = {
                    user_id: newUserId,
                    institution: edu.institution,
                    degree: edu.degree,
                    period: edu.period,
                    grade: edu.grade,
                    location: edu.location,
                    description: edu.description,
                    sort_order: edu.sort_order,
                };
                try {
                    await addEducation(newEdu);
                } catch (error) {
                    console.error("Error adding education:", error);
                    throw new Error("Failed to add education.");
                }
            }
        }

        revalidatePath("/");

        return { success: true, message: "Data imported successfully!" };
    } catch (error) {
        console.error("Error importing data:", error);
        throw new Error("Failed to import user data.");
    }
}

import { getActiveUser } from "@/lib/services/user-service";
import { getProjectsByUserId, getActiveProjects, getProjectById, reorderProjects } from "@/lib/services/project-service";
import { getExperiencesByUserId, getActiveExperiences, getExperienceById } from "@/lib/services/experience-service";
import { getCoursesByUserId, getActiveCourses, getCourseById, reorderCourses } from "@/lib/services/course-service";
import { getEducationByUserId, getActiveEducation, getEducationById, reorderEducation } from "@/lib/services/education-service";

export async function getItemsFromPortfolioAction(sourceUserId: number, entityType: 'courses' | 'projects' | 'education' | 'experience') {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) return [];
    
    const auth = await checkAuth(token);
    if (!auth) return [];

    try {
        if (entityType === 'courses') return await getCoursesByUserId(sourceUserId);
        if (entityType === 'projects') return await getProjectsByUserId(sourceUserId);
        if (entityType === 'education') return await getEducationByUserId(sourceUserId);
        if (entityType === 'experience') return await getExperiencesByUserId(sourceUserId);
        return [];
    } catch (e) {
        console.error("Error fetching items:", e);
        return [];
    }
}

export async function importEntityFromPortfolioAction(recordId: number, entityType: 'courses' | 'projects' | 'education' | 'experience') {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_code')?.value;
        if (!token) return { success: false, message: "Unauthorized", status: 401 };
        
        const auth = await checkAuth(token);
        if (!auth) return { success: false, message: "Unauthorized", status: 401 };

        const activeUserResult = await getActiveUser();
        if (!activeUserResult) {
            return { success: false, message: "No active user found." };
        }
        const activeUserId = activeUserResult.id;

        if (entityType === 'courses') {
            const res = await getCourseById(recordId);
            const course = res?.[0];
            if (!course) return { success: false, message: "Course not found." };
            const activeCourses = await getActiveCourses();
            const exists = activeCourses.some((ac: any) => ac.title === course.title);
            if (exists) return { success: false, message: `Course "${course.title}" already exists.` };
            const newCourse = { ...course, user_id: activeUserId };
            delete newCourse.id;
            delete newCourse.users; // remove join data if any
            await addCourse(newCourse);
            await reorderCourses(activeUserId);
        } else if (entityType === 'projects') {
            const res = await getProjectById(recordId);
            const proj = res?.[0];
            if (!proj) return { success: false, message: "Project not found." };
            const activeProjects = await getActiveProjects();
            const exists = activeProjects.some((ap: any) => ap.title === proj.title);
            if (exists) return { success: false, message: `Project "${proj.title}" already exists.` };
            const newProj = { ...proj, user_id: activeUserId };
            delete newProj.id;
            delete newProj.users;
            await addProject(newProj);
            await reorderProjects(activeUserId);
        } else if (entityType === 'education') {
            const res = await getEducationById(recordId);
            const edu = res?.[0];
            if (!edu) return { success: false, message: "Education not found." };
            const activeEdu = await getActiveEducation();
            const exists = activeEdu.some((ae: any) => ae.institution === edu.institution && ae.degree === edu.degree);
            if (exists) return { success: false, message: `Education "${edu.degree} at ${edu.institution}" already exists.` };
            const newEdu = { ...edu, user_id: activeUserId };
            delete newEdu.id;
            delete newEdu.users;
            await addEducation(newEdu);
            await reorderEducation(activeUserId);
        } else if (entityType === 'experience') {
            const res = await getExperienceById(recordId);
            const exp = res?.[0];
            if (!exp) return { success: false, message: "Experience not found." };
            const activeExp = await getActiveExperiences();
            const exists = activeExp.some((ae: any) => ae.company === exp.company && ae.role === exp.role);
            if (exists) return { success: false, message: `Experience "${exp.role} at ${exp.company}" already exists.` };
            const newExp = { ...exp, user_id: activeUserId };
            delete newExp.id;
            delete newExp.users;
            await addExperience(newExp);
        } else {
            return { success: false, message: "Invalid entity type for import." };
        }

        revalidatePath("/");
        return { success: true, message: `${entityType} imported successfully!` };
    } catch (error: any) {
        console.error("Error importing entity:", error);
        return { success: false, message: error.message || "Failed to import." };
    }
}
