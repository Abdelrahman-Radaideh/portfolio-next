"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getActiveProjectsAction, deleteProjectAction } from "@/actions/project-action";
import { Project } from "@/lib/models/project";
import { Suspense, useState, useEffect } from "react";
import { Loading } from "@/components/loading";
import Link from 'next/link';
import { toast, Toaster } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function DashboardProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projToDelete, setProjToDelete] = useState<number | null>(null);

    const fetchProjects = () => {
        setIsLoading(true);
        getActiveProjectsAction().then((data) => {
            data.sort((a: Project, b: Project) => a.sort_order - b.sort_order);
            setProjects(data);

        }).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch projects");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDeleteClick = (id: number) => {
        setProjToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (projToDelete === null) return;
        try {
            await deleteProjectAction(projToDelete);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
            console.error(error);
        } finally {
            setProjToDelete(null);
        }
    }

    return (
        <>
            {isLoading ? <Loading /> :
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-1">Projects</h2>
                            <p className="text-muted">Showcase your best work</p>
                        </div>
                        <Link
                            href="?tab=projects&action=new"
                            className="bg-primary hover:bg-primary-hover text-inverse font-bold py-2 px-6 rounded-full transition-colors shadow-lg inline-block"
                        >
                            Add New
                        </Link>
                    </div>

                    <Suspense fallback={<Loading />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {projects?.map((proj: Project, index: number) => (
                                <div
                                    key={proj.id || index}
                                    className="relative overflow-hidden bg-surface border border-border rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md hover:border-border-hover transition-all group"
                                >
                                    {/* Background Image Layer */}
                                    {proj.images && (
                                        <div
                                            className="absolute inset-0 z-0 opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-300"
                                            style={{
                                                backgroundImage: `url(${proj.images[0] || '/default-bg.jpg'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                    )}
                                    {/* Overlay Layer for readability */}
                                    <div className="absolute inset-0 z-1 bg-surface/80 backdrop-blur-sm pointer-events-none" />

                                    {/* Card Content Layer */}
                                    <div className="relative z-10 p-6 flex flex-col justify-between h-full gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-xs font-mono bg-elevated text-foreground border border-border px-2 py-1 rounded shadow-sm font-semibold">#{proj.sort_order}</span>
                                                <span className={`text-xs px-2 py-1 rounded border font-bold ${
                                                    (() => {
                                                        const cleanStatus = proj.status.toLowerCase().replace(/_/g, ' ').trim();
                                                        switch (cleanStatus) {
                                                            case 'completed':
                                                                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                                                            case 'in progress':
                                                                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                                                            case 'suspended':
                                                                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
                                                            default:
                                                                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
                                                        }
                                                    })()
                                                }`}>
                                                    {proj.status.replace(/_/g, ' ').toLowerCase()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{proj.title}</h3>
                                            <p className="text-foreground/80 dark:text-muted-foreground text-sm line-clamp-3 mb-6 font-medium leading-relaxed">{proj.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                            <div className="flex flex-wrap gap-2 text-primary text-xs font-mono font-medium">
                                                {proj.technologies}
                                                {proj.technologies.length > 3 && '...'}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Link href={`?tab=projects&action=edit&id=${proj.id}`} className="p-2 bg-surface hover:bg-elevated text-primary border border-border rounded-lg transition-colors shadow-sm" title="Edit">
                                                    <FaEdit size={14} />
                                                </Link>
                                                <button type="button" onClick={() => { proj.id && handleDeleteClick(proj.id) }} className="p-2 bg-surface hover:bg-red-500/10 text-red-500 border border-border rounded-lg transition-colors shadow-sm" title="Delete">
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="text-muted text-center py-8 col-span-full bg-surface rounded-2xl border border-border">
                                    No projects found. Add one to showcase your work!
                                </div>
                            )}
                        </div>
                    </Suspense>

                    <ConfirmModal
                        isOpen={projToDelete !== null}
                        onClose={() => setProjToDelete(null)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Project"
                        description="Are you sure you want to delete this project? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        isDestructive={true}
                    />

                    <Toaster richColors position="bottom-center" duration={2000} />
                </div>
            }
        </>
    );
}
