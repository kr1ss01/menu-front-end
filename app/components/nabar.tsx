"use client"

import * as React from 'react';
import style from '@/styles/components/navbar/index.module.scss';
import { useAuthContext } from '../context/auth.contexts';
import Logo from '@/helpers/logo.help';
import { useQuery } from '@tanstack/react-query';
import Category from '@/types/categories';
import { getCategories } from '@/axios/categories';
import LoadingSpinner from '@/helpers/loading';
import Colors from '@/types/colors';
import Link from 'next/link';
import useOutsideHook from '@/helpers/hooks';
import { redirect } from 'next/navigation';


export default function Navbar() {
    const { auth, logout } = useAuthContext();

    const { data: categories, isLoading, refetch } = useQuery<Category[]>({
        queryKey: ['get-all-categories-navbar'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    const sideNavRef = React.useRef<HTMLDivElement>(null);

    const [openSide, setOpenSide] = React.useState<boolean>(false);
    const [red, setRed] = React.useState<boolean>(false);
    
    useOutsideHook(sideNavRef, setOpenSide);

    React.useEffect(() => {
        let altPress = false;
        let keyPress = false;

        const handleKeyBind = (e: KeyboardEvent) => {
            if (e.code === "AltLeft") {
                altPress = true;
            }

            if (e.code == "KeyB") {
                keyPress = true;
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (keyPress && altPress) {
                setOpenSide(curr => !curr);
            }

            if (e.code === "AltLeft") {
                altPress = false;
            }

            keyPress = false;
        }

        document.addEventListener('keydown', handleKeyBind);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyBind)
            document.removeEventListener('keyup', handleKeyUp)
        };
    }, []);

    function useTouchMove() {
        const [touchX, setTouchX] = React.useState<number>(0);

        const onTouchMove = (e: React.TouchEvent) => {
            setTouchX(e.changedTouches[0].clientX);
        };

        return { touchX, onTouchMove, setTouchX };
    }

    const { touchX, onTouchMove, setTouchX } = useTouchMove();

    React.useEffect(() => {
        if (red) {
            redirect('/');
        }
    }, [red]);

    React.useEffect(() => {
        var cx: number;

        const handleStart = (e: React.TouchEvent) => {
            cx = e.touches[0].clientX;
        }

        const handleEnd = (e: React.TouchEvent) => {
            let cxdelta = e.changedTouches[0].clientX - cx;

            if (cxdelta > 220) {
                setOpenSide(false);
            } else {
                setTouchX(0);
            }
        }

        // ! FUCK ME WITH THE TS TYPES...
        // @ts-ignore
        document.addEventListener("touchstart", handleStart);
        // @ts-ignore
        document.addEventListener("touchmove", onTouchMove);
        // @ts-ignore
        document.addEventListener("touchend", handleEnd);

        return () => {
            // @ts-ignore
            document.removeEventListener("touchstart", handleStart);
            // @ts-ignore
            document.removeEventListener("touchmove", onTouchMove);
            // @ts-ignore
            document.removeEventListener("touchend", handleEnd);
        }
    }, []);

    return (
        <>
            <nav className={style.mainNav} role='navigation'>
                <div className={style.mainNavWidth}>
                    <Logo align='flex-start' justify='center' margin={0} mode='dark' />
                    <div className={style.navButtonCont}>
                        <button
                            type='button'
                            aria-label='Navbar Menu Button'
                            role='button'
                            onClick={() => setOpenSide(curr => !curr)}
                            className={openSide ? style.navButtonOpen : style.navButton}
                        >
                            <span role='presentation'></span>
                            <span role='presentation'></span>
                            <span role='presentation'></span>
                        </button>
                    </div>
                </div>
            </nav>
            {openSide &&
                <div className={style.sideNavOuter} style={{ transform: `translateX(${(touchX + 1)/2}px)` }}>
                    <div className={style.sideNav} ref={sideNavRef}>
                        <div onClick={() => setOpenSide(false)} className={style.sideNavTop}>
                            <Logo align='center' justify='center' margin={'0 auto'} mode="dark" />
                        </div>
                        {isLoading ?
                            <div className={style.loadingSpinner}>
                                <LoadingSpinner stroke={Colors.white} fill={Colors.white} />
                                <p>Φόρτωση Κατηγοριών...</p>
                            </div>
                        :
                            <ul className={style.categoriesContNav}>
                                {categories?.map((c: Category, key: number) => {
                                    if (c.visible) {
                                        return (
                                            <li key={key}>
                                                <Link href={`/#${c._id + 'order-' + key}`} onClick={() => setOpenSide(false)}>
                                                    {c.name}
                                                </Link>
                                            </li>
                                        )
                                    }
                                })}
                            </ul>
                        }
                        {auth &&
                            <button onClick={() => {logout(); setOpenSide(false); setRed(true);}} role='button' type='button' className={style.logOutButton}>Αποσύνδεση</button>
                        }
                    </div>
                </div>
            }
        </>
    )
}