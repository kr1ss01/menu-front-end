import axios from "axios";
import BASE from "../base";
import Category, { CategoryCreate, CategoryOrder, CategoryStats, CategoryUpdate } from "@/types/categories";

const api = axios.create({
    baseURL: `${BASE}category`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const newCategory = async (obj: CategoryCreate, at: string | undefined): Promise<Category | undefined> => {
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

export const getCategories = async (): Promise<Category[]> => {
    const res = await api.get('/all');
    return res.data;
}

export const updateCateogry = async (at: string | undefined, obj: CategoryUpdate): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/update', obj, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

// export const deleteCategory = async (at: string | undefined, id: string): Promise<boolean | undefined> => {
//     try {
//         const token = 'Bearer ' + at;
//         const res = await api.delete(`/delete/${id}`, {
//             headers: {
//                 'Authorization': `${token}`,
//             },
//         });
//         return res.data;
//     } catch (e) {
//         return;
//     }
// }

// ! PROVIDE ALL THE CATEGORIES TO THE API!!
export const orderFixOnCategory = async (at: string | undefined, obj: CategoryOrder[]): Promise<boolean[] | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/order/fix', obj, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const getStatsCategories = async (): Promise<CategoryStats> => {
    const res = await api.get('/stats');
    return res.data;
}
