"use server";
import { getActiveEducation, getEducation, addEducation, updateEducation, deleteEducation, getEducationById, updateEducationOrder, reorderEducation, bulkUpdateEducationOrders } from "@/lib/services/education-service";
import { Education } from "@/lib/models/education";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export const getActiveEducationAction = async () => {
    try {
        return await getActiveEducation();
    } catch (error) {
        console.error("Error fetching active education:", error);
        return [];
    }
}
export const getEducationAction = async () => {
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
        return await getEducation();
    } catch (error) {
        console.error("Error fetching education:", error);
        throw error;
    }
}
export const addEducationAction = async (education: Education) => {
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
        const result = await addEducation(education);
        if (education.user_id) {
            await reorderEducation(education.user_id);
        }
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error adding education:", error);
        throw error;
    }
}
export const updateEducationAction = async (education: Education) => {
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
        const result = await updateEducation(education);
        if (education.user_id) {
            await reorderEducation(education.user_id);
        }
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error updating education:", error);
        throw error;
    }
}
export const deleteEducationAction = async (id: number) => {
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
        const eduOrArray = await getEducationById(id);
        const eduObj = Array.isArray(eduOrArray) ? eduOrArray[0] : eduOrArray;
        const userId = eduObj?.user_id;

        const result = await deleteEducation(id);
        if (userId) {
            await reorderEducation(userId);
        }
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error deleting education:", error);
        throw error;
    }
}
export const getEducationByIdAction = async (id: number) => {
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
        return await getEducationById(id);
    } catch (error) {
        console.error("Error fetching education by id:", error);
        throw error;
    }
}
export const updateEducationOrderAction = async (id: number, order: number) => {
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
        const result = await updateEducationOrder(id, order);
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error updating education order:", error);
        throw error;
    }
}

export async function bulkUpdateEducationOrdersAction(updates: { id: number; sort_order: number }[]) {
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
        await bulkUpdateEducationOrders(updates);
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error bulk updating education orders:", error);
        throw error;
    }
}
