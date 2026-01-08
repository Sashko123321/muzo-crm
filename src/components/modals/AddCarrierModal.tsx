// import { useState } from "react";
// // import { useThemeStore } from "../../store/useThemeStore";
// import { X } from "lucide-react";
// import type { CreateCarrierRequest, CarrierResponse } from "../../types/carrier.type.ts";
// import {useCarrier} from "../../hooks/carrier/useCarrier.ts";
// import type {DirectionForward} from "../../types/cargo.type.ts";
//
// interface AddCarrierModalProps {
//     onClose: () => void;
//     onAdd: (newCarrier: CarrierResponse) => void;
// }
//
// const AddCarrierModal = ({ onClose, onAdd }: AddCarrierModalProps) => {
//     // const theme = useThemeStore(s => s.theme);
//     const { create, loading } = useCarrier();
//
//     const [form, setForm] = useState<CreateCarrierRequest>({
//         name: "",
//         phoneNumber: "",
//         telegram: "",
//         vehicleType: "",
//         maxLoadKg: 0,
//         isActive: true,
//         regions:[]
//     });
//
//     const handleChange = (field: keyof CreateCarrierRequest, value: string) => {
//         if (field === "maxLoadKg") {
//             if (value === "" || /^[0-9]*$/.test(value)) {
//                 setForm(prev => ({ ...prev, [field]: Number(value) }));
//             }
//         } else {
//             setForm(prev => ({ ...prev, [field]: value }));
//         }
//     };
//
//     const handleSubmit = async () => {
//         if (!form.name.trim()) return alert("Name is required");
//         if (!form.phoneNumber.trim()) return alert("Phone number is required");
//         if (!form.vehicleType.trim()) return alert("Vehicle type is required");
//         if (form.maxLoadKg <= 0) return alert("Max load must be greater than 0");
//
//         const newCarrier = await create(form);
//         if (newCarrier) {
//             onAdd(newCarrier);
//             onClose();
//         } else {
//             alert("Failed to add carrier");
//         }
//     };
//
//     const inputClass = `w-full px-3 py-2 rounded-xl border transition text-sm bg-gray-100 border-gray-300 focus:border-blue-500`;
//     // ${
//     //     theme === "dark"
//     //         ? "bg-gray-800 border-gray-700 text-white focus:border-blue-400"
//     //         : ""
//     // }
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
//                     <h2 className="text-xl font-semibold">Add New Carrier</h2>
//                     <button
//                         className={`px-2 py-2 rounded-lg font-medium shadow-sm transition bg-gray-100 hover:bg-gray-200`}
//                         onClick={onClose}
//                     >
//                     {/*    ${*/}
//                     {/*    theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""*/}
//                     {/*}*/}
//                         <X size={18} />
//                     </button>
//                 </div>
//
//                 {/* BODY */}
//                 <div className="p-6 space-y-6 overflow-y-auto flex-1">
//                     <Field label="Name" value={form.name} onChange={v => handleChange("name", v)} inputClass={inputClass} />
//                     <Field label="Phone Number" value={form.phoneNumber} onChange={v => handleChange("phoneNumber", v)} inputClass={inputClass} />
//                     <Field label="Telegram" value={form.telegram || ""} onChange={v => handleChange("telegram", v)} inputClass={inputClass} />
//                     <Field label="Vehicle Type" value={form.vehicleType} onChange={v => handleChange("vehicleType", v)} inputClass={inputClass} />
//                     <Field label="Max Load (kg)" value={form.maxLoadKg.toString()} type="number" onChange={v => handleChange("maxLoadKg", v)} inputClass={inputClass} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                 <label className="text-sm font-medium opacity-80">Regions</label>
//                 <div className="flex gap-2">
//                     {allRegions.map(region => (
//                         <label key={region} className="flex items-center gap-1 text-sm">
//                             <input
//                                 type="checkbox"
//                                 checked={form.regions?.includes(region)}
//                                 onChange={e => {
//                                     if (e.target.checked) {
//                                         setForm(prev => ({ ...prev, regions: [...(prev.regions || []), region] }));
//                                     } else {
//                                         setForm(prev => ({ ...prev, regions: prev.regions?.filter(r => r !== region) }));
//                                     }
//                                 }}
//                             />
//                             {region}
//                         </label>
//                     ))}
//                 </div>
//             </div>
//                 {/* FOOTER */}
//                 <div className={`flex justify-end gap-2 p-4 border-t sticky bottom-0 z-10 bg-white border-gray-200
//                     `}>
//                     {/*${theme === "dark" ? "bg-gray-900 border-gray-700" : ""}*/}
//                     <button
//                         className={`px-5 py-2 rounded-lg font-medium shadow-sm bg-gray-100 hover:bg-gray-200 `}
//                         onClick={onClose}
//                     >
//                     {/*    ${*/}
//                     {/*    theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : ""*/}
//                     {/*}*/}
//                         Cancel
//                     </button>
//                     <button
//                         className="px-5 py-2 rounded-lg font-medium shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                     >
//                         {loading ? "Adding..." : "Add Carrier"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const Field = ({
//                    label,
//                    value,
//                    onChange,
//                    inputClass,
//                    type = "text"
//                }: {
//     label: string;
//     value: string;
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
// export default AddCarrierModal;
