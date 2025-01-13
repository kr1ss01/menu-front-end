"use client"

import * as React from 'react';
import style from '@/styles/pages/mplg/index.module.scss';
import Logo from '@/helpers/logo.help';
import Colors from '@/types/colors';
import Image from 'next/image';
import JWTResponseType from '@/types/tokens';
import { login as lg} from '@/axios/auth';
import { useAuthContext } from '../context/auth.contexts';
import { redirect } from 'next/navigation';
import TextInput from '@/helpers/inputs/text.input';
import { UserSVG } from '@/svg';
import PasswordInput from '@/helpers/inputs/password.input';

export default function Page() {
    const { login, auth } = useAuthContext();

    const [uid, setUID] = React.useState<string>('');
    const [pwd, setPWD] = React.useState<string>('');

    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const [red, setRed] = React.useState<boolean>(false);

    // ? Compoenent Did Mount
    React.useEffect(() => {
        if (auth) {
            redirect('/');
        }
    });

    // ? Catch Redirect Status
    React.useEffect(() => {
        if (red) {
            // setRed(false);
            redirect('/dashboard');
        }
    }, [red]);

    // ? Submit Function For Login In User
    const handleSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setEmptyFields(false);
        setError(false);

        if (uid.length == 0 || pwd.length == 0) {
            setEmptyFields(true);
            setLoading(false);
            return;
        }

        const res: JWTResponseType | undefined = await lg(pwd, uid);


        if (res) {
            login(res.access_token, res.refresh_token);
            setUID('');
            setPWD('');
            setRed(true);
            setLoading(false);
            return;
        } else {
            setError(true);
            setUID('');
            setPWD('');
            setLoading(false);
            return;
        }
    }

    return (
        <div className={style.login}>
            <div className={style.loginCont}>
                <Logo align='center' justify='center' margin={"0 auto"} mode='light' />
                <h2>Καλώς Ήρθατε Πίσω</h2>
                <h3>Admin Dashboard</h3>
                <form role='form' onSubmit={handleSubmition} autoComplete='off' autoCapitalize='off' autoCorrect='off'>
                    <div className={style.errorDiv}>
                        {emptyFields && <p className={style.error}>Κένα Πεδία!</p>}
                        {error && <p className={style.error}>Λάθος Κωδικός ή Username!</p>}
                    </div>
                    <TextInput
                        tabIndex={1}
                        placeholder='Username ή e-mail...'
                        label='username_or_email'
                        size={1.2}
                        maxChars={100}
                        icon={<UserSVG box={1.2} color={(emptyFields || error) ? Colors.error : Colors.black} />}
                        value={uid}
                        setValue={setUID}
                        emptyFields={emptyFields}
                        error={error}
                        setEmptyFields={setEmptyFields}
                        setError={setError}
                    />
                    <PasswordInput 
                        tabIndex={2}
                        placeholder='Password...'
                        label='pwd'
                        size={1.2}
                        value={pwd}
                        setValue={setPWD}
                        emptyFields={emptyFields}
                        error={error}
                        setEmptyFields={setEmptyFields}
                        setError={setError}
                    />
                    <button type='submit' className={style.submitButton}>
                        Συνδεση
                        <div className={style.borderAnimationButton} role='none'></div>
                    </button>

                    <Image src={'/menu.png'} alt="Menu Icon" width={128} height={128} priority />
                </form>
            </div>
        </div>
    )
}