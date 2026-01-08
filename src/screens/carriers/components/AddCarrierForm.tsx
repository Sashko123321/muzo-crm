import { type FC, type ReactNode, useState } from "react";
import type { CarrierResponse, CreateCarrierRequest, DirectionForward } from "../../../types/carrier.type.ts";
import { useCarrier } from "../../../hooks/carrier/useCarrier.ts";

interface AddCarrierFormProps {
    initialData?: CreateCarrierRequest | CarrierResponse;
    submitText?: string;
    onSubmit: (data: CreateCarrierRequest) => Promise<void>;
    onCancel?: () => void;
}

const AddCarrierForm: FC<AddCarrierFormProps> = ({ initialData, submitText = "Додати перевізника", onSubmit, onCancel }) => {
    const {  loading } = useCarrier();

    const [form, setForm] = useState<CreateCarrierRequest>({
        name: initialData?.name || "",
        phoneNumber: initialData?.phoneNumber || "",
        telegram: initialData?.telegram || "",
        vehicleType: initialData?.vehicleType || "",
        maxLoadKg: initialData?.maxLoadKg || 0,
        isActive: initialData?.isActive ?? true,
        regions: initialData?.regions || [],
    });

    const handleChange = (field: keyof CreateCarrierRequest, value: string) => {
        if (field === "maxLoadKg") {
            if (value === "" || /^[0-9]*$/.test(value)) {
                setForm(prev => ({ ...prev, [field]: Number(value) }));
            }
        } else {
            setForm(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) return alert("Ім'я обов'язкове");
        if (!form.phoneNumber.trim()) return alert("Номер телефону обов'язковий");
        if (!form.vehicleType.trim()) return alert("Тип транспортного засобу обов'язковий");
        if (form.maxLoadKg <= 0) return alert("Максимальне навантаження має бути більше 0");

        await onSubmit(form);
    };

    const inputClass = "w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const allRegions: DirectionForward[] = ["Ukraine", "Europe"];

    return (
        <div className="space-y-8">
            {/* General Info */}
            <Section title="Загальна інформація" color="bg-blue-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Ім'я" value={form.name} onChange={v => handleChange("name", v)} inputClass={inputClass} />
                    <Field label="Номер телефону" value={form.phoneNumber} onChange={v => handleChange("phoneNumber", v)} inputClass={inputClass} />
                    <Field label="Telegram" value={form.telegram || ""} onChange={v => handleChange("telegram", v)} inputClass={inputClass} />
                    <Field label="Тип транспортного засобу" value={form.vehicleType} onChange={v => handleChange("vehicleType", v)} inputClass={inputClass} />
                    <Field label="Макс. навантаження (кг)" type="number" value={form.maxLoadKg.toString()} onChange={v => handleChange("maxLoadKg", v)} inputClass={inputClass} />
                </div>
            </Section>

            {/* Regions */}
            <Section title="Регіони" color="bg-purple-500">
                <div className="flex flex-wrap gap-4">
                    {allRegions.map(region => (
                        <label key={region} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.regions?.includes(region)}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setForm(prev => ({ ...prev, regions: [...(prev.regions || []), region] }));
                                    } else {
                                        setForm(prev => ({ ...prev, regions: prev.regions?.filter(r => r !== region) }));
                                    }
                                }}
                                className="w-4 h-4"
                            />
                            {region}
                        </label>
                    ))}
                </div>
            </Section>

            {/* Submit buttons */}
            <div className="flex gap-2">
                {onCancel && (
                    <button onClick={onCancel} className="w-full h-10 rounded-xl border">
                        Скасувати
                    </button>
                )}
                <button onClick={handleSubmit} disabled={loading} className="w-full h-10 rounded-xl bg-blue-500 text-white">
                    {loading ? "Збереження..." : submitText}
                </button>
            </div>
        </div>
    );
};

export default AddCarrierForm;

/* ================= HELPERS ================= */
interface SectionProps {
    title: string;
    color: string;
    children: ReactNode;
}
const Section: FC<SectionProps> = ({ title, color, children }) => (
    <div>
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-1.5 h-6 rounded-full ${color}`} />
            <h3 className="text-lg font-medium">{title}</h3>
        </div>
        {children}
    </div>
);

interface FieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    inputClass: string;
    type?: React.HTMLInputTypeAttribute;
}
const Field: FC<FieldProps> = ({ label, value, onChange, inputClass, type = "text" }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium opacity-80">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
    </div>
);
