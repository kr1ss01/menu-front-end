"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/user.module.scss';
import { useQuery, skipToken } from '@tanstack/react-query';
import { changeUsersEmail, changeUsersImage, changeUsersName, changeUsersPassword, getInfo, getOwn } from '@/axios/auth';
import { InfoUser, OwnUser } from '@/types/auth';
import Image from 'next/image';
import { ImageSVG, InfoSVG, UserSVG } from '@/svg';
import Colors from '@/types/colors';
import TextInput from '@/helpers/inputs/text.input';
import SubmitButton from '@/helpers/components/submit.button';
import ErrorDiv, { SetStateTypeObject, SuccessDiv } from '@/helpers/components/error.div';
import { checkCapitalCharacters, checkNumber, checkSmallCharacters, checkSpecialCharacters, verifyEmail } from '@/helpers/auth';
import ImageInput from '@/helpers/inputs/image.input';
import PasswordInput from '@/helpers/inputs/password.input';
import EmailInput from '@/helpers/inputs/email.input';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import { Settings, UpdateSettings } from '@/types/settings';
import { getSettings, updateAll } from '@/axios/settings';
import { AvailabilityOptionsEnum, AvailabilityOptionsObject, PlateImagePositionEnum, PlateImagePostionObject } from '@/types/plate';
import DropDownInput from '@/helpers/inputs/dropdown.input';
import { getImageName, newImage } from '@/axios/backgroundImage';
import { BackgroundImage } from '@/types/backgroundImage';
import BASE from '@/axios/base';
import PopUpInit from '@/helpers/functions/popUpInit';

enum DisplayEnum {
    pwd = 'pwd',
    mail = 'mail',
    image = 'image',
    name = 'name',
    def = 'default',
    stg = 'settings',
    bgImage = 'backgroundImage',
};

const User = ({ token }: { token: string | undefined }) => {
    // ? Fetch User Admin Status
    const { data: user, isLoading: isLoadingOwn, isError: isErrorOwn, refetch: refetchOwn } = useQuery<OwnUser>({
        queryKey: ['get-admin'],
        queryFn: token ? async () => {
            return await getOwn(token);
        } : skipToken,
    });

    // ? Fetch User Info
    const { data: userInfo, isLoading: isLoadingInfo, isError: isErrorInfo, refetch: refetchInfo } = useQuery<InfoUser | undefined>({
        queryKey: ['get-admin-info'],
        queryFn: token ? async () => {
            return await getInfo(token);
        } : skipToken,
    });

    // ? Fetch Global Settings Object
    const { data: globalSettings, refetch: refetchGlobalSettings } = useQuery<Settings>({
        queryKey: ['get-global-settings-admin'],
        queryFn: async () => {
            return await getSettings();
        }
    });

    // ? Fetch Background Image Info
    const { data: bgImageInfo, refetch: refetchBgImageInfo } = useQuery<BackgroundImage>({
        queryKey: ['get-background-image-info-admin'],
        queryFn: async () => {
            return await getImageName(token);
        }
    })

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
    const [bgUploadImageTooLarge ,setBgUploadImageTooLarge] = React.useState<boolean>(false);
    const [noImage, setNoImage] = React.useState<boolean>(false);
    const [noBgImage, setNoBgImage] = React.useState<boolean>(false);
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

    // ? Background Image States
    const [bgUploadImage, setBgUploadImage] = React.useState<File>();
    const [bgUploadImageShow, setBgUploadImageShow] = React.useState<string>();

    // ? Password Check States
    const [char, setChar] = React.useState<boolean>(false);
    const [cLetter, setCLetter] = React.useState<boolean>(false);
    const [sLetter, setSLetter] = React.useState<boolean>(false);
    const [num, setNum] = React.useState<boolean>(false);
    const [special, setSpecial] = React.useState<boolean>(false);

    // ? Password Bars
    const [bars, setBars] = React.useState<number>(0);

    // ? Settings State
    const [bgImage, setBgImage] = React.useState<boolean>();
    const [avSettings, setAvSettings] = React.useState<AvailabilityOptionsEnum>();
    const [imgPosSettings, setImgPosSettings] = React.useState<PlateImagePositionEnum>();
    const [specialSettings, setSpecialSettings] = React.useState<boolean>();
    const [hideImgs, setHideImgs] = React.useState<boolean>();
    const [hideSpecial, setHideSpecial] = React.useState<boolean>();

    // ? Password Focus State
    const [passwordFocus, setPasswordFocus] = React.useState<boolean>(false);

    // ? User's Card Ref
    const userCardRef = React.useRef<HTMLDivElement>(null);

    // ? Handle Uplaod Image Too Large Error -- It's not beeing handled by Image Component at Inputs.
    React.useEffect(() => {
        if (uploadImageTooLarge || bgUploadImageTooLarge) {
            PopUpInit({ setPopUp: setPopUp, type: 'error', text: 'Μεγάλη Εικόνα!' });
            return;
        }
    }, [uploadImageTooLarge, bgUploadImageTooLarge]);

    // ? Handle Global Settings. As soos as they are fetched, set them as state.
    React.useEffect(() => {
        if (globalSettings) {
            setBgImage(globalSettings.backgroundImageVisibility);
            setAvSettings(globalSettings.availabilitySettings);
            setImgPosSettings(globalSettings.imagePosition);
            setSpecialSettings(globalSettings.showOnSpecialVisibility);
            setHideImgs(globalSettings.hideAllImages);
            setHideSpecial(globalSettings.hideOrShowSpecial);
        }
    }, [globalSettings]);

    // ? Password Strongness Functions
    React.useEffect(() => {
        const a = chechCharachters();
        const b = checkCapitalLetter();
        const c = checkSmallLetter();
        const d = checkNumbers();
        const e = checkSpeacial();

        setBars(a + b + c + d + e);
    }, [newPwd]);

    // ? Hover Effect On User's Card
    React.useEffect(() => {
        if (!userCardRef.current) return;
        
        const handleMouseMove = (e: MouseEvent) => {
            if (!userCardRef.current) return;

            const elementHeight = userCardRef.current?.clientHeight;
            const elementWidth = userCardRef.current?.clientWidth;
            const cardMouseX = e.layerX;
            const cardMouseY = e.layerY;

            let left;
            let right;
            let up;
            let down;

            if (cardMouseY > elementHeight / 2) {
                // ! DOWN
                down = true;
            }

            if (cardMouseY < elementHeight / 2) {
                // ! UP
                up = true;
            }

            if (cardMouseX > elementWidth / 2) {
                // ! RIGHT
                right = true;
            }

            if (cardMouseX < elementWidth / 2) {
                // ! LEFT
                left = true;
            }
            
            if (up && left) {
                userCardRef.current.style.transform = 'rotateX(-10deg) rotateY(5deg)';
            }

            if (up && right) {
                userCardRef.current.style.transform = 'rotateX(-10deg) rotateY(-5deg)';
            }

            if (down && left) {
                userCardRef.current.style.transform = 'rotateX(10deg) rotateY(5deg)';
            }

            if (down && right) {
                userCardRef.current.style.transform = 'rotateX(10deg) rotateY(-5deg)';
            }
        }

        const handleOutsideResetMouse = (e: MouseEvent) => {
            // @ts-ignore
            if (userCardRef.current && !userCardRef.current.contains(e.target)) {
                userCardRef.current.style.transform = 'rotateX(0) rotateY(0)';
            }
        }

        userCardRef.current.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', handleOutsideResetMouse);

        return () => {
            userCardRef.current?.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', handleOutsideResetMouse);
        }
    }, []);

    // ? Password Strongness Functions
    const chechCharachters = (): number => {
        if (newPwd.length >= 8) {
            setChar(true); 
            return 1;
        }
        setChar(false);
        return 0;
    }

    // ? Password Strongness Functions
    const checkCapitalLetter = (): number => {
        if (checkCapitalCharacters(newPwd)) {
            setCLetter(true);
            return 1;
        }
        setCLetter(false);
        return 0;
    }

    // ? Password Strongness Functions
    const checkSmallLetter = (): number => {
        if (checkSmallCharacters(newPwd)) {
            setSLetter(true);
            return 1;
        }
        setSLetter(false);
        return 0;
    }

    // ? Password Strongness Functions
    const checkNumbers = (): number => {
        if (checkNumber(newPwd)) {
            setNum(true);
            return 1;
        }
        setNum(false);
        return 0;
    }

    // ? Password Strongness Functions
    const checkSpeacial = (): number => {
        if (checkSpecialCharacters(newPwd)) {
            setSpecial(true);
            return 1;
        }
        setSpecial(false);
        return 0;
    }

    // ? Handle What Is Being Displayed
    // * Def = default
    const handleDisplay = (dis: DisplayEnum) => {
        if (dis === display) {
            setDisplay(DisplayEnum.def);
        } else {
            setDisplay(dis);
        }
    }

    // ? Change Name Function
    const handleNameSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(false);
        setEmptyFields(false);

        if (name.length === 0) {
            setEmptyFields(true);
            PopUpInit({ setPopUp: setPopUp, type: 'error', text: 'Κενά Πεδία!' });
            return;
        }

        const res = await changeUsersName(token, name);

        if (res) {
            refetchOwn();
            setDisplay(DisplayEnum.def);
            PopUpInit({ setPopUp: setPopUp, text: 'Το Όνομα Άλλαξε Με Επιτυχία!', type: 'success' });
            return;
        } else {
            setError(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Απροσδιόριστο Σφάλμα!', type: 'error' });
            return;
        }
    }

    // ? Change User's Image Function
    const handleImageSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(false);
        setUploadImageTooLarge(false);
        setNoImage(false);

        if (!uploadImage || !uploadImageShow) {
            setNoImage(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Προσθέστε Εικόνα!', type: 'error' });
            return;
        }

        const FD = new FormData();

        FD.append('image', uploadImage);

        const res = await changeUsersImage(token, FD, uploadImage.size);

        if (res) {
            refetchInfo();
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτυχής Αλλαγή!', type: 'success' });
            return;
        } else {
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            PopUpInit({ setPopUp: setPopUp, text: 'Απροσδιόριστο Σφάλμα!', type: 'error' });
            return;
        }
    }

    // ? Change User's Password
    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);
        setPwdMatch(false);
        setWeakPwd(false);
        setPwdNoMatch(false);

        if (newPwd.length === 0 || pwdCurr.length === 0 || newPwdRe.length === 0) {
            setEmptyFields(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Κενά Πεδία!', type: 'error' });
            return;
        }

        if (pwdCurr == newPwd) {
            setPwdMatch(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Ο Καινούργιος Κωδικός Πρέπει Να Διαφέρει Απο Τον Παλιό!', type: 'error' });
            return;
        }

        if (newPwd !== newPwdRe) {
            setPwdNoMatch(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Οι Κωδικοί Πρόσβασης Δεν Ταιριάζουν!', type: 'error' });
            return;
        }

        if (bars < 4) {
            setWeakPwd(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Αδύναμος Κωδικός Πρόσβασης!', type: 'error' });
            return;
        }

        const res = await changeUsersPassword(token, pwdCurr, newPwd);

        if (res) {
            setPwdCurr('');
            setNewPwd('');
            setNewPwdRe('');
            refetchOwn();
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτυχής Αλλαγή!', type: 'success' });
            return;
        } else {
            setError(true);
            setPwdCurr('');
            setNewPwd('');
            setNewPwdRe('');
            PopUpInit({ setPopUp: setPopUp, text: 'Λάθος Κωδικός Ή Όνομα!', type: 'error' });
            return;
        }
    }

    // ? Change User's Email Function
    const handleEmailSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);
        setEmailsMatch(false);
        setUnverifiableEmail(false);

        if (oldEmail.length === 0 || newEmail.length === 0) {
            setEmptyFields(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Κενά Πεδία!', type: 'error' });
            return;
        }

        if (newEmail === oldEmail) {
            setEmailsMatch(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Το Καινούργιο Και Το Παλιό E-Mail Πρέπει Να Διαφέρουν!', type: 'error' });
            return;
        }

        if (!verifyEmail(newEmail)) {
            setUnverifiableEmail(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Μη Επαληθεύσιμο E-Mail!', type: 'error' });
            return;
        }

        const res = await changeUsersEmail(token, oldEmail, newEmail);

        if (res) {
            setOldEmail('');
            setNewEmail('');
            refetchOwn();
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτιχής Αλλγαή!', type: 'success' });
            return;
        } else {
            setError(true);
            setOldEmail('');
            setNewEmail('');
            PopUpInit({ setPopUp: setPopUp, text: 'Απροσδιόριστο Σφάλμα!', type: 'error' });
            return;
        }
    }

    // ? Change Settings Function
    const handleSettingsSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!globalSettings) return;

        const updateObjectSettings: UpdateSettings = {
            availabilitySettings: avSettings as AvailabilityOptionsEnum,
            hideImagesSettings: hideImgs as boolean, 
            imagePosition: imgPosSettings as PlateImagePositionEnum,
            specialSettings: specialSettings as boolean,
            mainImage: bgImage as boolean,
            hideOrShowSpecial: hideSpecial as boolean,
        };

        const res = await updateAll(updateObjectSettings, token);

        if (res) {
            refetchGlobalSettings();
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτυχής Ενημέρωη Ρυθμίσεων!', type: 'success' });
            return;
        } else {
            PopUpInit({ setPopUp: setPopUp, text: 'Απροσδιόριστο Σφάλμα Στην Ενημέρωη Ρυθμίσεων!', type: 'error' });
            return;
        }
    }

    // ? Change Background Image Function
    const handleBgImageSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(false);
        setBgUploadImageTooLarge(false);
        setNoBgImage(false);

        if (!bgUploadImage || !bgUploadImageShow) {
            setNoBgImage(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Προσθέστε Εικόνα!', type: 'error' });
            return;
        }

        const FD = new FormData();

        FD.append('image', bgUploadImage);

        const res = await newImage(token, FD);

        if (res) {
            refetchBgImageInfo();
            setBgUploadImage(undefined);
            setBgUploadImageShow(undefined);
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτυχής Αλλαγή!', type: 'success' });
            return;
        } else {
            setBgUploadImage(undefined);
            setBgUploadImageShow(undefined);
            PopUpInit({ setPopUp: setPopUp, text: 'Απροσδιόριστο Σφάλμα!', type: 'error' });
            return;
        }
    }

    return (
        <div className={style.user}>
            <div className={style.userView}>
                {(popUp && popUp.type === 'error') && <ErrorDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                {(popUp && popUp.type === 'success') && <SuccessDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                <div className={style.userViewList} style={{
                    backgroundImage: `url(${BASE}background/)`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}>
                    {display === DisplayEnum.name &&
                        <form onSubmit={handleNameSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <h2>Αλλαγή Ονόματος Χρήστη</h2>
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
                                <SubmitButton text='Αλλαγή Ονόματος' type scroll={true} />
                            </div>
                        </form>
                    }
                    {display === DisplayEnum.image &&
                        <form onSubmit={handleImageSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <h2>Αλλαγή Εικόνας Χρήστη</h2>
                            {uploadImageShow &&
                                <Image src={uploadImageShow} alt="Users Image To Be Uploaded" width={64} height={64} style={{ display: 'block', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
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
                                <SubmitButton text='Αλλαγή Εικόνας' type scroll={true} />
                            </div>
                        </form>
                    }
                    {display === DisplayEnum.pwd &&
                        <form onSubmit={handleChangePassword} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <h2>Αλλαγή Κωδικού Πρόσβασης</h2>
                                <div className={style.passwordVerifyCont} style={{
                                    transform: passwordFocus ? 'translateY(0)' : 'translateY(-110%)',
                                }}>
                                    <div className={style.passwordVerify}>
                                        <div role='presentation' className={bars >= 1 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                        <div role='presentation' className={bars >= 2 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                        <div role='presentation' className={bars >= 3 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                        <div role='presentation' className={bars >= 4 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
                                        <div role='presentation' className={bars >= 5 ? style.passwordVerifyDiv_active : style.passwordVerifyDiv_inactive}></div>
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
                                            <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα πεζό γράμμα.</p>
                                        }
                                        {!cLetter &&
                                            <p>Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα.</p>
                                        }
                                    </div>
                                </div>
                            {/* } */}
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
                                onFocus={setPasswordFocus}
                                onBlur={setPasswordFocus}
                                onBlurValue={false}
                                onFocusValue={true}
                            />
                            <PasswordInput
                                tabIndex={2}
                                placeholder='Επανάληψη Καινούργιου Κωδικού...'
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
                                <SubmitButton text='Αλλαγή Κωδικού' type scroll={true} />
                            </div>
                        </form>
                    }
                    {display === DisplayEnum.mail &&
                        <form onSubmit={handleEmailSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <h2>Αλλαγή E-Mail</h2>
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
                                <SubmitButton text='Αλλαγή E-Mail' type scroll={true} />
                            </div>
                        </form>
                    }
                    {(display === DisplayEnum.stg && globalSettings) &&
                        <form className={style.appSettings} onSubmit={handleSettingsSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <h2>Αλλαγή Ρυθμίσεων Εφαρμογής</h2>
                            <div className={style.chooseDivOuter}>
                                <div className={style.chooseDiv}>
                                    <p>Διάταξη Εικόνας: </p>
                                    <DropDownInput 
                                        icon={<ImageSVG box={1.2} color={Colors.black} />}
                                        text='Επιλογή Διάταξης'
                                        content={PlateImagePostionObject}
                                        // @ts-ignore
                                        value={imgPosSettings}
                                        // @ts-ignore
                                        setValue={setImgPosSettings}
                                        takeForComp='name'
                                        takeForDisplay='display'
                                    />
                                </div>
                                <div className={style.chooseDivInfo}>
                                    <div>
                                        <InfoSVG box={1.8} color={Colors.black} />
                                    </div>
                                    <p>Επιλέξτε σε ποιο σημείο θα εμφανίζεται η εικόνα στο μενού στα πιάτα.</p>
                                </div>
                            </div>
                            <div className={style.chooseDivOuter}>
                                <div className={style.chooseDiv}>
                                    <p>Επιλογές Διαθεσιμότητας: </p>
                                    <DropDownInput 
                                        icon={<ImageSVG box={1.2} color={Colors.black} />}
                                        text='Επιλογές Διαθεσιμότητας'
                                        content={AvailabilityOptionsObject}
                                        // @ts-ignore
                                        value={avSettings}
                                        // @ts-ignore
                                        setValue={setAvSettings}
                                        takeForComp='name'
                                        takeForDisplay='display'
                                    />
                                </div>
                                <div className={style.chooseDivInfo}>
                                    <div>
                                        <InfoSVG box={1.8} color={Colors.black} />
                                    </div>
                                    <p>Επιλέξτε πως θα εμφανίζονται τα μη διαθέσμια πιάτα στο μενού ή αν δεν θα εμφανίζονται καθόλου.</p>
                                </div>
                            </div>
                            <div className={style.toggleDivOuter}>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='bgimage'>Εικόνα Αρχικής Σελίδας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='bgimage'
                                        // @ts-ignore
                                        clicked={bgImage}
                                        // @ts-ignore
                                        setClicked={setBgImage}
                                    />
                                </div>
                                <div className={style.toggleDivInfo}>
                                    <div>
                                        <InfoSVG box={1.8} color={Colors.black} />
                                    </div>
                                    <p>Μπορείτε να κρύψετε ή να εμφανίσετε την κύρια εικόνα της εφαρμογής στην αρχική σελίδα.</p>
                                </div>
                            </div>
                            <div className={style.toggleDivOuter}>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='spsettings'>Εμφάνηση Πιάτων Ημέρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='spsettings'
                                        // @ts-ignore
                                        clicked={specialSettings}
                                        // @ts-ignore
                                        setClicked={setSpecialSettings}
                                    />
                                </div>
                                <div className={style.toggleDivInfo}>
                                    <div>
                                        <InfoSVG box={1.8} color={Colors.black} />
                                    </div>
                                    <p>Εμφανίστε στα Πιάτα Ημέρας μόνο όσα πιάτα είναι στα Ημέρας.</p>
                                </div>
                            </div>
                            <div className={style.toggleDivOuter}>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='hideimgs'>Απόκρυψη Εικόνων: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='hideimgs'
                                        // @ts-ignore
                                        clicked={hideImgs}
                                        // @ts-ignore
                                        setClicked={setHideImgs}
                                    />
                                </div>
                                <div className={style.toggleDivInfo}>
                                    <div>
                                        <InfoSVG box={1.8} color={Colors.black} />
                                    </div>
                                    <p>Μπορείτε με ένα κλίκ να απενεργοποιήσετε όλες τις εικόνες. Δεν επηρεάζει τις ίδιες τις εικόνες, απλά δεν εμφανίζονται στο μενού.</p>
                                </div>
                            </div>
                            <div className={style.toggleDivOuter}>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='hidespecial'>Απόκρυψη Πιάτων Ημέρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='hidespecial'
                                        // @ts-ignore
                                        clicked={hideSpecial}
                                        // @ts-ignore
                                        setClicked={setHideSpecial}
                                    />
                                </div>
                                <div className={style.toggleDivInfo}>
                                    <div>
                                        <InfoSVG box={1.8} color={Colors.black} />
                                    </div>
                                    <p>Μπορείτε να κρύψετε ή να εμφανίσετε το μενού με τα Πιάτα Ημέρας.</p>
                                </div>
                            </div>
                            <div style={{ padding: '0 .5rem', marginTop: '1rem', width: '100%' }}>
                                <SubmitButton text={'Ενημέρωση'} type={true} scroll={true} />
                            </div>
                        </form>
                    }
                    {DisplayEnum.bgImage === display &&
                        <form onSubmit={handleBgImageSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <h2>Αλλαγή Εικόνας Φόντου</h2>
                            <ImageInput 
                                label='bg_image'
                                placeholder='Επιλογή Κύριας Εικόνας'
                                size={1.3}
                                setUploadImage={setBgUploadImage}
                                setUploadImageShow={setBgUploadImageShow}
                                setUploadImageTooLarge={setBgUploadImageTooLarge}
                                noImage={noBgImage}
                                setNoImage={setNoBgImage}
                                uploadImage={bgUploadImage}
                                uploadImageShow={bgUploadImageShow}
                                uploadImageTooLarge={bgUploadImageTooLarge}
                                imageSize={4096 * 2160}
                            />
                            <div>
                                <SubmitButton text='Αλλαγή Εικόνας' type scroll={true} />
                            </div>
                            <small>Απαιτήται επαναφόρτωση σελίδας για να φανεί η αλλαγή στην εικόνα φόντου!</small>
                            {bgImageInfo &&
                                <div className={style.bgImageInfo}>
                                    <h2>Πληροφορίες Εικόνας</h2>
                                    <p><span>Όνομα Εικόνας:</span> {bgImageInfo.imageName}</p>
                                    <p><span>Ημέρα Καταχώρησης:</span> {bgImageInfo.date}</p>
                                    <p><span>Όνομα Στον Server:</span>{bgImageInfo.storedImageName}</p>
                                    <p><span>Τύπος Εικόνας:</span>{bgImageInfo.mimeType}</p>
                                </div>
                            }
                        </form>
                    }
                </div>
                <div className={style.userSettings}>
                    <div className={style.userSettingsCont}>
                        <div className={style.userInfoImage} ref={userCardRef}>
                            <div className={style.userInfoImage_inner}>
                                {(userInfo && userInfo.image && userInfo.imageMimeType) ?
                                    <Image src={`data:${userInfo.imageMimeType};base64,${Buffer.from(userInfo.image).toString('base64')}`} alt='User Image' width={50} height={50} />
                                    :
                                    <UserSVG box={2.5} color={Colors.black} />
                                }
                                <p>{userInfo && userInfo.username}</p>
                            </div>
                            <ul className={style.userSettingsInfo}>
                                <li>Όνομα: <p>{user && user.name}</p></li>
                                <li>E-mail: <p>{user && user.email}</p></li>
                                <li>Αλλαγή Κωδικού: <p>{user && user.pwdChange}</p></li>
                                <li>Διαχειριστής: <p>{user && user.auth ? 'Ναι' : 'Όχι'}</p></li>
                            </ul>
                        </div>
                    </div>
                    <div className={style.changeUserActions}>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.name)}
                            style={{ opacity: display === DisplayEnum.name ? .5 : 1 }}
                        >
                            <p>Αλλαγή Ονόματος Χρήστη</p>
                        </button>
                        <button 
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.image)}
                            style={{ opacity: display === DisplayEnum.image ? .5 : 1 }}
                        >
                            <p>Αλλαγή Εικόνας Χρήστη</p>
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.pwd)}
                            style={{ opacity: display === DisplayEnum.pwd ? .5 : 1 }}
                        >
                            <p>Αλλαγή Κωδικού Πρόσβασης</p>
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.mail)}
                            style={{ opacity: display === DisplayEnum.mail ? .5 : 1 }}
                        >
                            <p>Αλλαγή E-Mail</p>
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.stg)}
                            style={{ opacity: display === DisplayEnum.stg ? .5 : 1 }}
                        >
                            <p>Ρυθμίσεις Εφαρμογής</p>
                        </button>
                        <button
                            type='button'
                            role='button'
                            className={style.changeButtons}
                            onClick={() => handleDisplay(DisplayEnum.bgImage)}
                            style={{ opacity: display === DisplayEnum.bgImage ? .5 : 1 }}
                        >
                            <p>Ρυθμίσεις Εικόνας Φόντου</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;