import axios from "axios";
import BASE from "../base";
import { BackgroundImage } from "@/types/backgroundImage";

const api = axios.create({
    baseURL: `${BASE}background`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const newImage = async (at: string | undefined, FD: FormData) => {
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

export const getImage = async () => {
    return (await api.get('')).data;
}

export const getImageName = async (at: string | undefined) => {
    return (await api.get('/name')).data;
}