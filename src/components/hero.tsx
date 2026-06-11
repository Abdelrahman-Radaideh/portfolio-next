"use client";
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/lib/models/user';
import { Skill } from '@/lib/models/skill';
import Marquee from "react-fast-marquee";
import { getIconForTechnology } from '@/lib/utils/client/icon-mapper';
import { motion, Variants } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import posthog from 'posthog-js';

export default function HeroSection({ user, skills }: { user: User, skills: Skill[] }) {
    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const skillsSlider = () => (
        <div className="mt-20 md:mt-32 w-full py-8 relative z-10 flex flex-col items-center bg-white/80 dark:bg-[#0b1120]/30 shadow-lg dark:shadow-2xl">
            {/* Top glowing scanning line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden bg-slate-200 dark:bg-slate-800/30">
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-[40%] h-full bg-gradient-to-r from-transparent via-[#0ea5e9] dark:via-[#38bdf8] to-transparent"
                />
            </div>

            <Marquee gradient={false} speed={40}>
                {skills.map((skill, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 px-12 group cursor-pointer">
                        <span className="text-3xl text-muted group-hover:text-primary transition-all duration-normal ease-smooth">
                            {getIconForTechnology(skill.name)}
                        </span>
                        <span className="text-[11px] font-semibold tracking-wider text-muted group-hover:text-foreground transition-colors duration-normal ease-smooth hidden md:block">
                            {skill.name}
                        </span>
                    </div>
                ))}
            </Marquee>

            {/* Bottom glowing scanning line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden bg-slate-200 dark:bg-slate-800/30">
                <motion.div
                    animate={{ x: ['200%', '-100%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-[40%] h-full bg-gradient-to-r from-transparent via-[#0ea5e9] dark:via-[#38bdf8] to-transparent"
                />
            </div>

            {/* Subtle Down Arrow */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -bottom-16 text-[#38bdf8]/50 flex justify-center"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
            </motion.div>
        </div>
    );

    return (
        <section className='flex flex-col relative pt-16 md:pt-24 w-full' id="hero">
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 xl:px-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-8">
                {/* Left content */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left z-10"
                >
                    <motion.div variants={fadeIn} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0ea5e9]/10 dark:bg-[#38bdf8]/10 border border-[#0ea5e9]/20 dark:border-[#38bdf8]/20 text-[#0ea5e9] dark:text-[#38bdf8] text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(14,165,233,0.05)] dark:shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] dark:bg-[#38bdf8] animate-pulse" />
                            {user.job_title}
                        </span>
                    </motion.div>

                    <motion.div variants={fadeIn} className="mb-6 space-y-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                            Hi, I'm <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary drop-shadow-sm">
                                {user.name}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted font-light leading-relaxed max-w-xl mb-10">
                        {user.hero_description}
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link href={user.resume_url} onClick={() => posthog.capture("resume_downloaded", { resume_url: user.resume_url })} className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-inverse font-bold rounded-full transition-all duration-normal ease-smooth transform hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--primary-glow)] text-center flex items-center justify-center gap-2">
                            Download CV
                        </Link>
                        <Link href={'/#contact'} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border hover:border-primary text-foreground hover:text-primary font-bold rounded-full transition-all duration-normal ease-smooth transform hover:-translate-y-1 text-center">
                            Let's Connect
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Cinematic Right Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="flex-shrink-0 relative group z-10 w-[280px] md:w-[380px] mt-16 md:mt-24 lg:mt-0 lg:ml-12"
                >
                    {/* The Main Container */}
                    <div className="relative w-full aspect-[4/4.5] rounded-[3rem] bg-[#293247] p-[8px] shadow-2xl group overflow-visible z-10">
                        
                        {/* Decorative Top-Right Corner Bracket */}
                        <div className="absolute -top-[12px] -right-[12px] w-24 h-24 border-t-[5px] border-r-[5px] border-white rounded-tr-[3.5rem] z-20 pointer-events-none" />
                        
                        {/* Decorative Bottom-Left Corner Bracket */}
                        <div className="absolute -bottom-[12px] -left-[12px] w-24 h-24 border-b-[5px] border-l-[5px] border-white rounded-bl-[3.5rem] z-20 pointer-events-none" />

                        <div className="w-full h-full relative z-10 overflow-hidden rounded-[2.5rem] bg-[#2e3748]">
                            
                            {/* Animated Internal Border Layer */}
                            <div className="absolute inset-0 z-0">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-90"
                                    style={{
                                        background: 'conic-gradient(from 0deg, transparent 0 280deg, var(--primary) 360deg)'
                                    }}
                                />
                            </div>

                            {/* Image Container with Inner Gap */}
                            <div className="absolute inset-[3px] z-10 overflow-hidden rounded-[2.4rem] bg-[#0b1221]">
                                {user.picture_url && (
                                    <Image
                                        src={user.picture_url}
                                        alt={user.name}
                                        fill
                                        sizes="(max-width: 768px) 340px, 400px"
                                        className="object-cover object-[center_top] scale-[1.25] group-hover:scale-[1.3] transition-all duration-1000 ease-smooth drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                        priority
                                        unoptimized
                                    />
                                )}
                            </div>
                        </div>

                        {/* Centered Floating Glass Pill Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-8 inset-x-0 flex justify-center z-30 pointer-events-none"
                        >
                            <div className="px-6 py-2 bg-[#6b7280]/80 backdrop-blur-md border border-white/20 rounded-[1.2rem] shadow-xl">
                                <p className="text-white text-[14px] md:text-[15px] font-semibold tracking-wide text-center">{user.job_title || 'Software Engineer'}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Small Decorative Floating Icon */}
                    {user.linkedin_url && (
                        <Link href={user.linkedin_url} target="_blank" onClick={() => posthog.capture("linkedin_profile_viewed")} className="absolute top-1/2 -left-5 w-10 h-10 bg-surface/80 backdrop-blur-md border border-border rounded-xl flex items-center justify-center shadow-lg transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[#0a66c2] text-muted transition-all duration-500 ease-smooth z-20 hover:scale-110">
                            <FaLinkedin className="w-5 h-5" />
                        </Link>
                    )}
                </motion.div>
            </div>

            {skillsSlider()}
        </section>
    )
}