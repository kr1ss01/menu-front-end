import * as React from 'react';
import style from '@/styles/helpers/inputs/password.module.scss';
import Colors from '@/types/colors';
import { EyeCloseSVG, EyeOpenSVG, PasswordSVG } from '@/svg';

type PasswordInputProps = {
    tabIndex: number;
    label: string;
    placeholder: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    hasCheck?: boolean;
    size?: number;
    emptyFields?: boolean;
    setEmptyFields?: React.Dispatch<React.SetStateAction<boolean>>;
    error?: boolean;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
    error2?: boolean;
    setError2?: React.Dispatch<React.SetStateAction<boolean>>;
    error3?: boolean;
    setError3?: React.Dispatch<React.SetStateAction<boolean>>;
    error4?: boolean;
    setError4?: React.Dispatch<React.SetStateAction<boolean>>;
    onFocus?: React.Dispatch<React.SetStateAction<any>>,
    onBlur?: React.Dispatch<React.SetStateAction<any>>,
    onFocusValue?: any,
    onBlurValue?: any,
};

export default function PasswordInput({
    tabIndex,
    label,
    placeholder,
    value,
    setValue,
    hasCheck = false,
    size = 1.3,
    emptyFields,
    error,
    setEmptyFields,
    setError,
    error2,
    setError2,
    error3,
    setError3,
    error4,
    setError4,
    onFocus,
    onBlur,
    onFocusValue,
    onBlurValue,
}: PasswordInputProps) {
    const [visible, setVisible] = React.useState<boolean>(false);

    const blurAndFocus = (type: 'blur' | 'focus') => {
        if (type === 'blur') {
            onBlur && onBlur(onBlurValue);
        }

        if (type === 'focus') {
            onFocus && onFocus(onFocusValue);
        }
    }

    return (
        <div
            className={style.inputDiv}
            style={{
                outline: (error || error2 || error3 || error4 || (emptyFields && value.length === 0)) ? `1px solid ${Colors.error}` : 'none',
                paddingLeft: '0.7rem',
            }}
        >
            <PasswordSVG box={size} color={(error || error2 || error3 || error4 || (emptyFields && value.length === 0)) ? Colors.error : Colors.black} />
            <input 
                type={visible ? "text" : "password"}
                placeholder={placeholder}
                name={label}
                id={label}
                role='textbox'
                title={placeholder}
                tabIndex={tabIndex}
                value={value}
                onFocus={() => blurAndFocus('focus')}
                onBlur={() => blurAndFocus('blur')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(e.currentTarget.value);
                    (emptyFields && value.length === 0 && setEmptyFields) && setEmptyFields(false);
                    (error && setError) && setError(false);
                    (error2 && setError2) && setError2(false);
                    (error3 && setError3) && setError3(false);
                    (error4 && setError4) && setError4(false);
                }}
            />
            <button role='button' type='button' onClick={() => setVisible(curr => !curr)}>
                {visible ?
                    <EyeOpenSVG box={size} color={(error || error2 || error3 || error4 || (emptyFields && value.length === 0)) ? Colors.error : Colors.black} />
                :
                    <EyeCloseSVG box={size} color={(error || error2 || error3 || error4 || (emptyFields && value.length === 0)) ? Colors.error : Colors.black} />
                }
            </button>
        </div>
    )
}