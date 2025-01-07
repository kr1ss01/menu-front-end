export interface CategoryCreate {
    name: string;
    visible: string | boolean;
}

export default interface Category {
    _id: string;
    order: number;
    visible: boolean;
    name: string;
};

export interface CategoryOrder {
    _id: string;
    name: string;
}

export interface CategoryUpdate extends CategoryOrder {
    visible: boolean;
}

export interface CategoryStats {
    notVisible: string | number;
    visible: string | number;
    sum: string | number;
}