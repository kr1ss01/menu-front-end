import * as React from 'react';
import style from '@/styles/helpers/components/submit.button.module.scss';
import { scrollToTop } from '../functions/scrollToTop';

const SubmitButton = ({ text, type, isSubmit = true, scroll = false, }: { text: string, type?: boolean, isSubmit?: boolean, scroll?: boolean }) => {
    const handleClick = () => {
        if (!scroll) return;

        scrollToTop();
    }

    return (
        <button
            type={isSubmit ? "submit" : 'button'}
            role='button'
            onClick={handleClick}
            className={
                type === undefined || type === false ? style.submitButton : style.submitButton2
            }
        >
            {text}
        </button>
    );
}

export default SubmitButton;