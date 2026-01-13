// utils/auth.ts
export const getUserRole = (): "Admin" | "User" | null => {
    try {
        const raw = localStorage.getItem("profile");
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed?.role ?? null;
    } catch {
        return null;
    }
};
