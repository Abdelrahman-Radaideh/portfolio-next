"use client";
import { Course } from '@/lib/models/course';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CoursesTimeline({ courses }: { courses: Course[] }) {
    return (
        <div className="space-y-12 md:space-y-20 relative z-10 w-full pl-5 md:pl-0">
            {courses.map((course: Course, index: number) => {
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: -20, y: 30 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: index * 0.1 }}
                        key={course.id} 
                        className="relative flex items-center w-full group"
                    >
                        {/* Timeline Dot & Ping Animation */}
                        <div className="absolute top-1/2 -left-5 md:left-3 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                            <div className="absolute w-8 h-8 rounded-full bg-primary/20 animate-ping group-hover:bg-primary/40 transition-colors duration-500"></div>
                            <div className="w-4 h-4 rounded-full bg-surface border-4 border-primary shadow-[0_0_15px_var(--primary-glow)] group-hover:scale-150 group-hover:bg-primary transition-all duration-500 ease-smooth"></div>
                        </div>

                        {/* Content Card (Full Width Single Column) */}
                        <div className="w-full pl-8 md:pl-20">
                            <div className="relative overflow-hidden bg-surface/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 ease-smooth hover:border-primary/50 shadow-lg hover:shadow-2xl transform group-hover:-translate-y-3 group-hover:translate-x-2">
                                
                                {/* Dynamic Interactive Sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-inverse group-hover:scale-110 transition-all duration-500 shadow-inner">
                                            <FaAward size={24} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors duration-normal ease-smooth mb-1 flex items-center gap-3">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            {course.year && <span className="text-primary font-bold tracking-widest uppercase text-xs border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">{course.year}</span>}
                                            <span className="text-muted font-bold text-lg">{course.provider}</span>
                                            {course.type && <span className="text-muted text-sm capitalize">({course.type})</span>}
                                            {course.hours && <span className="text-muted text-sm">{course.hours} hrs</span>}
                                        </div>
                                        {course.credential_id && <span className="text-muted text-sm mt-1">Credential ID: {course.credential_id}</span>}
                                    </div>
                                </div>
                                
                                {course.description && (
                                    <p className="text-muted text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap pl-2 border-l-2 border-primary/20 group-hover:border-primary transition-colors duration-500">{course.description}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
