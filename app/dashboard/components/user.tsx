"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/user.module.scss';
import { useQuery, skipToken } from '@tanstack/react-query';
import { changeUsersEmail, changeUsersImage, changeUsersName, changeUsersPassword, getInfo, getOwn } from '@/axios/auth';
import { InfoUser, OwnUser } from '@/types/auth';
import Image from 'next/image';
import { UserSVG } from '@/svg';
import Colors from '@/types/colors';
import TextInput from '@/helpers/inputs/text.input';
import SubmitButton from '@/helpers/components/submit.button';
import ErrorDiv, { SetStateTypeObject, SuccessDiv } from '@/helpers/components/error.div';
import { checkCapitalCharacters, checkNumber, checkSmallCharacters, checkSpecialCharacters, verifyEmail } from '@/helpers/auth';
import ImageInput from '@/helpers/inputs/image.input';
import PasswordInput from '@/helpers/inputs/password.input';
import EmailInput from '@/helpers/inputs/email.input';
// ? Images
import MAIL from '@/public/mail.png';
import PHOTO from '@/public/photo.png';
import IDCARD from '@/public/id-card.png';
import PADLOCK from '@/public/padlock.png';

enum DisplayEnum {
    pwd = 'pwd',
    mail = 'mail',
    image = 'image',
    name = 'name',
    def = 'default',
};

const User = ({ token }: { token: string | undefined }) => {
    const { data: user, isLoading: isLoadingOwn, isError: isErrorOwn, refetch: refetchOwn } = useQuery<OwnUser>({
        queryKey: ['get-admin'],
        queryFn: token ? async () => {
            return await getOwn(token);
        } : skipToken,
    });

    const { data: userInfo, isLoading: isLoadingInfo, isError: isErrorInfo, refetch: refetchInfo } = useQuery<InfoUser | undefined>({
        queryKey: ['get-admin-info'],
        queryFn: token ? async () => {
            return await getInfo(token);
        } : skipToken,
    });

    // ? Main Page States
    const [display, setDisplay] = React.useState<DisplayEnum>(DisplayEnum.def);

    // ? Input States
    const [name, setName] = React.useState<string>('');
    const [pwdCurr, setPwdCurr] = React.useState<string>('');
    const [newPwd, setNewPwd] = React.useState<string>('');
    const [newPwdRe, setNewPwdRe] = React.useState<string>('');
    const [oldEmail, setOldEmail] = React.useState<string>('');
    const [newEmail, setNewEmail] = React.useState<string>('');

    // ? Error States
    const [error, setError] = React.useState<boolean>(false);
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [uploadImageTooLarge ,setUploadImageTooLarge] = React.useState<boolean>(false);
    const [noImage, setNoImage] = React.useState<boolean>(false);
    const [pwdMatch, setPwdMatch] = React.useState<boolean>(false);
    const [weakPwd, setWeakPwd] = React.useState<boolean>(false);
    const [pwdNoMatch, setPwdNoMatch] = React.useState<boolean>(false);
    const [emailsMatch, setEmailsMatch] = React.useState<boolean>(false);
    const [unverifiableEmail, setUnverifiableEmail] = React.useState<boolean>(false);

    // ? Pop Up
    const [popUp, setPopUp] = React.useState<SetStateTypeObject | undefined>();

    // ? Image States
    const [uploadImage, setUploadImage] = React.useState<File>();
    const [uploadImageShow, setUploadImageShow] = React.useState<string>();

    // ? Password Check States
    const [char, setChar] = React.useState<boolean>(false);
    const [cLetter, setCLetter] = React.useState<boolean>(false);
    const [sLetter, setSLetter] = React.useState<boolean>(false);
    const [num, setNum] = React.useState<boolean>(false);
    const [special, setSpecial] = React.useState<boolean>(false);

    // ? Password Bars
    const [bars, setBars] = React.useState<number>(0);

    // ? Intervals
    const [intervals, setIntervals] = React.useState<number[]>([]);

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

    const handleDisplay = (dis: DisplayEnum) => {
        if (dis === display) {
            setDisplay(DisplayEnum.def);
        } else {
            setDisplay(dis);
        }
    }

    const handleNameSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(false);
        setEmptyFields(false);

        if (name.length === 0) {
            setEmptyFields(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ type: 'error', text: 'Κενά Πεδία!', intID: int });
            return;
        }

        const res = await changeUsersName(token, name);

        if (res) {
            refetchOwn();
            setDisplay(DisplayEnum.def);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Το Όνομα Άλλαξε Με Επιτυχία!', type: 'success', intID: int });
            return;
        } else {
            setError(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error', intID: int });
            return;
        }
    }

    const handleImageSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(false);
        setUploadImageTooLarge(false);
        setNoImage(false);

        if (!uploadImage || !uploadImageShow) {
            setNoImage(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Προσθέστε Εικόνα!', type: 'error', intID: int });
            return;
        }

        const FD = new FormData();

        FD.append('image', uploadImage);

        const res = await changeUsersImage(token, FD, uploadImage.size);

        if (res) {
            refetchInfo();
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Επιτυχής Αλλαγή!', type: 'success', intID: int });
            return;
        } else {
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error', intID: int });
            return;
        }
    }

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);
        setPwdMatch(false);
        setWeakPwd(false);
        setPwdNoMatch(false);

        if (newPwd.length === 0 || pwdCurr.length === 0 || newPwdRe.length === 0) {
            setEmptyFields(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Κενά Πεδία!', type: 'error', intID: int });
            return;
        }

        if (pwdCurr == newPwd) {
            setPwdMatch(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Ο Καινούργιος Κωδικός Πρέπει Να Διαφέρει Απο Τον Παλιό!', type: 'error', intID: int});
            return;
        }

        if (newPwd !== newPwdRe) {
            setPwdNoMatch(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Οι Κωδικοί Πρόσβασής Δεν Ταιριάζουν!', type: 'error', intID: int});
            return;
        }

        if (bars < 4) {
            setWeakPwd(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Αδύναμος Κωδικός Πρόσβασης!', type: 'error', intID: int});
            return;
        }

        const res = await changeUsersPassword(token, pwdCurr, newPwd);

        if (res) {
            setPwdCurr('');
            setNewPwd('');
            setNewPwdRe('');
            refetchOwn();
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Επιτιχής Αλλγαή!', type: 'success', intID: int });
            return;
        } else {
            setError(true);
            setPwdCurr('');
            setNewPwd('');
            setNewPwdRe('');
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error', intID: int });
            return;
        }
    }

    const handleEmailSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);
        setEmailsMatch(false);
        setUnverifiableEmail(false);

        if (oldEmail.length === 0 || newEmail.length === 0) {
            setEmptyFields(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Κενά Πεδία!', type: 'error', intID: int });
            return;
        }

        if (newEmail === oldEmail) {
            setEmailsMatch(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Το Καινούργιο Και Το Παλιό E-Mail Πρέπει Να Διαφέρουν!', type: 'error', intID: int });
            return;
        }

        if (!verifyEmail(newEmail)) {
            setUnverifiableEmail(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Μη Επαληθεύσιμο E-Mail!', type: 'error', intID: int });
            return;
        }

        const res = await changeUsersEmail(token, oldEmail, newEmail);

        if (res) {
            setOldEmail('');
            setNewEmail('');
            refetchOwn();
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Επιτιχής Αλλγαή!', type: 'success', intID: int });
            return;
        } else {
            setError(true);
            setOldEmail('');
            setNewEmail('');
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error', intID: int });
            return;
        }
    }

    return (
        <div className={style.user}>
            <div className={style.userView}>
                {(popUp && popUp.type === 'error') && <ErrorDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                {(popUp && popUp.type === 'success') && <SuccessDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                <div className={style.userViewList}>
                    {display === DisplayEnum.name &&
                        <form onSubmit={handleNameSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <Image src={IDCARD} alt='Flaticon Image | ID Card Image' width={64} height={64} />
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
                    {display === DisplayEnum.image &&
                        <form onSubmit={handleImageSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            {uploadImageShow ?
                                <Image src={uploadImageShow} alt="Users Image To Be Uploaded" width={64} height={64} style={{ display: 'block', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
                            :
                                <Image src={PHOTO} alt='Flaticon Image | Photo Image Icon' width={64} height={64} style={{ marginBottom: '1rem' }} />
                            }
                            <ImageInput
                                label='user_image'
                                placeholder='Επιλογή Εικόνας Χρήστη...'
                                size={1.3}
                                setUploadImage={setUploadImage}
                                setUploadImageShow={setUploadImageShow}
                                setUploadImageTooLarge={setUploadImageTooLarge}
                                noImage={noImage}
                                setNoImage={setNoImage}
                                uploadImage={uploadImage}
                                uploadImageShow={uploadImageShow}
                                uploadImageTooLarge={uploadImageTooLarge}
                            />
                            <div>
                                <SubmitButton text='Αλλαγή Εικόνας' type />
                            </div>
                        </form>
                    }
                    {display === DisplayEnum.pwd &&
                        <form onSubmit={handleChangePassword} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <div className={style.passwordVerify}>
                                <div role='presentation' className={bars >= 1 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                <div role='presentation' className={bars >= 1 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                <div role='presentation' className={bars >= 1 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                <div role='presentation' className={bars >= 1 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                <div role='presentation' className={bars >= 1 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                            </div>
                            <div className={style.passwordVerifyRules}>
                                {!char &&
                                    <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες.</p>
                                }
                                {!special &&
                                    <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν ειδικό χαρακτήρα.</p>
                                }
                                {!num &&
                                    <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν αριθμό.</p>
                                }
                                {!sLetter &&
                                    <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα πέζο γράμμα.</p>
                                }
                                {!cLetter &&
                                    <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον ενα καιφαλαίο γράμμα.</p>
                                }
                            </div>
                            <Image src={PADLOCK} alt='Flaticon Image | Padlock Icon' width={64} height={64} style={{ marginBottom: '1rem' }} />
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
                            <div>
                                <SubmitButton text='Αλλαγή Κωδικού' type />
                            </div>
                        </form>
                    }
                    {display === DisplayEnum.mail &&
                        <form onSubmit={handleEmailSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <Image src={MAIL} alt='Flaticon Image | Envelope Icon' width={64} height={64} style={{ marginBottom: '1rem' }} />
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
                            <div>
                                <SubmitButton text='Αλλαγή E-Mail' type />
                            </div>
                        </form>
                    }
                </div>
                <div className={style.userSettings}>
                    <div className={style.userInfoImage} onClick={() => console.log(intervals)}>
                        {(userInfo && userInfo.image && userInfo.imageMimeType) ?
                            <Image src={`data:${userInfo.imageMimeType};base64,${Buffer.from(userInfo.image).toString('base64')}`} alt='User Image' width={50} height={50} />
                            :
                            <UserSVG box={2.5} color={Colors.black} />
                        }
                        <p>{userInfo && userInfo.username}</p>
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
                            onClick={() => handleDisplay(DisplayEnum.name)}
                            style={{ opacity: display === DisplayEnum.name ? .5 : 1 }}
                        >
                            {display === DisplayEnum.name ?
                                <Image src={IDCARD} alt='Flaticon Image | ID Card Icon' width={64} height={64} />
                            :
                                <p>Αλλαγή Ονόματος</p>
                            }
                        </button>
                        <button 
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.image)}
                            style={{ opacity: display === DisplayEnum.image ? .5 : 1 }}
                        >
                            {display === DisplayEnum.image ?
                                <Image src={PHOTO} alt='Flaticon Image | Photo Image Icon' width={64} height={64} />
                            :
                                <p>Αλλαγή Εικόνας</p>
                            }
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.pwd)}
                            style={{ opacity: display === DisplayEnum.pwd ? .5 : 1 }}
                        > 
                            {display === DisplayEnum.pwd ?
                                <Image src={PADLOCK} alt='Flaticon Image | Padlock Icon' width={64} height={64} />
                            :
                                <p>Αλλαγή Κωδικού Πρόσβασης</p>
                            }
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.mail)}
                            style={{ opacity: display === DisplayEnum.mail ? .5 : 1 }}
                        >
                            {display === DisplayEnum.mail ?
                                <Image src={MAIL} alt='Flaticon Image | Envelope Icon' width={64} height={64} />
                            :
                                <p>Αλλαγή E-Mail</p>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;