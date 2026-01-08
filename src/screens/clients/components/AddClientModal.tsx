import type { ClientResponse, CreateClientRequest } from "../../../types/client.type";
import { type FC, useState } from "react";

interface AddClientFormProps {
    initialData?: ClientResponse;
    submitText?: string;
    onSubmit: (data: CreateClientRequest) => Promise<void>;
    onCancel?: () => void;
}

const AddClientForm: FC<AddClientFormProps> = ({
                                                   initialData,
                                                   submitText = "Зберегти",
                                                   onSubmit,
                                                   onCancel,
                                               }) => {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<CreateClientRequest>({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        status: initialData?.status ?? "Thinking",
        type: initialData?.type ?? "Individual",
        email: initialData?.email ?? "",
        phone: initialData?.phone ?? "",
    });

    const handleChange = <K extends keyof CreateClientRequest>(
        field: K,
        value: CreateClientRequest[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) return alert("Імʼя обовʼязкове");
        if (!form.phone?.trim()) return alert("Телефон обовʼязковий");

        setLoading(true);
        await onSubmit(form);
        setLoading(false);
    };

    const inputClass =
        "w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <div className="space-y-4">
            {/* Імʼя */}
            <Field
                label="Імʼя"
                value={form.name}
                onChange={(v) => handleChange("name", v)}
                inputClass={inputClass}
            />

            {/* Тип клієнта */}
            <SelectField
                label="Тип клієнта"
                value={form.type}
                onChange={(v) => handleChange("type", v)}
                options={[
                    { value: "Individual", label: "Фізична особа" },
                    { value: "Company", label: "Компанія" },
                    { value: "PartnerCompany", label: "Партнерська компанія" },
                ]}
            />

            {/* Статус */}
            <SelectField
                label="Статус"
                value={form.status}
                onChange={(v) => handleChange("status", v)}
                options={[
                    { value: "Thinking", label: "Думають" },
                    { value: "Supported", label: "Співпрацюємо" },
                    { value: "Declined", label: "Не співпрацюємо" },
                ]}
            />

            {/* Телефон */}
            <Field
                label="Телефон"
                value={form.phone || ""}
                onChange={(v) => handleChange("phone", v)}
                inputClass={inputClass}
            />

            {/* Email */}
            <Field
                label="Email"
                value={form.email || ""}
                onChange={(v) => handleChange("email", v)}
                inputClass={inputClass}
                type="email"
            />

            {/* Опис */}
            <TextAreaField
                label="Опис"
                value={form.description || ""}
                onChange={(v) => handleChange("description", v)}
            />

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="w-full h-10 rounded-xl border border-slate-300"
                    >
                        Скасувати
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-10 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                    {loading ? "Збереження..." : submitText}
                </button>
            </div>
        </div>
    );
};

export default AddClientForm;



interface FieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    inputClass: string;
    type?: React.HTMLInputTypeAttribute;
}

const Field: FC<FieldProps> = ({
                                   label,
                                   value,
                                   onChange,
                                   inputClass,
                                   type = "text",
                               }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
        />
    </div>
);

interface SelectFieldProps<T extends string> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: { value: T; label: string }[];
}

const SelectField = <T extends string>({
                                           label,
                                           value,
                                           onChange,
                                           options,
                                       }: SelectFieldProps<T>) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);


interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const TextAreaField: FC<TextAreaFieldProps> = ({
                                                   label,
                                                   value,
                                                   onChange,
                                               }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>
);
