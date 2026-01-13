import type { FC } from "react";
import { useState } from "react";
import type { ClientResponse, CreateClientRequest } from "../../../types/client.type";

import TextAreaField from "../../../components/field/TextAreaField.tsx";
import SelectField from "../../../components/field/SelectField.tsx";
import Section from "../../../components/section/Section.tsx";
import Field from "../../../components/field/Field.tsx";

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
        setForm(prev => ({ ...prev, [field]: value }));
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
        <div className="space-y-6">
            <Section title="Основна інформація" color="bg-indigo-500">
                <div className="space-y-4">
                    <Field
                        label="Імʼя"
                        value={form.name}
                        onChange={(v) => handleChange("name", v)}
                        inputClass={inputClass}
                    />

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
                </div>
            </Section>

            <Section title="Контактні дані" color="bg-emerald-500">
                <div className="space-y-4">
                    <Field
                        label="Телефон"
                        value={form.phone || ""}
                        onChange={(v) => handleChange("phone", v)}
                        inputClass={inputClass}
                    />

                    <Field
                        label="Email"
                        value={form.email || ""}
                        onChange={(v) => handleChange("email", v)}
                        inputClass={inputClass}
                        type="email"
                    />
                </div>
            </Section>

            <Section title="Додатково" color="bg-slate-400">
                <TextAreaField
                    label="Опис"
                    value={form.description || ""}
                    onChange={(v) => handleChange("description", v)}
                />
            </Section>

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
