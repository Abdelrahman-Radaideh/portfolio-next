"use server";
import {
    getProjects, getProjectById, getActiveProjects, addProject,
    updateProject, deleteProject, updateProjectImages, reorderProjects
} from "@/lib/services/project-service";
import { Project, ProjectSchema, RequestProject, RequestProjectSchema } from "@/lib/models/project";
import { uploadImage, deleteImage } from "@/lib/utils/server/could-upload";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
export async function getProjectsAction() {
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
        return await getProjects();
    } catch (error) {
        console.error("Error getting projects:", error);
        throw error;
    }
}
export async function getActiveProjectsAction() {
    try {
        return await getActiveProjects();
    } catch (error) {
        console.error("Error getting active projects:", error);
        throw error;
    }
}
export async function getProjectByIdAction(id: number) {
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
        return await getProjectById(id);
    } catch (error) {
        console.error("Error getting project by id:", error);
        throw error;
    }
}
export async function addProjectAction(project: Project) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const validatedProject = ProjectSchema.safeParse(project);
    if (!validatedProject.success) {
        throw new Error(validatedProject.error.message);
    }
    try {
        const res = await addProject(validatedProject.data);
        if (validatedProject.data.user_id) {
            await reorderProjects(validatedProject.data.user_id);
        }
        revalidatePath("/");
        return res;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
}
export async function updateProjectAction(project: Project) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const validatedProject = ProjectSchema.safeParse(project);
    if (!validatedProject.success) {
        throw new Error(validatedProject.error.message);
    }
    try {
        const res = await updateProject(validatedProject.data);
        if (validatedProject.data.user_id) {
            await reorderProjects(validatedProject.data.user_id);
        }
        revalidatePath("/");
        return res;
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
}
export async function deleteProjectAction(id: number) {
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
        const projectOrArray = await getProjectById(id);
        const project = Array.isArray(projectOrArray) ? projectOrArray[0] : projectOrArray;
        const userId = project?.user_id;

        const res = await deleteProject(id);
        if (userId) {
            await reorderProjects(userId);
        }
        revalidatePath("/");
        return res;
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
}
export async function updateProjectImagesAction(id: number, images: string[]) {
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
        const res = await updateProjectImages(id, images);
        revalidatePath("/");
        return res;
    } catch (error) {
        console.error("Error updating project images:", error);
        throw error;
    }
}

export async function addProjectWithFilesAction(projectData: RequestProject) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const parsed = RequestProjectSchema.safeParse(projectData);
    if (!parsed.success) {
        console.error("Validation error:", parsed.error);
        throw parsed.error;
    }

    try {
        const uploadedImages: string[] = [];
        if (parsed.data.new_images && parsed.data.new_images.length > 0) {
            const urls = await Promise.all(
                parsed.data.new_images.map((file) => uploadImage(file))
            );
            uploadedImages.push(...(urls.filter(Boolean) as string[]));
        }

        const newProject: Project = {
            ...parsed.data,
            user_id: parsed.data.user_id as number,
            technologies: parsed.data.technologies,
            images: [...(parsed.data.images || []), ...uploadedImages],
        };

        return await addProjectAction(newProject);
    } catch (e) {
        console.error("Error adding project with files:", e);
        throw e;
    }
}

export async function updateProjectWithFilesAction(projectData: RequestProject, imagesToDelete: string[] = []) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const parsed = RequestProjectSchema.safeParse(projectData);
    if (!parsed.success) {
        console.error("Validation error:", parsed.error);
        throw parsed.error;
    }

    try {
        // Handle deletions of old images
        for (const imgUrl of imagesToDelete) {
            await deleteImage(imgUrl);
        }

        const uploadedImages: string[] = [];
        if (parsed.data.new_images && parsed.data.new_images.length > 0) {
            const urls = await Promise.all(
                parsed.data.new_images.map((file) => uploadImage(file))
            );
            uploadedImages.push(...(urls.filter(Boolean) as string[]));
        }

        const remainingImages = (parsed.data.images || []).filter(img => !imagesToDelete.includes(img));

        const updatedProject: Project = {
            ...parsed.data,
            id: projectData.id,
            user_id: parsed.data.user_id as number,
            technologies: parsed.data.technologies,
            images: [...remainingImages, ...uploadedImages],
        };

        return await updateProjectAction(updatedProject);
    } catch (e) {
        console.error("Error updating project with files:", e);
        throw e;
    }
}

export async function updateProjectImagesOnlyAction(id: number, existingImages: string[], newImages: File[], imagesToDelete: string[] = []) {
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
        for (const imgUrl of imagesToDelete) {
            await deleteImage(imgUrl);
        }

        const uploadedImages: string[] = [];
        if (newImages && newImages.length > 0) {
            const urls = await Promise.all(
                newImages.map((file) => uploadImage(file))
            );
            uploadedImages.push(...(urls.filter(Boolean) as string[]));
        }

        const remainingImages = existingImages.filter(img => !imagesToDelete.includes(img));
        const finalImages = [...remainingImages, ...uploadedImages];

        return await updateProjectImagesAction(id, finalImages);
    } catch (e) {
        console.error("Error updating project images only:", e);
        throw e;
    }
}
