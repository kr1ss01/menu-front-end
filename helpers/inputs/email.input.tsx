import * as React from 'react';
import style from '@/styles/helpers/inputs/email.module.scss';
import Colors from '@/types/colors';
import { EmailSVG, TickCircleFillIcon, XCircleNoFillIcon } from '@/svg';
import { verifyEmail } from '../auth';

type EmailInputProps = {
    tabIndex: number;
    label: string;
    placeholder: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    size: number;
    emptyFields?: boolean;
    setEmptyFields?: React.Dispatch<React.SetStateAction<boolean>>;
    error?: boolean;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
    error2?: boolean;
    setError2?: React.Dispatch<React.SetStateAction<boolean>>;
    error3?: boolean;
    setError3?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EmailInput({
    tabIndex,
    label,
    placeholder,
    value,
    setValue,
    size,
    emptyFields,
    setEmptyFields,
    error,
    setError,
    error2,
    setError2,
    error3,
    setError3,
}: EmailInputProps) {
    return (
        <div
            className={style.inputDiv}
            style={{
                outline: (error || error2 || error3 || (emptyFields && value.length === 0)) ? `1px solid ${Colors.error}` : 'none',
            }}
        >
            <EmailSVG box={size} color={(error || error2 || error3 || (emptyFields && value.length === 0)) ? Colors.error : Colors.black} />
            <input
                type="email"
                placeholder={placeholder}
                tabIndex={tabIndex}
                name={label}
                id={label}
                title={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(e.currentTarget.value);
                    (emptyFields && value.length === 0 && setEmptyFields) && setEmptyFields(false);
                    (error && setError) && setError(false);
                    (error2 && setError2) && setError2(false);
                    (error3 && setError3) && setError3(false);
                }}
            />
            <button type='button' role='button' disabled>
                {!verifyEmail(value) ?
                    <XCircleNoFillIcon box={size} color={(error || error2 || error3 || (emptyFields && value.length === 0)) ? Colors.error : Colors.black} />
                :
                    <TickCircleFillIcon box={size} color={(error || error2 || error3 || (emptyFields && value.length === 0)) ? Colors.error : Colors.black} />
                }
            </button>
        </div>
    );
}