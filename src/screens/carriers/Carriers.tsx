import { useCarrier } from "../../hooks/carrier/useCarrier";
import { useEffect, useState } from "react";
import CarrierCard from "./components/CarrierCard";
import Pagination from "../../components/Pagination";
import {  MapPin, Phone, Plus, Send, Truck, Weight } from "lucide-react";
import type { CarrierResponse, CreateCarrierRequest } from "../../types/carrier.type";
import FilterButton from "../../components/button/FilterButton.tsx";
import CardModal from "../../components/shered/CardModal.tsx";
import AddModal from "../../components/shered/AddModal.tsx";
import AddCarrierForm from "./components/AddCarrierForm.tsx";
import CarrierCardSkeleton from "./components/CarrierCardSkeleton.tsx";
import {getUserRole} from "../../ utils/auth.ts";

const Carriers = () => {
    const { loading, error, getAll, toggleActivity, create, update, remove } = useCarrier();

    const [carriers, setCarriers] = useState<CarrierResponse[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const [totalPages, setTotalPages] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<CarrierResponse | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    const role = getUserRole();

    // ===================== FETCH =====================
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            const params = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                searchField: search || undefined,
                isActive: statusFilter === "all" ? undefined : statusFilter === "active",
            };

            const data = await getAll(params);
            if (!mounted) return;

            if (data?.data) {
                setCarriers(data.data);
                // Розрахунок totalPages через totalCount з API
                const pages = Math.ceil((data.totalCount || 1) / pageSize) || 1;
                setTotalPages(pages);
            } else {
                setCarriers([]);
                setTotalPages(1);
            }
        };

        fetchData();
        return () => { mounted = false; };
    }, [currentPage, search, statusFilter, getAll]);

    // ===================== ACTIVITY =====================
    const handleActivityChange = async (value: "active" | "inactive") => {
        if (!selectedCarrier) return;
        const isActive = value === "active";
        const updated = await toggleActivity(selectedCarrier.id.toString(), isActive);
        if (!updated) return;

        setSelectedCarrier(updated);
        setCarriers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    };

    const statusLabels = { active: "Активний", inactive: "Неактивний" };
    const statusBadgeVariant = { active: "active", inactive: "inactive" } as const;

    const toggleEditMode = () => setIsEdit(prev => !prev);

    return (
        <main className="p-4 w-full">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Список Перевізників</h1>
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex flex-wrap gap-2">
                        <FilterButton label="Всі" active={statusFilter === "all"} onClick={() => { setStatusFilter("all"); setCurrentPage(1); }} />
                        <FilterButton label="Активні" active={statusFilter === "active"} onClick={() => { setStatusFilter("active"); setCurrentPage(1); }} />
                        <FilterButton label="Неактивні" active={statusFilter === "inactive"} onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); }} />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Пошук..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="w-full h-9 pl-10 pr-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} /> Додати Перевізника
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {Array.from({ length: pageSize }).map((_, i) => <CarrierCardSkeleton key={i} />)}
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}
            {!loading && carriers.length === 0 && !error && (
                <p className="text-center text-slate-500 mt-10">Немає даних за вибраними фільтрами</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {carriers.map(carrier => (
                    <CarrierCard key={carrier.id} carrier={carrier} onViewDetails={setSelectedCarrier} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* ADD MODAL */}
            {showAddModal && (
                <AddModal open={showAddModal} onClose={setShowAddModal} title="Додати Перевізника" description="Створіть нового перевізника">
                    <AddCarrierForm
                        onSubmit={async (data: CreateCarrierRequest) => {
                            await create(data);
                            // Після створення оновлюємо список
                            const updatedList = await getAll({ limit: pageSize, offset: 0 });
                            if (updatedList?.data) setCarriers(updatedList.data);
                            setShowAddModal(false);
                        }}
                        submitText="Додати"
                        onCancel={() => setShowAddModal(false)}
                    />
                </AddModal>
            )}

            {/* VIEW / EDIT MODAL */}
            <CardModal
                open={!!selectedCarrier}
                onClose={() => { setSelectedCarrier(null); setIsEdit(false); }}
                title={selectedCarrier?.name || "Без назви"}
                badge={selectedCarrier ? statusLabels[selectedCarrier.isActive ? "active" : "inactive"] : undefined}
                badgeVariant={selectedCarrier ? statusBadgeVariant[selectedCarrier.isActive ? "active" : "inactive"] : undefined}
                isEdit={isEdit}
                onToggleEdit={toggleEditMode}
                onDelete={async () => {
                    if (!selectedCarrier) return;
                    const confirmed = confirm("Ви дійсно хочете видалити цього перевізника?");
                    if (!confirmed) return;
                    const success = await remove(selectedCarrier.id.toString());
                    if (success) {
                        setCarriers(prev => prev.filter(c => c.id !== selectedCarrier.id));
                        setSelectedCarrier(null);
                        setIsEdit(false);
                    }
                }}
            >
                {selectedCarrier && isEdit ? (
                    <AddCarrierForm
                        initialData={selectedCarrier}
                        submitText="Зберегти"
                        onSubmit={async (data: CreateCarrierRequest) => {
                            if (!selectedCarrier) return;
                            await update(selectedCarrier.id.toString(), data);
                            // Оновлюємо список
                            const updatedList = await getAll({ limit: pageSize, offset: 0 });
                            if (updatedList?.data) setCarriers(updatedList.data);
                            setIsEdit(false);
                        }}
                        onCancel={() => setIsEdit(false)}
                    />
                ) : (
                    selectedCarrier && (
                        <div className="space-y-6">
                            {/* CONTACTS */}
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Перевізник</p>
                                    <p className="font-semibold text-slate-900">{selectedCarrier.name}</p>
                                </div>
                            </div>

                            {/* CONTACT DETAILS */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-slate-900">Контакти</h4>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Телефон</p>
                                        <p className="font-medium">{selectedCarrier.phoneNumber}</p>
                                    </div>
                                </div>
                                {selectedCarrier.telegram && (
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                            <Send className="w-5 h-5 text-sky-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Telegram</p>
                                            <p className="font-medium">@{selectedCarrier.telegram}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {role === "Admin" && (
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-500">Статус</p>
                                    <select
                                        value={selectedCarrier.isActive ? "active" : "inactive"}
                                        onChange={e => handleActivityChange(e.target.value as "active" | "inactive")}
                                        className="w-full h-9 rounded-xl px-3 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        disabled={loading}
                                    >
                                        <option value="active">Активний</option>
                                        <option value="inactive">Неактивний</option>
                                    </select>
                                </div>
                            )}

                            {/* DETAILS */}
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="font-medium mb-4">Деталі</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                                        <Truck className="mx-auto text-slate-400" />
                                        <p className="text-sm mt-2 text-slate-500">Тип транспорту</p>
                                        <p className="font-semibold">{selectedCarrier.vehicleType}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                                        <Weight className="mx-auto text-slate-400" />
                                        <p className="text-xl font-bold mt-2">{selectedCarrier.maxLoadKg}</p>
                                        <p className="text-xs text-slate-500">кг</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                                        <MapPin className="mx-auto text-slate-400" />
                                        <p className="text-sm mt-2 text-slate-500">Напрямки</p>
                                        <p className="font-semibold">{selectedCarrier.regions.join(", ")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </CardModal>
        </main>
    );
};

export default Carriers;
