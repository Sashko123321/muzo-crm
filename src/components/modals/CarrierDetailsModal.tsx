// import { useState } from "react";
// // import { useThemeStore } from "../../store/useThemeStore";
// import {Pencil, X, Eye} from "lucide-react";
// import type { CarrierResponse, CreateCarrierRequest } from "../../types/carrier.type.ts";
// import {useCarrier} from "../../hooks/carrier/useCarrier.ts";
// import {getUserRole} from "../../ utils/auth.ts";
// import type {DirectionForward} from "../../types/cargo.type.ts";
//
// interface CarrierDetailsModalProps {
//     carrier: CarrierResponse;
//     onClose: () => void;
//     onUpdate?: (updatedCarrier: CarrierResponse) => void; // для зовнішнього оновлення списку без reload
// }
//
// const CarrierDetailsModal = ({ carrier, onClose, onUpdate }: CarrierDetailsModalProps) => {
//     // const theme = useThemeStore(s => s.theme);
//     const [isEdit, setIsEdit] = useState(false);
//     const { update, remove, loading, error } = useCarrier();
//     const role = getUserRole();
//     const [form, setForm] = useState<CreateCarrierRequest>({
//         name: carrier.name,
//         phoneNumber: carrier.phoneNumber,
//         telegram: carrier.telegram || "",
//         vehicleType: carrier.vehicleType,
//         maxLoadKg: carrier.maxLoadKg,
//         isActive: carrier.isActive
//     });
//
//     const inputClass = `w-full px-3 py-2 rounded-xl border transition text-sm bg-gray-100 border-gray-300 focus:border-blue-500 `;
//     // ${
//     //     theme === "dark"
//     //         ? "bg-gray-800 border-gray-700 text-white focus:border-blue-400"
//     //         : ""
//     // }
//     const handleDelete = async () => {
//         if (!confirm("Видалити цього carrier?")) return;
//
//         const ok = await remove(carrier.id.toString());
//         if (ok) {
//             onClose();
//             alert("Carrier deleted");
//         } else {
//             alert("Failed to delete carrier");
//         }
//     };
//
//     const handleSave = async () => {
//         const updated = await update(carrier.id.toString(), form);
//         if (updated) {
//             setIsEdit(false);
//             onUpdate?.(updated); // оновлюємо батьківський стан, якщо переданий
//         } else {
//             alert(error || "Failed to update carrier");
//         }
//     };
//     const allRegions: DirectionForward[] = ["Ukraine", "Europe"]; // тип union, як ми робили
//     return (
//         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50" onClick={onClose}>
//             <div
//                 className={`relative w-full max-w-2xl h-[70vh] rounded-2xl overflow-hidden shadow-2xl border
//                     animate-[fadeIn_0.2s_ease-out] bg-white border-gray-200 text-gray-900
//
//                     flex flex-col`}
//                 onClick={e => e.stopPropagation()}
//             >
//                 {/*${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : ""}*/}
//                 {/* HEADER */}
//                 <div className={`flex items-center justify-between p-5 border-b sticky top-0 z-10 bg-white border-gray-200
//                     `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     <div>
//                         <h2 className="text-xl font-semibold">Carrier Details</h2>
//                         <p className="text-xs opacity-70 mt-1">ID: {carrier.id}</p>
//                     </div>
//
//                     <div className="flex gap-2">
//                         {role !== "Employee" && (
//                         <button
//                             className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
//                             onClick={() => setIsEdit(prev => !prev)}
//                         >
//                             {isEdit ? <Eye size={18} /> : <Pencil size={18} />}
//                         </button>
//                             )}
//                         <button
//                             className={`px-2 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200 `}
//                             onClick={onClose}
//                         >
//                         {/*    ${*/}
//                         {/*    theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""*/}
//                         {/*}*/}
//                             <X size={18} />
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* BODY */}
//                 <div className="p-6 space-y-6 overflow-y-auto flex-1">
//                     <Field label="Name" isEdit={isEdit} value={form.name} viewValue={carrier.name} onChange={v => setForm({ ...form, name: v })} inputClass={inputClass} />
//                     <Field label="Phone Number" isEdit={isEdit} value={form.phoneNumber} viewValue={carrier.phoneNumber} onChange={v => setForm({ ...form, phoneNumber: v })} inputClass={inputClass} />
//                     <Field label="Telegram" isEdit={isEdit} value={form.telegram || ""} viewValue={carrier.telegram || "-"} onChange={v => setForm({ ...form, telegram: v })} inputClass={inputClass}/>
//                     <Field label="Vehicle Type" isEdit={isEdit} value={form.vehicleType} viewValue={carrier.vehicleType} onChange={v => setForm({ ...form, vehicleType: v })} inputClass={inputClass} />
//                     <Field label="Max Load (kg)" isEdit={isEdit} value={form.maxLoadKg} viewValue={carrier.maxLoadKg.toString()} type="number" onChange={v => setForm({ ...form, maxLoadKg: Number(v) })} inputClass={inputClass} />
//                     {isEdit ? (
//                         <div className="flex flex-col gap-1">
//                             <label className="text-sm font-medium opacity-80">Regions</label>
//                             <div className="flex gap-2">
//                                 {allRegions.map(region => (
//                                     <label key={region} className="flex items-center gap-1 text-sm">
//                                         <input
//                                             type="checkbox"
//                                             checked={form.regions?.includes(region)}
//                                             onChange={e => {
//                                                 if (e.target.checked) {
//                                                     setForm(prev => ({ ...prev, regions: [...(prev.regions || []), region] }));
//                                                 } else {
//                                                     setForm(prev => ({ ...prev, regions: prev.regions?.filter(r => r !== region) }));
//                                                 }
//                                             }}
//                                             disabled={!isEdit}
//                                         />
//                                         {region}
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                             {carrier.regions.length > 0 ? carrier.regions.join(", ") : "-"}
//                         </div>
//                     )}
//                 </div>
//
//
//
//
//                 {/* FOOTER */}
//                 <div className={`flex justify-end gap-2 p-4 border-t sticky bottom-0 z-10 bg-white border-gray-200
//                     `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     {isEdit && (
//                         <>
//                             <button
//                                 className="px-5 py-2 rounded-lg font-medium shadow-sm bg-red-500 text-white hover:bg-red-600 transition"
//                                 onClick={handleDelete}
//                                 disabled={loading}
//                             >
//                                 {loading ? "Deleting..." : "Delete"}
//                             </button>
//
//                             <button
//                                 className="px-5 py-2 rounded-lg font-medium shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition"
//                                 onClick={handleSave}
//                                 disabled={loading}
//                             >
//                                 {loading ? "Saving..." : "Save"}
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const Field = ({
//                    label,
//                    isEdit,
//                    value,
//                    onChange,
//                    viewValue,
//                    type = "text",
//                    inputClass
//                }: {
//     label: string;
//     isEdit: boolean;
//     value: string | number;
//     viewValue: string;
//     onChange: (v: string) => void;
//     type?: string;
//     inputClass: string;
// }) => (
//     <div className="flex flex-col gap-1">
//         <label className="text-sm font-medium opacity-80">{label}</label>
//         {isEdit ? (
//             <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
//         ) : (
//             <p className="text-base">{viewValue}</p>
//         )}
//     </div>
// );
//
// export default CarrierDetailsModal;
