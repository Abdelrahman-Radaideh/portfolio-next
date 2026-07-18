import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { Suspense } from "react";
import { getActivePortfolioNameAction } from "@/actions/user-action";
export const metadata: Metadata = {
  title: "Zaid Alradaideh",
  description: "Zaid Alradaideh - Portfolio",
};

async function athCheck() {
  let openDashboard = false;
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get('auth_code')?.value;
    if (token) {
      const isAuthenticated = await checkAuth(token);
      if (isAuthenticated) {
        openDashboard = true;
      }
    }
  } catch (error) {
    console.error("Auth header check error:", error);
  }
  return openDashboard;
}

async function AuthHeader() {
  const isAuthenticated = await athCheck();
  let portfolioName = undefined;
  if (isAuthenticated) {
      const portfolio = await getActivePortfolioNameAction();
      portfolioName = portfolio?.portfolio_name;
  }
  return <Header isAuthenticated={isAuthenticated} activePortfolio={portfolioName} />;
}

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await athCheck();

  return (
    <>
      <Suspense fallback={<Header isAuthenticated={false} />}>
        <AuthHeader />
      </Suspense>
      <main className="flex-grow">
        {children}
      </main>
      <Footer isAuthenticated={isAuthenticated} />
      <div className="text-center py-4">
        <hr className="border-gray-500 w-1/2 mx-auto" />
        <p className="text-sm text-gray-500 mt-5">© Zaid Radaideh. All rights reserved.</p>
      </div>
    </>
  );
}

