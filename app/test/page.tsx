"use client"

import * as React from 'react';
import style from '@/styles/pages/test/index.module.scss'
import { useAuthContext } from '../context/auth.contexts';
import { useQuery } from '@tanstack/react-query';
import { getOwn } from '@/axios/auth';
import { OwnUser } from '@/types/auth';

export default function Page() {
    const { token, fullName } = useAuthContext();

    const { data: user, isLoading: isLoadingOwn, isError: isErrorOwn, refetch: refetchOwn } = useQuery<OwnUser>({
        queryKey: ['get-admin'],
        queryFn: async () => {
            return await getOwn(token);
        }
    });


    return (
        <div className={style.user}>
            <div className={style.userView}>
                <div className={style.userViewList}>

                </div>
                <div className={style.userSettings}>
                    <h2>Ρυθμίσεις Χρήστη</h2>
                    <div className={style.userSettingsInfo}>
                        <p>Όνομα: <span>{user && user.name}</span></p>
                        <p>E-mail: <span>{user && user.email}</span></p>
                        <p>Αλλαγή Κωδικού: <span>{user && user.pwdChange}</span></p>
                        <p>Διαχειριστής: <span>{user && user.auth ? 'Ναι' : 'Όχι'}</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}