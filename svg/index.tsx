import * as React from 'react';
import Colors from '@/types/colors';

type SVGProps = {
    box: number,
    color: Colors,
};

export const PhoneSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    )
}

export const MapSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    )
}

export const ShoppingCartSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
    )
}

export const PlateSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
            <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
            <path d="m2.1 21.8 6.4-6.3"/>
            <path d="m19 5-7 7"/>
        </svg>
    )
}

export const CategorySVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
            <rect x="7" y="13" width="9" height="4" rx="1"/>
            <rect x="7" y="5" width="12" height="4" rx="1"/>
        </svg>
    )
}

export const GarnetSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/>
            <path d="M10 2c1 .5 2 2 2 5"/>
        </svg>
    )
}

export const UserSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    )
}

export const TickSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
        </svg>
    )
}

export const XSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    )
}

export function EmailSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256l0 32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32l0 80 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
        </svg>
    )
}

export const TickCircleFillIcon = ({box, color}: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={`${box}em`} fill={color}>
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"/>
        </svg>
    )
}

export const TickCircleNoFillIcon = ({box, color}: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={`${box}em`} fill={color}>
            <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/>
        </svg>
    )
}

export const XCircleNoFillIcon = ({box, color}: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
        </svg>
    )
}

export function XCircleFillIcon({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
        </svg>
    )
}

export function EnvelopeSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
        </svg>
    )
}

export const PasswordSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 448 512">
            <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
        </svg>
    );
}

export function EyeOpenSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 576 512">
            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
        </svg>
    )
}

export function EyeCloseSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 640 512">
            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
        </svg>
    )
}

export function BinSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 448 512">
            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
        </svg>
    )
}

export function ResetSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
        </svg>
    )
}

export function SaveSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 448 512">
            <path d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/>
        </svg>
    )
}

export function EditSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
        </svg>
    )
}

export function EuroSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 320 512">
            <path d="M48.1 240c-.1 2.7-.1 5.3-.1 8l0 16c0 2.7 0 5.3 .1 8L32 272c-17.7 0-32 14.3-32 32s14.3 32 32 32l28.3 0C89.9 419.9 170 480 264 480l24 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-24 0c-57.9 0-108.2-32.4-133.9-80L256 336c17.7 0 32-14.3 32-32s-14.3-32-32-32l-143.8 0c-.1-2.6-.2-5.3-.2-8l0-16c0-2.7 .1-5.4 .2-8L256 240c17.7 0 32-14.3 32-32s-14.3-32-32-32l-125.9 0c25.7-47.6 76-80 133.9-80l24 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-24 0C170 32 89.9 92.1 60.3 176L32 176c-17.7 0-32 14.3-32 32s14.3 32 32 32l16.1 0z"/>
        </svg>
    )
}

export function DownSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
        </svg>
    )
}

export function UpSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
        </svg>
    )
}

export function ImageSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 576 512">
            <path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z"/>
        </svg>
    )
}

export function BugSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"/>
        </svg>
    )
}

export function WarningSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
        </svg>
    )
}

export function ExpandSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M200 32L56 32C42.7 32 32 42.7 32 56l0 144c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l40-40 79 79-79 79L73 295c-6.9-6.9-17.2-8.9-26.2-5.2S32 302.3 32 312l0 144c0 13.3 10.7 24 24 24l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-40-40 79-79 79 79-40 40c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l144 0c13.3 0 24-10.7 24-24l0-144c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2l-40 40-79-79 79-79 40 40c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2l0-144c0-13.3-10.7-24-24-24L312 32c-9.7 0-18.5 5.8-22.2 14.8s-1.7 19.3 5.2 26.2l40 40-79 79-79-79 40-40c6.9-6.9 8.9-17.2 5.2-26.2S209.7 32 200 32z"/>
        </svg>
    )
}

export function SettingsSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
        </svg>
    )
}

export function SearchSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
        </svg>
    )
}

export function InfoSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
        </svg>
    )
}

export function BlockBGSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg height={`${box}em`} fill={color} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <rect height={`${box}em`} fill={color}/>
            <path d="M1 1.5H17" stroke={color}/>
            <line x1="1" y1="3.5" x2="17" y2="3.5" stroke={color}/>
            <line x1="1" y1="8.5" x2="17" y2="8.5" stroke={color}/>
            <line x1="1" y1="5.5" x2="17" y2="5.5" stroke={color}/>
        </svg>
    )
}

export function BlockLeftSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg height={`${box}em`} fill={color} viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg">
            <rect height={`${box}em`} fill={color}/>
            <rect x="1" y="1" width="8" height="8" fill={color}/>
            <line x1="10" y1="1.5" x2="19" y2="1.5" stroke={color}/>
            <line x1="10" y1="3.5" x2="19" y2="3.5" stroke={color}/>
            <line x1="10" y1="8.5" x2="19" y2="8.5" stroke={color}/>
            <line x1="10" y1="5.5" x2="19" y2="5.5" stroke={color}/>
        </svg>
    )
}

export function BlockRightSVG({box, color}: SVGProps): JSX.Element {
    return (
        <svg height={`${box}em`} fill={color} viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg">
            <rect height={`${box}em`} fill={color}/>
            <rect x="11" y="1" width="8" height="8" fill={color}/>
            <path d="M1 1.5H10" stroke={color}/>
            <line x1="1" y1="3.5" x2="10" y2="3.5" stroke={color}/>
            <line x1="1" y1="8.5" x2="10" y2="8.5" stroke={color}/>
            <line x1="1" y1="5.5" x2="10" y2="5.5" stroke={color}/>
        </svg>
    )
}

export const FacebookSquareSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 448 512">
            <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/>
        </svg>
    );
}

export const InstagramSquareSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 448 512">
                <path d="M224,202.66A53.34,53.34,0,1,0,277.36,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.41-30.41c-21-8.29-71-6.43-94.3-6.43s-73.25-1.93-94.31,6.43a54,54,0,0,0-30.41,30.41c-8.28,21-6.43,71.05-6.43,94.33S91,329.26,99.32,350.33a54,54,0,0,0,30.41,30.41c21,8.29,71,6.43,94.31,6.43s73.24,1.93,94.3-6.43a54,54,0,0,0,30.41-30.41c8.35-21,6.43-71.05,6.43-94.33S357.1,182.74,348.75,161.67ZM224,338a82,82,0,1,1,82-82A81.9,81.9,0,0,1,224,338Zm85.38-148.3a19.14,19.14,0,1,1,19.13-19.14A19.1,19.1,0,0,1,309.42,189.74ZM400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32ZM382.88,322c-1.29,25.63-7.14,48.34-25.85,67s-41.4,24.63-67,25.85c-26.41,1.49-105.59,1.49-132,0-25.63-1.29-48.26-7.15-67-25.85s-24.63-41.42-25.85-67c-1.49-26.42-1.49-105.61,0-132,1.29-25.63,7.07-48.34,25.85-67s41.47-24.56,67-25.78c26.41-1.49,105.59-1.49,132,0,25.63,1.29,48.33,7.15,67,25.85s24.63,41.42,25.85,67.05C384.37,216.44,384.37,295.56,382.88,322Z"/>
            </svg>
            <svg width="0" height="0">
                <radialGradient id="rg" r="150%" cx="30%" cy="107%">
                    <stop stopColor="#fdf497" offset="0" />
                    <stop stopColor="#fdf497" offset="0.05" />
                    <stop stopColor="#fd5949" offset="0.45" />
                    <stop stopColor="#d6249f" offset="0.6" />
                    <stop stopColor="#285AEB" offset="0.9" />
                </radialGradient>
            </svg>
        </>
    );
}

export const TikTokSVG = ({ box, color }: SVGProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={`${box}em`} fill={color} viewBox="0 0 448 512">
            <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/>
        </svg>
    );
}