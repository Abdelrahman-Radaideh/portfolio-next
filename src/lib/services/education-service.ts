import { Education } from "../models/education";
import sql from "@/lib/database-conection";
import { updateTag, cacheLife, cacheTag } from "next/cache";

export const getActiveEducation = async () => {
    "use cache";
    cacheTag("education");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("education").select("*,users!inner(is_active)").eq("users.is_active", true).order('sort_order', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching active education:", error);
        return [];
    }
}

export const getEducation = async () => {
    "use cache";
    cacheTag("education");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("education").select("*").order('sort_order', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching education:", error);
        return [];
    }
}

export const addEducation = async (education: Education) => {
    try {
        const { data, error } = await sql.from("education").insert(education);
        if (error) {
            throw error;
        }
        updateTag("education");
        return data;
    }
    catch (error) {
        console.error("Error adding education:", error);
        return [];
    }
}

export const updateEducation = async (education: Education) => {
    try {
        const { data, error } = await sql.from("education").update(education).eq("id", education.id);
        if (error) {
            throw error;
        }
        updateTag("education");
        return data;
    }
    catch (error) {
        console.error("Error updating education:", error);
        return [];
    }
}

export const deleteEducation = async (id: number) => {
    try {
        const { data, error } = await sql.from("education").delete().eq("id", id);
        if (error) {
            throw error;
        }
        updateTag("education");
        return data;
    }
    catch (error) {
        console.error("Error deleting education:", error);
        return [];
    }
}

export const getEducationById = async (id: number) => {
    "use cache";
    cacheTag("education");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("education").select("*").eq("id", id).single();
        if (error) {
            throw error;
        }
        return data ? [data] : [];
    }
    catch (error) {
        console.error("Error fetching education by id:", error);
        return [];
    }
}

export const updateEducationOrder = async (id: number, order: number) => {
    try {
        const { data, error } = await sql.from("education").update({ sort_order: order }).eq("id", id);
        if (error) {
            throw error;
        }
        updateTag("education");
        return data;
    }
    catch (error) {
        console.error("Error updating education order:", error);
        return [];
    }
}

export const getEducationByUserId = async (userId: number) => {
    "use cache";
    cacheTag("education");
    cacheLife("hours");
    try {
        const { data, error } = await sql.from("education").select("*").eq("user_id", userId).order('sort_order', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching education by user id:", error);
        return [];
    }
}

export async function reorderEducation(user_id: number) {
    const { data, error } = await sql.rpc('reorder_education_for_user', { target_user_id: user_id });
    if (error) {
        throw error;
    }
    updateTag("education");
    return data;
}

export async function bulkUpdateEducationOrders(updates: { id: number; sort_order: number }[]) {
    const promises = updates.map(update => 
        sql.from("education").update({ sort_order: update.sort_order }).eq("id", update.id)
    );
    const results = await Promise.all(promises);
    const firstError = results.find(r => r.error)?.error;
    if (firstError) throw firstError;
    updateTag("education");
    return true;
}
