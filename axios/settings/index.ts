import axios from "axios";
import BASE from "../base";
import { Settings, UpdateSettings } from "@/types/settings";
import { AvailabilityOptionsEnum, PlateImagePositionEnum } from "@/types/plate";

const api = axios.create({
    baseURL: `${BASE}settings`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getSettings = async (): Promise<Settings> => {
    return (await api.get('')).data;
}

export const updateImageSettings = async (value: PlateImagePositionEnum | undefined, token: string | undefined): Promise<boolean> => {
    return (await api.put('/update/image', { value: value }, { headers: { 'Authorization': `Bearer ${token}` } })).data;
}

export const updateAvailabiltySettings = async (value: AvailabilityOptionsEnum | undefined, token: string | undefined): Promise<boolean> => {
    return (await api.put('/update/availability', { value: value }, { headers: { 'Authorization': `Bearer ${token}` } })).data;
}

export const updateHideSettings = async (value: boolean | undefined, token: string | undefined): Promise<boolean> => {
    return (await api.put('/update/hide', { value: value }, { headers: { 'Authorization': `Bearer ${token}` } })).data;
}

export const updateSpecialSettings = async (value: boolean | undefined, token: string | undefined): Promise<boolean> => {
    return (await api.put('/update/special', { value: value }, { headers: { 'Authorization': `Bearer ${token}` } })).data;
}

export const updateBackgroundImageSettings = async (value: boolean | undefined, token: string | undefined): Promise<boolean> => {
    return (await api.put('/update/bgimage', { value: value }, { headers: { 'Authorization': `Bearer ${token}` } })).data;
}

export const updateAll = async (values: UpdateSettings, at: string | undefined): Promise<boolean> => {
    try {
        const token = `Bearer ${at}`;
        const res =  await api.put('/update/all', values, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return false;
    }
}