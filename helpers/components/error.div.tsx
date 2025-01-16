"use client"

import style from '@/styles/helpers/components/error.div.module.scss';
import { TickCircleFillIcon, WarningSVG } from "@/svg";
import Colors from "@/types/colors";
import React from 'react';

interface DialogDivType {
    text: string;
    // intID: number;
    // setPopUp: React.Dispatch<React.SetStateAction<SetStateTypeObject | undefined>>;
}

export interface SetStateTypeObject extends DialogDivType {
    type: "error" | "success";
}

const ErrorDiv = ({ text }: DialogDivType) => {
    // const handleClick = (id: number) => {
    //     window.clearInterval(id);
    //     setPopUp(undefined);
    // }

    return (
        <div className={style.errorHandlingDiv}>
            <p>{text}</p>
            <WarningSVG box={2} color={Colors.error} />
        </div>
    )
}

export const SuccessDiv = ({ text }: DialogDivType) => {
    // const handleClick = (id: number) => {
    //     window.clearInterval(id);
    //     setPopUp(undefined);
    // }

    return (
        <div className={style.successHandlingDiv}>
            <p style={{ color: Colors.green }}>{text}</p>
            <TickCircleFillIcon box={2} color={Colors.green} />
        </div>
    )
}

export default ErrorDiv;