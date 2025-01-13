"use client"

import style from '@/styles/helpers/components/error.div.module.scss';
import { TickCircleFillIcon, WarningSVG } from "@/svg";
import Colors from "@/types/colors";

export type SetStateTypeObject = {
    type: "error" | "success",
    text: string,
}

const ErrorDiv = ({ text, icon, textColor }: { text: string, icon?: JSX.Element, textColor?: Colors }) => {
    return (
        <div className={style.errorHandlingDiv}>
            <p style={{ color: textColor ? textColor : Colors.error }}>{text}</p>
            {icon ? 
                icon 
            :
                <WarningSVG box={2} color={Colors.error} />
            }
        </div>
    )
}

export const SuccessDiv = ({ text }: { text: string }) => {
    return (
        <div className={style.successHandlingDiv}>
            <p style={{ color: Colors.green }}>{text}</p>
            <TickCircleFillIcon box={2} color={Colors.green} />
        </div>
    )
}

export default ErrorDiv;