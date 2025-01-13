import axios from "axios";
import BASE from "../base";

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