import * as React from 'react';
import style from '@/styles/helpers/components/submit.button.module.scss';

const SubmitButton = ({ text, type, isSubmit = true, }: { text: string, type?: boolean, isSubmit?: boolean }) => {
    return (
        <button
            type={isSubmit ? "submit" : 'button'}
            role='button'
            className={
                type === undefined || type === false ? style.submitButton : style.submitButton2
            }
        >
            {text}
        </button>
    );
}

export default SubmitButton;