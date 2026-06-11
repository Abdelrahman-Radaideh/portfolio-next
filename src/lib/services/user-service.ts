
import sql from "../database-conection";
import { User } from "../models/user";
import { revalidateTag, cacheLife, cacheTag } from "next/cache";

export async function getUsers() {
    "use cache";
    cacheTag("users");
    cacheLife("hours");

    const { data, error } = await sql.from("users").select("*");
    if (error) {
        throw error;
    }
    return data;
}
export async function getUserById(id: number) {
    "use cache";
    cacheTag("users");
    cacheLife("hours");

    const { data, error } = await sql.from("users").select("*").eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}

export async function addUser(user: User) {
    const { data, error } = await sql.from("users").insert(user).select().single();

    if (error) {
        throw error;
    }
    revalidateTag("users");
    return data;
}

export async function updateUser(user: User) {
    if (user.picture_url) {
        const { data, error } = await sql.from("users").update(user).eq("id", user.id);
        if (error) {
            throw error;
        }
        revalidateTag("users");
        return data;
    }
    else {
        const { data, error } = await sql.from("users").update({ name: user.name, job_title: user.job_title, email: user.email, hero_description: user.hero_description, about_description: user.about_description, capabilities_description: user.capabilities_description, about_title: user.about_title, linkedin_url: user.linkedin_url, github_url: user.github_url, resume_url: user.resume_url, portfolio_name: user.portfolio_name, is_active: user.is_active }).eq("id", user.id);
        if (error) {
            throw error;
        }
        revalidateTag("users");
        return data;
    }
}

export async function deleteUser(id: number) {
    const { data, error } = await sql.from("users").delete().eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("users");
    return data;
}

export async function getActiveUser() {
    "use cache";
    cacheTag("users");
    cacheLife("hours");
    const { data, error } = await sql.from("users").select("*").eq("is_active", true).single();
    if (error) {
        throw error;
    }
    return data;
}
export async function activateUser(id: number) {

    const { data, error } = await sql.from("users").update({ is_active: true }).eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("users");
    return data;
}
export async function deactivateUser() {
    const { data, error } = await sql.from("users").update({ is_active: false }).eq("is_active", true);
    if (error) {
        throw error;
    }
    revalidateTag("users");
    return data;
}
export async function updateUserPicture(id: number, picture_url: string) {
    const { data, error } = await sql.from("users").update({ picture_url }).eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("users");
    return data;
}

export async function getUsersCount() {
    "use cache";
    cacheTag("users");
    cacheLife("hours");
    const { count, error } = await sql.from("users").select(`*`, { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count;
}
export async function getPortfolioNames() {
    "use cache";
    cacheTag("users");
    cacheLife("hours");
    const { data, error } = await sql.from("users").select("portfolio_name");
    if (error) {
        throw error;
    }
    return data;
}
export async function getActivePortfolioName() {
    "use cache";
    cacheTag("users");
    cacheLife("hours");
    const { data, error } = await sql.from("users").select("portfolio_name").eq("is_active", true).single();
    if (error) {
        throw error;
    }
    return data;
}