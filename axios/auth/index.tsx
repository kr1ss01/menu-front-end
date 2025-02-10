import axios from "axios";
import BASE from "../base";

import JWTResponseType from "@/types/tokens";
import SafeUser, { InfoUser } from "@/types/auth";

const api = axios.create({
    baseURL: `${BASE}auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (pwd: string, uid: string): Promise<JWTResponseType | undefined> => {
    try {
        const res = await api.post('/local/signin', {
            password: pwd,
            username: uid,
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const handleRT = async (rt: string | undefined): Promise<JWTResponseType | undefined> => {
    try {
        const token = 'Bearer ' + rt;
        const res = await api.post('/refresh', {}, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const logout = async (at: string): Promise<void> => {
    try {
        const token = 'Bearer ' + at;
        await api.post('/logout', {}, {
            headers: {
                'Authorization': `${token}`,
            },
        });
    } catch (e) {
        return;
    }
}

export const getInfo = async (at: string): Promise<InfoUser | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.get('/user', {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const changeUsersImage = async (at: string | undefined, fd: FormData, size: number): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/image', fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${token}`,
                'Content-Length': size
            },
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return;
    }
}

export const changeUsersEmail = async (at: string | undefined, oldEmail: string, newEmail: string): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/email', {
            email: oldEmail,
            newEmail: newEmail,
        },
        {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const changeUsersName = async (at: string | undefined, name: string): Promise<boolean | undefined> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('fullname', {
            nName: name,
        },
        {
            headers: {
                'Authorization': `${token}`,
            }
        });
        return res.data;
    } catch (e) {
        return;
    }
}

export const changeUsersPassword = async (at: string | undefined, oldPwd: string, newPwd: string) => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.put('/password', {
            pwd: oldPwd,
            newPwd: newPwd,
        },
        {
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

export const getUsersEmailHidden = async (at: string | undefined): Promise<string> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.get('/email', {
            headers: {
                'Authorization': `${token}`,
            }
        });
        return res.data;
    } catch (e) {
        return '';
    }
}

export const getUsersLastPasswordUpdate = async (at: string | undefined): Promise<string> => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.get('/password', {
            headers: {
                'Authorization': `${token}`,
            }
        });
        return res.data;
    } catch (e) {
        return '';
    }
}

export const getOwn = async (at: string | undefined) => {
    try {
        const token = 'Bearer ' + at;
        const res = await api.get('/own', {
            headers: {
                'Authorization': `${token}`,
            }
        });
        return res.data;
    } catch (e) {
        return '';
    }
}