"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/index.module.scss';
import { CategorySVG, GarnetSVG, PlateSVG, UserSVG } from '@/svg';
import Colors from '@/types/colors';
import User from './components/user';
import Categories from './components/categories';
import Garnets from './components/garnet';
import { useAuthContext } from '../context/auth.contexts';
import Plate from './components/plate';
import LoadingSpinner from '@/helpers/loading';
import { redirect } from 'next/navigation';

enum Dashboard {
    user = "user",
    cat = "category",
    grnt = "garnet",
    plate = "plate",
}

export default function Page() {
    const { token, auth, loading } = useAuthContext();

    // ? Component State
    const [active, setActive] = React.useState<Dashboard>(Dashboard.user);

    // ? Check Authentication
    React.useEffect(() => {
        if (!loading && !auth) {
            redirect('/');
        }
    }, [loading]);

    // ? Key-bind Use Effect
    // * ALT + 1 -> User's Page
    // * ALT + 2 -> Categories Page
    // * ALT + 3 -> Garnets Page
    // * ALT + 4 -> Plates Page
    React.useEffect(() => {
        let digitPress: boolean = false;
        let altPress: boolean = false;
        let caseDigit: 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4' | null = null;

        const handleKeyBind = (e: KeyboardEvent) => {
            if (e.code == "AltLeft") {
                e.preventDefault();
                altPress = true;
            }

            if ((e.code == "Digit1" || e.code == "Digit2" ||
                e.code == "Digit3" || e.code == "Digit4") && altPress) {
                e.preventDefault();
                digitPress = true;
                caseDigit = e.code;
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (altPress && digitPress) {
                switch (caseDigit) {
                    case 'Digit1':
                        setActive(Dashboard.user);
                        break;
                    case 'Digit2':
                        setActive(Dashboard.cat);
                        break;
                    case 'Digit3':
                        setActive(Dashboard.grnt);
                        break;
                    case 'Digit4':
                        setActive(Dashboard.plate);
                        break;
                }
            }

            if (e.code === "AltLeft") {
                altPress = false;
            }

            digitPress = false;
            caseDigit = null;
        }

        document.addEventListener('keydown', handleKeyBind);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyBind)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, []);


    if (loading) {
        return (
            <div className={style.dashboardNav}>
                <div className={style.dashboard}>
                    <div className={style.loading}>
                        <LoadingSpinner width={200} />
                        <p>Φόρτωση</p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className={style.dashboardNav}>
                <div className={style.dashboardNavWidth}>
                    <button type='button' onClick={() => setActive(Dashboard.user)} role='button' className={active === Dashboard.user ? style.dashboardNavBoxIconActive : style.dashboardNavBoxIcon}>
                        <UserSVG box={2.5} color={Colors.white} />
                    </button>
                    <button type='button' onClick={() => setActive(Dashboard.cat)} role='button' className={active === Dashboard.cat ? style.dashboardNavBoxIconActive : style.dashboardNavBoxIcon}>
                        <CategorySVG box={2.5} color={Colors.white} />
                    </button>
                    <button type='button' onClick={() => setActive(Dashboard.grnt)} role='button' className={active === Dashboard.grnt ? style.dashboardNavBoxIconActive : style.dashboardNavBoxIcon}>
                        <GarnetSVG box={2.5} color={Colors.white} />
                    </button>
                    <button type='button' onClick={() => setActive(Dashboard.plate)} role='button' className={active === Dashboard.plate ? style.dashboardNavBoxIconActive : style.dashboardNavBoxIcon}>
                        <PlateSVG box={2.5} color={Colors.white} />
                    </button>
                </div>
            </div>
            <div className={style.dashboard}>
                {token ?
                    <>
                        {active === Dashboard.user && <User token={token} />}
                        {active === Dashboard.cat && <Categories token={token} />}
                        {active === Dashboard.grnt && <Garnets token={token} />}
                        {active === Dashboard.plate && <Plate token={token} />}
                    </>
                :
                    <div className={style.loading}>
                        <LoadingSpinner width={130} />
                        <p>Φόρτωση</p>
                    </div>
                }
            </div>
        </>
    )
}
