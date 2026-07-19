"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import type {
    CountryBreakdownItem,
    EngagementResult,
} from "@/actions/posthog-action";
import { useEffect, useState } from "react";

interface PostHogChartsClientProps {
    countryData: CountryBreakdownItem[];
    engagement: EngagementResult;
}

export function PostHogChartsClient({
    countryData,
    engagement,
}: PostHogChartsClientProps) {
    // Prevent hydration mismatch by only rendering Recharts after mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-surface border border-border rounded-2xl p-6 h-72 lg:col-span-2 animate-pulse" />
                <div className="bg-surface border border-border rounded-2xl p-6 h-72 animate-pulse" />
            </div>
        );
    }

    // Prepare pie data
    const pieData = [
        { name: "CV Downloads", value: engagement.cvDownloads, color: "#10b981" },
        { name: "LinkedIn Views", value: engagement.linkedinViews, color: "#0a66c2" },
    ].filter(d => d.value > 0);

    const hasPieData = pieData.length > 0;
    const hasCountryData = countryData.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ── Country Breakdown (Horizontal Bar Chart) ────────────────── */}
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col shadow-md lg:col-span-2 hover:shadow-lg transition-all duration-300">
                <h3 className="text-sm font-bold tracking-wider text-muted uppercase mb-4">
                    Top Countries (Unique Visitors)
                </h3>
                <div className="flex-1 w-full h-64 min-h-[250px]">
                    {!hasCountryData ? (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                            No country data available.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={256}>
                            <BarChart
                                data={countryData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    dataKey="country"
                                    type="category"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={80}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: 'var(--sidebar-hover)' }}
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-surface)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--text)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                    itemStyle={{ color: 'var(--text)' }}
                                />
                                <Bar dataKey="visitors" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── Engagement Split (Pie Chart) ──────────────────────────────── */}
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-sm font-bold tracking-wider text-muted uppercase mb-4">
                    Engagement Split
                </h3>
                <div className="flex-1 w-full h-64 min-h-[250px]">
                    {!hasPieData ? (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                            No engagement events yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={256}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-surface)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--text)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                    itemStyle={{ color: 'var(--text)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                {/* Custom Legend */}
                {hasPieData && (
                    <div className="mt-4 flex flex-col gap-2">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-muted">{entry.name}</span>
                                </div>
                                <span className="font-bold text-foreground">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
