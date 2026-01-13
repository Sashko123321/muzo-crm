import { useEffect, useState } from "react";
import { Plus, Search,} from "lucide-react";

import FilterButton from "../../components/button/FilterButton";
import Pagination from "../../components/Pagination";
import CardModal from "../../components/shered/CardModal";

import { useClient } from "../../hooks/client/useClient";
import type { ClientResponse } from "../../types/client.type";

import ClientCard from "./components/ClientCard.tsx";
import AddClientForm from "./components/AddClientModal";
import AddModal from "../../components/shered/AddModal.tsx";

const Clients = () => {
    const { loading, error, getAll,  update,create } = useClient();


    const [clients, setClients] = useState<ClientResponse[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<"all" | "Thinking" | "Supported" | "Declined">("all");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const [totalPages, setTotalPages] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            const params = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                searchField: search || undefined,
                status: statusFilter === "all" ? undefined : statusFilter,
            };

            const data = await getAll(params);
            if (!mounted) return;

            if (data?.data) {
                setClients(data.data);
                setTotalPages(Math.ceil(data.totalCount / pageSize) || 1);
            } else {
                setClients([]);
                setTotalPages(1);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [currentPage, search, statusFilter, getAll]);

    const statusLabels = {
        Thinking: "Думають",
        Supported: "Співпрацюємо",
        Declined: "Не співпрацюємо",
    };

    const statusBadgeVariant = {
        Thinking: "default",
        Supported: "active",
        Declined: "inactive",
    } as const;

    return (
        <main className="p-4 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Список Клієнтів</h1>

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
                            label="Співпрацюємо"
                            active={statusFilter === "Supported"}
                            onClick={() => {
                                setStatusFilter("Supported");
                                setCurrentPage(1);
                            }}
                        />
                        <FilterButton
                            label="Не співпрацюємо"
                            active={statusFilter === "Declined"}
                            onClick={() => {
                                setStatusFilter("Declined");
                                setCurrentPage(1);
                            }}
                        />
                        <FilterButton
                            label="Думають"
                            active={statusFilter === "Thinking"}
                            onClick={() => {
                                setStatusFilter("Thinking");
                                setCurrentPage(1);
                            }}
                        />
                    </div>

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
                            <Plus size={18} /> Додати клієнта
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <p className="text-center text-slate-500">Завантаження...</p>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && clients.length === 0 && !error && (
                <p className="text-center text-slate-500 mt-10">
                    Клієнтів не знайдено
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {clients.map((client) => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        onView={() => setSelectedClient(client)}
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
                    title="Додати клієнта"
                >
                    <AddClientForm
                        submitText="Додати клієнта"
                        onSubmit={async (data) => {
                            const client = await create(data);
                            if (!client) return;

                            if ("duplicated" in client) {
                                alert(client.message); // або toast
                                return;
                            }

                            setClients(prev => [client, ...prev]); // тільки справжній ClientResponse
                            setShowAddModal(false);
                        }}

                    />
                </AddModal>
            )}


            <CardModal
                open={!!selectedClient}
                onClose={() => {
                    setSelectedClient(null);
                    setIsEdit(false);
                }}
                title={selectedClient?.name ?? "Клієнт"}
                badge={selectedClient ? statusLabels[selectedClient.status] : undefined}
                badgeVariant={
                    selectedClient ? statusBadgeVariant[selectedClient.status] : undefined
                }
                isEdit={isEdit}
                onToggleEdit={() => setIsEdit((p) => !p)}
            >
                {!selectedClient ? null : isEdit ? (
                    <AddClientForm
                        initialData={selectedClient}
                        submitText="Зберегти зміни"
                        onCancel={() => setIsEdit(false)}
                        onSubmit={async (data) => {
                            const updated = await update(
                                selectedClient.id.toString(),
                                data
                            );

                            if (!updated) return;

                            setClients((prev) =>
                                prev.map((c) =>
                                    c.id === updated.id ? updated : c
                                )
                            );

                            setSelectedClient(updated);
                            setIsEdit(false);
                        }}
                    />
                ) : (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-1">Імʼя клієнта</p>
                                <p className="text-sm font-semibold text-slate-900">
                                    {selectedClient.name}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-1">Тип клієнта</p>
                                <p className="text-sm font-semibold text-slate-900">
                                    {selectedClient.type === "Individual" && "Фізична особа"}
                                    {selectedClient.type === "Company" && "Компанія"}
                                    {selectedClient.type === "PartnerCompany" &&
                                        "Партнерська компанія"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-1">Email</p>
                                <p className="text-sm text-slate-900">
                                    {selectedClient.email || (
                                        <span className="text-slate-400">Не вказано</span>
                                    )}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-1">Телефон</p>
                                <p className="text-sm text-slate-900">
                                    {selectedClient.phone || (
                                        <span className="text-slate-400">Не вказано</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl p-4 border border-slate-200 text-center">
                                <p className="text-xl font-bold text-slate-900">
                                    {selectedClient.cargoCount}
                                </p>
                                <p className="text-xs text-slate-500">Вантажів</p>
                            </div>

                            <div className="rounded-xl p-4 border border-slate-200 text-center">
                                <p className="text-sm font-semibold text-slate-900">
                                    {statusLabels[selectedClient.status]}
                                </p>
                                <p className="text-xs text-slate-500">Статус</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 mb-1">Опис</p>
                            <p className="text-sm text-slate-900 whitespace-pre-line">
                                {selectedClient.description || (
                                    <span className="text-slate-400">
                            Опис відсутній
                        </span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </CardModal>


        </main>
    );
};

export default Clients;
