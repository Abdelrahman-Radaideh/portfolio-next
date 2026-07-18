"use client";
import { FaBolt, FaEdit, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { getUsersAction, activateUserAction, deleteUserAction } from "@/actions/user-action";
import { User } from "@/lib/models/user";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import Link from 'next/link';
import Image from 'next/image';
import { toast, Toaster } from "sonner";
import { useState, useEffect } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
export function DashboardPortfolios() {
    const [users, setUsers] = useState<User[]>([]);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const fetchUsers = () => {
        getUsersAction().then((users) => setUsers(users)).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch users");
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleActivation = async (id: number) => {
        try {
            await activateUserAction(id);
            toast.success("Portfolio activated successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to activate portfolio");
            console.error(error);
        }
    }

    const handleDeleteClick = (id: number) => {
        setUserToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (userToDelete === null) return;
        try {
            await deleteUserAction(userToDelete);
            toast.success("Portfolio deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete portfolio");
            console.error(error);
        } finally {
            setUserToDelete(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-1">Portfolios</h2>
                    <p className="text-muted">Manage your different portfolio profiles</p>
                </div>
                <Link
                    href="?tab=portfolios&action=new"
                    className="bg-primary hover:bg-primary-hover text-inverse font-bold py-2 px-6 rounded-full transition-colors shadow-lg inline-block"
                >
                    Add New
                </Link>
            </div>
            <Suspense fallback={<Loading />}>
                <div className="flex flex-col gap-4 mt-8">
                    {users?.map((user: User) => (
                        <div
                            key={user.id}
                            className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-border-hover transition-all duration-normal"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-elevated border border-border-hover flex-shrink-0 flex items-center justify-center">
                                    {user.picture_url ? (
                                        <Image src={user.picture_url} alt={user.name} fill sizes="48px" className="object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold text-muted">
                                            {user.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full border bg-transparent text-muted border-border-hover"
                                        >
                                            {user.portfolio_name}
                                        </span>
                                        {user.is_active && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#064e3b] text-[#10b981] flex items-center gap-1 font-medium">
                                                <FaCheck className="text-[10px]" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted text-sm mt-0.5">{user.job_title}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                {user.is_active && (
                                    <a href={`/${user.portfolio_name}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors" title="View Portfolio">
                                        <FaExternalLinkAlt />
                                    </a>
                                )}

                                {/* Quick Action / Activate */}

                                {!user.is_active && (
                                    <button type="submit" className="text-amber-400 hover:text-amber-300 transition-colors" title="Quick Action" onClick={() => { user.id && handleActivation(user.id) }}>
                                        <FaBolt />
                                    </button>
                                )}

                                <Link href={`?tab=portfolios&action=edit&id=${user.id}`} className="text-primary hover:text-primary-hover transition-colors" title="Edit">
                                    <FaEdit />
                                </Link>

                                {/* Delete */}
                                <button type="button" onClick={() => {
                                    if (user.is_active) {
                                        toast.warning("Cannot delete an active portfolio. Please activate a different portfolio first");
                                        return;
                                    }
                                    user.id && handleDeleteClick(user.id)
                                }} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


                <ConfirmModal
                    isOpen={userToDelete !== null}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Portfolio"
                    description="Are you sure you want to delete this portfolio? This action cannot be undone and will permanently remove all associated data."
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDestructive={true}
                />

                <Toaster richColors position="bottom-right" duration={2000} />
            </Suspense>
        </div>
    );
}
