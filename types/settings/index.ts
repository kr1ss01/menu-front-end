import { AvailabilityOptionsEnum, PlateImagePositionEnum } from "../plate";

export interface Settings {
    imagePosition: PlateImagePositionEnum;
    showOnSpecialVisibility: boolean;
    backgroundImageVisibility: boolean;
    availabilitySettings: AvailabilityOptionsEnum;
    hideAllImages: boolean;
};