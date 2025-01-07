import * as React from 'react';
import style from '@/styles/helpers/inputs/image.module.scss';
import Colors from '@/types/colors';
import { ImageSVG, XCircleFillIcon } from '@/svg';

type ImageInputProps = {
    uploadImage: File | undefined;
    uploadImageShow: string | undefined;
    setUploadImage: React.Dispatch<React.SetStateAction<File | undefined>>;
    setUploadImageShow: React.Dispatch<React.SetStateAction<string | undefined>>;
    size: number;
    placeholder: string;
    label: string;
    uploadImageTooLarge: boolean;
    setUploadImageTooLarge: React.Dispatch<React.SetStateAction<boolean>>;
    noImage: boolean;
    setNoImage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageInput({
    uploadImage,
    uploadImageShow,
    size,
    placeholder,
    label,
    uploadImageTooLarge,
    setUploadImageTooLarge,
    setUploadImage,
    setUploadImageShow,
    noImage,
    setNoImage,
}: ImageInputProps) {
    const handlePreUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        handleUploadImageSetting(e.target.files[0]);
    }

    const handleUploadImageSetting = (file: File) => {
        setUploadImageTooLarge(false);

        const currFile = file;

        if (!currFile) return;

        if (currFile.size > 1920 * 1080) {
            setUploadImageTooLarge(true);
            return;
        }

        setUploadImage(currFile);

        const reader = new FileReader();

        reader.onload = function () {
            if (typeof reader.result === 'string') setUploadImageShow(reader.result);
            return;
        }

        if (currFile != null) reader.readAsDataURL(currFile);
    }

    const resetImage = () => {
        setUploadImage(undefined);
        setUploadImageShow(undefined);
    }

    return (
        <div
            className={style.inputDiv}
            onClick={() => document.getElementById(`${label}`)?.click()}
            style={{
                outline: ((noImage && !uploadImage) || uploadImageTooLarge) ? `1px solid ${Colors.error}` : 'initial' 
            }}
        >
            <ImageSVG box={size} color={((noImage && !uploadImage) || uploadImageTooLarge) ? Colors.error : Colors.black} />
            <p style={{ cursor: 'pointer', pointerEvents: uploadImage ? 'none' : 'all' }}>{uploadImage ? uploadImage.name : placeholder}</p>
            <input 
                type="file"
                accept='image/*'
                hidden
                disabled={uploadImage ? true : false}
                name={label}
                id={label}
                title={placeholder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlePreUploadImage(e);
                }}
            />
            {(uploadImage && uploadImageShow) && 
                <button type='button' role='button' onClick={resetImage} style={{ marginLeft: '.5rem' }}>
                    <XCircleFillIcon box={size} color={Colors.error} />
                </button>
            }
        </div>
    );
}