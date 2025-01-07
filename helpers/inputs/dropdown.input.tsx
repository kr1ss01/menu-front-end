import * as React from 'react';
import style from '@/styles/helpers/inputs/dropdown.module.scss';
import { CategorySVG, DownSVG, EuroSVG, PlateSVG, TickCircleFillIcon, UpSVG } from '@/svg';
import Colors from '@/types/colors';

const DropDownInput = (
    { 
        text,
        content,
        setValue,
        value,
        takeForDisplay,
        takeForComp,
        icon,
        setValueName,
    }: 
    { 
        text: string,
        content: any,
        value: string
        setValue: React.Dispatch<React.SetStateAction<string>>,
        takeForDisplay: string,
        takeForComp: string,
        icon: JSX.Element,
        setValueName?: React.Dispatch<React.SetStateAction<string>>,
    }
) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [forDisplay, setForDisplay] = React.useState<string>('');

    const dropDownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setOpen(false);
    }, [forDisplay]);

    React.useEffect(() => {
        if (value.length === 0) {
            setForDisplay('');
        }
    }, [value]);

    React.useEffect(() => {
        function handleClickOutside(event: any) {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropDownRef]);

    const toggleOpen = () => {
        setOpen((open) => !open);
    }

    return (
        <div className={style.dropDownInput} ref={dropDownRef}>
            <div className={`${style.dropDownButton} ${open ? style.buttonOpen : null}`} onClick={toggleOpen}>
                <p>
                    {icon}
                    {(value && forDisplay) ? forDisplay : text}
                </p>
                <span>
                    {value ? <TickCircleFillIcon box={1.1} color={Colors.black} /> : open ?
                        <UpSVG box={1.1} color={Colors.black} />
                    :
                        <DownSVG box={1.1} color={Colors.black} />
                    }
                </span>
            </div>
            <DropDownContent
                content={content}
                open={open}
                setValue={setValue}
                value={value}
                takeForComp={takeForComp}
                takeForDisplay={takeForDisplay}
                forDisplay={forDisplay}
                setForDisplay={setForDisplay}
                setValueName={setValueName}
            />
        </div>
    );
}

const DropDownContent = (
    {
        content,
        open,
        setValue,
        value,
        takeForDisplay,
        takeForComp,
        forDisplay,
        setForDisplay,
        setValueName,
    }:
    {
        content: any,
        open: boolean,
        setValue: React.Dispatch<React.SetStateAction<string>>,
        value: string,
        takeForDisplay: string,
        takeForComp: string,
        forDisplay: string,
        setForDisplay: React.Dispatch<React.SetStateAction<string>>,
        setValueName?: React.Dispatch<React.SetStateAction<string>>,
    }
) => {
    return (
        <div className={`${style.dropDownContent} ${open ? style.contentOpen : null}`}>
             {content.map((cont: any, key: number) => {
                if (cont[takeForComp] === value) {
                    setForDisplay(cont[takeForDisplay]);
                    setValueName && setValueName(cont[takeForDisplay]);
                }
                return (
                    <DropDownItem 
                        display={cont[takeForDisplay]}
                        transfer={cont[takeForComp]}
                        value={value} 
                        setValue={setValue}
                        forDisplay={forDisplay}
                        setForDisplay={setForDisplay}
                        setValueName={setValueName}
                        key={key}
                    />
                )
            })}
        </div>
    )
}

const DropDownItem = (
    {
        display,
        setValue,
        value,
        transfer,
        forDisplay,
        setForDisplay,
        setValueName,
    }:
    {
        display: string,
        setValue: React.Dispatch<React.SetStateAction<string>>,
        value: string,
        transfer: any,
        forDisplay: string,
        setForDisplay: React.Dispatch<React.SetStateAction<string>>,
        setValueName?: React.Dispatch<React.SetStateAction<string>>,
    }
) => {
    if (forDisplay === display) {
        return (
            <div className={style.dropDownItemActive} onClick={() => {
                setValue('');
                setForDisplay('');
                if (setValueName) {
                    setValueName(display);
                }
            }}>
                {display}
            </div>
        )
    } else {
        return (
            <div className={style.dropDownItem} onClick={() => {
                setValue(transfer);
                setForDisplay(display);
                if (setValueName) {
                    setValueName(display);
                }
            }}>
                {display}
            </div>
        )
    }
}

export default DropDownInput;