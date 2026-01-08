import {type FC, useState} from "react";
import type {CreateUserRequest, RoleType} from "../../../types/user.type.ts";

interface AddMemberFormProps {
    initialData?: CreateUserRequest;
    submitText?: string;
    onSubmit: (data: CreateUserRequest) => Promise<void>;
    onCancel?: () => void;
}

const AddMemberForm: FC<AddMemberFormProps> = ({ initialData, submitText = "Зберегти", onSubmit, onCancel }) => {
    const [form, setForm] = useState<CreateUserRequest>({
        firstName: initialData?.firstName || "",
        lastName: initialData?.lastName || "",
        phoneNumber: initialData?.phoneNumber || "",
        password: initialData?.password || "",
        role: initialData?.role || "User",
    });

    const handleChange = (field: keyof CreateUserRequest, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!(form.firstName ?? "").trim()) return alert("Ім'я обов'язкове");
        if (!form.role) return alert("Роль обов'язкова");

        await onSubmit(form);
    };

    const inputClass = "w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium opacity-80">Ім'я</label>
                    <input
                        type="text"
                        value={form.firstName}
                        onChange={e => handleChange("firstName", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium opacity-80">Прізвище</label>
                    <input
                        type="text"
                        value={form.lastName}
                        onChange={e => handleChange("lastName", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium opacity-80">Телефон</label>
                    <input
                        type="text"
                        value={form.phoneNumber}
                        onChange={e => handleChange("phoneNumber", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium opacity-80">Пароль</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={e => handleChange("password", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium opacity-80">Роль</label>
                    <select
                        value={form.role}
                        onChange={e => handleChange("role", e.target.value as RoleType)}
                        className={inputClass}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2">
                {onCancel && (
                    <button onClick={onCancel} className="w-full h-10 rounded-xl border">
                        Скасувати
                    </button>
                )}
                <button onClick={handleSubmit} className="w-full h-10 rounded-xl bg-indigo-600 text-white">
                    {submitText}
                </button>
            </div>
        </div>
    );
};

export default AddMemberForm;
