"use client"

import * as React from 'react';
import style from '@/styles/pages/test/index.module.scss'
import { useAuthContext } from '../context/auth.contexts';
import { skipToken, useQuery } from '@tanstack/react-query';
import { getOwn } from '@/axios/auth';
import { OwnUser } from '@/types/auth';
import Image from 'next/image';
import { UserSVG } from '@/svg';
import Colors from '@/types/colors';
import TextInput from '@/helpers/inputs/text.input';
import SubmitButton from '@/helpers/components/submit.button';

enum DisplayEnum {
    pwd = 'pwd',
    mail = 'mail',
    image = 'image',
    name = 'name',
    def = 'default',
};

export default function Page() {
    const { token, image, username } = useAuthContext();

    const { data: user, isLoading: isLoadingOwn, isError: isErrorOwn, refetch: refetchOwn } = useQuery<OwnUser>({
        queryKey: ['get-admin'],
        queryFn: token ? async () => {
            return await getOwn(token);
        } : skipToken,
    });

    // ? Main Page States
    const [display, setDisplay] = React.useState<DisplayEnum>(DisplayEnum.def);

    // ? Input States
    const [name, setName] = React.useState<string>('');

    // ? Error States
    const [error, setError] = React.useState<boolean>(false);
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);


    return (
        <div className={style.user}>
            <div className={style.userView}>
                <div className={style.userViewList}>
                    {display === DisplayEnum.name &&
                        <form>
                            <TextInput
                                label='name' 
                                placeholder='Όνομα...'
                                value={name}
                                setValue={setName}
                                tabIndex={1}
                                icon={<UserSVG box={1.4} color={Colors.white} />}
                                emptyFields={emptyFields}
                                setEmptyFields={setEmptyFields}
                                error={error}
                                setError={setError}
                            />
                            <div>
                                <SubmitButton text='Αλλαγή Ονόματος' type />
                            </div>
                        </form>
                    }
                </div>
                <div className={style.userSettings}>
                    <div className={style.userInfoImage}>
                        {image ?
                            <Image src={image} alt='User Image' width={50} height={50} />
                            :
                            <UserSVG box={2.5} color={Colors.black} />
                        }
                        <p>{username}</p>
                    </div>
                    <h2>Ρυθμίσεις Χρήστη</h2>
                    <div className={style.userSettingsInfo}>
                        <p>Όνομα: <span>{user && user.name}</span></p>
                        <p>E-mail: <span>{user && user.email}</span></p>
                        <p>Αλλαγή Κωδικού: <span>{user && user.pwdChange}</span></p>
                        <p>Διαχειριστής: <span>{user && user.auth ? 'Ναι' : 'Όχι'}</span></p>
                    </div>
                    <div className={style.changeUserActions}>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => setDisplay(DisplayEnum.name)}
                            style={{ opacity: display === DisplayEnum.name ? .5 : 1 }}
                        > 
                            Αλλαγή Ονόματος
                        </button>
                        <button 
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => setDisplay(DisplayEnum.image)}
                            style={{ opacity: display === DisplayEnum.image ? .5 : 1 }}
                        > 
                            Αλλαγή Εικόνας
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => setDisplay(DisplayEnum.pwd)}
                            style={{ opacity: display === DisplayEnum.pwd ? .5 : 1 }}
                        > 
                            Αλλαγή Κωδικού Πρόσβασης
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => setDisplay(DisplayEnum.mail)}
                            style={{ opacity: display === DisplayEnum.mail ? .5 : 1 }}
                        >
                            Αλλαγή E-Mail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}