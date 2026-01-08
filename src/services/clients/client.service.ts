import instance from "../api/interseptors.api.ts";
import type {
    ClientListResponse,
    ClientQueryParams,
    ClientResponse,
    CreateClientRequest
} from "../../types/client.type.ts";
import {createClient, deleteClient, getClient, getClients, updateClient} from "../../config/api.config.ts";




export const ClientService = {
    getAll: (params?: ClientQueryParams) =>
        instance<ClientListResponse>({
            url: getClients(),
            method: "GET",
            params,
        }),

    getOne: (id: string) =>
        instance<ClientResponse>({
            url: getClient(id),
            method: "GET",
        }),

    create: (data: CreateClientRequest) =>
        instance<ClientResponse>({
            url: createClient(),
            method: "POST",
            data,
        }),

    update: (id: string, data: CreateClientRequest) =>
        instance<ClientResponse>({
            url: updateClient(id),
            method: "PUT",
            data,
        }),

    delete: (id: string) =>
        instance<void>({
            url: deleteClient(id),
            method: "DELETE",
        }),
};
