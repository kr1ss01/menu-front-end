import axios from "axios";
import BASE from "../base";
import { Settings } from "@/types/settings";
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

export const updateImageSettings = async (value: PlateImagePositionEnum): Promise<boolean> => {
    return (await api.put('/update/image', { value: value })).data;
}

export const updateAvailabiltySettings = async (value: AvailabilityOptionsEnum): Promise<boolean> => {
    return (await api.put('/update/availability', { value: value })).data;
}

export const updateHideSettings = async (value: boolean): Promise<boolean> => {
    return (await api.put('/update/hide', { value: value })).data;
}

export const updateSpecialSettings = async (value: boolean): Promise<boolean> => {
    return (await api.put('/update/special', { value: value })).data;
}

export const updateBackgroundImageSettings = async (value: boolean): Promise<boolean> => {
    return (await api.put('/update/bgimage', { value: value })).data;
}