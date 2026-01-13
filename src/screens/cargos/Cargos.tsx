    import { useEffect, useState } from "react";
    import { Compass, MapPin, Package, Plus, Search, Weight} from "lucide-react";

    import Pagination from "../../components/Pagination";
    import CargoCardSkeleton from "./components/CargoCardSkeleton";
    import CardModal from "../../components/shered/CardModal";

    import { useCargo } from "../../hooks/cargo/useCargo";
    import type { CargoResponse } from "../../types/cargo.type";
    import FilterButton from "../../components/button/FilterButton.tsx";
    import CargoCard from "./components/CargoCard.tsx";
    import AddModal from "../../components/shered/AddModal.tsx";
    import AddCargoForm from "./components/AddCargoForm.tsx";
    import {getUserRole} from "../../ utils/auth.ts";

    const Cargos = () => {
        const { loading, error, getAll,toggleActivity } = useCargo();

        const [cargos, setCargos] = useState<CargoResponse[]>([]);
        const [search, setSearch] = useState("");
        const [statusFilter, setStatusFilter] =
            useState<"all" | "active" | "inactive">("all");

        const [currentPage, setCurrentPage] = useState(1);
        const pageSize = 8;
        const [totalPages, setTotalPages] = useState(1);

        const [showAddModal, setShowAddModal] = useState(false);
        const [selectedCargo, setSelectedCargo] = useState<CargoResponse | null>(null);

        const role = getUserRole();

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
                    setCargos(data.data);

                    const pages = Math.ceil((data.totalCount || 1) / pageSize) || 1;
                    setTotalPages(pages);
                } else {
                    setCargos([]);
                    setTotalPages(1);
                }
            };

            fetchData();
            return () => { mounted = false; };
        }, [currentPage, search, statusFilter, getAll]);

        const handleActivityChange = async (value: "active" | "inactive") => {
            if (!selectedCargo) return;
            const isActive = value === "active";
            const updated = await toggleActivity(selectedCargo.id.toString(), isActive);
            if (!updated) return;

            setSelectedCargo(updated);

            setCargos((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
            );
        };


        const statusLabels = {
            active: "Активний",
            inactive: "Неактивний",
        };

        const statusBadgeVariant = {
            active: "active",
            inactive: "inactive",
        } as const;

        const formatDate = (dateStr?: string) => {
            if (!dateStr) return "Н/Д";
            const date = new Date(dateStr);
            return `${date.getDate().toString().padStart(2,"0")}.${(date.getMonth()+1).toString().padStart(2,"0")}.${date.getFullYear()}`;
        };
        const currencyIcons: Record<string, string> = {
            USD: "$",
            EUR: "€",
            UAH: "₴",
        };

        const [isEdit, setIsEdit] = useState(false);
        const toggleEditMode = () => {
            setIsEdit((prev) => !prev);
        };

        const { create, update ,remove} = useCargo();

        return (
            <main className="p-4 w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-4">Список Вантажів</h1>

                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <FilterButton
                                label="Всі"
                                active={statusFilter === "all"}
                                onClick={() => {
                                    setStatusFilter("all");
                                    setCurrentPage(1);
                                }}
                            />
                            <FilterButton
                                label="Активні"
                                active={statusFilter === "active"}
                                onClick={() => {
                                    setStatusFilter("active");
                                    setCurrentPage(1);
                                }}
                            />
                            <FilterButton
                                label="Неактивні"
                                active={statusFilter === "inactive"}
                                onClick={() => {
                                    setStatusFilter("inactive");
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Search + Add */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Пошук..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="
                                        w-full h-9 pl-10 pr-3 rounded-xl
                                        border border-slate-300
                                        text-sm text-slate-900
                                        placeholder:text-slate-400
                                        focus:outline-none
                                        focus:ring-2 focus:ring-indigo-500
                                    "
                                />
                            </div>

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="
                                    inline-flex items-center gap-2
                                    h-9 px-4 rounded-xl
                                    bg-indigo-600 text-white font-medium
                                    hover:bg-indigo-700 transition
                                "
                            >
                                <Plus size={18} /> Додати вантаж
                            </button>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {Array.from({ length: pageSize }).map((_, i) => (
                            <CargoCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && cargos.length === 0 && !error && (
                    <p className="text-center text-slate-500 mt-10">
                        Немає даних за вибраними фільтрами
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {cargos.map((cargo) => (
                        <CargoCard
                            key={cargo.id}
                            cargo={cargo}
                            onViewDetails={setSelectedCargo}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}


                {showAddModal && (
                    <AddModal
                        open={showAddModal}
                        onClose={setShowAddModal}
                        title="Додати Вантаж"
                        description="Створіть новий вантажний маршрут"

                    >
                        <AddCargoForm
                            submitText="Додати вантаж"
                            onSubmit={async (data) => {
                                const cargo = await create(data);
                                if (cargo) {
                                    setCargos((prev) => [cargo, ...prev]);
                                    setShowAddModal(false);
                                }
                            }}
                        />

                    </AddModal>

                )}

                <CardModal
                    open={!!selectedCargo}
                    onClose={() => {
                        setSelectedCargo(null);
                        setIsEdit(false);
                    }}
                    title={selectedCargo?.description || "Без опису"}
                    badge={
                        selectedCargo
                            ? statusLabels[selectedCargo.isActive ? "active" : "inactive"]
                            : undefined
                    }
                    badgeVariant={
                        selectedCargo
                            ? statusBadgeVariant[
                                selectedCargo.isActive ? "active" : "inactive"
                                ]
                            : undefined
                    }
                    isEdit={isEdit}
                    onToggleEdit={toggleEditMode}
                    onDelete={async () => {
                        if (!selectedCargo) return;
                        const confirmed = confirm("Ви дійсно хочете видалити цей вантаж?");
                        if (!confirmed) return;

                        const success = await remove(selectedCargo.id.toString());
                        if (success) {
                            // Оновлюємо список вантажів
                            setCargos((prev) => prev.filter((c) => c.id !== selectedCargo.id));
                            setSelectedCargo(null);
                            setIsEdit(false);
                        }
                    }}
                >

                    {selectedCargo && isEdit ?
                        <AddCargoForm
                            initialData={selectedCargo}
                            submitText="Зберегти зміни"
                            onCancel={() => setIsEdit(false)}
                            onSubmit={async (data) => {
                                const updated = await update(selectedCargo.id.toString(), data);

                                if (!updated) return;

                                setCargos((prev) =>
                                    prev.map((c) => (c.id === updated.id ? updated : c))
                                );

                                setSelectedCargo(updated);
                                setIsEdit(false);
                            }}

                        />

                    :
                    <>
                        {selectedCargo && (
                            <div className="space-y-6">
                                {/* Client Info */}
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex flex-col items-center justify-center text-white">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-slate-500">Клієнт</p>
                                        <p className="font-semibold text-slate-900">{selectedCargo.clientName || "Н/Д"}</p>
                                        {selectedCargo.clientPhone && (
                                            <p className="text-xs text-slate-500 mt-1">{selectedCargo.clientPhone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-slate-900">Маршрут</h4>

                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Відправлення
                                            </p>
                                            <p className="font-medium">
                                                {selectedCargo.fromLocation}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-5 h-6 border-l-2 border-dashed border-slate-200" />

                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Призначення
                                            </p>
                                            <p className="font-medium">
                                                {selectedCargo.toLocation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {role === "Admin" && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-500">Статус</p>

                                        <select
                                            value={selectedCargo.isActive ? "active" : "inactive"}
                                            onChange={(e) =>
                                                handleActivityChange(e.target.value as "active" | "inactive")
                                            }
                                            className="
                                                w-full h-9 rounded-xl px-3
                                                border border-slate-300
                                                text-sm
                                                focus:outline-none
                                                focus:ring-2 focus:ring-indigo-500
                                            "
                                            disabled={loading}
                                        >
                                            <option value="active">Активний</option>
                                            <option value="inactive">Неактивний</option>
                                        </select>
                                    </div>
                                )}
                                {/* Details */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="font-medium mb-4">Деталі</h4>

                                    <div className="grid grid-cols-3 gap-4 ">
                                        {selectedCargo.weightKg && (
                                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                                <Weight className="mx-auto text-slate-400" />
                                                <p className="text-xl font-bold mt-2">
                                                    {selectedCargo.weightKg}
                                                </p>
                                                <p className="text-xs text-slate-500">кг</p>
                                            </div>
                                        )}

                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <Compass className="mx-auto text-slate-400" />
                                            <p className="text-xl font-bold mt-2">
                                                {selectedCargo.directionForward || "-"}
                                            </p>
                                            {/*<p className="text-xs text-slate-500">м³</p>*/}
                                        </div>

                                        {selectedCargo.price && (
                                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <span className="text-lg text-slate-400">
                                                {currencyIcons[selectedCargo.currency || "USD"]}
                                            </span>
                                                <p className="text-xl font-bold mt-2">
                                                    {selectedCargo.price.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    ціна
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Dimensions */}
                                    {selectedCargo.dimensions && (
                                        <div className="mt-4 bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-xs text-slate-500">Розміри вантажу</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">{selectedCargo.dimensions}</p>
                                        </div>
                                    )}

                                    {/* --- Додаємо терміни завантаження --- */}
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                                            <p className="text-xs text-slate-500">Завантаження з</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                                {formatDate(selectedCargo.availableFrom)}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                                            <p className="text-xs text-slate-500">Завантаження до</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                                {formatDate(selectedCargo.availableTo)}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedCargo.notes && (
                                        <div className="pt-4 ">
                                            <h4 className="font-medium mb-2">Нотатки</h4>
                                            <div className="bg-slate-50 p-4 rounded-xl max-h-48 overflow-y-auto">
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {selectedCargo.notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>

                    }

                </CardModal>
            </main>
        );
    };

    export default Cargos;
