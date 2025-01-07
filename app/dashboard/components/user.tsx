"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/user.module.scss';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import TextInput from '@/helpers/inputs/text.input';
import { changeUsersEmail, changeUsersPassword, getUsersEmailHidden, getUsersLastPasswordUpdate } from '@/axios/auth';
import { useAuthContext } from '@/app/context/auth.contexts';
import EmailInput from '@/helpers/inputs/email.input';
import { checkCapitalCharacters, checkNumber, checkSmallCharacters, checkSpecialCharacters, verifyEmail } from '@/helpers/auth';
import PasswordInput from '@/helpers/inputs/password.input';
import Colors from '@/types/colors';
import { useQuery } from '@tanstack/react-query';
import SubmitButton from '@/helpers/components/submit.button';

const User = ({ token }: { token: string | undefined }) => {

    const { data: emailHidden, isLoading, refetch } = useQuery<string>({
        queryKey: ['get-email-hidden'],
        queryFn: async () => {
            return await getUsersEmailHidden(token);
        },
    });

    const { data: passwordChangeDate, refetch: refetchPwd } = useQuery<string> ({
        queryKey: ['get-password-last-update-date'],
        queryFn: async () => {
            return await getUsersLastPasswordUpdate(token);
        }
    });

    React.useEffect(() => {
        if (token) {
            refetch();
            refetchPwd();
        };
    }, [token]);

    const [openEmail, setOpenEmail] = React.useState<boolean>(false);
    const [openPWD, setOpenPWD] = React.useState<boolean>(false);

    const emailRef = React.useRef<HTMLDivElement>(null);
    const pwdRef = React.useRef<HTMLDivElement>(null);

    const [icons, setIcons] = React.useState<boolean>(false);
    const [desc, setDesc] = React.useState<boolean>(false);
    const [garnet, setGarnet] = React.useState<boolean>(false);
    const [price, setPrice] = React.useState<boolean>(false);

    const handleOptionsSubmition = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const handleOpenAndCloseEmail = (type: boolean) => {
        if (type) {
            if (emailRef && emailRef.current) emailRef.current.style.transform = "translateY(0)";
            setOpenEmail(true);
        } else {
            if (emailRef && emailRef.current) emailRef.current.style.transform = "translateY(100%)";
            setOpenEmail(false);
        }
    }

    const handleOpenAndClosePassword = (type: boolean) => {
        if (type) {
            if (pwdRef && pwdRef.current) pwdRef.current.style.transform = "translateY(0)";
            setOpenPWD(true);
        } else {
            if (pwdRef && pwdRef.current) pwdRef.current.style.transform = "translateY(100%)";
            setOpenPWD(false);
        }
    }

    return (
        <div className={style.user}>
            <HandleEmailChange ref={emailRef} close={handleOpenAndCloseEmail} />
            <HandlePasswordChange ref={pwdRef} close={handleOpenAndClosePassword} />
            <h2 role='heading'>{openEmail ? 'Αλλαγή E-Mail' : openPWD ? 'Αλλαγή Κωδικού Πρόσβασης' : 'Ρυθμίσεις Χρήστη'}</h2>
            <div className={style.userBody}>
                <div className={style.changeSection}>
                    <h3>Αλλαγή e-mail</h3>
                    <p>Τρέχων e-mail: {emailHidden}</p>
                    <button type='button' role='button' onClick={() => {
                        handleOpenAndCloseEmail(true)
                    }}>
                        Αλλαγή
                    </button>
                </div>
                <div className={style.changeSection}>
                    <h3>Αλλαγή κωδικού πρόσβασης</h3>
                    <p>Τελευταία αλλαγή: {passwordChangeDate}</p>
                    <button type='button' role='button' onClick={() => {
                        handleOpenAndClosePassword(true)
                    }}>
                        Αλλαγή
                    </button>
                </div>
                <form className={style.userGeneralOptions} onSubmit={handleOptionsSubmition}>
                    <div className={style.userGeneralOptionsRow}>
                        <label htmlFor='icon'>Εμφάνηση Εικόνων:</label>
                        <div>
                            <ToggleSwitch
                                banner=''
                                clicked={icons}
                                setClicked={setIcons}
                                hasInfo={false}
                                label='icon'
                            />
                        </div>
                    </div>
                    <div className={style.userGeneralOptionsRow}>
                        <label htmlFor='desc'>Εμφάνηση Περιγραφών:</label>
                        <div>
                            <ToggleSwitch
                                banner=''
                                clicked={desc}
                                setClicked={setDesc}
                                hasInfo={false}
                                label='desc'
                            />
                        </div>
                    </div>
                    <div className={style.userGeneralOptionsRow}>
                        <label htmlFor='garnet'>Εμφάνηση Γαρνιτούρας:</label>
                        <div>
                            <ToggleSwitch
                                banner=''
                                clicked={garnet}
                                setClicked={setGarnet}
                                hasInfo={false}
                                label='garnet'
                            />
                        </div>
                    </div>
                    <div className={style.userGeneralOptionsRow}>
                        <label htmlFor='price'>Εμφάνηση Τιμής:</label>
                        <div>
                            <ToggleSwitch
                                banner=''
                                clicked={price}
                                setClicked={setPrice}
                                hasInfo={false}
                                label='price'
                            />
                        </div>
                    </div>
                    <SubmitButton text='Αποθήκευση' type={true} />
                </form>
            </div>
        </div>
    );
}

const HandlePasswordChange = React.forwardRef(({ close }: { close: (type: boolean) => void}, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { token } = useAuthContext();

    const [newPwdRe, setNewPwdRe] = React.useState<string>('');
    const [pwdCurr, setPwdCurr] = React.useState<string>('');
    const [newPwd, setNewPwd] = React.useState<string>('');

    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [pwdMatch, setPwdMatch] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);
    const [weakPwd, setWeakPwd] = React.useState<boolean>(false);
    const [pwdNoMatch, setPwdNoMatch] = React.useState<boolean>(false);
    // ! ADD LOADING

    const [char, setChar] = React.useState<boolean>(false);
    const [cLetter, setCLetter] = React.useState<boolean>(false);
    const [sLetter, setSLetter] = React.useState<boolean>(false);
    const [num, setNum] = React.useState<boolean>(false);
    const [special, setSpecial] = React.useState<boolean>(false);

    const [bars, setBars] = React.useState<number>(0);

    React.useEffect(() => {
        const a = chechCharachters();
        const b = checkCapitalLetter();
        const c = checkSmallLetter();
        const d = checkNumbers();
        const e = checkSpeacial();

        setBars(a + b + c + d + e);
    }, [newPwd]);

    const chechCharachters = (): number => {
        if (newPwd.length >= 8) {
            setChar(true); 
            return 1;
        }
        setChar(false);
        return 0;
    }

    const checkCapitalLetter = (): number => {
        if (checkCapitalCharacters(newPwd)) {
            setCLetter(true);
            return 1;
        }
        setCLetter(false);
        return 0;
    }

    const checkSmallLetter = (): number => {
        if (checkSmallCharacters(newPwd)) {
            setSLetter(true);
            return 1;
        }
        setSLetter(false);
        return 0;
    }

    const checkNumbers = (): number => {
        if (checkNumber(newPwd)) {
            setNum(true);
            return 1;
        }
        setNum(false);
        return 0;
    }

    const checkSpeacial = (): number => {
        if (checkSpecialCharacters(newPwd)) {
            setSpecial(true);
            return 1;
        }
        setSpecial(false);
        return 0;
    }
    
    const handleSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);
        setPwdMatch(false);
        setWeakPwd(false);
        setPwdNoMatch(false);

        if (newPwd.length === 0 || pwdCurr.length === 0 || newPwdRe.length === 0) {
            setEmptyFields(true);
            return;
        }

        if (pwdCurr == newPwd) {
            setPwdMatch(true);
            return;
        }

        if (newPwd !== newPwdRe) {
            setPwdNoMatch(true);
            return;
        }

        if (bars < 4) {
            setWeakPwd(true);
            return;
        }

        const res = await changeUsersPassword(token, pwdCurr, newPwd);
        
        if (res) {
            setPwdCurr('');
            setNewPwd('');
            setNewPwdRe('');
            close(false);
        } else {
            setError(true);
            setPwdCurr('');
            setNewPwd('');
            setNewPwdRe('');
        }
    }

    return (
        <div className={style.passwordChange} ref={ref}>
            <div className={style.passwordVerify}>
                <div role='presentation' style={{ backgroundColor: bars >= 1 ? Colors.black : Colors.grey }}></div>
                <div role='presentation' style={{ backgroundColor: bars >= 2 ? Colors.black : Colors.grey }}></div>
                <div role='presentation' style={{ backgroundColor: bars >= 3 ? Colors.black : Colors.grey }}></div>
                <div role='presentation' style={{ backgroundColor: bars >= 4 ? Colors.black : Colors.grey }}></div>
                <div role='presentation' style={{ backgroundColor: bars >= 5 ? Colors.black : Colors.grey }}></div>
            </div>
            <div className={style.passwordVerifyRules}>
                <p
                    style={{ 
                        backgroundColor: char ? Colors.black : Colors.grey,
                        color: char ? Colors.white : Colors.black,
                        textDecoration: char ? 'line-through' : 'none' }}
                >Ο κωδικός πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες.</p>
                <p
                    style={{ 
                        backgroundColor: special ? Colors.black : Colors.grey,
                        color: special ? Colors.white : Colors.black,
                        textDecoration: special ? 'line-through' : 'none' }}
                >Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν ειδικό χαρακτήρα.</p>
                <p
                    style={{ 
                        backgroundColor: num ? Colors.black : Colors.grey,
                        color: num ? Colors.white : Colors.black,
                        textDecoration: num ? 'line-through' : 'none' }}
                >Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν αριθμό.</p>
                <p
                    style={{ 
                        backgroundColor: sLetter ? Colors.black : Colors.grey,
                        color: sLetter ? Colors.white : Colors.black,
                        textDecoration: sLetter ? 'line-through' : 'none' }}
                >Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα πέζο γράμμα.</p>
                <p
                    style={{ 
                        backgroundColor: cLetter ? Colors.black : Colors.grey,
                        color: cLetter ? Colors.white : Colors.black,
                        textDecoration: cLetter ? 'line-through' : 'none' }}
                >Ο κωδικός πρέπει να περιέχει τουλάχιστον ενα καιφαλαίο γράμμα.</p>
            </div>
            <form role='form' onSubmit={handleSubmition}>
                <div className={style.errorDiv}>
                    {emptyFields && <p className={style.error}>Κένα Πεδία!</p>}
                    {error && <p className={style.error}>Λάθος Δεδομένα!</p>}
                    {pwdMatch && <p className={style.error}>Πρέπει να είναι διαφορετικοί οι κωδικοί!</p>}
                    {pwdNoMatch && <p className={style.error}>Οι κωδικοί δεν ταιριάζουν!</p>}
                    {weakPwd && <p className={style.error}>Αδύναμος Κωδικός!</p>}
                </div>
                <PasswordInput
                    tabIndex={1}
                    placeholder='Τρέχων Κωδικός...'
                    label='pwd'
                    size={1.2}
                    value={pwdCurr}
                    setValue={setPwdCurr}
                    emptyFields={emptyFields}
                    error={error}
                    error2={pwdMatch}
                    setEmptyFields={setEmptyFields}
                    setError={setError}
                    setError2={setPwdMatch}
                />
                <PasswordInput
                    tabIndex={2}
                    placeholder='Καινούργιος Κωδικός...'
                    label='pwdNew'
                    size={1.2}
                    value={newPwd}
                    setValue={setNewPwd}
                    emptyFields={emptyFields}
                    error={error}
                    error2={pwdMatch}
                    error3={pwdNoMatch}
                    error4={weakPwd}
                    setEmptyFields={setEmptyFields}
                    setError={setError}
                    setError2={setPwdMatch}
                    setError3={setPwdNoMatch}
                    setError4={setWeakPwd}
                />
                <PasswordInput
                    tabIndex={2}
                    placeholder='Επανάληψη Καινούργιου Κωδικός...'
                    label='pwdNewRe'
                    size={1.2}
                    value={newPwdRe}
                    setValue={setNewPwdRe}
                    emptyFields={emptyFields}
                    error={error}
                    error2={pwdNoMatch}
                    setEmptyFields={setEmptyFields}
                    setError={setError}
                    setError2={setPwdNoMatch}
                />
                <SubmitButton text='Αλλαγή' />
            </form>
            <div className={style.closeDiv}>
                <button type='button' role='button' className={style.closeButton} onClick={() => {close(false)}}>
                    Κλείσιμο
                </button>
            </div>
        </div>
    )
});

const HandleEmailChange = React.forwardRef(({ close }: { close: (type: boolean) => void}, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { token } = useAuthContext();

    const [oldEmail, setOldEmail] = React.useState<string>('');
    const [newEmail, setNewEmail] = React.useState<string>('');

    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [emailsMatch, setEmailsMatch] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);
    const [unverifiableEmail, setUnverifiableEmail] = React.useState<boolean>(false);
    // ! ADD LOADING

    const handleSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);
        setEmailsMatch(false);
        setUnverifiableEmail(false);

        if (oldEmail.length === 0 || newEmail.length === 0) {
            setEmptyFields(true);
            return;
        }

        if (newEmail === oldEmail) {
            setEmailsMatch(true);
            return;
        }

        if (!verifyEmail(newEmail)) {
            setUnverifiableEmail(true);
            return;
        }

        const res = await changeUsersEmail(token, oldEmail, newEmail);

        if (res) {
            setOldEmail('');
            setNewEmail('');
            close(false);

        } else {
            setError(true);
            setOldEmail('');
            setNewEmail('');
        }
    }

    return (
        <div className={style.changeEmail} ref={ref}>
            <form role='form' onSubmit={handleSubmition} autoComplete='off' autoCapitalize='off' autoCorrect='off'>
                <div className={style.errorDiv}>
                    {emptyFields && <p className={style.error}>Κένα Πεδία!</p>}
                    {error && <p className={style.error}>Λάθος Δεδομένα!</p>}
                    {emailsMatch && <p className={style.error}>Τα e-mail είναι ίδια!</p>}
                    {unverifiableEmail && <p className={style.error}>Μη επαληθέυσμιο e-mail!</p>}
                </div>
                <EmailInput 
                    tabIndex={1}
                    label='old_email'
                    placeholder='Τρέχων E-Mail...'
                    size={1.2}
                    value={oldEmail}
                    setValue={setOldEmail}
                    emptyFields={emptyFields}
                    error={error}
                    error2={emailsMatch}
                    setEmptyFields={setEmptyFields}
                    setError={setError}
                    setError2={setEmailsMatch}
                />
                <EmailInput 
                    tabIndex={2}
                    label='new_email'
                    placeholder='Καινούργιο E-Mail...'
                    size={1.2}
                    value={newEmail}
                    setValue={setNewEmail}
                    emptyFields={emptyFields}
                    error={error}
                    error2={emailsMatch}
                    error3={unverifiableEmail}
                    setEmptyFields={setEmptyFields}
                    setError={setError}
                    setError2={setEmailsMatch}
                    setError3={setUnverifiableEmail}
                />
                <SubmitButton text='Αλλαγή' />
            </form>
            <div className={style.closeDiv}>
                <button type='button' role='button' className={style.closeButton} onClick={() => {close(false)}}>
                    Κλείσιμο
                </button>
            </div>
        </div>
    );

});

export default User;