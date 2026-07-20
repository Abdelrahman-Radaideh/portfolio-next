import type { Metadata } from "next";
import "@/app/globals.css"
import Header from "@/components/layout/header";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { Suspense } from "react";
import { getActivePortfolioNameAction } from "@/actions/user-action";


export const metadata: Metadata = {
    title: "Abdelrahman Khalid Radaideh dashboard",
    description: "Abdelrahman Khalid Radaideh - dashboard Portfolio ",
};

async function AuthHeader() {
    let openDashboard = false;
    let portfolioName = undefined;
    const cookieStore = await cookies();
    try {
        const token = cookieStore.get('auth_code')?.value;
        if (token) {
            const auth = await checkAuth(token);
            if (auth) {
                openDashboard = true;
                const portfolio = await getActivePortfolioNameAction();
                portfolioName = portfolio?.portfolio_name;
            }
        }
    } catch (error) {
        console.error("Auth header check error:", error);
    }
    return <Header isAuthenticated={openDashboard} activePortfolio={portfolioName} />;
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Suspense fallback={<Header isAuthenticated={false} />}>
                <AuthHeader />
            </Suspense>
            <main className="flex-grow">
                {children}
            </main>
            <div className="text-center py-10">
                <hr className="border-border w-1/2 mx-auto" />
                <p className="text-sm text-muted mt-5">© Abdelrahman Khalid Radaideh. All rights reserved.</p>
            </div>
        </>
    );
}

