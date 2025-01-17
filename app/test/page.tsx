"use client"

import * as React from 'react';
import style from '@/styles/pages/test/index.module.scss'
import { useQuery } from '@tanstack/react-query';
import Category from '@/types/categories';
import { getCategories } from '@/axios/categories';
import LoadingSpinner from '@/helpers/loading';
import Colors from '@/types/colors';
import { BugSVG, XCircleFillIcon, XCircleNoFillIcon } from '@/svg';
import Link from 'next/link';
import { PlateComplex } from '@/types/plate';
import { getPlatesByCategoryStrickt, getSpecialPlates } from '@/axios/complex';
import { PlateFinal } from '@/helpers/plate';
import Image from 'next/image';

import SPECIAL from '@/public/menu.png';

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

    const handlePrice = (price: number) => {
        if (price % 1 == 0) return `${price}.00`;
        return `${price}0`;
    }

    return (
        <main className={style.main}>
            {(specialPlates && showSpecial && specialPlates.length >= 1) &&
                <div className={style.specialPopUp}>
                    <div className={style.specialPopUpInner}>
                        <h2>Πιάτα Ημέρας</h2>
                        <ul className={style.specialPopUp_showSpecialCont}>
                            {specialPlates.map((sp: PlateComplex, key: number) => {
                                return (
                                    <li key={key}>
                                        <p>{sp.name}</p>
                                        <p>{handlePrice(sp.price)}&euro; {sp.kiloPrice && '/κιλό'}</p>
                                    </li>
                                );
                            })}
                        </ul>
                        <button type='button' role='button' className={style.closeButtonSpecial} onClick={() => setShowSpecial(false)}>
                            <XCircleFillIcon box={2} color={Colors.black} />
                        </button>
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
                            <>
                                <li key={key} className={style.categoryItem} onClick={() => getPlates(cat)}>
                                    <Link href={`/test/#${key === 0 ? '' : key - 1}`} passHref>
                                        <div role='presentation' className={style.cross}>
                                            <span role='presentation'></span>
                                            <span role='presentation' style={{ transform: active?._id === cat._id ? 'rotate(0)' : '' }} ></span>
                                        </div>
                                        <p>{cat.name}</p>
                                    </Link>
                                </li>
                                {(loadingPlates && active?._id === cat._id && !errorPlates) &&
                                    <div className={style.loading} key={cat._id + 1000}>
                                        <LoadingSpinner />
                                        <p>Φόρτωση Πιάτων...</p>
                                    </div>
                                }
                                {(errorPlates && active?._id === cat._id) &&
                                    <div className={style.loading} key={cat._id + 1000}>
                                        <LoadingSpinner />
                                        <p>Σφάλμα!</p>
                                    </div>
                                }
                                {(active?._id === cat._id && !errorPlates && !loadingPlates && currentPlates) &&
                                    <section className={style.platesView}>
                                        {currentPlates.map((pl: PlateComplex, key: number) => {
                                            if (!pl.visible || !pl.availability || pl.onlyOnSpecial) return;
                                            return (
                                                <PlateFinal
                                                    key={key}
                                                    image={pl.image}
                                                    name={pl.name}
                                                    price={pl.price}
                                                    category={pl.category}
                                                    garnet={pl.garnet}
                                                    desc={pl.desc}
                                                    availability={pl.availability}
                                                    showIcon={pl.showIcon}
                                                    showDesc={pl.showDesc}
                                                    showPrice={pl.showPrice}
                                                    kiloPrice={pl.kiloPrice}
                                                    onlyOnSpecial={pl.onlyOnSpecial}
                                                    order={pl.order}
                                                    showOnSpecial={pl.showOnSpecial}
                                                    visible={pl.visible}
                                                    imageMimeType={pl.imageMimeType}
                                                    showGarnet={pl.showGarnet}
                                                    _id={pl._id}
                                                    object={pl}
                                                    showOrder={false}
                                                    onClick={() => {return;}}
                                                />
                                            );
                                        })}
                                    </section>
                                }
                            </>
                        );
                    })}
                </ul>
            }
        </main>
    );
}