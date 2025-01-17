"use client"

import style from '@/styles/helpers/components/error.div.module.scss';
import { TickCircleFillIcon, WarningSVG } from "@/svg";
import Colors from "@/types/colors";
import React from 'react';

interface DialogDivType {
    text: string;
    intID: number;
    setPopUp: React.Dispatch<React.SetStateAction<SetStateTypeObject | undefined>>;
}

export interface SetStateTypeObject {
    type: "error" | "success";
    text: string;
    intID: number;
}

const ErrorDiv = ({ text, intID, setPopUp }: DialogDivType) => {
    return (
        <div className={style.errorHandlingDiv} onClick={() => {window.clearInterval(intID); setPopUp(undefined);}} style={{ cursor: 'pointer' }}>
            <p>{text}</p>
            <WarningSVG box={2} color={Colors.error} />
        </div>
    )
}

export const SuccessDiv = ({ text, intID, setPopUp }: DialogDivType) => {
    return (
        <div className={style.successHandlingDiv} onClick={() => {window.clearInterval(intID); setPopUp(undefined);}} style={{ cursor: 'pointer' }}>
            <p style={{ color: Colors.green }}>{text}</p>
            <TickCircleFillIcon box={2} color={Colors.green} />
        </div>
    )
}

export default ErrorDiv;