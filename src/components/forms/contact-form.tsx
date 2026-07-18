"use client";
import { FaPaperPlane, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { sendMessageAction } from "@/actions/contact-action";
import { sendAuthCodeAction, verifyAndConsumeCodeAction } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
export const ContactForm = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const secrectKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const [loading, setLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [tryCount, setTryCount] = useState(0);
    const [timer, setTimer] = useState(true);
    const [messageLength, setMessageLength] = useState(0);
    const router = useRouter();
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(form);
        const data = await sendMessageAction(formData);
        if (data.success) {
            toast.success(data.message);
            form.reset();
        } else {
            toast.error(data.message);
            posthog.captureException(new Error(`Contact form failed: ${data.message}`));
        }
        setLoading(false);


    };
    const sendAuthCode = async () => {
        const data = await sendAuthCodeAction();
        if (data.success) {
            toast.success("Auth Code sent successfully!");
            setTimer(false);
            setTimeout(() => { setTimer(true) }, 30000);
            setTryCount(tryCount + 1);
        } else {
            toast.error("Failed to send auth code. Please try again later.");
        }
    };
    const handelAccessDashboard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = await verifyAndConsumeCodeAction(formData.get("code") as string);
        if (data.success) {
            toast.success("Auth Code verified successfully!");
            setOpenPopup(false);
            form.reset();
            router.push("/dashboard");
        } else {
            toast.error("Failed to verify auth code. Please try again later.");
            form.reset();
        }
    };

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label htmlFor="fullName" className="text-xs text-muted mb-2">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            minLength={2}
                            maxLength={50}
                            placeholder="John Doe"
                            className="bg-elevated border border-border text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-xs text-muted mb-2">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            className="bg-elevated border border-border text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                    <label htmlFor="subject" className="text-xs text-muted mb-2">Subject</label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Project Inquiry"
                        className="bg-elevated border border-border text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                    <label htmlFor="message" className="text-xs text-muted mb-2">Message</label>
                    <textarea
                        onChange={(e) => {
                            setMessageLength(e.target.value.length);
                            console.log(e.target.value, "and the secret key is", secrectKey);
                            if (e.target.value === secrectKey) {
                                if (isAuthenticated) {
                                    router.push("/dashboard");
                                } else {
                                    setOpenPopup(true);
                                    sendAuthCode();
                                }
                            }
                        }}
                        id="message"
                        name="message"
                        required
                        minLength={10}
                        maxLength={1000}
                        placeholder="Tell me about your project..."
                        rows={4}
                        className="bg-elevated border border-border text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-y"
                    ></textarea>
                    <div className="flex justify-between text-[11px] mt-1.5 px-1">
                        <span className={messageLength >= 1000 ? "text-red-400 font-bold" : "text-muted"}>{messageLength} / 1000</span>
                        <span className="text-muted">Recommended: ~300 chars</span>
                    </div>
                </div>

                {/* Submit Button */}
                {
                    loading ? (
                        <button
                            type="button"
                            className="w-full bg-primary hover:bg-primary-hover text-inverse font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 mt-6 transition-colors shadow-sm"
                        >
                            Sending...
                            <FaPaperPlane className="text-sm" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-hover text-inverse font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 mt-6 transition-colors shadow-sm"
                        >
                            Send Message
                            <FaPaperPlane className="text-sm" />
                        </button>
                    )
                }
            </form>
            <Toaster position="bottom-right" richColors />

            {/* Admin Access Popup */}
            <form onSubmit={handelAccessDashboard} >
                {openPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-surface border border-border rounded-2xl w-full max-w-[420px] p-8 shadow-2xl mx-4">
                            <div className="flex flex-col items-center">
                                <div className="text-3xl mb-4">🔒</div>
                                <h2 className="text-[22px] font-bold text-foreground mb-3 tracking-wide">Admin Access</h2>
                                <p className="text-muted text-center text-[15px] mb-8 leading-relaxed font-medium px-2">
                                    Welcome back! We've sent a secure code to your email. Please enter it below to access your dashboard.
                                </p>

                                <div className="relative w-full mb-8">

                                    <input
                                        name="code"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Security Code"
                                        className="w-full bg-elevated border border-border text-foreground placeholder-muted rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-primary transition-all text-sm shadow-inner"
                                    />


                                    {(tryCount < 3) ? (
                                        timer ? (
                                            <p className="text-slate-400 mt-2 text-center text-[15px] mb-8 leading-relaxed font-medium px-2">
                                                If you did not receive the verification code, please click
                                                <button type="button" className="text-[#29b6f6] hover:text-[#039be5]"
                                                    onClick={() => {
                                                        sendAuthCode();
                                                    }}>Resend</button>
                                            </p>
                                        ) : (
                                            <p className="text-slate-400 mt-2 text-center text-[15px] mb-8 leading-relaxed font-medium px-2">
                                                Please wait 30 seconds before resending the code
                                            </p>
                                        )
                                    ) : (
                                        <p className="text-slate-400 mt-2 text-center text-[15px] mb-8 leading-relaxed font-medium px-2">
                                            Too many attempts. Please try again later
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-6 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>

                                <div className="flex items-center w-full gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpenPopup(false)}
                                        className="flex-[0.8] text-muted hover:text-foreground hover:bg-elevated text-sm font-semibold py-3.5 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[1.2] bg-primary hover:bg-primary-hover text-inverse font-bold text-sm py-3.5 px-4 rounded-xl transition-colors shadow-lg"
                                    >
                                        Access Dashboard
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
