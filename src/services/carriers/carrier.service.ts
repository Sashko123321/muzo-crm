import type { CarrierQueryParams, CreateCarrierRequest } from "../../types/carrier.type.ts";
import instance from "../api/interseptors.api.ts";
import { getCarriers, getCarrier, createCarrier, updateCarrier, deleteCarrier, toggleCarrierActivity } from "../../config/api.config.ts";

export const CarriersService = {
    getAll: (params?: CarrierQueryParams) =>
        instance({
            url: getCarriers(),
            method: "GET",
            params,
        }),

    getOne: (id: string) =>
        instance({
            url: getCarrier(id),
            method: "GET",
        }),

    create: (data: CreateCarrierRequest) =>
        instance({
            url: createCarrier(),
            method: "POST",
            data,
        }),

    update: (id: string, data: CreateCarrierRequest) =>
        instance({
            url: updateCarrier(id),
            method: "PUT",
            data,
        }),

    delete: (id: string) =>
        instance({
            url: deleteCarrier(id),
            method: "DELETE",
        }),

    toggleActivity: (id: string, isActive: boolean) =>
        instance({
            url: toggleCarrierActivity(id),
            method: "PATCH",
            data: isActive,
        }),
};
