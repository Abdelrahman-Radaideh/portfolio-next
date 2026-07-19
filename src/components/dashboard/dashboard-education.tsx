"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { getActiveEducationAction, deleteEducationAction, bulkUpdateEducationOrdersAction } from "@/actions/education-action";
import { Education } from "@/lib/models/education";
import { Suspense, useState, useEffect } from "react";
import { Loading } from "@/components/loading";
import Link from 'next/link';
import { toast, Toaster } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ImportModal } from "@/components/dashboard/import-modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableEducationCard({ edu, handleDeleteClick }: { edu: Education, handleDeleteClick: (id: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: edu.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm hover:border-border-hover hover:shadow-md transition-all gap-4 relative ${isDragging ? 'opacity-80 shadow-2xl scale-[1.02] border-primary ring-2 ring-primary/20' : ''}`}
        >
            <div className="flex items-start sm:items-center gap-4 flex-1 w-full">
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 hover:bg-elevated rounded transition-colors"
                    title="Drag to reorder"
                >
                    <MdDragIndicator size={24} />
                </div>
                
                <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                        <span className="text-xs font-mono bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded shadow-sm font-bold">#{edu.sort_order || 1}</span>
                        {edu.institution}
                    </h3>
                    <p className="text-muted text-sm mt-0.5">{edu.degree} • {edu.period}</p>
                    {edu.description && <p className="text-muted text-xs mt-2 line-clamp-2">{edu.description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto sm:ml-0 flex-shrink-0">
                <Link href={`?tab=education&action=edit&id=${edu.id}`} className="p-2 bg-surface hover:bg-elevated text-primary border border-border rounded-lg transition-colors shadow-sm" title="Edit">
                    <FaEdit size={14} />
                </Link>
                <button type="button" onClick={() => { edu.id && handleDeleteClick(edu.id) }} className="p-2 bg-surface hover:bg-red-500/10 text-red-500 border border-border rounded-lg transition-colors shadow-sm" title="Delete">
                    <FaTrash size={14} />
                </button>
            </div>
        </div>
    );
}

export function DashboardEducation() {
    const [education, setEducation] = useState<Education[]>([]);
    const [eduToDelete, setEduToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchEducation = () => {
        getActiveEducationAction().then((data) => {
            data.sort((a: Education, b: Education) => (a.sort_order || 0) - (b.sort_order || 0));
            setEducation(data);
        }).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch education");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    const handleDeleteClick = (id: number) => {
        setEduToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (eduToDelete === null) return;
        try {
            await deleteEducationAction(eduToDelete);
            toast.success("Education deleted successfully");
            fetchEducation();
        } catch (error) {
            toast.error("Failed to delete education");
            console.error(error);
        } finally {
            setEduToDelete(null);
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const oldIndex = education.findIndex(item => item.id === active.id);
            const newIndex = education.findIndex(item => item.id === over.id);
            
            const newItems = arrayMove(education, oldIndex, newIndex);
            
            // Optimistically update sort_order 
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                sort_order: index + 1
            }));
            
            setEducation(updatedItems);
            
            // Fire off the background update
            const updates = updatedItems.map(item => ({ id: item.id!, sort_order: item.sort_order || 1 }));
            
            toast.promise(bulkUpdateEducationOrdersAction(updates), {
                loading: 'Saving new order...',
                success: 'Order updated successfully',
                error: 'Failed to update order'
            });
        }
    };

    return (
        <>
            {isLoading ? <Loading /> :

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-1">Education</h2>
                            <p className="text-muted">Manage your educational background</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsImportOpen(true)}
                                className="bg-surface hover:bg-border text-foreground border border-border font-bold py-2 px-6 rounded-full transition-colors shadow-sm inline-block"
                            >
                                Import
                            </button>
                            <Link
                                href="?tab=education&action=new"
                                className="bg-primary hover:bg-primary-hover text-inverse font-bold py-2 px-6 rounded-full transition-colors shadow-lg inline-block"
                            >
                                Add New
                            </Link>
                        </div>
                    </div>
                    <Suspense fallback={<Loading />}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={education.map(e => e.id!)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-col gap-4 mt-8">
                                    {education?.map((edu: Education) => (
                                        <SortableEducationCard 
                                            key={edu.id} 
                                            edu={edu} 
                                            handleDeleteClick={handleDeleteClick} 
                                        />
                                    ))}
                                    {education.length === 0 && (
                                        <div className="text-muted text-center py-8">
                                            No education found for the active user. Add one to get started!
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </Suspense>

                    <ConfirmModal
                        isOpen={eduToDelete !== null}
                        onClose={() => setEduToDelete(null)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Education"
                        description="Are you sure you want to delete this education entry? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        isDestructive={true}
                    />

                    <Toaster richColors position="bottom-center" duration={2000} />

                    <ImportModal
                        isOpen={isImportOpen}
                        onClose={() => { setIsImportOpen(false); fetchEducation(); }}
                        entityType="education"
                    />
                </div>
            }

        </>
    );
}
