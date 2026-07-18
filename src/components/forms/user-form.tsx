'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addUserAction, getUsersAction, updateUserAction, getUserByIdAction } from '@/actions/user-action';
import { RequestUser, requestUserSchema } from "@/lib/models/user";
import { toast, Toaster } from 'sonner';
import { Loading } from '../loading';
import Link from 'next/link';
import { compressImage } from '@/lib/utils/client/image-compression';

export function DashboardPortfolioForm({ userId }: { userId?: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = !!userId;
    const [existingUser, setExistingUser] = useState<any>(null);
    const [picturePreview, setPicturePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<RequestUser>({
        resolver: zodResolver(requestUserSchema),
    });
    
    const heroDesc = watch('hero_description') || '';
    const aboutTitle = watch('about_title') || '';
    const aboutDesc = watch('about_description') || '';
    const capabilitiesDesc = watch('capabilities_description') || '';
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        if (!isEditMode) {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getUsersAction().then((users) => setNames(users.map((user: any) => user.portfolio_name))).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch users");
        });

        if (userId) {
            getUserByIdAction(userId).then((user) => {
                if (user) {
                    const userData = Array.isArray(user) ? user[0] : user;
                    if (userData) {
                        setExistingUser(userData);
                        reset({
                            id: userData.id,
                            name: userData.name,
                            portfolio_name: userData.portfolio_name,
                            job_title: userData.job_title,
                            email: userData.email,
                            linkedin_url: userData.linkedin_url,
                            github_url: userData.github_url,
                            resume_url: userData.resume_url,
                            hero_description: userData.hero_description,
                            about_title: userData.about_title,
                            about_description: userData.about_description,
                            capabilities_description: userData.capabilities_description,
                        });
                        setPicturePreview(userData.picture_url);
                    }
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error(error);
                toast.error("Failed to fetch user details");
                setIsLoading(false);
            });
        }
    }, [userId, reset]);

    const onSubmit = async (data: RequestUser) => {

        setIsSubmitting(true);
        setError(null);

        const isNameChanged = existingUser && existingUser.portfolio_name !== data.portfolio_name;
        if ((!isEditMode || isNameChanged) && names.includes(data.portfolio_name)) {
            setError("Portfolio name already exists");
            toast.error("Portfolio name already exists");
            setIsSubmitting(false);
            return;
        }

        if (data.picture) {
            toast.info("Compressing image...", { id: "compress-toast" });
            try {
                data.picture = await compressImage(data.picture);
            } catch (err) {
                console.error("Failed to compress user picture:", err);
                toast.error("Failed to compress image. Uploading original.");
            }
            toast.dismiss("compress-toast");
        }

        try {
            if (isEditMode) {
                data.id = userId;
                await updateUserAction(data);
                toast.success("Portfolio updated successfully");
            } else {
                await addUserAction(data);
                toast.success("Portfolio added successfully");
            }
            router.push('?tab=portfolios');
        } catch (err: any) {

            console.error("Error -->: ", err);
            setError(err.message || 'Something went wrong while submitting.');
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} portfolio`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isLoading ? <Loading /> : (
                <>
                    <div className="space-y-6">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-1">{isEditMode ? 'Edit Portfolio / User' : 'Add Portfolio / User'}</h2>
                                <p className="text-muted">{isEditMode ? 'Update the details of your portfolio.' : 'Create a new portfolio profile with full details.'}</p>
                            </div>
                            <Link
                                href="?tab=portfolios"
                                className="bg-transparent border border-border hover:bg-elevated text-foreground font-bold py-2 px-6 rounded-full transition-colors"
                            >
                                Back to List
                            </Link>
                        </div>

                        <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-lg">
                            {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Portfolio Name (ID)</label>
                                        <input
                                            {...register('portfolio_name')}
                                            placeholder="e.g. jdoe-portfolio (Unique URL ID)"
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.portfolio_name && <p className="text-red-400 text-xs mt-1">{errors.portfolio_name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Full Name</label>
                                        <input
                                            {...register('name')}
                                            placeholder="e.g. Zaid Radaideh"
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Job Title</label>
                                        <input
                                            {...register('job_title')}
                                            placeholder="e.g. Software Engineer"
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.job_title && <p className="text-red-400 text-xs mt-1">{errors.job_title.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Email</label>
                                        <input
                                            {...register('email')}
                                            placeholder="e.g. example@gmail.com"
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">LinkedIn URL</label>
                                        <input
                                            {...register('linkedin_url')}
                                            placeholder="https://linkedin.com/..."
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.linkedin_url && <p className="text-red-400 text-xs mt-1">{errors.linkedin_url.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">GitHub URL</label>
                                        <input
                                            {...register('github_url')}
                                            placeholder="https://github.com/..."
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.github_url && <p className="text-red-400 text-xs mt-1">{errors.github_url.message}</p>}
                                    </div>
                                </div>

                                {/* Row 4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Resume URL</label>
                                        <input
                                            {...register('resume_url')}
                                            placeholder="CV Link"
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        {errors.resume_url && <p className="text-red-400 text-xs mt-1">{errors.resume_url.message}</p>}
                                    </div>
                                </div>

                                {/* Row 5: Profile Picture */}
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Profile Picture {isEditMode && <span className="text-sky-500 ml-1">(Optional - leave empty to keep current)</span>}</label>
                                    <span className="flex items-center gap-2">
                                        {picturePreview && <img src={picturePreview} alt="" className="w-16 h-16 rounded-full" />}
                                        <input

                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            {...register('picture', {
                                                onChange: (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setPicturePreview(URL.createObjectURL(file))
                                                    }
                                                }
                                            })}
                                            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface file:text-foreground hover:file:bg-border transition-all cursor-pointer"
                                        />
                                    </span>

                                    {errors.picture && <p className="text-red-400 text-xs mt-1">{errors.picture?.message as string}</p>}
                                </div>

                                <hr className="border-border" />

                                {/* Textareas */}
                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Hero Description</label>
                                    <textarea
                                        {...register('hero_description')}
                                        rows={3}
                                        maxLength={300}
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <div className="flex justify-between text-[11px] mt-1.5 px-1">
                                        <span className={heroDesc.length >= 300 ? "text-red-400 font-bold" : "text-muted"}>{heroDesc.length} / 300</span>
                                        <span className="text-muted">Recommended: ~150 chars</span>
                                    </div>
                                    {errors.hero_description && <p className="text-red-400 text-xs mt-1">{errors.hero_description.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">About Title</label>
                                    <textarea
                                        {...register('about_title')}
                                        rows={3}
                                        maxLength={100}
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <div className="flex justify-between text-[11px] mt-1.5 px-1">
                                        <span className={aboutTitle.length >= 100 ? "text-red-400 font-bold" : "text-muted"}>{aboutTitle.length} / 100</span>
                                        <span className="text-muted">Recommended: ~50 chars</span>
                                    </div>
                                    {errors.about_title && <p className="text-red-400 text-xs mt-1">{errors.about_title.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">About Bio</label>
                                    <textarea
                                        {...register('about_description')}
                                        rows={4}
                                        maxLength={1000}
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <div className="flex justify-between text-[11px] mt-1.5 px-1">
                                        <span className={aboutDesc.length >= 1000 ? "text-red-400 font-bold" : "text-muted"}>{aboutDesc.length} / 1000</span>
                                        <span className="text-muted">Recommended: ~400 chars</span>
                                    </div>
                                    {errors.about_description && <p className="text-red-400 text-xs mt-1">{errors.about_description.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">Capabilities Description</label>
                                    <textarea
                                        {...register('capabilities_description')}
                                        rows={4}
                                        maxLength={1000}
                                        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <div className="flex justify-between text-[11px] mt-1.5 px-1">
                                        <span className={capabilitiesDesc.length >= 1000 ? "text-red-400 font-bold" : "text-muted"}>{capabilitiesDesc.length} / 1000</span>
                                        <span className="text-muted">Recommended: ~400 chars</span>
                                    </div>
                                    {errors.capabilities_description && <p className="text-red-400 text-xs mt-1">{errors.capabilities_description.message}</p>}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary hover:bg-primary-hover text-inverse font-bold py-3 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Save Portfolio'}
                                    </button>
                                </div>
                            </form>
                            <Toaster richColors position="bottom-right" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
