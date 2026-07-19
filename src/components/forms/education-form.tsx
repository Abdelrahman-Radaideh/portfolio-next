'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addEducationAction, updateEducationAction, getEducationByIdAction } from '@/actions/education-action';
import { getActiveUserAction } from '@/actions/user-action';
import { Education, EducationSchema } from "@/lib/models/education";
import { z } from "zod";
import { toast, Toaster } from 'sonner';
import { Loading } from '@/components/loading';
import Link from 'next/link';
import { FaSave } from "react-icons/fa";

export function DashboardEducationForm({ educationId }: { educationId?: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = !!educationId;
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<z.input<typeof EducationSchema>>({
        resolver: zodResolver(EducationSchema),
    });

    const expDesc = watch('description') || '';

    useEffect(() => {
        getActiveUserAction().then(res => {
            const activeUser = Array.isArray(res) ? res[0] : res;
            if (activeUser && activeUser.id) {
                setActiveUserId(activeUser.id);
            }
            if (!isEditMode) {
                setIsLoading(false);
            }
        });

        if (educationId) {
            getEducationByIdAction(educationId).then((edu) => {
                if (edu) {
                    const eduData = Array.isArray(edu) ? edu[0] : edu;
                    if (eduData) {
                        reset({
                            id: eduData.id,
                            user_id: eduData.user_id,
                            institution: eduData.institution,
                            degree: eduData.degree || '',
                            period: eduData.period || '',
                            grade: eduData.grade || '',
                            location: eduData.location || '',
                            description: eduData.description || '',
                            sort_order: eduData.sort_order || 1,
                        });
                    }
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error(error);
                toast.error("Failed to fetch education details");
                setIsLoading(false);
            });
        }
    }, [educationId, reset, isEditMode]);

    const onSubmit = async (formData: z.input<typeof EducationSchema>) => {
        const data = formData as Education;
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
                data.id = educationId;
                data.user_id = data.user_id || activeUserId || 0; 
                await updateEducationAction(data);
                toast.success("Education updated successfully");
            } else {
                data.user_id = activeUserId as number;
                await addEducationAction(data);
                toast.success("Education added successfully");
            }
            router.push('?tab=education');
        } catch (err: any) {
            console.error("Error -->: ", err);
            setError(err.message || 'Something went wrong while submitting.');
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} education`);
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
                            <h2 className="text-3xl font-bold text-foreground mb-1">{isEditMode ? 'Edit Education' : 'Add Education'}</h2>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-lg">
                        {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Institution</label>
                                    <input
                                        {...register('institution')}
                                        placeholder="e.g. Stanford University"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Degree</label>
                                    <input
                                        {...register('degree')}
                                        placeholder="e.g. Bachelor of Science"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.degree && <p className="text-red-400 text-xs mt-1">{errors.degree.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Period</label>
                                    <input
                                        {...register('period')}
                                        placeholder="e.g. 2020 - 2024"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.period && <p className="text-red-400 text-xs mt-1">{errors.period.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Grade</label>
                                    <input
                                        {...register('grade')}
                                        placeholder="e.g. 3.9 GPA"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.grade && <p className="text-red-400 text-xs mt-1">{errors.grade.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Location</label>
                                    <input
                                        {...register('location')}
                                        placeholder="e.g. Stanford, CA"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Sort Order</label>
                                    <input
                                        min={1}
                                        max={100}
                                        type="number"
                                        {...register('sort_order', { valueAsNumber: true })}
                                        placeholder="e.g. 1"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.sort_order && <p className="text-red-400 text-xs mt-1">{errors.sort_order.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Description <span className="text-slate-500 font-normal normal-case">(Optional)</span></label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    maxLength={2000}
                                    placeholder="Describe your studies, activities, and societies..."
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
                                    href="?tab=education"
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
