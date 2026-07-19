"use client";
import { FaEdit, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { getActiveCoursesAction, deleteCourseAction, bulkUpdateCourseOrdersAction } from "@/actions/course-action";
import { Course } from "@/lib/models/course";
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

function SortableCourseCard({ course, handleDeleteClick }: { course: Course, handleDeleteClick: (id: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: course.id! });

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
                        <span className="text-xs font-mono bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded shadow-sm font-bold">#{course.sort_order || 1}</span>
                        {course.title}
                    </h3>
                    <p className="text-muted text-sm mt-0.5">
                        {course.provider} 
                        {course.year ? ` • ${course.year}` : ''}
                        {course.type ? ` • ${course.type.charAt(0).toUpperCase() + course.type.slice(1)}` : ''}
                        {course.hours ? ` • ${course.hours} hours` : ''}
                    </p>
                    {course.credential_id && <p className="text-muted text-xs mt-1">Credential ID: {course.credential_id}</p>}
                    {course.description && <p className="text-muted text-xs mt-2 line-clamp-2">{course.description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto sm:ml-0 flex-shrink-0">
                <Link href={`?tab=courses&action=edit&id=${course.id}`} className="p-2 bg-surface hover:bg-elevated text-primary border border-border rounded-lg transition-colors shadow-sm" title="Edit">
                    <FaEdit size={14} />
                </Link>
                <button type="button" onClick={() => { course.id && handleDeleteClick(course.id) }} className="p-2 bg-surface hover:bg-red-500/10 text-red-500 border border-border rounded-lg transition-colors shadow-sm" title="Delete">
                    <FaTrash size={14} />
                </button>
            </div>
        </div>
    );
}

export function DashboardCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
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

    const fetchCourses = () => {
        getActiveCoursesAction().then((data) => {
            data.sort((a: Course, b: Course) => (a.sort_order || 0) - (b.sort_order || 0));
            setCourses(data);
        }).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch courses");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDeleteClick = (id: number) => {
        setCourseToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (courseToDelete === null) return;
        try {
            await deleteCourseAction(courseToDelete);
            toast.success("Course deleted successfully");
            fetchCourses();
        } catch (error) {
            toast.error("Failed to delete course");
            console.error(error);
        } finally {
            setCourseToDelete(null);
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const oldIndex = courses.findIndex(item => item.id === active.id);
            const newIndex = courses.findIndex(item => item.id === over.id);
            
            const newItems = arrayMove(courses, oldIndex, newIndex);
            
            // Optimistically update sort_order 
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                sort_order: index + 1
            }));
            
            setCourses(updatedItems);
            
            // Fire off the background update
            const updates = updatedItems.map(item => ({ id: item.id!, sort_order: item.sort_order || 1 }));
            
            toast.promise(bulkUpdateCourseOrdersAction(updates), {
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
                            <h2 className="text-3xl font-bold text-foreground mb-1">Courses & Certifications</h2>
                            <p className="text-muted">Manage your additional courses and certifications</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsImportOpen(true)}
                                className="bg-surface hover:bg-border text-foreground border border-border font-bold py-2 px-6 rounded-full transition-colors shadow-sm inline-block"
                            >
                                Import
                            </button>
                            <Link
                                href="?tab=courses&action=new"
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
                                items={courses.map(c => c.id!)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-col gap-4 mt-8">
                                    {courses?.map((course: Course) => (
                                        <SortableCourseCard 
                                            key={course.id} 
                                            course={course} 
                                            handleDeleteClick={handleDeleteClick} 
                                        />
                                    ))}
                                    {courses.length === 0 && (
                                        <div className="text-muted text-center py-8">
                                            No courses found for the active user. Add one to get started!
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </Suspense>

                    <ConfirmModal
                        isOpen={courseToDelete !== null}
                        onClose={() => setCourseToDelete(null)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Course"
                        description="Are you sure you want to delete this course entry? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        isDestructive={true}
                    />

                    <Toaster richColors position="bottom-center" duration={2000} />

                    <ImportModal
                        isOpen={isImportOpen}
                        onClose={() => { setIsImportOpen(false); fetchCourses(); }}
                        entityType="courses"
                    />
                </div>
            }

        </>
    );
}
