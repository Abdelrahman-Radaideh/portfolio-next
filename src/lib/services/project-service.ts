import sql from "../database-conection";
import { Project } from "../models/project";
import { revalidateTag, cacheLife, cacheTag } from "next/cache";

export async function getProjects() {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { data, error } = await sql.from("projects").select("*");
    if (error) {
        throw error;
    }
    return data;
}
export async function getProjectById(id: number) {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { data, error } = await sql.from("projects").select("*").eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}

export async function addProject(project: Project) {
    const { data, error } = await sql.from("projects").insert(project);
    if (error) {
        throw error;
    }
    revalidateTag("projects");
    return data;
}

export async function updateProject(project: Project) {
    const { data, error } = await sql.from("projects").update(project).eq("id", project.id);
    if (error) {
        throw error;
    }
    revalidateTag("projects");
    return data;
}

export async function deleteProject(id: number) {
    const { data, error } = await sql.from("projects").delete().eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("projects");
    return data;
}
export async function updateProjectImages(id: number, images: string[]) {
    const { data, error } = await sql.from("projects").update({ images }).eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("projects");
    return data;
}
export async function getActiveProjects() {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { data, error } = await sql.from("projects").select("*,users!inner(is_active)").eq("users.is_active", true)
    if (error) {
        throw error;
    }
    return data;
}
export async function getProjectsCount() {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { count, error } = await sql.from("projects").select(`*`, { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count;
}
export async function reorderProjects(user_id: number) {
    // 1. Fetch all projects for this user, sorted by sort_order ASC, id DESC
    const { data: projects, error: fetchError } = await sql
        .from("projects")
        .select("id, sort_order")
        .eq("user_id", user_id)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: false });

    if (fetchError) {
        throw fetchError;
    }

    if (!projects || projects.length === 0) return null;

    // 2. Assign sequential ranks 1, 2, 3... and update rows whose rank changed
    const updates = projects.map((project: { id: number; sort_order: number }, index: number) => {
        const newRank = index + 1;
        if (project.sort_order !== newRank) {
            return sql
                .from("projects")
                .update({ sort_order: newRank })
                .eq("id", project.id);
        }
        return null;
    }).filter(Boolean);

    // 3. Execute updates in parallel
    if (updates.length > 0) {
        const results = await Promise.all(updates);
        const firstError = results.find(r => r.error)?.error;
        if (firstError) {
            throw firstError;
        }
    }

    revalidateTag("projects");
    return projects;
}