import axios from "axios";
import BASE from "../base";
import Garnet, { CreateGarnet } from "@/types/garnets";

const api = axios.create({
    baseURL: `${BASE}garnet`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const newGarnet = async (at: string | undefined, obj: CreateGarnet): Promise<string | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.post('/new', obj, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const getGarnets = async (): Promise<Garnet[]> => {
    const res = await api.get('/all');
    return res.data;
}

export const updateGarnet = async (at: string | undefined, obj: Garnet): Promise<boolean> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/update', obj, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const deleteGarnet = async (at: string | undefined, id: string): Promise<boolean | undefined> => {
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