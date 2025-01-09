"use client"

import style from '@/styles/helpers/components/error.div.module.scss';
import { WarningSVG } from "@/svg"
import Colors from "@/types/colors"

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

export default ErrorDiv;