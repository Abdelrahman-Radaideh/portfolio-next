"use client";

import { useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { getExportDataAction } from "@/actions/export-action";
import { getActivePortfolioNameAction } from "@/actions/user-action";

export function ExportDataCard() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const { portfolio_name } = await getActivePortfolioNameAction();
            const data = await getExportDataAction();

            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `portfolio-data-${portfolio_name}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export data. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border-hover transition-all duration-normal">
            <div className="mb-6">
                <FaFileExport className="text-primary text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Export User Data</h3>
            <p className="text-muted text-sm mb-8 leading-relaxed max-w-sm flex-1">
                Download all your active portfolio data including skills, projects, experiences, courses, and education in JSON format.
            </p>
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-primary hover:bg-primary-hover disabled:bg-muted disabled:cursor-not-allowed text-inverse font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg"
            >
                {isExporting ? "Exporting..." : "Download Data"}
            </button>
        </div>
    );
}
