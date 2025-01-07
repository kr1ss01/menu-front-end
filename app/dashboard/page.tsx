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

enum Dashboard {
    user = "user",
    cat = "category",
    grnt = "garnet",
    plate = "plate",
}

export default function Page() {
    const { token, auth } = useAuthContext();

    const [active, setActive] = React.useState<Dashboard>(Dashboard.user);

    // ? Check Authentication
    // React.useEffect(() => {
    //     if (!auth) redirect('/login');
    // });

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
