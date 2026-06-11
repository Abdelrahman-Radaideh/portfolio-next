"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getActiveExperiencesAction, deleteExperienceAction } from "@/actions/experience-action";
import { Experience } from "@/lib/models/experience";
import { Suspense, useState, useEffect } from "react";
import { Loading } from "@/components/loading";
import Link from 'next/link';
import { toast, Toaster } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function DashboardExperience() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [expToDelete, setExpToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExperiences = () => {

        getActiveExperiencesAction().then((data) => {
            setExperiences(data);
        }).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch experiences");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleDeleteClick = (id: number) => {
        setExpToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (expToDelete === null) return;
        try {
            await deleteExperienceAction(expToDelete);
            toast.success("Experience deleted successfully");
            fetchExperiences();
        } catch (error) {
            toast.error("Failed to delete experience");
            console.error(error);
        } finally {
            setExpToDelete(null);
        }
    }

    return (
        <>
            {isLoading ? <Loading /> :

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-1">Experience</h2>
                            <p className="text-muted">Manage your work history</p>
                        </div>
                        <Link
                            href="?tab=experience&action=new"
                            className="bg-primary hover:bg-primary-hover text-inverse font-bold py-2 px-6 rounded-full transition-colors shadow-lg inline-block"
                        >
                            Add New
                        </Link>
                    </div>
                    <Suspense fallback={<Loading />}>
                        <div className="flex flex-col gap-4 mt-8">
                            {experiences?.map((exp: Experience, index: number) => (
                                <div
                                    key={exp.id || index}
                                    className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm hover:border-border-hover hover:shadow-md transition-all gap-4"
                                >
                                    <div className="flex items-start sm:items-center gap-4 flex-1">
                                        <div className="mt-1 sm:mt-0 text-primary bg-primary/10 p-2 rounded-full border border-primary/20 flex-shrink-0">
                                            <span className="w-2 h-2 rounded-full bg-primary block"></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                                            <p className="text-muted text-sm mt-0.5">{exp.company} • {exp.period}</p>
                                            <p className="text-muted text-xs mt-2 line-clamp-2">{exp.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-auto sm:ml-0 flex-shrink-0">
                                        <Link href={`?tab=experience&action=edit&id=${exp.id}`} className="text-primary hover:text-primary-hover transition-colors" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button type="button" onClick={() => { exp.id && handleDeleteClick(exp.id) }} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {experiences.length === 0 && (
                                <div className="text-muted text-center py-8">
                                    No experiences found for the active user. Add one to get started!
                                </div>
                            )}
                        </div>
                    </Suspense>

                    <ConfirmModal
                        isOpen={expToDelete !== null}
                        onClose={() => setExpToDelete(null)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Experience"
                        description="Are you sure you want to delete this experience entry? This action cannot be undone."
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
