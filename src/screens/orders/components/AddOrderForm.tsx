import { useEffect, useState, type FC } from "react";
import type { CreateOrderRequest, OrderResponse } from "../../../types/order.type";
import type { CarrierResponse } from "../../../types/carrier.type";
import type { CargoResponse } from "../../../types/cargo.type";
import { useOrder } from "../../../hooks/order/useOrder";
import { useCarrier } from "../../../hooks/carrier/useCarrier";
import { useCargo } from "../../../hooks/cargo/useCargo";
import Field from "../../../components/field/Field.tsx";
import Section from "../../../components/section/Section.tsx";

interface AddOrderFormProps {
    onSuccess: (newOrder: OrderResponse) => void;
}

const AddOrderForm: FC<AddOrderFormProps> = ({ onSuccess }) => {
    const { create, loading } = useOrder();
    const { getAll: getCarriers } = useCarrier();
    const { getAll: getCargos } = useCargo();

    const [form, setForm] = useState<CreateOrderRequest>({
        CarrierId: 0,
        Percentage: 0,
        CommissionFor: "Carrier",
        CargoIds: [],
    });

    const [carriers, setCarriers] = useState<CarrierResponse[]>([]);
    const [cargos, setCargos] = useState<CargoResponse[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const carrierData = await getCarriers();
            if (carrierData) setCarriers(carrierData.data.filter(c => c.isActive));

            const cargoData = await getCargos();
            if (cargoData) setCargos(cargoData.data.filter(c => c.isActive));
        };
        loadData();
    }, [getCarriers, getCargos]);

    const handleSubmit = async () => {
        if (!form.CarrierId) return alert("Оберіть перевізника");
        if (form.CargoIds.length === 0) return alert("Оберіть хоча б один вантаж");

        const payload: CreateOrderRequest = {
            ...form,
            CarrierId: Number(form.CarrierId),
            CargoIds: form.CargoIds.map(id => Number(id)),
        };

        const newOrder = await create(payload);
        if (newOrder) {
            onSuccess(newOrder);
        } else {
            alert("Не вдалося створити замовлення");
        }
    };

    const inputClass = "w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="space-y-6">
            <Section title="General Info" color="bg-blue-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                        label="Percentage"
                        type="number"
                        value={form.Percentage}
                        onChange={v => setForm({ ...form, Percentage: Number(v) })}
                        inputClass={inputClass}
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium opacity-80">Commission For</label>
                        <select
                            className={inputClass}
                            value={form.CommissionFor}
                            onChange={e => setForm({ ...form, CommissionFor: e.target.value as "Carrier" | "Cargo" })}
                        >
                            <option value="Carrier">Carrier</option>
                            <option value="Cargo">Cargo</option>
                        </select>
                    </div>
                </div>
            </Section>

            <Section title="Carrier" color="bg-green-500">
                <select
                    className={inputClass}
                    value={form.CarrierId}
                    onChange={e => setForm({ ...form, CarrierId: Number(e.target.value) })}
                >
                    <option value={0} disabled>Оберіть перевізника</option>
                    {carriers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </Section>

            <Section title="Cargos" color="bg-purple-500">
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {cargos.map(cargo => (
                        <label key={cargo.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.CargoIds.includes(cargo.id)}
                                onChange={() => {
                                    const ids = form.CargoIds.includes(cargo.id)
                                        ? form.CargoIds.filter(id => id !== cargo.id)
                                        : [...form.CargoIds, cargo.id];
                                    setForm({ ...form, CargoIds: ids });
                                }}
                                className="w-4 h-4"
                            />
                            {cargo.fromLocation}-{cargo.toLocation} ({cargo.description})
                        </label>
                    ))}
                </div>
            </Section>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-10 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
                {loading ? "Adding..." : "Add Order"}
            </button>
        </div>
    );
};




export default AddOrderForm;
