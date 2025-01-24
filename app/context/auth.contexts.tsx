"use client"

import * as React from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import * as api from '@/axios/auth/index';

import AuthContextInterface from '@/types/context';
import SafeUser from '@/types/auth';
import { Token } from '@/types/tokens';
import JWTResponseType from '@/types/tokens';

const AuthContext = React.createContext<AuthContextInterface>({
    auth: false,
    token: undefined,
    username: undefined,
    fullName: undefined,
    image: undefined,
    loading: true,
    login() {},
    logout() {},
    async handleRt() { return '' },
    handleChangeImageRaw() {},
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = React.useState<boolean>(false);
    const [token, setToken] = React.useState<string | undefined>(undefined);
    const [username, setUsername] = React.useState<string | undefined>(undefined);
    const [fullName, setFullName] = React.useState<string | undefined>(undefined);
    const [image, setImage] = React.useState<string | undefined>(undefined);
    const [loading, setLoading] = React.useState<boolean>(true);

    const [int, setInt] = React.useState<number>();

    React.useEffect(() => {
        const handleMountTokenCheck = async () => {
            const tkn = getCookie(Token.RefreshTokenCookie) as string;
            if (!tkn) {
                setLoading(false);
            }

            if (tkn) {
                await handleRt(tkn);
                setLoading(false);
            }
        }

        handleMountTokenCheck();
    }, []);

    // * I'm not sure if this is doing what I want it to do but ok... :)
    // ? Supposed to every 14 minutes update RT :|
    const handleUpdateRt = async (type: boolean) => {
        if (type) {
            const int = window.setInterval(async () => {
                const tk = getCookie(Token.RefreshTokenCookie) as string;

                await handleRt(tk);
                await handleUpdateRt(false);
                await handleUpdateRt(true);
            }, 1000 * 60 * 14);
            setInt(int);
        } else {
            if (int) {
                window.clearInterval(int);
            }
        }
    }

    const handleRt = async (rt?: string | undefined): Promise<string> => {
        var RT: string;

        if (!rt || rt == undefined) {
            RT = getCookie(Token.RefreshTokenCookie) as string;
        } else {
            RT = rt;
        }

        if (!RT) {
            return '';
        }

        const data: JWTResponseType | undefined = await api.handleRT(RT);

        if (data) {
            getUserInfo(data.access_token);

            setAuth(true);
            setToken(data.access_token);

            deleteCookie(Token.RefreshTokenCookie);
            setCookie(Token.RefreshTokenCookie, data.refresh_token);

            await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: data.access_token }),
            });

            return data.refresh_token;
        } else {
            return '';
        }
    }

    const login = async (at: string, rt: string): Promise<void> => {
        getUserInfo(at);

        setAuth(true);
        setToken(at);

        setCookie(Token.RefreshTokenCookie, rt);
        await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: at }),
        });
        handleUpdateRt(true);
    }

    const logout = async (): Promise<void> => {
        if (token) {
            api.logout(token);
        }

        setAuth(false);
        setUsername(undefined);
        setFullName(undefined);
        setToken(undefined);

        deleteCookie(Token.RefreshTokenCookie);
        await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        handleUpdateRt(false);
    }

    const handleChangeImageRaw = (image: string) => {
        setImage(image);
    }

    // ! Private
    const handleUserImage = async (img?: Buffer) => {
        if (!img) return;
        // @ts-ignore
        setImage(`data:image/jpeg;base64,${Buffer.from(img.data).toString('base64')}`);
    }

    const getUserInfo = async (at: string): Promise<void> => {
        try {
            const user: SafeUser | undefined = await api.getInfo(at);

            if (user) {
                setUsername(user.username);
                setFullName(user.fullName);
                handleUserImage(user?.image);
            } else {
                setAuth(false);
                setUsername(undefined);
                setFullName(undefined);
                setToken(undefined);
            }
        } catch (e) {
            setAuth(false);
            setUsername(undefined);
            setFullName(undefined);
            setToken(undefined);
        }
    }

    return (
        <AuthContext.Provider value={{ auth, token, login, logout, loading, handleRt, username, fullName, image, handleChangeImageRaw }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => React.useContext(AuthContext);