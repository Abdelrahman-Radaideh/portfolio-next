"use client";
import { Project } from "@/lib/models/project";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Projects({ projects }: { projects: Project[] }) {
    projects.sort((a, b) => a.sort_order - b.sort_order);
    const ImageSlider = ({ imgeurl, projectName }: { imgeurl: string[], projectName: string }) => {
        return (
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="w-full aspect-video bg-transparent rounded-[2rem] overflow-hidden"
            >
                {imgeurl.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={slide}
                            alt={`${projectName} preview ${index + 1}`}
                            className="w-full h-full object-cover object-center transform transition-transform duration-[10s] hover:scale-105"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    const statusColor = (status: string) => {
        const normalized = status.toLowerCase().replace(/_/g, ' ').trim();
        switch (normalized) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'in progress':
                return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            case 'suspended':
                return 'bg-red-500/10 text-red-400 border border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        }
    }

    const projectCard = (project: Project, index: number) => {
        const isReversed = index % 2 !== 0;
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                key={project.id}
                className={`flex flex-col ${isReversed ? 'xl:flex-row-reverse' : 'xl:flex-row'} gap-12 xl:gap-20 mb-32 lg:mb-40 items-center justify-between w-full`}
            >
                {/* Left side: Animated Border Image Slider Container */}
                <div className="w-full xl:w-[58%] relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-[700ms] ease-smooth pointer-events-none" />

                    {/* Animated Light Border Wrapper */}
                    <div className="relative rounded-[2rem] overflow-hidden p-[2px] shadow-2xl group">
                        {/* Spinning beam */}
                        <div className="absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_75%,var(--primary)_100%)] opacity-80" />

                        {/* Inner Container */}
                        <div className="relative w-full h-full bg-surface rounded-[calc(2rem-2px)] p-2 z-10 overflow-hidden">
                            <div className="rounded-[1.5rem] overflow-hidden relative border border-border">
                                <div className={`absolute top-6 left-6 z-10 ${statusColor(project.status || 'Completed')} px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] rounded-full backdrop-blur-md shadow-lg`}>
                                    {(project.status || 'Completed').replace(/_/g, ' ')}
                                </div>
                                {project.images && <ImageSlider imgeurl={project.images} projectName={project.title} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Project Details */}
                <div className="w-full xl:w-[40%] flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            {project.title}
                        </h3>

                        <p className="text-muted text-base md:text-lg mb-10 leading-relaxed font-light">
                            {project.description}
                        </p>

                        {/* Metadata Bento Box */}
                        <div className="relative overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-md rounded-[2rem] p-6 md:p-8 grid grid-cols-2 gap-y-8 gap-x-4 mb-10 shadow-xl lg:shadow-2xl hover:border-primary/30 transition-all duration-normal ease-smooth group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-normal ease-smooth pointer-events-none" />
                            <div className="flex flex-col gap-2 relative z-10">
                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none">Year</span>
                                <span className="text-sm md:text-base font-bold text-foreground leading-none">{project.year}</span>
                            </div>
                            <div className="flex flex-col gap-2 relative z-10">
                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none">Role</span>
                                <span className="text-sm md:text-base font-bold text-foreground leading-none">{project.role}</span>
                            </div>
                            <div className="flex flex-col gap-2 relative z-10">
                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none">Technologies</span>
                                <span className="text-sm md:text-base font-bold text-primary drop-shadow-[0_0_8px_var(--primary-glow)] leading-snug">{project.technologies}</span>
                            </div>
                            <div className="flex flex-col gap-2 relative z-10">
                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none">Client</span>
                                <span className="text-sm md:text-base font-bold text-foreground leading-none">{project.client}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-inverse font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-normal ease-smooth transform hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--primary-glow)] w-max"
                            >
                                <FaGithub className="w-4 h-4" />
                                View Code
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    return (
        <section id="projects" className='flex flex-col pt-12 pb-24 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto w-full relative z-10'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center mb-24 lg:mb-32 text-center"
            >
                <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border mb-6 backdrop-blur-sm shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className='text-xs text-primary font-bold tracking-[0.2em] uppercase'>My Work</span>
                </div>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight'>Featured Projects</h2>
                <p className='text-muted max-w-2xl text-lg font-light leading-relaxed'>A collection of carefully crafted projects that showcase my passion for building beautiful and robust web applications.</p>
            </motion.div>

            <div className="flex flex-col">
                {projects.map((project, index) => projectCard(project, index))}
            </div>
        </section>
    )
}
