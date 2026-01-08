    // import { useState } from "react";
    // import { X } from "lucide-react";
    // // import { useThemeStore } from "../../store/useThemeStore.ts";
    // import type {CargoResponse, CreateCargoRequest, Currency, DirectionForward} from "../../types/cargo.type.ts";
    // import {useCargo} from "../../hooks/cargo/useCargo.ts";
    //
    // interface AddCargoModalProps {
    //     onClose: () => void;
    //     onAdd: (newCargo: CargoResponse) => void;
    // }
    //
    // const AddCargoModal = ({ onClose, onAdd }: AddCargoModalProps) => {
    //     // const theme = useThemeStore(s => s.theme);
    //     const { create, loading } = useCargo();
    //
    //
    //     const [form, setForm] = useState<CreateCargoRequest>({
    //         description: "",
    //         weightKg: 0,
    //         dimensions: "",
    //         clientName: "",
    //         clientPhone: "",
    //         fromLocation: "",
    //         toLocation: "",
    //         availableFrom: new Date().toISOString().split("T")[0],
    //         availableTo: new Date().toISOString().split("T")[0],
    //         directionForward: "Ukraine" as DirectionForward,
    //         price: 0,
    //         currency: "USD" as Currency,
    //         notes: "",
    //         isActive: true,
    //     });
    //
    //
    //     const handleChange = (field: keyof typeof form, value: string) => {
    //         if (["weightKg", "price", "orderId"].includes(field)) {
    //             if (value === "" || /^[0-9]*$/.test(value)) {
    //                 setForm(prev => ({ ...prev, [field]: value }));
    //             }
    //         } else {
    //             setForm(prev => ({ ...prev, [field]: value }));
    //         }
    //     };
    //
    //     const handleSubmit = async () => {
    //         if (!(form.description ?? "").trim()) return alert("Description is required");
    //         if (!(form.clientName ?? "").trim()) return alert("Client Name is required");
    //         if (!(form.clientPhone ?? "").trim()) return alert("Client Phone is required");
    //         if (Number(form.weightKg) <= 0) return alert("Weight must be greater than 0");
    //         if (Number(form.price) <= 0) return alert("Price must be greater than 0");
    //
    //         try {
    //             const payload = {
    //                 description: form.description,
    //                 weightKg: Number(form.weightKg),
    //                 dimensions: form.dimensions,
    //                 clientName: form.clientName,
    //                 clientPhone: form.clientPhone,
    //                 fromLocation: form.fromLocation,
    //                 toLocation: form.toLocation,
    //                 availableFrom: form.availableFrom,
    //                 availableTo: form.availableTo,
    //                 directionForward: form.directionForward,
    //                 price: Number(form.price),
    //                 currency: form.currency,
    //                 notes: form.notes,
    //                 isActive: true,
    //             };
    //
    //             const newCargo = await create(payload);
    //             if (newCargo) {
    //                 onAdd(newCargo);
    //                 onClose();
    //             } else {
    //                 alert("Failed to add cargo");
    //             }
    //         } catch (e) {
    //             console.error(e);
    //             alert("Failed to add cargo");
    //         }
    //     };
    //
    //     const inputClass = `
    //         w-full px-3 py-2 rounded-xl border transition text-sm bg-gray-100 border-gray-300 focus:border-blue-500
    //
    //     `;
    //     // ${theme === "dark"
    //     //     ? "bg-gray-800 border-gray-700 text-white focus:border-blue-400"
    //     //     : ""}
    //     return (
    //         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50" onClick={onClose}>
    //             <div
    //                 className={`
    //                     relative w-full max-w-2xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl border bg-white border-gray-200 text-gray-900
    //
    //                     flex flex-col animate-[fadeIn_0.2s_ease-out]
    //                 `}
    //                 // ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : ""}
    //                 onClick={e => e.stopPropagation()}
    //             >
    //                 {/* HEADER */}
    //                 <div className={`flex items-center justify-between p-5 border-b sticky top-0 z-10 bg-white border-gray-200 `}>
    //                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
    //                     <h2 className="text-xl font-semibold">Add New Cargo</h2>
    //                     <button
    //                         className={`px-2 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200 `}
    //                         // ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white"
    //                         onClick={onClose}
    //                     >
    //                         <X size={18} />
    //                     </button>
    //                 </div>
    //
    //                 {/* BODY */}
    //                 <div className="p-6 space-y-8 overflow-y-auto flex-1">
    //                     <Section title="General Info" color="bg-blue-500">
    //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //                             <Field label="Description" value={form.description ?? ""} onChange={v => handleChange("description", v)} inputClass={inputClass}/>
    //                             <Field label="Weight (kg)" value={form.weightKg?.toString() ?? "0"} onChange={v => handleChange("weightKg", v)} type="number" inputClass={inputClass}/>
    //                             <Field label="Dimensions" value={form.dimensions ?? ""} onChange={v => handleChange("dimensions", v)} inputClass={inputClass}/>
    //                             <Field label="Price" value={form.price} onChange={v => handleChange("price", v)} type="number" inputClass={inputClass} />
    //                         </div>
    //
    //
    //
    //                         {/* Currency */}
    //                         <div className="mt-4">
    //                             <label className="text-sm font-medium opacity-80 mb-1 block">Currency</label>
    //                             <select
    //                                 value={form.currency}
    //                                 onChange={e => setForm(prev => ({ ...prev, currency: e.target.value as Currency }))}
    //                                 className={inputClass}
    //                             >
    //                                 <option value="USD">USD</option>
    //                                 <option value="EUR">EUR</option>
    //                                 <option value="UAH">UAH</option>
    //                             </select>
    //                         </div>
    //                         {/* Direction */}
    //                         <div className="mt-4">
    //                             <label className="text-sm font-medium opacity-80 mb-1 block">DirectionForward</label>
    //                             <select
    //                                 value={form.directionForward}
    //                                 onChange={e => setForm(prev => ({ ...prev, direction: e.target.value as DirectionForward }))}
    //                                 className={inputClass}
    //                             >
    //                                 <option value="Ukraine">Ukraine</option>
    //                                 <option value="Europe">Europe</option>
    //                             </select>
    //                         </div>
    //                     </Section>
    //
    //
    //                     <Section title="Client" color="bg-green-500">
    //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //                             <Field label="Client Name" value={form.clientName} onChange={v => handleChange("clientName", v)} inputClass={inputClass} />
    //                             <Field label="Client Phone" value={form.clientPhone} onChange={v => handleChange("clientPhone", v)} inputClass={inputClass} />
    //                         </div>
    //                     </Section>
    //
    //                     <Section title="Route" color="bg-purple-500">
    //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //                             <Field label="From" value={form.fromLocation ?? ""} onChange={v => handleChange("fromLocation", v)} inputClass={inputClass}/>
    //                             <Field label="To" value={form.toLocation ?? ""} onChange={v => handleChange("toLocation", v)} inputClass={inputClass}/>
    //                         </div>
    //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
    //                             <Field label="Available From" value={form.availableFrom} type="date" onChange={v => handleChange("availableFrom", v)} inputClass={inputClass} />
    //                             <Field label="Available To" value={form.availableTo} type="date" onChange={v => handleChange("availableTo", v)} inputClass={inputClass} />
    //                         </div>
    //                     </Section>
    //
    //                     <Section title="Notes" color="bg-yellow-500">
    //                         <textarea className={inputClass} rows={3} value={form.notes} onChange={e => handleChange("notes", e.target.value)} />
    //                     </Section>
    //                 </div>
    //
    //                 {/* FOOTER */}
    //                 <div className={`flex flex-col sm:flex-row justify-end gap-2 p-4 border-t sticky bottom-0 z-10 bg-white border-gray-200 `}>
    //                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
    //                     <button className={`px-5 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200 `} onClick={onClose}>
    //                         {/*${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""}*/}
    //                         Cancel
    //                     </button>
    //                     <button className="px-5 py-2 rounded-lg font-medium shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition" onClick={handleSubmit} disabled={loading}>
    //                         {loading ? "Adding..." : "Add Cargo"}
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };
    //
    // /* REUSABLE COMPONENTS */
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
    // const Field = ({
    //                    label,
    //                    value,
    //                    onChange,
    //                    inputClass,
    //                    type = "text"
    //                }: {
    //     label: string;
    //     value: string | number;
    //     onChange: (v: string) => void;
    //     inputClass: string;
    //     type?: string;
    // }) => (
    //     <div className="flex flex-col gap-1">
    //         <label className="text-sm font-medium opacity-80">{label}</label>
    //         <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
    //     </div>
    // );
    //
    // export default AddCargoModal;
