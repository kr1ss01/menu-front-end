"use client"

import * as React from 'react';
import style from '@/styles/helpers/plate/plate.module.scss';
import Image from 'next/image';
import { AvailabilityOptionsEnum, PlateComplex, PlateImagePositionEnum } from '@/types/plate';
import Garnet from '@/types/garnets';

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

export const PlateClient = ({
    image,
    name,
    price,
    garnet,
    desc,
    showIcon,
    showDesc,
    showPrice,
    kiloPrice,
    availability,
    imageMimeType,
    showGarnet,
    imagePosition,
    onClick,
    object,
    showOrder,
    order,
    availabilityActions,
    hideImage = false,
    animationDelay = 0,
}: {
    image: Buffer | undefined,
    name: string,
    price: number,
    garnet: Garnet,
    desc?: string,
    showIcon: boolean,
    showDesc: boolean,
    kiloPrice: boolean,
    showPrice: boolean,
    availability: boolean,
    imageMimeType?: string,
    showGarnet: boolean, 
    imagePosition: PlateImagePositionEnum,
    onClick?: React.Dispatch<React.SetStateAction<PlateComplex | null>>,
    object?: PlateComplex,
    showOrder?: boolean,
    order?: number,
    availabilityActions: AvailabilityOptionsEnum,
    hideImage?: boolean,
    animationDelay?: number,
}) => {
    const handlePrice = (price: number) => {
        if (price % 1 == 0) return `${price}.00`;
        return `${price}0`;
    }

    if (!hideImage) {
        if (image && showIcon && imageMimeType) {
            if (imagePosition === PlateImagePositionEnum.left || imagePosition === PlateImagePositionEnum.bg) {
                return (
                    <div
                        className={
                            imagePosition === PlateImagePositionEnum.left ? style.plateClientImage : style.plateWithImage
                        }
                        style={{
                            cursor: (onClick && object) ? 'pointer' : 'default',
                            opacity: (!availability && AvailabilityOptionsEnum.opacity === availabilityActions) ? .3 : 1,
                            filter: (!availability && AvailabilityOptionsEnum.grey === availabilityActions) ? 'grayscale(1) opacity(.8)' : '',
                            display: (!availability && AvailabilityOptionsEnum.hide === availabilityActions) ? 'none' : 'grid',
                            animationDelay: `${animationDelay}ms`,
                        }}
                        onClick={() => { (onClick && object) ? onClick(object) : null }}
                    >
                        {imagePosition === PlateImagePositionEnum.left && 
                            <div className={style.plateClientImage_imgbox}>
                                <Image
                                    src={`data:${imageMimeType};base64,${Buffer.from(image).toString('base64')}`}
                                    alt={`${name} image`}
                                    objectFit='cover'
                                    fill
                                />
                            </div>
                        }
                        {imagePosition === PlateImagePositionEnum.bg &&
                            <div
                            className={style.imageBackface}
                            style={{ 
                                backgroundImage: `url(data:${imageMimeType};base64,${Buffer.from(image).toString('base64')})`,
                                backgroundSize: 'cover',
                                WebkitBackgroundSize: 'cover',
        
                            }}
                            role='presentation'
                            ></div>
                        }
                        <div
                            className={style.infoDiv}
                            style={{ cursor: (onClick && object) ? 'pointer' : 'default' }}
                            onClick={() => { (onClick && object) ? onClick(object) : null }}
                        >
                            <p className={style.infoDivName}>{(showOrder && order) && `(${order})`} {name}</p>
                            {showGarnet && <span className={style.infoDivGarnet}>Συνοδεύεται με: {garnet.name === 'Καμία' ? '-' : garnet.name}</span>}
                            {showDesc && <span className={style.infoDivDesc}>{desc}</span>}
                            {showPrice && 
                                <span className={style.platePrice}>
                                    {handlePrice(price)}&euro;{kiloPrice && '/κιλό'}
                                </span>
                            }
                        </div>
                    </div>
                );
            } else {
                return (
                    <div
                        className={style.plateClientImage_right}
                        style={{
                            cursor: (onClick && object) ? 'pointer' : 'default',
                            opacity: (!availability && AvailabilityOptionsEnum.opacity === availabilityActions) ? .3 : 1,
                            filter: (!availability && AvailabilityOptionsEnum.grey === availabilityActions) ? 'grayscale(1) opacity(.8)' : '',
                            display: (!availability && AvailabilityOptionsEnum.hide === availabilityActions) ? 'none' : 'grid',
                            animationDelay: `${animationDelay}ms`,
                        }}
                        onClick={() => { (onClick && object) ? onClick(object) : null }}
                    >
                        <div
                            className={style.infoDiv}
                            style={{ cursor: (onClick && object) ? 'pointer' : 'default' }}
                            onClick={() => { (onClick && object) ? onClick(object) : null }}
                        >
                            <p className={style.infoDivName}>{(showOrder && order) && `(${order})`} {name}</p>
                            {showGarnet && <span className={style.infoDivGarnet}>Συνοδεύεται με: {garnet.name === 'Καμία' ? '-' : garnet.name}</span>}
                            {showDesc && <span className={style.infoDivDesc}>{desc}</span>}
                            {showPrice && 
                                <span className={style.platePrice}>
                                    {handlePrice(price)}&euro;{kiloPrice && '/κιλό'}
                                </span>
                            }
                        </div>
    
                        <div className={style.plateClientImage_imgbox}>
                            <Image
                                src={`data:${imageMimeType};base64,${Buffer.from(image).toString('base64')}`}
                                alt={`${name} image`}
                                objectFit='cover'
                                fill
                            />
                        </div>  
                    </div>
                );
            }
        }
    }

    return (
        <div
            className={style.plateClient}
            style={{
                cursor: (onClick && object) ? 'pointer' : 'default',
                opacity: (!availability && AvailabilityOptionsEnum.opacity === availabilityActions) ? .3 : 1,
                filter: (!availability && AvailabilityOptionsEnum.grey === availabilityActions) ? 'grayscale(1) opacity(.3)' : '',
                display: (!availability && AvailabilityOptionsEnum.hide === availabilityActions) ? 'none' : 'grid',
                animationDelay: `${animationDelay}ms`,
            }}
            onClick={() => { (onClick && object) ? onClick(object) : null }}
        >
            <p>{(showOrder && order) && `(${order})`} {name}</p>
            {showGarnet && <span>Συνοδεύεται με: {garnet.name}</span>}
            {showDesc && <span>{desc}</span>}
            {showPrice && 
                <span className={style.platePrice}>
                    {handlePrice(price)}&euro; {kiloPrice && '/κιλό'}
                </span>
            }
        </div>
    )
}

export const PlateSpecial = ({
    image,
    name,
    price,
    garnet,
    desc,
    showIcon,
    showDesc,
    kiloPrice,
    showPrice,
    availability,
    imageMimeType,
    showGarnet,
    imagePosition,
    availabilityActions,
    hideImage,
    animationDelay,
    globalSpecial,
    onlyOnSpecial,
}:{
    image: Buffer | undefined,
    name: string,
    price: number,
    garnet: Garnet,
    desc?: string,
    showIcon: boolean,
    showDesc: boolean,
    kiloPrice: boolean,
    showPrice: boolean,
    availability: boolean,
    imageMimeType?: string,
    showGarnet: boolean, 
    imagePosition: PlateImagePositionEnum,
    availabilityActions: AvailabilityOptionsEnum,
    hideImage?: boolean,
    animationDelay?: number,
    globalSpecial: boolean,
    onlyOnSpecial: boolean,
}) => {
    const handlePrice = (price: number) => {
        if (price % 1 == 0) return `${price}.00`;
        return `${price}0`;
    }
    // if (!onlyOnSpecial && globalSpecial) return;
    return (
        <li className={style.specialPlate} onClick={() => {}}>
            <div className={style.specialPlateLine}>
                <p>{name}</p>
                <p>{handlePrice(price)}&euro; {kiloPrice && '/κιλό'}</p>
            </div>
            <div className={style.specialPlateInfo}>
                {(image && imageMimeType && showIcon) &&
                    <div className={style.specialPlateInfoImage}>
                        <Image
                            src={`data:${imageMimeType};base64,${Buffer.from(image).toString('base64')}`}
                            alt={`${name} image`}
                            objectFit='cover'
                            fill
                        />
                    </div>
                }
            </div>
        </li>
    );
}