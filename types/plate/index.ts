import Category from "../categories";
import Garnet from "../garnets";

export default interface Plate {
    _id?: string;
    name: string;
    price: number;
    availability: boolean;
    visible: boolean;
    garnetID: string;
    categoryID: string;
    order: number;
    desc?: string;
    image?: Buffer;
    imageMimeType?: string;
    kiloPrice: boolean;
    showIcon: boolean;
    showDesc: boolean;
    showGarnet: boolean;
    showPrice: boolean;
    showOnSpecial: boolean;
    onlyOnSpecial: boolean;
};

export interface AddPlate {
    name: string;
    price: string;
    visible: string | boolean;
    garnetID: string;
    categoryID: string;
    availability: string | boolean;
    showOnSpecial: string | boolean;
    onlyOnSpecial: string | boolean;
    desc?: string;
    image?: Buffer;
    mimeType?: string;
    showIcon?: boolean;
    showDesc?: boolean;
    showGarnet?: boolean;
    showPrice?: boolean;
}

export interface PlateSettings {
    _id: string;
    showIcon: boolean;
    showDesc: boolean;
    showGarnet: boolean;
    showPrice: boolean;
}

export interface PlateUpdate {
    _id: string;
    name: string;
    price: number;
    visisble: boolean;
    garnetID: string;
    categoryID: string;
    availability: boolean;
    showOnSpecial: boolean;
    onlyOnSpecial: boolean;
    desc?: string;
}

export interface PlateUpdateWithImage extends PlateUpdate {
    image: Buffer;
    imageMimeType: string;
}

export interface PlateComplex {
    _id?: string;
    name: string;
    price: number;
    availability: boolean;
    visible: boolean;
    garnet: Garnet;
    category: Category;
    order: number;
    desc?: string;
    image?: Buffer;
    imageMimeType?: string;
    kiloPrice: boolean;
    showIcon: boolean;
    showDesc: boolean;
    showGarnet: boolean;
    showPrice: boolean;
    showOnSpecial: boolean;
    onlyOnSpecial: boolean;
}

export interface PlateCategories {
    category: Category,
    plates: PlateComplex[], 
}

export interface PlateCategoriesSimple {
    category: string;
    plates: PlateComplex[],
}

export interface PlateFixOrder {
    categoryID: string,
    name: string;
    _id: string;
    order: number;
}

export interface PlateStats {
    all: number;
    visible: number;
    showOnSpecial: number;
    onlyOnSpecial: number;
    availability: number;
    hasImage: number;
}

export enum PlateImagePositionEnum {
    left = "left",
    right = "right",
    bg = "background",
}

export enum AvailabilityOptionsEnum {
    opacity = 'opacity',
    hide = 'hide',
    grey = 'greyedOut',
    nothing = 'nothing',
}