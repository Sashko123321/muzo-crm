import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import CardModal from "../../components/shered/CardModal.tsx";
import Skeleton from "../../components/skeleton/Skeleton.tsx";
import AddMemberForm from "./components/AddMemberForm.tsx";
import { MemberCard } from "./components/MemberCard.tsx";
import AddModal from "../../components/shered/AddModal.tsx";

import { useUser } from "../../hooks/user/useUser.ts";
import { usePayments } from "../../hooks/payment/usePayments.ts";
import type { RoleType, UserResponse } from "../../types/user.type.ts";

type Currency = "USD" | "EUR" | "UAH";
const currencySymbols: Record<Currency, string> = {
    USD: "$",
    EUR: "€",
    UAH: "₴",
};

interface TeamMember {
    id: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role: RoleType;
    isActive: boolean;
}

interface RevenueByCurrency {
    [key: string]: number;
}

const Members = () => {
    const { getAll, remove, update, toggleActivity, create, loading: loadingUsers } = useUser();
    const { getUserTotalPayments } = usePayments();

    const [members, setMembers] = useState<TeamMember[]>([]);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [selectedRevenue, setSelectedRevenue] = useState<RevenueByCurrency | null>(null);

    const [isEdit, setIsEdit] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const toggleEditMode = () => setIsEdit(prev => !prev);

    const mapUserToTeamMember = (user: UserResponse): TeamMember => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
    });

    const statusLabels = {
        active: "Активний",
        inactive: "Неактивний",
    };
    const statusBadgeVariant = {
        active: "active",
        inactive: "inactive",
    } as const;

    // ===================== FETCH USERS =====================
    useEffect(() => {
        (async () => {
            const res = await getAll({ limit: 50, offset: 0 });
            if (res) setMembers(res.data.map(mapUserToTeamMember));
        })();
    }, [getAll]);

    // ===================== FETCH REVENUE =====================
    useEffect(() => {
        if (!selectedMember) return;

        (async () => {
            const data = await getUserTotalPayments(selectedMember.id, "Paid");
            setSelectedRevenue(data?.totalByCurrency ?? null);
        })();
    }, [selectedMember, getUserTotalPayments]);

    const handleToggleActivity = async (member: TeamMember) => {
        const action = member.isActive ? "заблокувати" : "розблокувати";
        if (!confirm(`Ви дійсно хочете ${action} користувача ${member.firstName ?? ""} ${member.lastName ?? ""}?`)) return;

        const updated = await toggleActivity(member.id.toString(), !member.isActive);
        if (!updated) return;

        const mapped = mapUserToTeamMember(updated);
        setMembers(prev => prev.map(m => m.id === member.id ? mapped : m));
        setSelectedMember(mapped);
    };

    return (
        <main className="p-4 w-full">
            {/* ===================== HEADER ===================== */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Команда користувачів</h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                    <Plus size={18} /> Додати користувача
                </button>
            </div>

            {/* ===================== USERS GRID ===================== */}
            {loadingUsers ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <Skeleton className="h-5 w-32 mt-2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {members.map((member, index) => (
                        <MemberCard key={index} member={member} onViewDetails={setSelectedMember} />
                    ))}
                </div>
            )}

            {/* ===================== ADD USER MODAL ===================== */}
            {showAddModal && (
                <AddModal
                    open={showAddModal}
                    onClose={setShowAddModal}
                    title="Додати користувача"
                >
                    <AddMemberForm
                        submitText="Додати користувача"
                        onSubmit={async (data) => {
                            const newUser = await create(data);
                            if (!newUser) return;

                            setMembers(prev => [mapUserToTeamMember(newUser), ...prev]);
                            setShowAddModal(false);
                        }}
                        onCancel={() => setShowAddModal(false)}
                    />
                </AddModal>
            )}

            {/* ===================== DETAIL MODAL ===================== */}
            <CardModal
                open={!!selectedMember}
                onClose={() => {
                    setSelectedMember(null);
                    setSelectedRevenue(null);
                    setIsEdit(false);
                }}
                title={selectedMember ? `${selectedMember.firstName ?? ""} ${selectedMember.lastName ?? ""}` : "Без імені"}
                badge={selectedMember ? statusLabels[selectedMember.isActive ? "active" : "inactive"] : undefined}
                badgeVariant={selectedMember ? statusBadgeVariant[selectedMember.isActive ? "active" : "inactive"] : undefined}
                isEdit={isEdit}
                onToggleEdit={toggleEditMode}
                onDelete={async () => {
                    if (!selectedMember) return;
                    if (!confirm(`Ви дійсно хочете видалити ${selectedMember.firstName ?? ""} ${selectedMember.lastName ?? ""}?`)) return;

                    const success = await remove(selectedMember.id.toString());
                    if (success) {
                        setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
                        setSelectedMember(null);
                        setSelectedRevenue(null);
                        setIsEdit(false);
                    }
                }}
            >
                {selectedMember && isEdit ? (
                    <AddMemberForm
                        initialData={{
                            firstName: selectedMember.firstName,
                            lastName: selectedMember.lastName,
                            phoneNumber: selectedMember.phoneNumber,
                            role: selectedMember.role,
                            password: "",
                        }}
                        onCancel={() => setIsEdit(false)}
                        onSubmit={async (data) => {
                            if (!selectedMember) return;
                            const updatedData = { ...data, isActive: selectedMember.isActive };
                            const updated = await update(selectedMember.id.toString(), updatedData);
                            if (!updated) return;

                            const mapped = mapUserToTeamMember(updated);
                            setMembers(prev => prev.map(m => m.id === selectedMember.id ? mapped : m));
                            setSelectedMember(mapped);
                            setIsEdit(false);
                        }}
                    />
                ) : selectedMember ? (
                    <div className="space-y-6 p-6 bg-white shadow-md rounded-2xl">
                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Ім'я</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedMember.firstName ?? "-"}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Прізвище</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedMember.lastName ?? "-"}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Телефон</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedMember.phoneNumber ?? "-"}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Роль</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedMember.role}</p>
                        </div>

                        {/* Revenue */}
                        <div className="pt-4 border-t border-slate-200">
                            <h4 className="font-medium text-slate-900 mb-4">Заробіток по валютах</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedRevenue ? (
                                    Object.entries(selectedRevenue)
                                        .filter(([, amount]) => Number(amount) > 0)
                                        .map(([currency, amount]) => (
                                            <div
                                                key={currency}
                                                className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white text-center shadow-lg hover:scale-105 transition-transform"
                                            >
                                                <p className="text-2xl sm:text-3xl font-bold">
                                                    {currencySymbols[currency as Currency]}{Number(amount).toLocaleString()}
                                                </p>
                                                <p className="text-white/80 text-sm mt-1">{currency}</p>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-sm text-slate-400 text-center col-span-2">Немає заробітку</p>
                                )}
                            </div>
                        </div>

                        <button
                            className={`w-full mt-4 py-3 rounded-xl text-white font-medium shadow hover:shadow-lg transition-all ${
                                selectedMember.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => handleToggleActivity(selectedMember)}
                        >
                            {selectedMember.isActive ? "Заблокувати" : "Розблокувати"}
                        </button>
                    </div>
                ) : null}
            </CardModal>
        </main>
    );
};

export default Members;
