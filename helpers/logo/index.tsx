"use client"

import * as React from 'react';
import style from '@/styles/helpers/logo.help.module.scss';
import Link from 'next/link';

type LogoProps = {
    align: "center" | "flex-start" | "flex-end",
    justify: "center" | "flex-start" | "flex-end",
    margin: "0 auto" | "auto 0" | number | "none",
    mode: "dark" | "light",
}

export default function Logo({align, justify, margin, mode}: LogoProps) {
    return (
        <Link href={'/'} className={style.logo} style={{
            alignItems: align,
            justifyContent: justify,
            flexDirection: 'column',
            display: 'flex',
            margin: margin,
        }}>
            <p className={`${style.logoMain} ${mode === "dark" ? style.logoMainDark : style.logoMainLight}`} role='banner'>μαυρο πιπερι</p>
            <p className={`${style.logoSecondary} ${mode === "dark" ? style.logoSecondaryDark : style.logoSecondaryLight}`} role='banner'>Online Menu</p>
        </Link>
    )
}