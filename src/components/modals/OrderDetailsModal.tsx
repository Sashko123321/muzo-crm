// import { useState, useEffect } from "react";
// import { Pencil, X, Eye } from "lucide-react";
// import { useOrder } from "../../hooks/order/useOrder";
// import { useCargo } from "../../hooks/cargo/useCargo";
// import type { OrderResponse, OrderStatus } from "../../types/order.type";
// import type { CargoResponse } from "../../types/cargo.type.ts";
//
// interface OrderDetailsModalProps {
//     order: OrderResponse;
//     onClose: () => void;
//     onUpdate?: (updatedOrder: OrderResponse) => void;
//     onDelete?: (id: number) => void;
// }
//
// const statusOptions: OrderStatus[] = ["Pending", "Accepted", "InProgress", "Completed", "Cancelled"];
//
// const OrderDetailsModal = ({ order, onClose, onUpdate, onDelete }: OrderDetailsModalProps) => {
//     const [isEdit, setIsEdit] = useState(false);
//     const { updateStatus, remove, loading: updating } = useOrder();
//     const { getOne: getCargo } = useCargo();
//
//     const [status, setStatus] = useState<OrderStatus>(order.status);
//     const [cargoDetails, setCargoDetails] = useState<CargoResponse[]>([]);
//
//
//     const inputClass = `w-full px-3 py-2 rounded-xl border transition bg-gray-100 border-gray-300 focus:border-blue-500
//         `;
//     // ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white focus:border-blue-400" : ""}
//     // --- Завантаження деталей вантажів ---
//     useEffect(() => {
//         const fetchCargoDetails = async () => {
//             const details: CargoResponse[] = [];
//             for (const id of order.cargoIds) {
//                 const cargo = await getCargo(id.toString());
//                 if (cargo) details.push(cargo);
//             }
//             setCargoDetails(details);
//         };
//         fetchCargoDetails();
//     }, [order.cargoIds, getCargo]);
//
//     const handleDelete = async () => {
//         if (!confirm("Видалити це замовлення?")) return;
//         const ok = await remove(order.id.toString());
//         if (ok) {
//             onDelete?.(order.id);
//             onClose();
//         } else {
//             alert("Не вдалося видалити замовлення");
//         }
//     };
//
//     const handleSave = async () => {
//         const result = await updateStatus(order.id.toString(), status);
//         if (result) {
//             onUpdate?.(result);
//             setIsEdit(false);
//         } else {
//             alert("Не вдалося оновити статус");
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50" onClick={onClose}>
//             <div
//                 className={`relative w-full max-w-3xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl border bg-white border-gray-200 text-gray-90
//
//                 flex flex-col`}
//                 onClick={e => e.stopPropagation()}
//             >
//                 {/*${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "0"}*/}
//                 {/* HEADER */}
//                 <div className={`flex items-center justify-between p-5 border-b sticky top-0 z-10 bg-white border-gray-200 `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     <div>
//                         <h2 className="text-2xl font-bold">Order Details</h2>
//                         <p className="text-xs opacity-60 mt-1">ID: {order.id}</p>
//                     </div>
//                     <div className="flex gap-2">
//                         <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm" onClick={() => setIsEdit(prev => !prev)}>
//                             {isEdit ? <Eye size={18} /> : <Pencil size={18} />}
//                         </button>
//                         <button className={`px-2 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200`} onClick={onClose}>
//                             {/*${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""}*/}
//                             <X size={18} />
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* BODY */}
//                 <div className="p-6 overflow-y-auto flex-1 space-y-7">
//                     {/* Status */}
//                     <Section title="Status" color="bg-blue-500">
//                         <Field
//                             label="Current Status"
//                             isEdit={isEdit}
//                             value={status}
//                             viewValue={status}
//                             onChange={v => setStatus(v as OrderStatus)}
//                             inputClass={inputClass}
//                             type="select"
//                             options={statusOptions}
//                         />
//                     </Section>
//
//                     {/* Carrier */}
//                     <Section title="Carrier" color="bg-green-500">
//                         <p className="font-medium">{order.carrierName || "-"}</p>
//                     </Section>
//
//                     {/* Cargos */}
//                     <Section title={`Cargos (${cargoDetails.length})`} color="bg-purple-500">
//                         {cargoDetails.length ? (
//                             <div className="space-y-3 max-h-60 overflow-y-auto">
//                                 {cargoDetails.map(c => (
//                                     <div
//                                         key={c.id}
//                                         className={`p-3 border rounded-lg shadow-sm flex flex-col gap-1 bg-white border-gray-200 text-gray-900 `}
//                                     >
//                                     {/*    ${*/}
//                                     {/*    theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""*/}
//                                     {/*}*/}
//                                         <span className="font-semibold">{c.description || "-"}</span>
//                                         <div className={`flex flex-wrap gap-3 text-xs text-gray-600`}>
//                                         {/*    ${*/}
//                                         {/*    theme === "dark" ? "text-gray-300" : ""*/}
//                                         {/*}*/}
//                                             <span>{c.fromLocation || "-"} - {c.toLocation || "-"}</span>
//                                             <span>Weight: {c.weightKg} kg</span>
//                                             {c.dimensions && <span>Dimensions: {c.dimensions}</span>}
//                                             <span>Price: {c.price} {c.currency}</span>
//                                             {c.notes && <span className="italic">Notes: {c.notes}</span>}
//                                             <span className={`${c.isActive ? "text-green-500" : "text-red-500"} font-medium`}>
//               {/*Active: {c.isActive ? "Yes" : "No"}*/}
//             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-xs opacity-50">No cargos</p>
//                         )}
//                     </Section>
//
//
//                     {/* Commission */}
//                     <Section title="Commission" color="bg-yellow-500">
//                         <div className="flex flex-col gap-2">
//                             <div className="flex justify-between">
//                                 <span>Commission for</span>
//                                 <span className="font-medium">{order.commissionFor}</span>
//                             </div>
//                             {Object.entries(order.total).map(([currency, amount]) => {
//                                 const percentAmount = (amount * order.percentage) / 100;
//                                 return (
//                                     <div key={currency} className="flex justify-between">
//                                         <span>{amount} {currency}</span>
//                                         <span className="opacity-70">{order.percentage}% → {percentAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </Section>
//                 </div>
//
//                 {/* FOOTER */}
//                 <div className={`flex flex-col sm:flex-row justify-end gap-2 p-4 border-t sticky bottom-0 z-10 bg-white border-gray-200 `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     {isEdit && (
//                         <>
//                             <button className="px-5 py-2 rounded-lg font-medium shadow-sm bg-red-500 text-white hover:bg-red-600 transition" onClick={handleDelete} disabled={updating}>
//                                 {updating ? "Deleting..." : "Delete"}
//                             </button>
//                             <button className="px-5 py-2 rounded-lg font-medium shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition" onClick={handleSave} disabled={updating}>
//                                 {updating ? "Saving..." : "Save"}
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// // --- Section і Field як у твоєму CargoDetailsModal ---
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
// const Field = ({ label, isEdit, value, viewValue, onChange, type = "text", inputClass, options }: {
//     label: string;
//     isEdit: boolean;
//     value: string | number;
//     viewValue?: string;
//     onChange: (v: string) => void;
//     type?: "text" | "number" | "select";
//     inputClass: string;
//     options?: string[];
// }) => (
//     <div className="flex flex-col gap-1">
//         <label className="text-sm font-medium opacity-80">{label}</label>
//         {isEdit ? (
//             type === "select" ? (
//                 <select value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
//                     {options?.map(o => <option key={o} value={o}>{o}</option>)}
//                 </select>
//             ) : (
//                 <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
//             )
//         ) : (
//             <p className="text-base">{viewValue ?? value}</p>
//         )}
//     </div>
// );
//
// export default OrderDetailsModal;
