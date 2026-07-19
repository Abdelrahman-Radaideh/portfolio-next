import Link from 'next/link';
import {
    FaChartLine, FaUsers, FaBriefcase, FaCode, FaProjectDiagram, FaGraduationCap, FaCertificate
} from 'react-icons/fa';
import { DashboardAnalysis } from '@/components/dashboard/dashboard-analysis';
import { DashboardPortfolios } from '@/components/dashboard/dashboard-portfolios';
import { DashboardPortfolioForm } from '@/components/forms/user-form';
import { DashboardExperience } from '@/components/dashboard/dashboard-experience';
import { DashboardExperienceForm } from '@/components/forms/experience-form';
import { DashboardEducation } from '@/components/dashboard/dashboard-education';
import { DashboardEducationForm } from '@/components/forms/education-form';
import { DashboardCourses } from '@/components/dashboard/dashboard-courses';
import { DashboardCourseForm } from '@/components/forms/course-form';
import { DashboardSkills } from '@/components/dashboard/dashboard-skills';
import { DashboardProjects } from '@/components/dashboard/dashboard-projects';
import { DashboardProjectForm } from '@/components/forms/project-form';
import { Suspense } from 'react';
export type TabKey = 'analysis' | 'portfolios' | 'experience' | 'education' | 'courses' | 'projects' | 'skills';

interface DashboardPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const params = await searchParams;
    const activeTab = (params.tab as TabKey) || 'analysis';
    const action = params.action as string | undefined;
    const id = params.id as string | undefined || null;

    const navItems = [
        { id: 'analysis', label: 'Analysis', icon: FaChartLine, color: '#0ea5e9' },
        { id: 'portfolios', label: 'Portfolios', icon: FaUsers, color: '#f59e0b' },
        { id: 'experience', label: 'Experience', icon: FaBriefcase, color: '#ec4899' },
        { id: 'education', label: 'Education', icon: FaGraduationCap, color: '#10b981' },
        { id: 'courses', label: 'Courses', icon: FaCertificate, color: '#f43f5e' },
        { id: 'projects', label: 'Projects', icon: FaProjectDiagram, color: '#a855f7' },
        { id: 'skills', label: 'Skills', icon: FaCode, color: '#3b82f6' },
    ];

    const navBar = () => (
        <nav className="mt-4 flex flex-col gap-1 px-3">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.id}
                        href={`?tab=${item.id}`}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl relative group transition-all w-full text-left
                            ${isActive
                                ? 'bg-opacity-10'
                                : 'text-muted hover:text-foreground hover:bg-sidebar-hover'
                            }
                        `}
                        style={isActive ? { color: item.color, backgroundColor: `${item.color}1a` } : {}}
                    >
                        {isActive && (
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md"
                                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                            ></div>
                        )}
                        <Icon className={`text-lg ${!isActive ? `group-hover:text-[${item.color}]` : ''}`} style={!isActive ? {} : { color: item.color }} />
                        <span className="font-semibold text-sm">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen pt-[104px] flex relative bg-background transition-colors duration-300">

            {/* Sidebar */}
            <aside className="w-64 border-r border-border hidden lg:block bg-sidebar-bg sticky top-[104px] h-[calc(100vh-104px)] overflow-y-auto transition-colors duration-300">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-1">Admin Panel</h2>
                    <p className="text-sm text-muted">Manage your portfolio</p>
                </div>
                {navBar()}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 lg:p-10 w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto space-y-8">
                {activeTab === 'analysis' && <DashboardAnalysis />}
                {activeTab === 'portfolios' && (
                    (action === 'new' || action === 'edit') ? <DashboardPortfolioForm userId={id ? Number(id) : undefined} /> : <DashboardPortfolios />
                )}
                {activeTab === 'experience' && (
                    (action === 'new' || action === 'edit') ? <DashboardExperienceForm experienceId={id ? Number(id) : undefined} /> : <DashboardExperience />
                )}
                {activeTab === 'education' && (
                    (action === 'new' || action === 'edit') ? <DashboardEducationForm educationId={id ? Number(id) : undefined} /> : <DashboardEducation />
                )}
                {activeTab === 'courses' && (
                    (action === 'new' || action === 'edit') ? <DashboardCourseForm courseId={id ? Number(id) : undefined} /> : <DashboardCourses />
                )}
                {activeTab === 'projects' && (
                    (action === 'new' || action === 'edit') ? <DashboardProjectForm projectId={id ? Number(id) : undefined} /> : <DashboardProjects />
                )}
                {activeTab === 'skills' && <DashboardSkills />}
            </main>
        </div>
    );
}
