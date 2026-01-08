// import { useState, useEffect } from "react";
// // import { useThemeStore } from "../../store/useThemeStore";
// import { X } from "lucide-react";
// import type {CreateOrderRequest, OrderResponse} from "../../types/order.type";
// import type { CarrierResponse } from "../../types/carrier.type";
// import type { CargoResponse } from "../../types/cargo.type";
// import {useOrder} from "../../hooks/order/useOrder.ts";
// import {useCarrier} from "../../hooks/carrier/useCarrier.ts";
// import {useCargo} from "../../hooks/cargo/useCargo.ts";
//
// interface AddOrderModalProps {
//     onClose: () => void;
//     onAdd: (newOrder: OrderResponse) => void;
// }
//
// const AddOrderModal = ({ onClose, onAdd }: AddOrderModalProps) => {
//     // const theme = useThemeStore(s => s.theme);
//
//     const { create, loading } = useOrder();
//     const { getAll: getCarriers } = useCarrier();
//     const { getAll: getCargos } = useCargo();
//
//     const [form, setForm] = useState<CreateOrderRequest>({
//         CarrierId: 0,          // спочатку нічого не вибрано
//         Percentage: 0,
//         CommissionFor: "Carrier",
//         CargoIds: [],           // масив порожній
//     });
//
//
//     const [carriers, setCarriers] = useState<CarrierResponse[]>([]);
//     const [cargos, setCargos] = useState<CargoResponse[]>([]);
//
//     const handleSubmit = async () => {
//         if (!form.CarrierId) return alert("Select a carrier");
//         if (form.CargoIds.length === 0) return alert("Select at least one cargo");
//
//         const payload: CreateOrderRequest = {
//             ...form,
//             CarrierId: Number(form.CarrierId),
//             CargoIds: form.CargoIds.map(id => Number(id)),
//         };
//
//         const newOrder = await create(payload);
//         if (newOrder) {
//             onAdd(newOrder);
//             onClose();
//         } else {
//             alert("Failed to create order");
//         }
//     };
//
//     // Завантаження перевізників і вантажів
//     useEffect(() => {
//         const loadData = async () => {
//             const carrierData = await getCarriers();
//             if (carrierData) setCarriers(carrierData.data.filter(c => c.isActive));
//
//             const cargoData = await getCargos();
//             if (cargoData) setCargos(cargoData.data.filter(c => c.isActive));
//         };
//         loadData();
//     }, [getCarriers, getCargos]);
//
//
//
//     const inputClass = `w-full px-3 py-2 rounded-xl border transition text-sm bg-gray-100 border-gray-300 focus:border-blue-500 `;
//     // ${
//     //     theme === "dark"
//     //         ? "bg-gray-800 border-gray-700 text-white focus:border-blue-400"
//     //         : ""
//     // }
//     return (
//         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50" onClick={onClose}>
//             <div
//                 className={`relative w-full max-w-2xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl border
//                     animate-[fadeIn_0.2s_ease-out] bg-white border-gray-200 text-gray-900
//
//                     flex flex-col`}
//                 onClick={e => e.stopPropagation()}
//             >
//                 {/*${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : ""}*/}
//                 {/* HEADER */}
//                 <div className={`flex items-center justify-between p-5 border-b sticky top-0 z-10 bg-white border-gray-200 `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     <h2 className="text-xl font-semibold">Add New Order</h2>
//                     <button
//                         className={`px-2 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200 `}
//                         onClick={onClose}
//                     >
//                         {/*${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""}*/}
//                         <X size={18} />
//                     </button>
//                 </div>
//
//                 {/* BODY */}
//                 <div className="p-6 space-y-6 overflow-y-auto flex-1">
//                     <Section title="General Info" color="bg-blue-500">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                             <Field label="Percentage" type="number" value={form.Percentage} onChange={v => setForm({ ...form, Percentage: Number(v) })} inputClass={inputClass} />
//                             <div className="flex flex-col gap-1">
//                                 <label className="text-sm font-medium opacity-80">Commission For</label>
//                                 <select value={form.CommissionFor} onChange={e => setForm({ ...form, CommissionFor: e.target.value as "Carrier" | "Cargo" })} className={inputClass}>
//                                     <option value="Carrier">Carrier</option>
//                                     <option value="Cargo">Cargo</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </Section>
//
//                     <Section title="Carrier" color="bg-green-500">
//                         <select className={inputClass} value={form.CarrierId} onChange={e => setForm({ ...form, CarrierId: Number(e.target.value) })}>
//                             <option value={0} disabled>Select a carrier</option>
//                             {carriers.map(c => (
//                                 <option key={c.id} value={c.id}>{c.name}</option>
//                             ))}
//                         </select>
//                     </Section>
//
//                     <Section title="Cargos" color="bg-purple-500">
//                         <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
//                             {cargos.map(cargo => (
//                                 <label key={cargo.id} className="flex items-center gap-2">
//                                     <input
//                                         type="checkbox"
//                                         className="checkbox"
//                                         checked={form.CargoIds.includes(cargo.id)}
//                                         onChange={() => {
//                                             const ids = form.CargoIds.includes(cargo.id)
//                                                 ? form.CargoIds.filter(id => id !== cargo.id)
//                                                 : [...form.CargoIds, cargo.id];
//                                             setForm({ ...form, CargoIds: ids });
//                                         }}
//                                     />
//                                     {cargo.fromLocation}-{cargo.toLocation} ({cargo.description})
//                                 </label>
//                             ))}
//                         </div>
//                     </Section>
//                 </div>
//
//                 {/* FOOTER */}
//                 <div className={`flex flex-col sm:flex-row justify-end gap-2 p-4 border-t sticky bottom-0 z-10 bg-white border-gray-200 `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     <button
//                         className={`px-5 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200 `}
//                         onClick={onClose}
//                     >
//                         {/*${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""}*/}
//                         Cancel
//                     </button>
//                     <button
//                         className="px-5 py-2 rounded-lg font-medium shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                     >
//                         {loading ? "Adding..." : "Add Order"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const Section = ({ title, color, children }: { title: string; color: string; children: React.ReactNode }) => (
//     <div>
//         <div className="flex items-center gap-3 mb-3">
//             <div className={`w-1.5 h-6 rounded-full ${color}`} />
//             <h3 className="text-lg font-medium">{title}</h3>
//         </div>
//         {children}
//     </div>
// );
//
// const Field = ({ label, value, onChange, inputClass, type = "text" }: { label: string; value: string | number; onChange: (v: string) => void; inputClass: string; type?: string }) => (
//     <div className="flex flex-col gap-1">
//         <label className="text-sm font-medium opacity-80">{label}</label>
//         <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
//     </div>
// );
//
// export default AddOrderModal;
