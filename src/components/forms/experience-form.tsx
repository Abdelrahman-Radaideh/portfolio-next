'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addExperienceAction, updateExperienceAction, getExperienceByIdAction } from '@/actions/experience-action';
import { getActiveUserAction } from '@/actions/user-action';
import { Experience, ExperienceSchema } from "@/lib/models/experience";
import { toast, Toaster } from 'sonner';
import { Loading } from '@/components/loading';
import Link from 'next/link';
import { FaSave } from "react-icons/fa";

export function DashboardExperienceForm({ experienceId }: { experienceId?: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = !!experienceId;
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<Experience>({
        resolver: zodResolver(ExperienceSchema),
    });

    const expDesc = watch('description') || '';

    useEffect(() => {
        getActiveUserAction().then(res => {
            if (res && res.length > 0) {
                setActiveUserId(res[0].id);
            }
            if (!isEditMode) {
                setIsLoading(false);
            }
        });

        if (experienceId) {
            getExperienceByIdAction(experienceId).then((exp) => {
                if (exp) {
                    const expData = Array.isArray(exp) ? exp[0] : exp;
                    if (expData) {
                        reset({
                            id: expData.id,
                            user_id: expData.user_id,
                            role: expData.role,
                            company: expData.company,
                            period: expData.period,
                            description: expData.description,
                        });
                    }
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error(error);
                toast.error("Failed to fetch experience details");
                setIsLoading(false);
            });
        }
    }, [experienceId, reset, isEditMode]);

    const onSubmit = async (data: Experience) => {
        setIsSubmitting(true);
        setError(null);

        if (!activeUserId && !isEditMode) {
            setError("No active user found. Please activate a portfolio first.");
            toast.error("No active user found.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditMode) {
                data.id = experienceId;
                data.user_id = data.user_id || activeUserId || 0; 
                await updateExperienceAction(data);
                toast.success("Experience updated successfully");
            } else {
                data.user_id = activeUserId as number;
                await addExperienceAction(data);
                toast.success("Experience added successfully");
            }
            router.push('?tab=experience');
        } catch (err: any) {
            console.error("Error -->: ", err);
            setError(err.message || 'Something went wrong while submitting.');
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} experience`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isLoading ? <Loading /> : (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-1">{isEditMode ? 'Edit Experience' : 'Add Experience'}</h2>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-lg">
                        {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Role</label>
                                    <input
                                        {...register('role')}
                                        placeholder="e.g. Senior Software Engineer"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Company</label>
                                    <input
                                        {...register('company')}
                                        placeholder="e.g. Google"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Period</label>
                                    <input
                                        {...register('period')}
                                        placeholder="e.g. Sep 2025 - Present"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.period && <p className="text-red-400 text-xs mt-1">{errors.period.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    maxLength={2000}
                                    placeholder="Describe your role, responsibilities, and key achievements..."
                                    className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                <div className="flex justify-between text-[11px] mt-1.5 px-1">
                                    <span className={expDesc.length >= 2000 ? "text-red-400 font-bold" : "text-muted"}>{expDesc.length} / 2000</span>
                                    <span className="text-muted">Recommended: ~500 chars</span>
                                </div>
                                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="flex justify-end pt-4 gap-4">
                                <Link
                                    href="?tab=experience"
                                    className="bg-transparent border border-border hover:bg-elevated text-foreground font-medium py-3 px-8 rounded-xl transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary hover:bg-primary-hover text-inverse font-bold py-3 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? 'Submitting...' : (
                                        <>
                                            <FaSave className="text-lg" /> Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <Toaster richColors position="bottom-right" />
                    </div>
                </div>
            )}
        </>
    );
}
