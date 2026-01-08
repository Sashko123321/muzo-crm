import { type FC, type ReactNode, useState, useEffect } from "react";
import { useCargo } from "../../../hooks/cargo/useCargo.ts";
import { useClient } from "../../../hooks/client/useClient.ts";
import type { CargoResponse, CreateCargoRequest, Currency, DirectionForward } from "../../../types/cargo.type.ts";
import {type ClientResponse, isDuplicateResponse} from "../../../types/client.type.ts";
import AddModal from "../../../components/shered/AddModal.tsx";
import AddClientForm from "../../clients/components/AddClientModal.tsx";

interface AddCargoFormProps {
    initialData?: CreateCargoRequest | CargoResponse;
    submitText?: string;
    onSubmit: (data: CreateCargoRequest) => Promise<void>;
    onCancel?: () => void;
}

const AddCargoForm = ({ initialData, submitText, onSubmit, onCancel }: AddCargoFormProps) => {
    const { loading } = useCargo();
    const { getAll: getClients,create } = useClient();
    const [clients, setClients] = useState<ClientResponse[]>([]);
    const [showAddClientModal, setShowAddClientModal] = useState(false);

    const [form, setForm] = useState<CreateCargoRequest>({
        description: initialData?.description || "",
        weightKg: initialData?.weightKg || 0,
        dimensions: initialData?.dimensions || "",
        clientId: (initialData as CreateCargoRequest)?.clientId || 0, // ✅ латинська c
        fromLocation: initialData?.fromLocation || "",
        toLocation: initialData?.toLocation || "",
        availableFrom: initialData?.availableFrom || new Date().toISOString().split("T")[0],
        availableTo: initialData?.availableTo || new Date().toISOString().split("T")[0],
        directionForward: initialData?.directionForward || "Ukraine",
        price: initialData?.price || 0,
        currency: initialData?.currency || "USD",
        notes: initialData?.notes || "",
        isActive: initialData?.isActive ?? true,
    });


    // Завантажуємо список клієнтів
    useEffect(() => {
        (async () => {
            const data = await getClients({ limit: 100 });
            if (data) setClients(data.data);
        })();
    }, []);

    const handleChange = (field: keyof typeof form, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.description.trim()) return alert("Description is required");
        if (!form.clientId || form.clientId === 0) return alert("Select a client");


        await onSubmit({
            ...form,
            weightKg: Number(form.weightKg),
            price: Number(form.price),
        });
    };

    // // Додаємо нового клієнта в список після створення
    // const handleAddClient = (newClient: ClientResponse) => {
    //     setClients(prev => [...prev, newClient]);
    //     setForm(prev => ({ ...prev, clientId: newClient.id })); // ✅ виправлено clientId
    //     setShowAddClientModal(false);
    // };


    const inputClass = "w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm";

    return (
        <div className="space-y-8">
            {/* Загальна інформація */}
            <Section title="Загальна Інформація" color="bg-blue-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Опис" value={form.description} onChange={(v) => handleChange("description", v)} inputClass={inputClass} />
                    <Field label="Вага (кг)" type="number" value={form.weightKg} onChange={(v) => handleChange("weightKg", v)} inputClass={inputClass} />
                    <Field label="Розміри" value={form.dimensions ?? ""} onChange={(v) => handleChange("dimensions", v)} inputClass={inputClass} />
                    <Field label="Вартість" type="number" value={form.price} onChange={(v) => handleChange("price", v)} inputClass={inputClass} />
                </div>

                <div className="mt-4">
                    <label className="text-sm font-medium opacity-80 mb-1 block">Валюта</label>
                    <select value={form.currency} onChange={(e) => handleChange("currency", e.target.value as Currency)} className={inputClass}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="UAH">UAH</option>
                    </select>
                </div>

                <div className="mt-4">
                    <label className="text-sm font-medium opacity-80 mb-1 block">Напрямок</label>
                    <select value={form.directionForward} onChange={(e) => handleChange("directionForward", e.target.value as DirectionForward)} className={inputClass}>
                        <option value="Ukraine">Ukraine</option>
                        <option value="Europe">Europe</option>
                    </select>
                </div>
            </Section>

            {/* Дати завантаження */}
            <Section title="Дати завантаження" color="bg-yellow-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Завантаження з" type="date" value={form.availableFrom} onChange={(v) => handleChange("availableFrom", v)} inputClass={inputClass} />
                    <Field label="Завантаження до" type="date" value={form.availableTo} onChange={(v) => handleChange("availableTo", v)} inputClass={inputClass} />
                </div>
            </Section>

            {/* Клієнт */}
            <Section title="Клієнт" color="bg-green-500">
                <div className="flex items-center gap-2 mt-2">
                    <select value={form.clientId} onChange={(e) => handleChange("clientId", Number(e.target.value))}>

                    <option value={0}>-- Оберіть клієнта --</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.phone ?? "немає телефону"})</option>
                        ))}
                    </select>
                    <button type="button" className="px-3 py-2 bg-green-600 text-white rounded-xl" onClick={() => setShowAddClientModal(true)}>
                        + Додати нового
                    </button>
                </div>
            </Section>

            {/* Маршрут */}
            <Section title="Маршрут" color="bg-purple-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Звідки" value={form.fromLocation ?? ""} onChange={(v) => handleChange("fromLocation", v)} inputClass={inputClass} />
                    <Field label="Куди" value={form.toLocation ?? ""} onChange={(v) => handleChange("toLocation", v)} inputClass={inputClass} />
                </div>
            </Section>

            {/* Нотатки */}
            <Section title="Нотатки" color="bg-gray-500">
                <textarea value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm resize-none" placeholder="Додаткові нотатки..." rows={4} />
            </Section>

            <div className="flex gap-2">
                {onCancel && <button onClick={onCancel} className="w-full h-10 rounded-xl border">Скасувати</button>}
                <button onClick={handleSubmit} disabled={loading} className="w-full h-10 rounded-xl bg-indigo-600 text-white">{loading ? "Збереження..." : submitText}</button>
            </div>

            {showAddClientModal && (
                <AddModal
                    open={showAddClientModal}
                    onClose={setShowAddClientModal}
                    title="Додати клієнта"
                >
                    <AddClientForm
                        submitText="Додати клієнта"
                        onSubmit={async (data) => {
                            const client = await create(data);
                            if (!client) return;

                            if (isDuplicateResponse(client)) {
                                alert(client.message); // показуємо повідомлення про дубль
                                return;
                            }

                            setClients((prev) => [client, ...prev]);
                            setForm((prev) => ({ ...prev, clientId: client.id })); // обираємо нового клієнта
                            setShowAddClientModal(false);
                        }}

                    />
                </AddModal>
            )}

        </div>
    );
};

export default AddCargoForm;

/* Section & Field залишаються без змін */
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
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
);
