import * as React from 'react';
import style from '@/styles/helpers/inputs/toggle.module.scss';
import { TickSVG, XSVG } from '@/svg';
import Colors from '@/types/colors';

type ToggleSwitchProps = {
    label: string;
    clicked: boolean;
    setClicked: React.Dispatch<React.SetStateAction<boolean>>;
    hasInfo: boolean;
    banner: string;
    info?: string;
    iconOff?: JSX.Element;
    iconOn?: JSX.Element;
    error?: boolean;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToggleSwitch({
    label,
    clicked,
    setClicked,
    hasInfo,
    banner,
    info,
    iconOff,
    iconOn,
    error,
    setError,
}: ToggleSwitchProps) {
    const handleChange = () => {
        setClicked(curr => !curr);
    }

    return (
        <div className={style.toggleSwitchOuter} style={{ backgroundColor: (error) ? Colors.error : 'initial' }}>
            <div className={style.toggleSwitchComponent}>
                <div className={style.toggleSwitch}>
                    <input
                        type="checkbox"
                        role='checkbox'
                        className={style.checkbox}
                        name={label}
                        id={label}
                        checked={clicked}
                        onChange={handleChange}
                    />
                    <label htmlFor={label} className={style.label}>
                        <span className={style.inner}></span>
                        <span className={style.switch}>
                            {!clicked ?
                                iconOff ? iconOff : <XSVG box={1} color={Colors.black} />
                            :
                                iconOn ? iconOn : <TickSVG box={1} color={Colors.white} />
                            }
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}