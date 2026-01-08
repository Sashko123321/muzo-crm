import { getCargos, getCargo, createCargo, updateCargo, deleteCargo, toggleCargoActivity } from "../../config/api.config.ts";
import instance from "../api/interseptors.api.ts";
import type { CargoQueryParams, CreateCargoRequest } from "../../types/cargo.type.ts";

export const CargoService = {
    getAll: (params?: CargoQueryParams) =>
        instance({
            url: getCargos(),
            method: "GET",
            params,
        }),

    getOne: (id: string) =>
        instance({
            url: getCargo(id),
            method: "GET",
        }),

    create: (data: CreateCargoRequest) =>
        instance({
            url: createCargo(),
            method: "POST",
            data,
        }),

    update: (id: string, data: CreateCargoRequest) =>
        instance({
            url: updateCargo(id),
            method: "PUT",
            data,
        }),

    delete: (id: string) =>
        instance({
            url: deleteCargo(id),
            method: "DELETE",
        }),

    toggleActivity: (id: string, isActive: boolean) =>
        instance({
            url: toggleCargoActivity(id),
            method: "PATCH",
            data: isActive,
        }),
};
