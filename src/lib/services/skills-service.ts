import { Skill } from "../models/skill";
import sql from "../database-conection";
import { revalidateTag, cacheLife, cacheTag } from "next/cache";

export async function getSkills() {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql.from("skills").select("*");
    if (error) {
        throw error;
    }
    return data;
}
export async function getActiveSkills() {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql.from("skills").select("*,users!inner(is_active)").eq("users.is_active", true);
    if (error) {
        throw error;
    }
    return data;
}
export async function getSkillById(id: number) {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql.from("skills").select("*").eq("id", id).single();
    if (error) {
        throw error;
    }
    return data;
}
export async function addSkill(skill: Skill) {
    const { data, error } = await sql.from("skills").insert(skill);
    if (error) {
        throw error;
    }
    revalidateTag("skills");
    return data;
}
export async function updateSkill(skill: Skill) {
    const { data, error } = await sql.from("skills").update(skill).eq("id", skill.id);
    if (error) {
        throw error;
    }
    revalidateTag("skills");
    return data;
}
export async function deleteSkill(id: number) {
    const { data, error } = await sql.from("skills").delete().eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("skills");
    return data;
}
export async function getSkillsCount() {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { count, error } = await sql.from("skills").select(`*`, { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count;
}