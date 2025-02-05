import React from "react"
import { SetStateTypeObject } from "../components/error.div"

type PopUpInitProps = {
    setPopUp: React.Dispatch<React.SetStateAction<SetStateTypeObject | undefined>>;
    text: string;
    type: "error" | "success";
    duration?: number;
}

export default function PopUpInit({
    setPopUp,
    text,
    type,
    duration = 5000,
}: PopUpInitProps): number {
    const int = window.setInterval(() => {
        setPopUp(undefined);
        window.clearInterval(int);
    }, duration);
    setPopUp({ text: text, type: type, intID: int });
    return int;
}