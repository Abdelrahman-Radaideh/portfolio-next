"use server";
import { RequestUser, requestUserSchema, UserSchema, User } from "@/lib/models/user";
import {
    getUsers, getUserById, addUser, updateUser, deleteUser, getActiveUser, activateUser,
    deactivateUser, getPortfolioNames, getActivePortfolioName
} from "@/lib/services/user-service";
import { uploadImage, deleteImage } from "@/lib/utils/server/could-upload";
import { revalidatePath, updateTag } from "next/cache";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
export async function getUsersAction() {
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
        return await getUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}
export async function getUserByIdAction(id: number) {
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
        return await getUserById(id);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}
export async function addUserAction(user: RequestUser) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const parsed = requestUserSchema.safeParse(user);

    if (!parsed.success) {
        console.error("Error adding user:", parsed.error);
        throw parsed.error;
    }
    try {
        if (user.picture) {
            const url = await uploadImage(user.picture);
            if (!url) {
                throw new Error("Error uploading picture");
            }
            const newUser: User = {
                name: user.name,
                job_title: user.job_title,
                email: user.email,
                hero_description: user.hero_description,
                about_description: user.about_description,
                capabilities_description: user.capabilities_description,
                about_title: user.about_title,
                linkedin_url: user.linkedin_url,
                github_url: user.github_url,
                resume_url: user.resume_url,
                picture_url: url,
                portfolio_name: user.portfolio_name,
            }
            const result = await addUser(newUser);
            revalidatePath("/");
            return result;
        }
        else {
            throw new Error("Picture is required");
        }
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
}
export async function updateUserAction(user: RequestUser) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const parsed = requestUserSchema.safeParse(user);
    if (!parsed.success) {
        console.error(" Error parsing user:", parsed.error);
        throw parsed.error;
    }

    try {

        if (user.picture && user.id) {
            //delete old picture
            const oldUserResult = await getUserByIdAction(user.id);
            const oldUser = Array.isArray(oldUserResult) ? oldUserResult[0] : oldUserResult;
            if (oldUser && oldUser.picture_url) {
                await deleteImage(oldUser.picture_url);
            }
            const url = await uploadImage(user.picture);
            if (!url) {
                throw new Error("Error uploading picture");
            }
            const newUser: User = {
                id: user.id,
                name: user.name,
                job_title: user.job_title,
                email: user.email,
                hero_description: user.hero_description,
                about_description: user.about_description,
                capabilities_description: user.capabilities_description,
                about_title: user.about_title,
                linkedin_url: user.linkedin_url,
                github_url: user.github_url,
                resume_url: user.resume_url,
                picture_url: url,
                portfolio_name: user.portfolio_name,
            }
            const result = await updateUser(newUser);
            revalidatePath("/");
            return result;
        }
        const newUserWithoutPic: User = {
            id: user.id,
            name: user.name,
            job_title: user.job_title,
            email: user.email,
            hero_description: user.hero_description,
            about_description: user.about_description,
            capabilities_description: user.capabilities_description,
            about_title: user.about_title,
            linkedin_url: user.linkedin_url,
            github_url: user.github_url,
            resume_url: user.resume_url,
            portfolio_name: user.portfolio_name,
        };
        const result = await updateUser(newUserWithoutPic);
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error updating user to DB:", error);
        throw error;
    }
}
export async function deleteUserAction(id: number) {
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
        const result = await deleteUser(id);
        revalidatePath("/");
        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
export async function getActiveUserAction() {

    try {
        return await getActiveUser();
    } catch (error) {
        console.error("Error fetching active user:", error);
        throw error;
    }
}
export async function activateUserAction(id: number) {
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
        await deactivateUserAction();
        const result = await activateUser(id);
        updateTag("users");
        updateTag("skills");
        updateTag("projects");
        updateTag("experiences");
        revalidatePath("/", "layout");
        return result;
    } catch (error) {
        console.error("Error activating user:", error);
        throw error;
    }
}
export async function deactivateUserAction() {
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
        const result = await deactivateUser();
        updateTag("users");
        updateTag("skills");
        updateTag("projects");
        updateTag("experiences");
        revalidatePath("/", "layout");
        return result;
    } catch (error) {
        console.error("Error deactivating user:", error);
        throw error;
    }
}
// get all portfolio names
export async function getPortfolioNamesAction() {
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
        return await getPortfolioNames();
    } catch (error) {
        console.error("Error fetching portfolio names:", error);
        throw error;
    }
}
export async function getActivePortfolioNameAction() {
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
        return await getActivePortfolioName();
    } catch (error) {
        console.error("Error fetching active portfolio name:", error);
        throw error;
    }
}

