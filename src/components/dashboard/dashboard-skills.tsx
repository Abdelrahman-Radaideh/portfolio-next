"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { getActiveSkillsAction, deleteSkillAction, addSkillAction } from "@/actions/skill-action";
import { getActiveUserAction } from '@/actions/user-action';
import { Skill } from "@/lib/models/skill";
import { availableTechnologies, getIconForTechnology, technologyCategories } from "@/lib/utils/client/icon-mapper";
import { toast, Toaster } from "sonner";
import { Loading } from "@/components/loading";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function DashboardSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchInitialData = () => {
        setIsLoading(true);
        Promise.all([
            getActiveSkillsAction(),
            getActiveUserAction()
        ]).then(([skillsData, usersData]) => {
            setSkills(skillsData);
            if (usersData) {
                setActiveUserId(usersData.id);
            }
        }).catch(err => {
            console.error(err);
            toast.error("Failed to load skills.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const fetchSkills = () => {
        getActiveSkillsAction().then(data => setSkills(data)).catch(console.error);
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleDeleteClick = (id: number) => {
        setSkillToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (skillToDelete === null) return;
        try {
            await deleteSkillAction(skillToDelete);
            toast.success("Skill removed");
            fetchSkills();
        } catch (error) {
            toast.error("Failed to remove skill");
            console.error(error);
        } finally {
            setSkillToDelete(null);
        }
    }

    const handleAddSkill = async (name: string, type: "primary" | "secondary") => {
        if (!activeUserId) {
            toast.error("No active user found. Please activate a portfolio first.");
            return;
        }

        if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            toast.error(`${name} is already in your skills.`);
            return;
        }

        try {
            // Optimistic update visual feedback by hiding modal early
            setIsAddModalOpen(false);
            const promise = addSkillAction({ name, type, user_id: activeUserId }).then(() => {
                fetchSkills();
            });

            toast.promise(
                promise,
                {
                    loading: `Adding ${name}...`,
                    success: `${name} added securely`,
                    error: "Failed to add skill"
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const primarySkills = skills.filter(s => s.type === "primary");
    const secondarySkills = skills.filter(s => s.type === "secondary");

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-1">Skills & Technologies</h2>
                    <p className="text-muted">Manage your technical arsenal</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary-hover text-inverse font-bold py-2 px-6 rounded-full transition-colors shadow-lg"
                >
                    Add New
                </button>
            </div>

            {isLoading ? <Loading /> : (
                <div className="space-y-12">
                    {/* Primary Skills */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-xl font-bold text-foreground mb-6">Primary Skills</h3>
                        {primarySkills.length === 0 ? (
                            <p className="text-muted bg-surface border border-border p-6 rounded-2xl text-center">No primary skills added yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {primarySkills.map(skill => (
                                    <SkillCard key={skill.id!} skill={skill} onDelete={() => skill.id && handleDeleteClick(skill.id)} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Secondary Skills */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground mb-6">Secondary Skills</h3>
                        {secondarySkills.length === 0 ? (
                            <p className="text-muted bg-surface border border-border p-6 rounded-2xl text-center">No secondary skills added yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {secondarySkills.map(skill => (
                                    <SkillCard key={skill.id!} skill={skill} onDelete={() => skill.id && handleDeleteClick(skill.id)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <AddSkillModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAddSkill={handleAddSkill}
                />
            )}

            <ConfirmModal
                isOpen={skillToDelete !== null}
                onClose={() => setSkillToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Remove Skill"
                description="Are you sure you want to remove this skill? It will no longer appear on your public profile."
                confirmText="Remove"
                cancelText="Cancel"
                isDestructive={true}
            />

            <Toaster richColors position="bottom-center" duration={2000} />
        </div>
    );
}

function SkillCard({ skill, onDelete }: { skill: Skill; onDelete: () => void }) {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 relative group hover:border-primary/50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 duration-normal">
            <button
                onClick={onDelete}
                className="absolute top-3 right-3 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 p-1.5 hover:bg-red-400/10 rounded-lg"
                title="Remove skill"
            >
                <FaTrash size={13} />
            </button>
            <div className="text-[40px] text-primary">
                {getIconForTechnology(skill.name)}
            </div>
            <span className="font-bold text-foreground text-[13px] text-center tracking-wide">{skill.name}</span>
        </div>
    );
}

function AddSkillModal({ onClose, onAddSkill }: { onClose: () => void; onAddSkill: (name: string, type: "primary" | "secondary") => void }) {
    const [search, setSearch] = useState('');
    const [type, setType] = useState<"primary" | "secondary">("primary");
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const categories = useMemo(() => {
        const cats = new Set(Object.values(technologyCategories));
        return ["All", ...Array.from(cats)].sort((a, b) => {
            if (a === "All") return -1;
            if (b === "All") return 1;
            return a.localeCompare(b);
        });
    }, []);

    const filteredTech = useMemo(() => {
        let list = availableTechnologies;
        if (activeCategory !== "All") {
            list = list.filter(t => technologyCategories[t] === activeCategory);
        }
        if (search) {
            const lower = search.toLowerCase();
            list = list.filter(t => t.toLowerCase().includes(lower));
        }
        return list;
    }, [search, activeCategory]);

    return (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="bg-surface border border-border flex flex-col rounded-3xl w-full max-w-4xl shadow-2xl h-[85vh] sm:h-[700px] max-h-screen"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border flex-shrink-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Add New Skill</h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-foreground hover:bg-elevated p-2 rounded-xl transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-6 sm:px-8 sm:py-6 border-b border-border flex-shrink-0 space-y-6">
                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <FaSearch className="text-muted group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search technologies..."
                            className="w-full bg-elevated border border-border rounded-2xl pl-12 pr-4 py-3.5 text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-[15px]"
                        />
                    </div>

                    {/* Radio */}
                    <div className="flex items-center gap-8 pl-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="skillType"
                                value="primary"
                                checked={type === "primary"}
                                onChange={() => setType("primary")}
                                className="w-4 h-4 text-primary bg-elevated border-border focus:ring-primary cursor-pointer"
                            />
                            <span className={`font-bold transition-colors ${type === "primary" ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>Primary Skill</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="skillType"
                                value="secondary"
                                checked={type === "secondary"}
                                onChange={() => setType("secondary")}
                                className="w-4 h-4 text-primary bg-elevated border-border focus:ring-primary cursor-pointer"
                            />
                            <span className={`font-bold transition-colors ${type === "secondary" ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>Secondary Skill</span>
                        </label>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-primary text-inverse shadow-md' : 'bg-elevated text-muted hover:text-foreground hover:bg-border border border-border'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-background/30 custom-scrollbar">
                    {filteredTech.length === 0 ? (
                        <div className="text-center text-muted py-16 flex flex-col items-center gap-4">
                            <FaSearch size={32} className="text-muted" />
                            <p className="text-lg">No technologies found for "{search}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredTech.map(tech => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => onAddSkill(tech, type)}
                                    className="bg-surface border border-border hover:border-primary hover:bg-primary/10 rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all outline-none focus:ring-2 focus:ring-primary group shadow-sm hover:shadow-lg"
                                >
                                    <div className="text-4xl text-muted/80 group-hover:text-primary transition-colors">
                                        {getIconForTechnology(tech)}
                                    </div>
                                    <span className="font-bold text-muted group-hover:text-foreground text-[13px] text-center transition-colors line-clamp-1 w-full">
                                        {tech}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--border-hover);
                }
            `}</style>
        </div>
    );
}
