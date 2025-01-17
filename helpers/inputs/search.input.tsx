import * as React from 'react';
import style from '@/styles/helpers/inputs/search.module.scss';
import Colors from '@/types/colors';
import { SearchSVG } from '@/svg';

type SearchInputProps = {
    tabIndex?: number;
    label: string;
    placeholder: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchInput({
    tabIndex,
    label,
    placeholder,
    value,
    setValue,
}: SearchInputProps) {
    return (
        <div className={style.inputDivSearch}>
            <SearchSVG box={1.4} color={Colors.black} />
            <input
                type="search"
                placeholder={placeholder}
                name={label}
                id={label}
                role='textbox'
                title={placeholder}
                value={value}
                tabIndex={tabIndex}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}
                autoCapitalize='off'
                autoComplete='off'
                autoCorrect='off'
            />

        </div>
    );
}