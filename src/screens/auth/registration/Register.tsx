import { useState } from "react";
import { useRegisterMutation } from "./hooks/useReqisterMutation";

const roles = ["User", "Admin"] as const;

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<(typeof roles)[number]>("User");
    const [error, setError] = useState("");

    const registerMutation = useRegisterMutation();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!firstName || !lastName || !password || !confirmPassword || !phone) {
            setError("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        registerMutation.mutate({
            firstName,
            lastName,
            password,
            phoneNumber: phone,
            role,
        });
    };

    return (
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl shadow-indigo-100">

            {/* Logo */}
            <div className="flex justify-center mb-6">
                <div className="
                    w-14 h-14 rounded-2xl
                    bg-gradient-to-br from-indigo-500 to-purple-600
                    flex items-center justify-center
                    text-white text-2xl font-bold
                ">
                    A
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-slate-900">
                Create account
            </h1>
            <p className="text-sm text-slate-500 text-center mt-2">
                Fill the form to get started
            </p>

            <form onSubmit={handleRegister} className="space-y-4 mt-8">

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="auth-input"
                    />
                    <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="auth-input"
                    />
                </div>

                <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="auth-input"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as typeof roles[number])}
                    className="auth-input"
                >
                    {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                    type="submit"
                    className="
                        w-full h-11 mt-4 rounded-xl
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white font-semibold
                        hover:from-indigo-500 hover:to-purple-500
                        transition
                    "
                >
                    Register
                </button>
            </form>

            <p className="text-sm text-center text-slate-500 mt-6">
                Already have an account?
                <a
                    href="/login"
                    className="text-indigo-600 font-medium ml-1 hover:underline"
                >
                    Login
                </a>
            </p>
        </div>
    );
};

export default Register;
