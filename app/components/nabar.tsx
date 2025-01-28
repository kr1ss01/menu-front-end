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

    const [dragStartX, setDragStartX] = React.useState<number>(0);
    const [dragStartY, setDragStartY] = React.useState<number>(0);
    const [dragEndX, setDragEndX] = React.useState<number>(0);
    const [dragEndY, setDragEndY] = React.useState<number>(0);
    const [animateDrag, setAnimateDrag] = React.useState<number>(0);
    
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

    React.useEffect(() => {
        if (!openSide) return;
        if (!sideNavRef.current) return;

        const handleTouchStart = (e: TouchEvent) => {
            setDragStartX(e.changedTouches[0].clientX);
            setDragStartY(e.changedTouches[0].clientY);
        }

        const handleTouchMove = (e: TouchEvent) => {
            setDragEndX(e.changedTouches[0].clientX);
            setDragEndY(e.changedTouches[0].clientY);

            let dragDistanceX = dragEndX - dragStartX;
            let dragDistanceY = Math.abs(dragEndY - dragStartY);

            if (dragDistanceX > 20 && dragDistanceY < 70) {
                setAnimateDrag(dragDistanceX);
            }
        }
        
        const handleTouchEnd = (e: TouchEvent) => {
            let dragDistanceX = dragEndX - dragStartX;
            let dragDistanceY = Math.abs(dragEndY - dragStartY);

            if (dragDistanceX > 245 && dragDistanceY < 70) {
                setOpenSide(false);
                setAnimateDrag(0);
            } else {
                setAnimateDrag(0);
            }
        }

        sideNavRef.current.addEventListener('touchstart', handleTouchStart);
        sideNavRef.current.addEventListener('touchmove', handleTouchMove);
        sideNavRef.current.addEventListener('touchend', handleTouchEnd);

        return () => {
            sideNavRef.current?.removeEventListener('touchstart', handleTouchStart);
            sideNavRef.current?.removeEventListener('touchmove', handleTouchMove);
            sideNavRef.current?.removeEventListener('touchend', handleTouchEnd);
        }
    }, [openSide, sideNavRef, dragStartX, dragStartY, dragEndX, dragEndY, animateDrag]);

    React.useEffect(() => {
        if (red) {
            redirect('/');
        }
    }, [red]);

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
                <div className={style.sideNavOuter} style={{ transform: `translateX(${animateDrag / 2}px)` }}>
                    <div
                        className={style.sideNav}
                        ref={sideNavRef}
                    >
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

// style={{ transform: `translateX(${(touchX + 1)/2}px)` }}