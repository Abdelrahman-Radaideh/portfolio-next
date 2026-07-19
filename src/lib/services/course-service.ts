import { Course } from "../models/course";
import sql from "@/lib/database-conection";
import { updateTag, cacheLife, cacheTag } from "next/cache";

export const getActiveCourses = async () => {
    "use cache";
    cacheTag("courses");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("courses").select("*,users!inner(is_active)").eq("users.is_active", true).order('sort_order', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching active courses:", error);
        return [];
    }
}

export const getCourses = async () => {
    "use cache";
    cacheTag("courses");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("courses").select("*").order('sort_order', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

export const addCourse = async (course: Course) => {
    try {
        const { data, error } = await sql.from("courses").insert(course);
        if (error) {
            throw error;
        }
        updateTag("courses");
        return data;
    }
    catch (error) {
        console.error("Error adding course:", error);
        return [];
    }
}

export const updateCourse = async (course: Course) => {
    try {
        const { data, error } = await sql.from("courses").update(course).eq("id", course.id);
        if (error) {
            throw error;
        }
        updateTag("courses");
        return data;
    }
    catch (error) {
        console.error("Error updating course:", error);
        return [];
    }
}

export const deleteCourse = async (id: number) => {
    try {
        const { data, error } = await sql.from("courses").delete().eq("id", id);
        if (error) {
            throw error;
        }
        updateTag("courses");
        return data;
    }
    catch (error) {
        console.error("Error deleting course:", error);
        return [];
    }
}

export const getCourseById = async (id: number) => {
    "use cache";
    cacheTag("courses");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("courses").select("*").eq("id", id).single();
        if (error) {
            throw error;
        }
        return data ? [data] : [];
    }
    catch (error) {
        console.error("Error fetching course by id:", error);
        return [];
    }
}

export const updateCourseOrder = async (id: number, order: number) => {
    try {
        const { data, error } = await sql.from("courses").update({ sort_order: order }).eq("id", id);
        if (error) {
            throw error;
        }
        updateTag("courses");
        return data;
    }
    catch (error) {
        console.error("Error updating course order:", error);
        return [];
    }
}

export const getCoursesByUserId = async (userId: number) => {
    "use cache";
    cacheTag("courses");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("courses").select("*").eq("user_id", userId).order('sort_order', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching courses by user id:", error);
        return [];
    }
}

export async function reorderCourses(user_id: number) {
    const { data, error } = await sql.rpc('reorder_courses_for_user', { target_user_id: user_id });
    if (error) {
        throw error;
    }
    updateTag("courses");
    return data;
}

export async function bulkUpdateCourseOrders(updates: { id: number; sort_order: number }[]) {
    const promises = updates.map(update => 
        sql.from("courses").update({ sort_order: update.sort_order }).eq("id", update.id)
    );
    const results = await Promise.all(promises);
    const firstError = results.find(r => r.error)?.error;
    if (firstError) throw firstError;
    updateTag("courses");
    return true;
}
