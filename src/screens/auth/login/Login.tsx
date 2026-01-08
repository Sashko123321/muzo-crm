import { useState } from "react";
import { useLoginMutation } from "./hooks/useLoginMutation";
import { Truck } from "lucide-react";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const loginMutation = useLoginMutation();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!phoneNumber.trim() || !password.trim()) {
            setError("Please enter both phone number and password.");
            return;
        }

        loginMutation.mutate(
            { phoneNumber, password },
            {
                onError: (err: unknown) => {
                    if (err && typeof err === "object" && "response" in err) {
                        const e = err as { response?: { data?: { message?: string } }; message?: string };
                        setError(e.response?.data?.message || e.message || "Login failed. Try again.");
                    } else if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Login failed. Try again.");
                    }
                },
            }
        );
    };

    const isLoading = loginMutation.isPending;

    return (
        <div
            className="
                w-full max-w-md
                bg-white
                rounded-none sm:rounded-2xl
                p-5 sm:p-8
                shadow-none sm:shadow-xl sm:shadow-indigo-100
                min-h-screen sm:min-h-0
                flex flex-col justify-center
            "
        >
            {/* Logo */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
                <div
                    className="
                        w-12 h-12 sm:w-14 sm:h-14
                        rounded-xl sm:rounded-2xl
                        bg-gradient-to-br from-indigo-500 to-purple-600
                        flex items-center justify-center
                        text-white
                    "
                >
                    <Truck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <span className="font-bold text-2xl sm:text-3xl text-slate-800">
                    MuzoCRM
                </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
                Welcome back
            </h1>
            <p className="text-sm text-slate-500 text-center mt-2">
                Sign in to your account
            </p>

            <form onSubmit={handleLogin} className="space-y-4 mt-8">
                {/* Phone */}
                <div>
                    <label className="text-sm font-medium text-slate-600">
                        Phone number
                    </label>
                    <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        autoFocus
                        disabled={isLoading}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="
                            mt-1 w-full h-11 sm:h-12 rounded-xl px-3
                            border border-slate-300
                            text-slate-900
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                            disabled:opacity-60
                        "
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm font-medium text-slate-600">
                        Password
                    </label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="
                            mt-1 w-full h-11 sm:h-12 rounded-xl px-3
                            border border-slate-300
                            text-slate-900
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                            disabled:opacity-60
                        "
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500 text-center sm:text-left">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        w-full h-12 sm:h-11 mt-4
                        rounded-xl
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white font-semibold
                        hover:from-indigo-500 hover:to-purple-500
                        active:scale-[0.99]
                        transition
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >
                    {isLoading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
