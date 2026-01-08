// import { useState } from "react";
// import { Pencil, X, Eye } from "lucide-react";
// import { useCargo } from "../../hooks/cargo/useCargo.ts";
// import type { CreateCargoRequest, CargoResponse } from "../../types/cargo.type.ts";
// import {getUserRole} from "../../ utils/auth.ts";
//
// interface CargoDetailsModalProps {
//     cargo: CargoResponse;
//     onClose: () => void;
//     onUpdate?: (updatedCargo: CargoResponse) => void; // callback замість reload
//     onDelete?: (id: number) => void;
// }
//
// const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("uk-UA", { day: "2-digit", month: "short", year: "numeric" });
// };
//
// const formatDateForInput = (dateStr: string) => {
//     const date = new Date(dateStr);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// };
//
// const CargoDetailsModal = ({ cargo, onClose, onUpdate, onDelete }: CargoDetailsModalProps) => {
//     const [isEdit, setIsEdit] = useState(false);
//     const { update, remove, loading: updating, error: updateError } = useCargo();
//     const role = getUserRole();
//
//     const [form, setForm] = useState<CreateCargoRequest>({
//         description: cargo.description ?? "",
//         weightKg: cargo.weightKg,
//         dimensions: cargo.dimensions ?? "",
//         clientName: cargo.clientName ?? "",
//         clientPhone: cargo.clientPhone ?? "",
//         fromLocation: cargo.fromLocation ?? "",
//         toLocation: cargo.toLocation ?? "",
//         availableFrom: formatDateForInput(cargo.availableFrom),
//         availableTo: formatDateForInput(cargo.availableTo),
//         directionForward: cargo.directionForward,
//         price: cargo.price,
//         currency: cargo.currency,
//         notes: cargo.notes ?? "",
//         isActive: cargo.isActive
//     });
//
//
//     const input = `w-full px-3 py-2 rounded-xl border transition bg-gray-100 border-gray-300 focus:border-blue-500
//
//     `;
//     // ${theme === "dark"
//     //     ? "bg-gray-800 border-gray-700 text-white focus:border-blue-400"
//     //     : ""}
//     const handleDelete = async () => {
//         if (!confirm("Видалити цей cargo?")) return;
//
//         const ok = await remove(cargo.id.toString());
//         if (ok) {
//             onDelete?.(cargo.id);
//             onClose();
//             window.location.reload()
//         } else {
//             alert("Failed to delete cargo");
//         }
//     };
//
//     const handleSave = async () => {
//         const updated = await update(cargo.id.toString(), form);
//         if (updated) {
//             onUpdate?.(updated);
//             setIsEdit(false);
//             window.location.reload()
//         } else {
//             alert(updateError || "Failed to update cargo");
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50" onClick={onClose}>
//             <div
//                 className={`
//                     relative w-full max-w-2xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl border
//                     animate-[fadeIn_0.2s_ease-out] bg-white border-gray-200 text-gray-900
//
//                     flex flex-col
//                 `}
//                 onClick={e => e.stopPropagation()}
//             >
//                 {/*${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : ""}*/}
//                 {/* HEADER */}
//                 <div className={`flex items-center justify-between p-5 border-b sticky top-0 z-10 bg-white border-gray-200 `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     <div>
//                         <h2 className="text-xl font-semibold">Cargo Details</h2>
//                         <p className="text-xs opacity-70 mt-1">ID: {cargo.id}</p>
//                     </div>
//                     <div className="flex gap-2">
//
//
//                         <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm" onClick={() => setIsEdit(prev => !prev)}>
//                             {isEdit ? <Eye size={18} /> : <Pencil size={18} />}
//                         </button>
//
//                         <button className={`px-2 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200 `} onClick={onClose}>
//                             {/*${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""}*/}
//                             <X size={18} />
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* BODY */}
//                 <div className="p-6 space-y-7 overflow-y-auto flex-1">
//                     {/* General Info */}
//                     <Section title="General Info" color="bg-blue-500">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                             <Field
//                                 label="Description"
//                                 isEdit={isEdit}
//                                 value={form.description}
//                                 viewValue={cargo.description || ""}
//                                 onChange={v => setForm({ ...form, description: v })}
//                                 inputClass={input}
//                             />
//
//                             <Field
//                                 label="Weight (kg)"
//                                 isEdit={isEdit}
//                                 type="number"
//                                 value={form.weightKg}
//                                 viewValue={`${cargo.weightKg} kg`}
//                                 onChange={v => setForm({ ...form, weightKg: Number(v) })}
//                                 inputClass={input}
//                             />
//
//                             {/* Price */}
//                             <Field
//                                 label="Price"
//                                 isEdit={isEdit}
//                                 type="number"
//                                 value={form.price}
//                                 viewValue={`${cargo.price} ${cargo.currency}`}
//                                 onChange={v => setForm({ ...form, price: Number(v) })}
//                                 inputClass={input}
//                             />
//
//                             {/* Currency – ТІЛЬКИ В EDIT */}
//                             {isEdit && (
//                                 <div className="flex flex-col gap-1">
//                                     <label className="text-sm font-medium opacity-80">Currency</label>
//                                     <select
//                                         value={form.currency}
//                                         onChange={e =>
//                                             setForm({ ...form, currency: e.target.value as typeof form.currency })
//                                         }
//                                         className={input}
//                                     >
//                                         <option value="USD">USD</option>
//                                         <option value="EUR">EUR</option>
//                                         <option value="UAH">UAH</option>
//                                     </select>
//                                 </div>
//                             )}
//                         </div>
//                     </Section>
//
//
//                     {/* Client */}
//                     <Section title="Client" color="bg-green-500">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                             <Field label="Client Name" isEdit={isEdit} value={form.clientName} viewValue={cargo.clientName || ""} onChange={v => setForm({ ...form, clientName: v })} inputClass={input} />
//                             <Field label="Client Phone" isEdit={isEdit} value={form.clientPhone} viewValue={cargo.clientPhone || ""} onChange={v => setForm({ ...form, clientPhone: v })} inputClass={input} />
//                         </div>
//                     </Section>
//
//                     {/* Route */}
//                     <Section title="Route" color="bg-purple-500">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                             <Field
//                                 label="From"
//                                 isEdit={isEdit}
//                                 value={form.fromLocation}
//                                 viewValue={cargo.fromLocation || ""}
//                                 onChange={v => setForm({ ...form, fromLocation: v })}
//                                 inputClass={input}
//                             />
//
//                             <Field
//                                 label="To"
//                                 isEdit={isEdit}
//                                 value={form.toLocation}
//                                 viewValue={cargo.toLocation || ""}
//                                 onChange={v => setForm({ ...form, toLocation: v })}
//                                 inputClass={input}
//                             />
//
//                             {/* Direction */}
//                             <div className="flex flex-col gap-1">
//                                 <label className="text-sm font-medium opacity-80">Direction Forward</label>
//                                 {isEdit ? (
//                                     <select
//                                         value={form.directionForward}
//                                         onChange={e =>
//                                             setForm({ ...form, directionForward: e.target.value as typeof form.directionForward })
//                                         }
//                                         className={input}
//                                     >
//                                         <option value="Ukraine">Ukraine</option>
//                                         <option value="Europe">Europe</option>
//                                     </select>
//                                 ) : (
//                                     <p className="text-base">{cargo.directionForward}</p>
//                                 )}
//                             </div>
//                         </div>
//
//                         <div className="mt-4">
//                             <p className="text-sm opacity-80 mb-1">Available</p>
//                             {isEdit ? (
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <input type="date" value={form.availableFrom} onChange={e => setForm({ ...form, availableFrom: e.target.value })} className={input} />
//                                     <input type="date" value={form.availableTo} onChange={e => setForm({ ...form, availableTo: e.target.value })} className={input} />
//                                 </div>
//                             ) : (
//                                 <div className="font-medium">
//                                     {formatDate(cargo.availableFrom)} — {formatDate(cargo.availableTo)}
//                                 </div>
//                             )}
//                         </div>
//                     </Section>
//
//
//                     {/* Notes */}
//                     <Section title="Notes" color="bg-yellow-500">
//                         {isEdit ? <textarea className={input} rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /> : <p>{cargo.notes || "-"}</p>}
//                     </Section>
//                 </div>
//
//                 {/* FOOTER */}
//                 <div className={`flex flex-col sm:flex-row justify-end gap-2 p-4 border-t sticky bottom-0 z-10 bg-white border-gray-200 `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     {isEdit && (
//                         <>
//                         {role !== "Employee" && (
//                             <button className="px-5 py-2 rounded-lg font-medium shadow-sm bg-red-500 text-white hover:bg-red-600 transition" onClick={handleDelete} disabled={updating}>
//                                 {updating ? "Deleting..." : "Delete"}
//                             </button>
//                             )}
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
// const Field = ({ label, isEdit, value, onChange, viewValue, type = "text", inputClass }: {
//     label: string;
//     isEdit: boolean;
//     value: string | number | undefined; // <- додали undefined
//     onChange: (v: string) => void;
//     viewValue: string;
//     type?: string;
//     inputClass: string
// }) => (
//     <div className="flex flex-col gap-1">
//         <label className="text-sm font-medium opacity-80">{label}</label>
//         {isEdit
//             ? <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} className={inputClass} />
//             : <p className="text-base">{viewValue}</p>}
//     </div>
// );
//
//
// export default CargoDetailsModal;
