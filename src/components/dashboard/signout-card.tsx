"use client";
import { FaSignOutAlt } from "react-icons/fa";
import { signOutAction } from "@/actions/auth-action";
import posthog from "posthog-js";

const SignOutCard = () => {
    const handleSignOut = async () => {
        posthog.reset();
        await signOutAction();
    };
    return (
        <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border-hover transition-all duration-normal">
            <div className="mb-6 bg-red-500/10 p-4 rounded-full">
                <FaSignOutAlt className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Sign Out</h3>
            <p className="text-muted text-sm mb-8 leading-relaxed max-w-sm flex-1">
                Securely end your session and return to the login screen
            </p>
            <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg shadow-red-600/20">
                Sign Out
            </button>
        </div>
    )
}

export default SignOutCard