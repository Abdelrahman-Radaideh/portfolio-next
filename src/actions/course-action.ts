"use server";
import { getActiveCourses, getCourses, addCourse, updateCourse, deleteCourse, getCourseById, updateCourseOrder, reorderCourses, bulkUpdateCourseOrders } from "@/lib/services/course-service";
import { Course } from "@/lib/models/course";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export const getActiveCoursesAction = async () => {
    try {
        return await getActiveCourses();
    } catch (error) {
        console.error("Error fetching active courses:", error);
        return [];
    }
}
export const getCoursesAction = async () => {
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
        return await getCourses();
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}
export const addCourseAction = async (course: Course) => {
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
        const result = await addCourse(course);
        if (course.user_id) {
            await reorderCourses(course.user_id);
        }
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error adding course:", error);
        throw error;
    }
}
export const updateCourseAction = async (course: Course) => {
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
        const result = await updateCourse(course);
        if (course.user_id) {
            await reorderCourses(course.user_id);
        }
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
}
export const deleteCourseAction = async (id: number) => {
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
        const courseOrArray = await getCourseById(id);
        const courseObj = Array.isArray(courseOrArray) ? courseOrArray[0] : courseOrArray;
        const userId = courseObj?.user_id;

        const result = await deleteCourse(id);
        if (userId) {
            await reorderCourses(userId);
        }
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
}
export const getCourseByIdAction = async (id: number) => {
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
        return await getCourseById(id);
    } catch (error) {
        console.error("Error fetching course by id:", error);
        throw error;
    }
}
export const updateCourseOrderAction = async (id: number, order: number) => {
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
        const result = await updateCourseOrder(id, order);
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error updating course order:", error);
        throw error;
    }
}

export async function bulkUpdateCourseOrdersAction(updates: { id: number; sort_order: number }[]) {
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
        await bulkUpdateCourseOrders(updates);
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error bulk updating course orders:", error);
        throw error;
    }
}
