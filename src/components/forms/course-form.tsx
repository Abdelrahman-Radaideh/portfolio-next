'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addCourseAction, updateCourseAction, getCourseByIdAction } from '@/actions/course-action';
import { getActiveUserAction } from '@/actions/user-action';
import { Course, CourseSchema } from "@/lib/models/course";
import { toast, Toaster } from 'sonner';
import { Loading } from '@/components/loading';
import Link from 'next/link';
import { FaSave } from "react-icons/fa";

export function DashboardCourseForm({ courseId }: { courseId?: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = !!courseId;
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<Course>({
        resolver: zodResolver(CourseSchema),
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

        if (courseId) {
            getCourseByIdAction(courseId).then((course) => {
                if (course) {
                    const courseData = Array.isArray(course) ? course[0] : course;
                    if (courseData) {
                        reset({
                            id: courseData.id,
                            user_id: courseData.user_id,
                            title: courseData.title,
                            provider: courseData.provider || '',
                            credential_id: courseData.credential_id || '',
                            certificate_url: courseData.certificate_url || '',
                            description: courseData.description || "",
                            sort_order: courseData.sort_order || 1,
                            year: courseData.year || new Date().getFullYear(),
                            type: courseData.type || undefined,
                            hours: courseData.hours || undefined,
                        });
                    }
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error(error);
                toast.error("Failed to fetch course details");
                setIsLoading(false);
            });
        }
    }, [courseId, reset, isEditMode]);

    const onSubmit = async (data: Course) => {
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
                data.id = courseId;
                data.user_id = data.user_id || activeUserId || 0; 
                await updateCourseAction(data);
                toast.success("Course updated successfully");
            } else {
                data.user_id = activeUserId as number;
                await addCourseAction(data);
                toast.success("Course added successfully");
            }
            router.push('?tab=courses');
        } catch (err: any) {
            console.error("Error -->: ", err);
            setError(err.message || 'Something went wrong while submitting.');
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} course`);
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
                            <h2 className="text-3xl font-bold text-foreground mb-1">{isEditMode ? 'Edit Course' : 'Add Course'}</h2>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-lg">
                        {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Title</label>
                                    <input
                                        {...register('title')}
                                        placeholder="e.g. Advanced React Patterns"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Provider</label>
                                    <input
                                        list="providers-list"
                                        {...register('provider')}
                                        placeholder="e.g. Coursera, Udemy"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <datalist id="providers-list">
                                        <option value="Coursera" />
                                        <option value="Udemy" />
                                        <option value="edX" />
                                        <option value="Pluralsight" />
                                        <option value="Udacity" />
                                        <option value="LinkedIn Learning" />
                                        <option value="Codecademy" />
                                        <option value="FreeCodeCamp" />
                                        <option value="Google" />
                                        <option value="Microsoft" />
                                        <option value="AWS" />
                                    </datalist>
                                    {errors.provider && <p className="text-red-400 text-xs mt-1">{errors.provider.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Type</label>
                                    <select
                                        {...register('type')}
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                                    >
                                        <option value="">Select a type...</option>
                                        <option value="course">Course</option>
                                        <option value="certificate">Certificate</option>
                                    </select>
                                    {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Year</label>
                                    <input
                                        type="number"
                                        {...register('year')}
                                        placeholder="e.g. 2024"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Hours</label>
                                    <input
                                        type="number"
                                        {...register('hours')}
                                        placeholder="e.g. 40"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.hours && <p className="text-red-400 text-xs mt-1">{errors.hours.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Credential ID <span className="text-slate-500 font-normal normal-case">(Optional)</span></label>
                                    <input
                                        {...register('credential_id')}
                                        placeholder="e.g. UC-12345678"
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {errors.credential_id && <p className="text-red-400 text-xs mt-1">{errors.credential_id.message}</p>}
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
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Certificate URL <span className="text-slate-500 font-normal normal-case">(Optional)</span></label>
                                <input
                                    type="url"
                                    {...register('certificate_url')}
                                    placeholder="e.g. https://coursera.org/verify/..."
                                    className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                {errors.certificate_url && <p className="text-red-400 text-xs mt-1">{errors.certificate_url.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Description <span className="text-slate-500 font-normal normal-case">(Optional)</span></label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    maxLength={2000}
                                    placeholder="Describe what you learned in this course..."
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
                                    href="?tab=courses"
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
