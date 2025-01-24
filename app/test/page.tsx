"use client"

import * as React from 'react';
import style from '@/styles/pages/test/index.module.scss'
import { useQuery } from '@tanstack/react-query';
import Category from '@/types/categories';
import { getCategories } from '@/axios/categories';
import LoadingSpinner from '@/helpers/loading';
import Colors from '@/types/colors';
import { BugSVG } from '@/svg';
import Link from 'next/link';
import { AvailabilityOptionsEnum, PlateComplex, PlateImagePositionEnum } from '@/types/plate';
import { getPlatesByCategoryStrickt, getSpecialPlates } from '@/axios/complex';
import { PlateClient } from '@/helpers/plate';
import Image from 'next/image';
import { Settings } from '@/types/settings';
import { getSettings } from '@/axios/settings';
import useOutsideHook from '@/helpers/hooks';
import SPECIAL from '@/public/menu.png';
import BASE from '@/axios/base';

type PlateArrayType = {
    catID: string,
    plate: PlateComplex[],
};

const plateArray: PlateArrayType[] = []; 


export default function Page() {
    const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, refetch: refetchCat } = useQuery<Category[]>({
        queryKey: ['get-all-categories-main'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    const { data: special, isLoading: isLoadingSpecial, isError: isErrorSpecial, refetch: refetchSpecial } = useQuery<PlateComplex[]>({
        queryKey: ['get-all-special-plates-main'],
        queryFn: async () => {
            return await getSpecialPlates();
        }
    });

    const { data: globalSettings } = useQuery<Settings>({
        queryKey: ['get-settings-main'],
        queryFn: async () => {
            return await getSettings();
        }
    });

    React.useEffect(() => {
        if (special) {
            setSpecialPlates(special);
        }
    }, [special]);

    // ? Plate State
    const [currentPlates, setCurrentPlates] = React.useState<PlateComplex[]>();
    const [active, setActive] = React.useState<Category>();
    const [specialPlates, setSpecialPlates] = React.useState<PlateComplex[]>();

    // ? Error Plate States
    const [loadingPlates, setLoadingPlates] = React.useState<boolean>(false);
    const [errorPlates, setErrorPlates] = React.useState<boolean>(false);

    const [showSpecial, setShowSpecial] = React.useState<boolean>(true);

    // ? Ref
    const specialRef = React.useRef<HTMLDivElement>(null);

    useOutsideHook(specialRef, setShowSpecial);

    // ! ADD SPECIAL PLATES
    const getPlates = async (cat: Category, t?: number) => {
        if (!t) {
            setLoadingPlates(false);
            setErrorPlates(false);
        }

        if (t == 4) return;

        if (cat._id === active?._id) {
            setActive(undefined);
            return;
        }

        setActive(cat)
        setLoadingPlates(true);
        if (plateArray.length > 0) {
            for (let i = 0; i < plateArray.length; i++) {
                if (plateArray[i].catID === cat._id) {
                    setLoadingPlates(false);
                    setCurrentPlates(plateArray[i].plate);
                    return;
                }
            }
        }

        const res = await getPlatesByCategoryStrickt(cat._id);

        if (res) {
            setLoadingPlates(false);
            setCurrentPlates(res);
            plateArray.push({
                catID: cat._id,
                plate: res,
            });
            return;
        } else {
            setLoadingPlates(false);
            setErrorPlates(true);
            getPlates(cat, t ? t + 1 : 1);
            return;
        }
    }

    return (
        <main className={style.main}>
            {(globalSettings && globalSettings.backgroundImageVisibility) &&
                <div
                    className={style.backgroundImageTop}
                    style={{
                    backgroundImage: `url(${BASE}background/)`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    }}
                    role='presentation'
                ></div>
            }
            {(specialPlates && showSpecial && specialPlates.length >= 1 && globalSettings) &&
                <div className={style.specialPopUp}>
                    <div className={style.specialPopUpInner} ref={specialRef}>
                        <h2>Πιάτα Ημέρας</h2>
                        <ul className={style.specialPopUp_showSpecialCont}>
                            {specialPlates.map((sp: PlateComplex, key: number) => {
                                if (!sp.onlyOnSpecial && globalSettings.showOnSpecialVisibility) return
                                return (
                                    <PlateClient 
                                        key={sp._id}
                                        image={sp.image}
                                        name={sp.name}
                                        price={sp.price}
                                        garnet={sp.garnet}
                                        desc={sp.desc}
                                        availability={sp.availability}
                                        showIcon={sp.showIcon}
                                        showDesc={sp.showDesc}
                                        showPrice={sp.showPrice}
                                        kiloPrice={sp.kiloPrice}
                                        imageMimeType={sp.imageMimeType}
                                        showGarnet={sp.showGarnet}
                                        imagePosition={globalSettings ? globalSettings.imagePosition : PlateImagePositionEnum.left}
                                        availabilityActions={globalSettings ? globalSettings.availabilitySettings : AvailabilityOptionsEnum.grey}
                                        hideImage={globalSettings?.hideAllImages}
                                        animationDelay={key * 100}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </div>
            }
            {!showSpecial &&
                <button type="button" role='button' className={style.openSpecialButton} onClick={() => setShowSpecial(true)}>
                    <Image src={SPECIAL} alt='Menu Icon' width={40} height={40} />
                </button>
            }
            {isLoadingCategories &&
                <div className={style.loading}>
                    <LoadingSpinner />
                    <p>Φόρτωση...</p>
                </div>
            }
            {isErrorCategories &&
                <div className={style.loading}>
                    <div className={style.bugDiv}>
                        <BugSVG box={3} color={Colors.black} />
                    </div>
                    <p>Απροσδιόριστο Σφάλμα!</p>
                    <button onClick={() => {refetchCat()}} type="button" role="button" className={style.refetchCatButton}>
                        Προσπαθήστε Ξανά
                    </button>
                </div>
            }
            {(categories && !isLoadingCategories && !isErrorCategories) &&
                <ul className={style.categories}>
                    {categories.map((cat: Category, key: number) => {
                        if (!cat.visible) return;
                        return (
                            <React.Fragment key={cat._id}>
                                <li className={style.categoryItem} onClick={() => getPlates(cat)} id={`${cat._id}order-${key}`}>
                                    <Link href={`#${cat._id + 'order-' + key}`} passHref>
                                        <div role='presentation' className={style.cross}>
                                            <span role='presentation'></span>
                                            <span role='presentation' style={{ transform: active?._id === cat._id ? 'rotate(0)' : '' }} ></span>
                                        </div>
                                        <p>{cat.name}</p>
                                    </Link>
                                </li>
                                {(loadingPlates && active?._id === cat._id && !errorPlates) &&
                                    <div className={style.loading}>
                                        <LoadingSpinner />
                                        <p>Φόρτωση Πιάτων...</p>
                                    </div>
                                }
                                {(errorPlates && active?._id === cat._id) &&
                                    <div className={style.loading}>
                                        <LoadingSpinner />
                                        <p>Σφάλμα!</p>
                                    </div>
                                }
                                {(active?._id === cat._id && !errorPlates && !loadingPlates && currentPlates) &&
                                    <section className={style.platesView} key={cat._id}>
                                        {currentPlates.map((pl: PlateComplex, key2: number) => {
                                            if (!pl.visible || pl.onlyOnSpecial) return;
                                            return (
                                                <PlateClient 
                                                    key={pl._id}
                                                    image={pl.image}
                                                    name={pl.name}
                                                    price={pl.price}
                                                    garnet={pl.garnet}
                                                    desc={pl.desc}
                                                    availability={pl.availability}
                                                    showIcon={pl.showIcon}
                                                    showDesc={pl.showDesc}
                                                    showPrice={pl.showPrice}
                                                    kiloPrice={pl.kiloPrice}
                                                    imageMimeType={pl.imageMimeType}
                                                    showGarnet={pl.showGarnet}
                                                    imagePosition={globalSettings ? globalSettings.imagePosition : PlateImagePositionEnum.left}
                                                    availabilityActions={globalSettings ? globalSettings.availabilitySettings : AvailabilityOptionsEnum.grey}
                                                    hideImage={globalSettings?.hideAllImages}
                                                    animationDelay={key2 * 100}
                                                />
                                            );
                                        })}
                                    </section>
                                }
                            </React.Fragment>
                        );
                    })}
                </ul>
            }
        </main>
    );
}