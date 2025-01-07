import * as React from 'react';
import style from '@/styles/helpers/inputs/number.module.scss';
import Colors from '@/types/colors';
import { EuroSVG, TickCircleFillIcon, TickCircleNoFillIcon, XCircleNoFillIcon } from '@/svg';

type NumberInputProps = {
    tabIndex: number;
    label: string;
    placeholder: string;
    max: number;
    min: number;
    size: number;
    step: number;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    emptyFields?: boolean;
    setEmptyFields?: React.Dispatch<React.SetStateAction<boolean>>;
    error?: boolean;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NumberInput({
    tabIndex,
    label,
    placeholder,
    max,
    min,
    size,
    step,
    value,
    setValue,
    emptyFields,
    error,
    setEmptyFields,
    setError,
}: NumberInputProps) {
    return (
        <div
            className={style.inputDiv}
            style={{
                paddingLeft: '0.7rem',
                outline: ((emptyFields && !value) || error) ? `1px solid ${Colors.error}` : 'none',
            }}
        >
            <EuroSVG box={size} color={((emptyFields && !value) || error) ? Colors.error : Colors.black} />
            <input
                type="number"
                placeholder={placeholder}
                tabIndex={tabIndex}
                max={max}
                min={min}
                name={label}
                id={label}
                step={step}
                title={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // @ts-ignore
                    setValue(e.target.value);
                    (emptyFields && !value && setEmptyFields) && setEmptyFields(false);
                    (error && setError) && setError(false);

                }}
            />
            <button type='button' role='button' disabled>
                {value && value >= min && value <= max ?
                    <TickCircleFillIcon box={size} color={(error || (emptyFields && !value)) ? Colors.error : Colors.black} />
                :
                    <XCircleNoFillIcon box={size} color={(error || (emptyFields && !value)) ? Colors.error : Colors.black} />
                }
            </button>
        </div>
    );
}