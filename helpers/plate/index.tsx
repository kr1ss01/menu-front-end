"use client"

import * as React from 'react';
import style from '@/styles/helpers/plate/plate.module.scss';
import Image from 'next/image';
import { PlateComplex } from '@/types/plate';

interface PlateViewDashboardProps extends PlateComplex {
    onClick: React.Dispatch<React.SetStateAction<PlateComplex | null>>,
    object: PlateComplex,
    showOrder: boolean,
}

type PlatePreviewProps = {
    image?: string;
    name?: string;
    price?: number | string;
    categoryName?: string;
    garnetName?: string;
    desc?: string;
    availability?: boolean;
    showIcon?: boolean;
    showDesc?: boolean;
    showPrice?: boolean;
    kiloPrice?: boolean;
    showGarnet?: boolean;
}

export const PlatePreview = ({ 
    image,
    name,
    price,
    categoryName,
    garnetName,
    desc,
    availability,
    showIcon,
    showDesc,
    showPrice,
    kiloPrice,
    showGarnet,
 }: PlatePreviewProps) => {
    return (
        <div className={style.plate}>
            {showIcon &&
                <div className={style.plateImage}>
                    {image && <Image src={image} alt='Plate Image' width={100} height={100}   />}
                </div>
            }
            <div className={showIcon ? style.plateInfo : style.plateInfoNoImage}>
                <p className={style.plateName}>{name ? name : 'Ονομασία Πιάτου'}</p>
                {(garnetName && !desc) ? <p className={style.plateDesc}>{showGarnet && garnetName}</p> :
                    showDesc ? <p className={style.plateDesc}>{desc ? desc : 'Περιγραφή Πιάτου'}</p> : <p className={style.plateDesc}>{showGarnet ? garnetName : ''}</p>
                }
                {showPrice && <p className={style.platePrice}>{kiloPrice ? <span>{price}&euro;/κιλό</span> : <>{price}&euro;</>}</p>}
            </div>
        </div>
    )
}

export const PlateViewDashboard = ({
    image,
    name,
    price,
    category,
    garnet,
    desc,
    availability,
    showIcon,
    showDesc,
    showPrice,
    kiloPrice,
    onlyOnSpecial,
    order,
    showOnSpecial,
    visible,
    imageMimeType,
    showGarnet,
    _id,
    onClick,
    showOrder,
}: PlateViewDashboardProps) => {
    const handleUpdate = () => {
        onClick({
            image: image,
            name: name,
            price: price,
            category: category,
            garnet: garnet,
            desc: desc,
            availability: availability,
            showIcon: showIcon,
            showDesc: showDesc,
            showPrice: showPrice,
            kiloPrice: kiloPrice,
            onlyOnSpecial: onlyOnSpecial,
            order: order,
            showOnSpecial: showOnSpecial,
            visible: visible,
            showGarnet: showGarnet,
            _id: _id,
        })
    }

    return (
        <div className={image ? (showIcon ? style.plateView : style.plateViewNoImage) : style.plateViewNoImage} onClick={() => handleUpdate()}>
            {image &&
                <div className={style.imageCont}>
                    <Image src={`data:${imageMimeType};base64,${Buffer.from(image).toString('base64')}`} alt='Plate Image' width={130} height={130} />
                </div>
            }
            <div className={style.infoDiv} style={{ paddingLeft: !image ? '.5rem' : 'initial' }}>
                <p className={style.infoDivName}>{name}</p>
                {showGarnet && <p className={style.infoDivGarnet}>Συνοδευεται με: {garnet.name === 'Καμία' ? '-' : garnet.name}</p>}
                {showDesc && <p className={style.infoDivDesc}>{desc}</p>}
                {showPrice && <p className={style.infoDivPrice}>{price}&euro;{kiloPrice ? '/κιλο' : ''}</p>}
            </div>
        </div>
    );
}

export const PlateFinal = ({
    image,
    name,
    price,
    category,
    garnet,
    desc,
    availability,
    showIcon,
    showDesc,
    showPrice,
    kiloPrice,
    onlyOnSpecial,
    order,
    showOnSpecial,
    visible,
    imageMimeType,
    showGarnet,
    _id,
    object,
    onClick,
    showOrder
}: PlateViewDashboardProps) => {
    const handlePrice = (price: number) => {
        if (price % 1 == 0) return `${price}.00`;
        return `${price}0`;
    }

    // * RETURN WITH IMAGE
    if (image && showIcon && imageMimeType) {
        return (
            <div
                className={style.plateWithImage}
                onClick={() => onClick(object)}
                >
                    <div
                    className={style.imageBackface}
                    style={{ 
                        backgroundImage: `url(data:${imageMimeType};base64,${Buffer.from(image).toString('base64')})`,
                        backgroundSize: 'cover',
                        WebkitBackgroundSize: 'cover',

                    }}
                    role='presentation'
                    >
                    </div>
                <div className={style.plateInfo}>
                    <p>{showOrder && `(${order})`} {name}</p>
                    {showGarnet && <span>{garnet.name}</span>}
                    {showDesc && <span>{desc}</span>}
                    {showPrice && 
                    <span className={style.platePrice}>
                        {handlePrice(price)}&euro; {kiloPrice && '/κιλό'}
                    </span>
                    }
                </div>
            </div>
        );
    }
    // * RETURN NO IMAGE
    return (
        <div className={style.plateNoImage} onClick={() => onClick(object)}>
            <p>{showOrder && `(${order})`} {name}</p>
            {showGarnet && <span>{garnet.name}</span>}
            {showDesc && <span>{desc}</span>}
            {showPrice && 
                <span className={style.platePrice}>
                {handlePrice(price)}&euro; {kiloPrice && '/κιλό'}
                </span>
            }
        </div>
    );
}