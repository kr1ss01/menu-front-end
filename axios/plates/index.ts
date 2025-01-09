import axios from "axios";
import BASE from "../base";
import Plate, { AddPlate, PlateFixOrder, PlateUpdate } from "@/types/plate";

const api = axios.create({
    baseURL: `${BASE}plate`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const newPlate = async (at: string | undefined, FD: FormData): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.post('/new', FD, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const getAllPlates = async (): Promise<Plate[]> => {
    const res = await api.get('/get/all');
    return res.data;
}

export const getPlatesOnCategory = async (catID: string): Promise<Plate[]> => {
    const res = await api.get(`/get/category/${catID}`);
    return res.data;
}

export const deletePlate = async (at: string | undefined, id: string): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.delete(`/delete/${id}`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const updatePlate = async (at: string | undefined, item: PlateUpdate): Promise<boolean> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/update', item, {
            headers: {
                'Authorization': `${token}`,
            }
        });
        return res.data;
    } catch (e) {
        return false;
    }
}

export const updatePlateWithImage = async (at: string | undefined, FD: FormData): Promise<boolean> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/update/image', FD, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${token}`,
            }
        });
        return res.data;
    } catch (e) {
        return false;
    }
}

export const fixPlateOrder = async (at: string | undefined, obj: PlateFixOrder[]): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/order/fix', obj, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return;
    }
}

export const getPlateStats = async () => {
    return (await api.get('stats/all')).data;
}