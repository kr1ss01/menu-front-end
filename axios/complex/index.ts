import axios from "axios";
import BASE from "../base";
import DeleteInterface from "@/types/delete";

const api = axios.create({
    baseURL: `${BASE}complex`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getPlates = async () => {
    return (await api.get('/plates')).data;
}

export const getPlatesByCategory = async () => {
    return (await api.get('/plates/categories')).data;
}

export const getPlatesByCategorySimple = async () => {
    return (await api.get('/plates/simple')).data;
}

export const getPlatesByCategoryStrickt = async (id: string) => {
    return (await api.get(`/plates/categories/${id}`)).data
}

export const getSpecialPlates = async () => {
    return (await api.get('/special')).data;
}

export const deleteCategory = async (at: string | undefined, id: string): Promise<DeleteInterface | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.delete(`/delete/category/${id}`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const deleteGarnet = async (at: string | undefined, id: string): Promise<DeleteInterface | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.delete(`/delete/garnet/${id}`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}