"use server";
import { getActiveExperiences, getExperiences, addExperience, updateExperience, deleteExperience, getExperienceById } from "@/lib/services/experience-service";
import { Experience, ExperienceSchema } from "@/lib/models/experience";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export const getActiveExperiencesAction = async () => {
    try {
        return await getActiveExperiences();
    } catch (error) {
        console.error("Error fetching active experiences:", error);
        return [];
    }
}
export const getExperiencesAction = async () => {
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
        return await getExperiences();
    } catch (error) {
        console.error("Error fetching experiences:", error);
        throw error;
    }
}
export const addExperienceAction = async (experience: Experience) => {
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
        const result = await addExperience(experience);
        return result;
    } catch (error) {
        console.error("Error adding experience:", error);
        throw error;
    }
}
export const updateExperienceAction = async (experience: Experience) => {
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
        const result = await updateExperience(experience);
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error updating experience:", error);
        throw error;
    }
}
export const deleteExperienceAction = async (id: number) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    try {
        const result = await deleteExperience(id);
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error deleting experience:", error);
        throw error;
    }
}
export const getExperienceByIdAction = async (id: number) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    try {
        return await getExperienceById(id);
    } catch (error) {
        console.error("Error fetching experience by id:", error);
        throw error;
    }
}
