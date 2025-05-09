"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/plate.module.scss';
import Colors from '@/types/colors';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/helpers/loading';
import { getCategories } from '@/axios/categories';
import Category from '@/types/categories';
import { BinSVG, BlockBGSVG, BlockLeftSVG, BlockRightSVG, BugSVG, CategorySVG, ExpandSVG, EyeCloseSVG, EyeOpenSVG, GarnetSVG, PlateSVG, ResetSVG, SettingsSVG, UpSVG, XCircleNoFillIcon } from '@/svg';
import ImageInput from '@/helpers/inputs/image.input';
import TextInput from '@/helpers/inputs/text.input';
import NumberInput from '@/helpers/inputs/number.input';
import TextAreaInput from '@/helpers/inputs/textarea.input';
import DropDownInput from '@/helpers/inputs/dropdown.input';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import SubmitButton from '@/helpers/components/submit.button';
import Garnet from '@/types/garnets';
import { getGarnets } from '@/axios/garnets';
import { AvailabilityOptionsEnum, PlateComplex, PlateFixOrder, PlateImagePositionEnum, PlateStats } from '@/types/plate';
import { getPlatesByCategoryStrickt } from '@/axios/complex';
import { PlateClient } from '@/helpers/plate';
import { deletePlate, fixPlateOrder, getPlateStats, newPlate, updatePlateWithImage } from '@/axios/plates';
import ErrorDiv, { SetStateTypeObject, SuccessDiv } from '@/helpers/components/error.div';
import SearchInput from '@/helpers/inputs/search.input';
import { scrollToTop } from '@/helpers/functions/scrollToTop';
import PopUpInit from '@/helpers/functions/popUpInit';

type PlateArrayType = {
    catID: string,
    plate: PlateComplex[],
};

const plateArray: PlateArrayType[] = [];

const Plate = ({ token }: { token: string | undefined }) => {
    // ? Fetch all categories
    const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, refetch: refetchCategories } = useQuery<Category[]>({
        queryKey: ['get-all-categories-for-plates-admin'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    // ? Fetch all garnets
    const { data: garnets, isLoading: isLoadingGarnets } = useQuery<Garnet[]>({
        queryKey: ['get-all-garnets-for-plates-admin'],
        queryFn: async () => {
            return await getGarnets();
        }
    });

    // ? Fetch stats of plates
    const { data: stats } = useQuery<PlateStats>({
        queryKey: ['get-stats-plates-admin'],
        queryFn: async () => {
            return await getPlateStats();
        }
    });

    // ? API States
    const [allCategories, setAllCategories] = React.useState<Category[]>();
    const [plate, setAllPlates] = React.useState<PlateComplex[]>();

    // ? Object States
    const [gID, setGID] = React.useState<string>(''); // garnet id
    const [cID, setCID] = React.useState<string>(''); // category id
    const [name, setName] = React.useState<string>(''); // name
    const [desc, setDesc] = React.useState<string>(''); // description
    const [price, setPrice] = React.useState<number>(0); // price
    const [visible, setVisible] = React.useState<boolean>(true); // visible
    const [showIcon, setShowIcon] = React.useState<boolean>(false); // available
    const [showDesc, setShowDesc] = React.useState<boolean>(false); // show description
    const [showPrice, setShowPrice] = React.useState<boolean>(true); // show price
    const [kiloPrice, setKiloPrice] = React.useState<boolean>(false); // is it weightable
    const [showGarnet, setShowGarnet] = React.useState<boolean>(true); // show garnet
    const [availability, setAvailability] = React.useState<boolean>(true); // availability
    const [showOnSpecial, setShowOnSpecial] = React.useState<boolean>(false); // show on special plates
    const [onlyOnSpecial, setOnlyOnSpecial] = React.useState<boolean>(false); // show ONLY on special plates -- exclude from main menu

    // ? Fuck Me State
    const [garnetName, setGarnetName] = React.useState<string>('');

    const [active, setActive] = React.useState<Category>();
    const [currentPlates, setCurrentPlates] = React.useState<PlateComplex[]>();

    // ? Error Plate States
    const [loadingPlates, setLoadingPlates] = React.useState<boolean>(false);
    const [errorPlates, setErrorPlates] = React.useState<boolean>(false);

    // ? Error Handling State
    const [error, setError] = React.useState<boolean>(false);
    const [noImage, setNoImage] = React.useState<boolean>(false);
    const [descError, setDescError] = React.useState<boolean>(false);
    const [garnetError, setGarnetError] = React.useState<boolean>(false);
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [specialError, setSpecialError] = React.useState<boolean>(false);
    const [uploadImageTooLarge ,setUploadImageTooLarge] = React.useState<boolean>(false);

    // ? Pop Up For Addresing Issues
    const [popUp, setPopUp] = React.useState<SetStateTypeObject>();

    // ? Image States
    const [uploadImage, setUploadImage] = React.useState<File>();
    const [uploadImageShow, setUploadImageShow] = React.useState<string>();

    // ? Update State
    const [updateObject, setUpdateObject] = React.useState<PlateComplex | null>(null);

    // ? Settings States
    const [settings, setSettings] = React.useState<boolean>(false);

    // ? Order States
    const [order, setOrder] = React.useState<boolean>(false);
    const [orderSet, setOrderSet] = React.useState<PlateComplex>();
    const [orderLoading, setOrderLoading] = React.useState<boolean>(false);

    // ? Filters
    const [visibleOnly, setVisibleOnly] = React.useState<boolean>(false);
    const [nonVisibleOnly, setNonVisibleOnly] = React.useState<boolean>(false);
    const [availableOnly, setAvailableOnly] = React.useState<boolean>(false);
    const [nonAvailableOnly, setNonAvailableOnly] = React.useState<boolean>(false);
    const [dayPlateOnly, setDayPlateOnly] = React.useState<boolean>(false);
    const [exclDayPlateOnly, setExclDayPlateOnly] = React.useState<boolean>(false);
    const [hasImageOnly, setHasImageOnly] = React.useState<boolean>(false);

    // ? Search Filter
    const [search, setSearch] = React.useState<string>('');

    // ? Plate Position
    const [imagePosition, setImagePosition] = React.useState<PlateImagePositionEnum>(PlateImagePositionEnum.left);

    // ? Drag N Drop Refs
    let todoItemDragOver = React.useRef<number>(0);
    let todoItemDrag = React.useRef<number>(0);

    // ? Handle Uplaod Image Too Large Error -- It's not beeing handled by Image Component at Inputs.
    React.useEffect(() => {
        if (uploadImageTooLarge) {
            PopUpInit({ setPopUp: setPopUp, type: 'error', text: 'Μεγάλη Εικόνα!' });
            return;
        }
    }, [uploadImageTooLarge]);

    // ? Don't let user have specific pair values checked at the same time.
    React.useEffect(() => {
        if (visibleOnly && nonVisibleOnly) {
            setNonVisibleOnly(false);
            setVisibleOnly(true);
        }
    }, [visibleOnly]);

    React.useEffect(() => {
        if (visibleOnly && nonVisibleOnly) {
            setNonVisibleOnly(true);
            setVisibleOnly(false);
        }
    }, [nonVisibleOnly]);

    React.useEffect(() => {
        if (availableOnly && nonAvailableOnly) {
            setNonAvailableOnly(false);
            setAvailableOnly(true);
        }
    }, [availableOnly]);

    React.useEffect(() => {
        if (availableOnly && nonAvailableOnly) {
            setAvailableOnly(false);
            setNonAvailableOnly(true);
        }
    }, [nonAvailableOnly]);

    React.useEffect(() => {
        if (dayPlateOnly && exclDayPlateOnly) {
            setDayPlateOnly(true);
            setExclDayPlateOnly(false);
        }
    }, [dayPlateOnly]);

    React.useEffect(() => {
        if (dayPlateOnly && exclDayPlateOnly) {
            setDayPlateOnly(false);
            setExclDayPlateOnly(true);
        }
    }, [exclDayPlateOnly]);

    // ? As soos as categories are fetched set them as state.
    React.useEffect(() => {
        if (categories) {
            setAllCategories(categories);
        }
    }, [categories]);

    // ? Warn For Not Showing Price On Plate (Might be illegal)
    React.useEffect(() => {
        if (!showPrice) {
            const ans = confirm("Η απόκρυψη τιμής ίσως υπόκειται σε νομικές παραβάσεις!");
            if (!ans) setShowPrice(true);
        }
    }, [showPrice]);

    // ? Get Plates and handle Cache.
    const getPlates = async (cat: Category, t?: number) => {
        if (!t) {
            setLoadingPlates(false);
            setErrorPlates(false);
        }

        if (t == 4) {
            PopUpInit({ setPopUp: setPopUp, text: 'Απροσδιόριστο Σφάλμα Στην Λήψη Πιάτων!', type: 'error' });
            return;
        }

        if (cat._id === active?._id) {
            setActive(undefined);
            return;
        }

        setActive(cat);
        setLoadingPlates(true);
        if (plateArray.length > 0) {
            for (let i = 0; i < plateArray.length; i++) {
                if (plateArray[i].catID === cat._id) {
                    setLoadingPlates(false);
                    setAllPlates(plateArray[i].plate);
                    setCurrentPlates(plateArray[i].plate);
                    return;
                }
            }
        }

        const res = await getPlatesByCategoryStrickt(cat._id);

        if (res) {
            setLoadingPlates(false);
            setAllPlates(res);
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

    // ? Set Update Object Params
    React.useEffect(() => {
        if (updateObject) {
            setGID(updateObject.garnet._id);
            setCID(updateObject.category._id);
            setName(updateObject.name);
            setDesc(updateObject.desc ? updateObject.desc : '');
            setPrice(updateObject.price);
            setVisible(updateObject.visible);
            setShowIcon(updateObject.showIcon);
            setShowDesc(updateObject.showDesc);
            setShowPrice(updateObject.showPrice);
            setKiloPrice(updateObject.kiloPrice);
            setShowGarnet(updateObject.showGarnet);
            setAvailability(updateObject.availability);
            setShowOnSpecial(updateObject.showOnSpecial);
            setOnlyOnSpecial(updateObject.onlyOnSpecial);
        } else {
            setGID('');
            setCID('');
            setName('');
            setDesc('');
            setPrice(0);
            setVisible(true);
            setShowIcon(false);
            setShowDesc(false);
            setShowPrice(true);
            setKiloPrice(false);
            setShowGarnet(true);
            setAvailability(true);
            setShowOnSpecial(false);
            setOnlyOnSpecial(false);
        }
    }, [updateObject]);

    // ? Handle Plate Creation Or Update
    // * This function handles BOTH update & creation.
    const handleSubmition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setNoImage(false);
        setDescError(false);
        setGarnetError(false);
        setError(false);
        setSpecialError(false);
        setUploadImageTooLarge(false);

        if (name.length === 0 || price === 0 || price == undefined || price == null 
            || price == 0 || !gID || !cID || gID.length === 0 || cID.length === 0) {
            setEmptyFields(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Κενά Πεδία!', type: 'error' });
            return;
        }

        if ((showDesc && !desc) || (showDesc && desc.length === 0)) {
            setDescError(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Σφάλμα Στην Περιγραφή!', type: 'error' });
            return;
        }

        if (showIcon && !uploadImage && !updateObject) {
            setNoImage(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Σφάλμα Στην Εικόνα!', type: 'error' });
            return;
        }

        if ((showGarnet && !gID) || (showGarnet && gID.length === 0)) {
            setGarnetError(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Σφάλμα Στην Γαρνιτούρα!', type: 'error' });
            return;
        }

        if (onlyOnSpecial && !showOnSpecial) {
            setSpecialError(true);
            PopUpInit({ setPopUp: setPopUp, text: 'Μη Διαθέσιμο στα Πιάτα Ημέρας!', type: 'error' });
            return;
        }

        const FD = new FormData();
        
        updateObject && FD.append('_id', updateObject._id ? updateObject._id : '');
        FD.append('name', name);
        FD.append('garnetID', gID);
        FD.append('categoryID', cID);
        FD.append('price', price.toString());
        FD.append('visible', visible ? 'true' : 'false');
        FD.append('showDesc', showDesc ? 'true' : 'false');
        FD.append('showIcon', showIcon ? 'true' : 'false');
        FD.append('kiloPrice', kiloPrice ? 'true' : 'false');
        FD.append('showPrice', showPrice ? 'true' : 'false');
        FD.append('showGarnet', showGarnet ? 'true' : 'false');
        FD.append('availability', availability ? 'true' : 'false');
        FD.append('showOnSpecial', showOnSpecial ? 'true' : 'false');
        FD.append('onlyOnSpecial', onlyOnSpecial ? 'true' : 'false');
        if (uploadImage) {FD.append('image', uploadImage)};

        if (desc) {FD.append('desc', desc)}

        var res: boolean | undefined;

        if (updateObject) {
            res = await updatePlateWithImage(token, FD);
        } else {
            res = await newPlate(token, FD);
        }

        if (res) {
            setName('');
            setPrice(0);
            setDesc('');
            setCID('');
            setGID('');
            setGarnetName('');
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            active && await refetchPlates();
            updateObject && setUpdateObject(null);
            PopUpInit({ setPopUp: setPopUp, type: 'success', text: updateObject ? 'Επιτυχής Ενημέρωση Πιάτου!' : 'Επιτυχής Καταχώρηση Πιάτου!' });
            return;
        } else {
            setError(true);
            PopUpInit({ setPopUp: setPopUp, type: 'error', text: updateObject ? 'Ανεπιτυχής Ενημέρωση Πιάτου!' : 'Ανεπιτυχής Καταχώρηση Πιάτου!' });
            return;
        }
    }

    // ? Handle Order Change
    const handleOrderSubmition = async (e: React.MouseEvent) => {
        if (!order || !plate) return;
        setOrder(false);
        setOrderLoading(true);
        scrollToTop();

        const orderFix: PlateFixOrder[] = [];

        for (let i = 0; i < plate.length; i++) {
            orderFix.push({
                // @ts-ignore
                _id: plate[i]._id,
                order: plate[i].order,
                categoryID: plate[i].category._id,
                name: plate[i].name,
            });
        }

        const res = await fixPlateOrder(token, orderFix);

        if (res) {
            await refetchPlates();
            setOrderLoading(false);
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτυχής Αλλαγή Σειράς!', type: "success" });
            return;
        } else {
            setOrder(true);
            setOrderLoading(false);
            PopUpInit({ setPopUp: setPopUp, text: 'Ανεπιτυχής Αλλαγή Σειράς!', type: 'success' });
            return;
        }
    }

    // ? Handle Drag Start
    const dragStart = (e: React.DragEvent, index: number) => {
        if (!order) return;
        todoItemDrag.current = index;
    }

    // ? Handle Drag Enter
    const dragEnter = (e: React.DragEvent, index: number) => {
        if (!order) return;
        todoItemDragOver.current = index;
    }

    // ? Handle Drag End Function
    const dragEnd = (e?: React.DragEvent) => {
        if (!order) return;
        if (!plate) return;
        const platesClone = [...plate];
        const temp = platesClone[todoItemDrag.current];
        platesClone[todoItemDrag.current] = platesClone[todoItemDragOver.current];
        platesClone[todoItemDragOver.current] = temp;
        setAllPlates(platesClone);
    }

    // ? Handle Order Behaviour For Mobile
    const handleOrderMobile = (pl: PlateComplex) => {
        if (window.innerWidth < 620 && order && plate) {
            if (!orderSet) {
                setOrderSet(pl);
            } else {
                let temp1 = pl;
                let tempValue = pl.order;
                let temp2 = orderSet;
                temp1.order = orderSet.order;
                temp2.order = tempValue;

                const final = [];

                for (let i = 0; i < plate.length; i++) {
                    if (plate[i].order === temp1.order) {
                        final.push(temp2);
                    } else if (plate[i].order === temp2.order) {
                        final.push(temp1);
                    } else {
                        final.push(plate[i]);
                    }
                }

                setOrderSet(undefined);
                setAllPlates(final);
            }
        }
    }

    // ? Refetch Function - Similar to useQuery refetch function.
    const refetchPlates = async () => {
        if (!active) return;

        const res = await getPlatesByCategoryStrickt(active._id);
        if (res) {
            setCurrentPlates(res);
            setAllPlates(res);
            plateArray.length = 0;
            plateArray.push({
                catID: active._id,
                plate: res,
            });
            return;
        } else {
            PopUpInit({ setPopUp: setPopUp, text: 'Σφάλμα Στην Επαναφόρτωση πιάτων!', type: 'error' });
            return;
        }
    }

    // ? Delete Plate
    const deletePlateFE = async (id: string | undefined) => {
        const ans = confirm("Ειστέ σίγουρος για την διαγραφή του " + updateObject?.name + ";");

        if (!ans) return;

        const res = await deletePlate(token, id ? id : '');

        if (res) {
            refetchPlates();
            setUpdateObject(null);
            PopUpInit({ setPopUp: setPopUp, text: 'Επιτυχής Διαγραφή!', type: 'success' });
            return;
        } else {
            PopUpInit({ setPopUp: setPopUp, text: 'Σφάλμα Στην Διαγραφή!', type: 'error' });
            return;
        }
    }

    return (
        <div className={style.plates}>
            <div className={style.platesView}>
                {(popUp && popUp.type === 'error') && <ErrorDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                {(popUp && popUp.type === 'success') && <SuccessDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                <div className={style.platesViewList}>
                    {isLoadingCategories &&
                        <div className={style.categoriesViewList_loading}>
                            <LoadingSpinner />
                            <p>Φόρτωση Κατηγοριών...</p>
                        </div>
                    }
                    {isErrorCategories &&
                        <div className={style.categoriesViewList_error}>
                            <BugSVG box={2.5} color={Colors.black} />
                            <p>Απροσδιόριστο Σφάλμα.</p>
                            <button type='button' role='button' onClick={() => refetchCategories()}>
                                Προσπαθήστε Ξανά
                            </button>
                        </div>
                    }
                    {(allCategories && !active) && allCategories.map((cat: Category, key: number) => {
                            return (
                                <div
                                    className={style.categoryView}
                                    key={key}
                                    // onClick={() => {setCatContent(cat); refetchPlates();}}
                                    onClick={() => {getPlates(cat);}}
                                >
                                    <div className={style.categoryView_left}>
                                        {cat.visible ?
                                            <EyeOpenSVG box={.9} color={Colors.black} />
                                        :
                                            <EyeCloseSVG box={.9} color={Colors.black} />
                                        }
                                        <p>{cat.name}</p>
                                    </div>
                                    <div className={style.categoryView_right}>
                                        <button className={style.categotyBtn_expand} role='button' title='Ενημέρωση Κατηγορίας' type='button' disabled>
                                            <ExpandSVG box={1.1} color={Colors.black} />
                                        </button>
                                    </div>
                                </div>
                            );
                    })}
                    {(loadingPlates && active) &&
                        <div className={style.categoriesViewList_loading}>
                            <LoadingSpinner />
                            <p>Φόρτωση Πιάτων...</p>
                        </div>
                    }
                    {(errorPlates && active) && 
                        <div className={style.categoriesViewList_error}>
                            <BugSVG box={2.5} color={Colors.black} />
                            <p>Απροσδιόριστο Σφάλμα.</p>
                            <button type='button' role='button' onClick={async () => await refetchPlates()}>
                                Προσπαθήστε Ξανά
                            </button>
                        </div>
                    }
                    {(plate) &&
                        <ul className={style.platesViewInner}>
                            <div className={style.platesViewInner_filters}>
                                <button className={style.platesViewInnerButton} role='button' type='button' onClick={() => {setActive(undefined); setCurrentPlates(undefined); setUpdateObject(null); setAllPlates(undefined);}}>
                                    <UpSVG box={1} color={Colors.black} />
                                    Πίσω
                                </button>
                                <SearchInput
                                    tabIndex={0}
                                    label='search'
                                    placeholder='Αναζήτηση...'
                                    value={search}
                                    setValue={setSearch}
                                />
                            </div>
                            <div className={style.platesViewInner_imagePosition}>
                                <button type='button' role='button' title='Η εικόνα θα εμφανίζεται αριστερά' onClick={() => setImagePosition(PlateImagePositionEnum.left)}>
                                    <BlockLeftSVG box={2} color={imagePosition === PlateImagePositionEnum.left ? Colors.green : Colors.grey} />
                                </button>
                                <button type='button' role='button' title='Η εικόνα θα εμφανίζεται στο παρασκήνιο' onClick={() => setImagePosition(PlateImagePositionEnum.bg)}>
                                    <BlockBGSVG box={2} color={imagePosition === PlateImagePositionEnum.bg ? Colors.green : Colors.grey} />
                                </button>
                                <button type='button' role='button' title='Η εικόνα θα εμφανίζεται δεξιά' onClick={() => setImagePosition(PlateImagePositionEnum.right)}>
                                    <BlockRightSVG box={2} color={imagePosition === PlateImagePositionEnum.right ? Colors.green : Colors.grey} />
                                </button>
                            </div>
                            {((plate) && plate.map((pl: PlateComplex, key: number) => {
                                if (hasImageOnly && !pl.image) return;
                                if (visibleOnly && !pl.visible) return;
                                if (nonVisibleOnly && pl.visible) return;
                                if (availableOnly && !pl.availability) return;
                                if (nonAvailableOnly && pl.availability) return;
                                if (dayPlateOnly && !pl.showOnSpecial) return;
                                if (exclDayPlateOnly && !pl.onlyOnSpecial) return;
                                if (search.length > 0 && 
                                    !pl.name.toLowerCase().includes(search.toLowerCase()) &&
                                    !pl.garnet.name.toLowerCase().includes(search.toLowerCase()) &&
                                    !pl.category.name.toLowerCase().includes(search.toLowerCase()) &&
                                    (pl.desc && !pl.desc.toLowerCase().includes(search.toLowerCase()))
                                ) return;
                                return (
                                    <li 
                                        key={key}
                                        className={style.plateViewOutside}
                                        draggable={order}
                                        onDragStart={(e: React.DragEvent) => dragStart(e, key)}
                                        onDragEnter={(e: React.DragEvent) => dragEnter(e, key)}
                                        onDragEnd={(e: React.DragEvent) => dragEnd(e)}
                                        onDragOver={(e: React.DragEvent) => e.preventDefault()}
                                        onClick={() => {order ? null : setUpdateObject(pl); handleOrderMobile(pl); order ? null : setSettings(false);}}
                                        style={{ opacity: orderSet?._id === pl._id ? .5 : 1 }}
                                    >
                                        <PlateClient
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
                                            imagePosition={imagePosition}
                                            object={pl}
                                            onClick={order ? () => {} : setUpdateObject}
                                            showOrder={order}
                                            order={pl.order}
                                            availabilityActions={AvailabilityOptionsEnum.nothing}
                                            animationDelay={key * 100}
                                        />
                                    </li>
                                );
                            }))}
                        </ul>
                    }
                </div>
                <div className={style.platesSettings}>
                    <h2>
                        {updateObject ?
                            'Ενημέρωση Πιάτων'
                        :
                            settings ?
                                'Ρυθμίσεις'
                            :
                                'Προσθήκη Πιατών'
                        }
                    </h2>
                    {settings ?
                        <div className={style.settings}>
                            <div className={style.platesSettingsInfo}>
                                <p>Σύνολο Πιάτων: <span>{stats && stats.all}</span></p>
                                <p>Διαθέσιμα: <span>{stats && stats.availability}</span></p>
                                <p>Εμφάνηση Στο Μενού <span>{stats && stats.visible}</span></p>
                                <p>Πιάτα Ημέρας <span>{stats && stats.showOnSpecial}</span></p>
                                <p>Μόνο Στα Πιάτα Ημέρας <span>{stats && stats.onlyOnSpecial}</span></p>
                                <p>Έχουν Εικόνα <span>{stats && stats.hasImage}</span></p>
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor="order">Προγραμματισμός Σειράς: </label>
                                <ToggleSwitch
                                    banner=''
                                    hasInfo={false}
                                    label='order'
                                    clicked={order}
                                    setClicked={setOrder}
                                />
                            </div>
                            <div className={style.resetOrderDiv}>
                                <p>Επαναφορά Σειράς:</p>
                                <button
                                    type='button'
                                    role='button'
                                    title='Επαναφορά Πιάτων'
                                    onClick={() => {
                                        plate && setAllPlates(currentPlates);
                                    }}
                                >
                                    <ResetSVG box={1.5} color={Colors.error} />
                                </button>
                            </div>
                            {(plate && !orderLoading) &&
                                <div className={style.submitOrderChange} style={{ padding: '0 .5rem', marginTop: '1rem', width: '100%' }}>
                                    <button
                                        type="button"
                                        role='button'
                                        title='Αλλαγή Σειράς'
                                        onClick={handleOrderSubmition}
                                        disabled={!order}
                                    >
                                        Αλλαγή Σειράς
                                    </button>
                                </div>
                            }
                            <div className={style.filters}>
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showOnlyVisibles">Δείτε Πιάτα Που Είναι Εμφανή: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showOnlyVisibles'
                                        clicked={visibleOnly}
                                        setClicked={setVisibleOnly}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showOnlyNonVisibles">Δείτε Πιάτα Που Είναι Μη Εμφανή: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showOnlyNonVisibles'
                                        clicked={nonVisibleOnly}
                                        setClicked={setNonVisibleOnly}
                                    />
                                </div>
                                <hr />
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showOnlyAvailables">Δείτε Πιάτα Που Είναι Διαθέσιμα: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showOnlyAvailables'
                                        clicked={availableOnly}
                                        setClicked={setAvailableOnly}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showOnlyNonAvailables">Δείτε Πιάτα Που Είναι Μη Διαθέσιμα: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showOnlyNonAvailables'
                                        clicked={nonAvailableOnly}
                                        setClicked={setNonAvailableOnly}
                                    />
                                </div>
                                <hr />
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showOnlyDayPlates">Δείτε Πιάτα Που Είναι Ημέρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showOnlyDayPlates'
                                        clicked={dayPlateOnly}
                                        setClicked={setDayPlateOnly}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showOnlyExclusivlyDayPlates">Δείτε Πιάτα Που Είναι Μόνο Ημέρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showOnlyExclusivlyDayPlates'
                                        clicked={exclDayPlateOnly}
                                        setClicked={setExclDayPlateOnly}
                                    />
                                </div>
                                <hr />
                                <div className={style.toggleDiv}>
                                    <label htmlFor="showPlatesWithImage">Δείτε Πιάτα Που Έχουν Εικόνα: </label>
                                    <ToggleSwitch
                                        banner=''
                                        hasInfo={false}
                                        label='showPlatesWithImage'
                                        clicked={hasImageOnly}
                                        setClicked={setHasImageOnly}
                                    />
                                </div>
                                <hr />
                                <button type='button' role='button' onClick={() => {setSettings(false); setOrder(false);}} className={style.backSettingsButton}>
                                    <UpSVG box={1} color={Colors.black} />
                                    Πίσω
                                </button>
                            </div>
                        </div>
                    :
                        <form onSubmit={handleSubmition} autoCapitalize='off' autoComplete='off' autoCorrect='off'>
                            <ImageInput
                                label='image_on_plate'
                                placeholder='Επιλογή Εικόνας'
                                size={1.3}
                                setUploadImage={setUploadImage}
                                setUploadImageShow={setUploadImageShow}
                                setUploadImageTooLarge={setUploadImageTooLarge}
                                noImage={noImage}
                                setNoImage={setNoImage}
                                uploadImage={uploadImage}
                                uploadImageShow={uploadImageShow}
                                uploadImageTooLarge={uploadImageTooLarge}
                            />
                            <TextInput
                                label='name'
                                placeholder='Όνομα Πιάτου...'
                                value={name}
                                setValue={setName}
                                tabIndex={1}
                                icon={<PlateSVG box={1.4} color={Colors.white} />}
                                emptyFields={emptyFields}
                                setEmptyFields={setEmptyFields}
                                error={error}
                                setError={setError}
                            />
                            <NumberInput
                                tabIndex={2}
                                label='price'
                                placeholder='Τιμή'
                                max={1000}
                                min={0.5}
                                size={1.3}
                                step={.5}
                                value={price}
                                setValue={setPrice}
                                emptyFields={emptyFields}
                                setEmptyFields={setEmptyFields}
                                error={error}
                                setError={setError}
                            />
                            {isLoadingCategories ?
                                <div className={style.loadingAnimationOnDropdownButton}>
                                    <div>
                                        <LoadingSpinner width={20}/>
                                    </div>
                                    <p>Φόρτωση...</p>
                                </div>
                            : 
                                <DropDownInput
                                    icon={<CategorySVG box={1.2} color={Colors.white} />}
                                    text={'Επιλογή Κατηγορίας'}
                                    content={categories}
                                    value={cID}
                                    setValue={setCID}
                                    takeForComp='_id'
                                    takeForDisplay='name'
                                />
                            }
                            {isLoadingGarnets ?
                                <div className={style.loadingAnimationOnDropdownButton}>
                                    <div>
                                        <LoadingSpinner width={20}/>
                                    </div>
                                    <p>Φόρτωση...</p>
                                </div>
                            :
                                <DropDownInput
                                    icon={<GarnetSVG box={1.2} color={Colors.white} />}
                                    text={'Επιλογή Γαρνιτούρας'}
                                    content={garnets}
                                    value={gID}
                                    setValue={setGID}
                                    takeForComp='_id'
                                    takeForDisplay='name'
                                    setValueName={setGarnetName}
                                />
                            }
                            <TextAreaInput
                                label='description'
                                placeholder='Περιγραφή πιάτου...'
                                value={desc}
                                setValue={setDesc}
                                tabIndex={3}
                                icon={<PlateSVG box={1.4} color={Colors.white} />}
                                emptyFields={emptyFields}
                                setEmptyFields={setEmptyFields}
                                error={error}
                                setError={setError}
                            />
                            <div className={style.toggleDiv}>
                                <label htmlFor='visible'>Εμφάνιση στο μενού: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={visible}
                                    setClicked={setVisible}
                                    hasInfo={false}
                                    label='visible'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='availability'>Διαθεσιμότητα: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={availability}
                                    setClicked={setAvailability}
                                    hasInfo={false}
                                    label='availability'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='show_image'>Προβολή εικόνας: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={showIcon}
                                    setClicked={setShowIcon}
                                    hasInfo={false}
                                    label='show_image'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='show_desc'>Προβολή περιγραφής: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={showDesc}
                                    setClicked={setShowDesc}
                                    hasInfo={false}
                                    label='show_desc'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='show_price'>Προβολή τιμής: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={showPrice}
                                    setClicked={setShowPrice}
                                    hasInfo={false}
                                    label='show_price'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='kilo_price'>Ζυγιζόμενο: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={kiloPrice}
                                    setClicked={setKiloPrice}
                                    hasInfo={false}
                                    label='kilo_price'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='show_garnet'>Προβολή γαρνιτούρας: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={showGarnet}
                                    setClicked={setShowGarnet}
                                    hasInfo={false}
                                    label='show_garnet'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='show_on_special'>Πιάτο ημέρας: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={showOnSpecial}
                                    setClicked={setShowOnSpecial}
                                    hasInfo={false}
                                    label='show_on_special'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.toggleDiv}>
                                <label htmlFor='show_only_on_special' title='Δεν θα εμφανίζεται στο μενού - μόνο στα πιάτα ημέρας'>Μόνο στα ημέρας: </label>
                                <ToggleSwitch
                                    banner=''
                                    clicked={onlyOnSpecial}
                                    setClicked={setOnlyOnSpecial}
                                    hasInfo={false}
                                    label='show_only_on_special'
                                    error={error}
                                    setError={setError}
                                />
                            </div>
                            <div className={style.submitButtonDiv}>
                                {!updateObject &&
                                    <button type='button' role='button' title='Ρυθμίσεις' onClick={() => setSettings(curr => !curr)}>
                                        <SettingsSVG box={2} color={Colors.black} />
                                    </button>
                                }
                                {updateObject &&
                                    <>
                                        <button type='button' role='button' title='Διαγραφή' onClick={() => deletePlateFE(updateObject._id)}>
                                            <BinSVG box={2} color={Colors.error} />
                                        </button>
                                        <button type="button" role='button' title='Ακύρωση' onClick={() => setUpdateObject(null)} style={{ marginLeft: '1rem'}}>
                                            <XCircleNoFillIcon box={2} color={Colors.error} />
                                        </button>
                                    </>
                                }
                                <SubmitButton text={updateObject ? 'Ενημέρωση' : 'Προσθήκη'} type={true} scroll={true} />
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
}

export default Plate;