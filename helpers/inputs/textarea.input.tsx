import * as React from 'react';
import style from '@/styles/helpers/inputs/textarea.module.scss';
import Colors from '@/types/colors';
import { TickCircleFillIcon, XCircleNoFillIcon } from '@/svg';

type TextInputProps = {
    tabIndex: number;
    label: string;
    placeholder: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    icon: JSX.Element;
    maxChars?: number;
    size?: number;
    emptyFields?: boolean;
    setEmptyFields?: React.Dispatch<React.SetStateAction<boolean>>;
    error?: boolean;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
    error2?: boolean;
    setError2?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TextAreaInput({
    tabIndex,
    label,
    placeholder,
    value,
    setValue,
    icon,
    maxChars,
    size = 1.3,
    emptyFields,
    error,
    error2,
    setEmptyFields,
    setError,
    setError2,
}: TextInputProps) {
    React.useEffect(() => {
        // * If MAX_LENGTH is providen, reduce string to max strings if needed.
        if (maxChars) {
            if (value.length > maxChars) {
                setValue(value.substring(0, value.length -1));
            }
        }
    }, [value]);

    return (
        <div
            className={style.inputDiv}
        >
            <textarea 
                placeholder={placeholder}
                name={label}
                id={label}
                role='textbox'
                title={placeholder}
                value={value}
                tabIndex={tabIndex}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setValue(e.currentTarget.value);
                    (emptyFields && value.length === 0 && setEmptyFields) && setEmptyFields(false);
                    (error && setError) && setError(false);
                    (error2 && setError2) && setError2(false);
                }}
                style={{
                    outline: (error || error2 || (emptyFields && value.length === 0)) ? `1px solid ${Colors.error}` : 'none',
                }}
            />
        </div>
    );
}