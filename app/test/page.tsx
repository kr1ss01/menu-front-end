"use client"

import * as React from 'react';
import style from '@/styles/pages/test/index.module.scss'
import Colors from '@/types/colors';
import { skipToken, useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/helpers/loading';
import { getCategories } from '@/axios/categories';
import Category from '@/types/categories';
import { BugSVG, CategorySVG, ExpandSVG, EyeCloseSVG, EyeOpenSVG, GarnetSVG, PlateSVG, UpSVG } from '@/svg';
import TextInput from '@/helpers/inputs/text.input';
import NumberInput from '@/helpers/inputs/number.input';
import DropDownInput from '@/helpers/inputs/dropdown.input';
import Garnet from '@/types/garnets';
import { getGarnets } from '@/axios/garnets';
import TextAreaInput from '@/helpers/inputs/textarea.input';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import SubmitButton from '@/helpers/components/submit.button';

import { useAuthContext } from '../context/auth.contexts';
import { PlateComplex } from '@/types/plate';
import { getPlatesByCategoryStrickt } from '@/axios/complex';
import getQueryClient from '../utils/getQueryClient';
import { PlateFinal } from '@/helpers/plate';
import ImageInput from '@/helpers/inputs/image.input';
import { newPlate, updatePlateWithImage } from '@/axios/plates';
import ErrorDiv from '@/helpers/components/error.div';

export default function Page() {
    const { token } = useAuthContext();

    // ? Render Category Content
    const [catContent, setCatContent] = React.useState<Category>();

    const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, refetch: refetchCategories } = useQuery<Category[]>({
        queryKey: ['get-all-categories-for-plates-admin'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    const { data: garnets, isLoading: isLoadingGarnets, isError: isErrorGarnets } = useQuery<Garnet[]>({
        queryKey: ['get-all-garnets-for-plates-admin'],
        queryFn: async () => {
            return await getGarnets();
        }
    });

    const { data: plates, isLoading: isLoadingPlates, isError: isErrorPlates, refetch: refetchPlates, isFetching: isFetchingPlates } = useQuery<PlateComplex[]>({
        queryKey: ['get-all-plates-from-category-admin'],
        queryFn: catContent ? () => getPlatesByCategoryStrickt(catContent._id) : skipToken,
        
    })

    // ? API States
    const [allCategories, setAllCategories] = React.useState<Category[]>();

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

    // ? Error Handling State
    const [error, setError] = React.useState<boolean>(false);
    const [noImage, setNoImage] = React.useState<boolean>(false);
    const [descError, setDescError] = React.useState<boolean>(false);
    const [garnetError, setGarnetError] = React.useState<boolean>(false);
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [specialError, setSpecialError] = React.useState<boolean>(false);
    const [uploadImageTooLarge ,setUploadImageTooLarge] = React.useState<boolean>(false);

    // ? Pop Up For Addresing Issues
    const [popUp, setPopUp] = React.useState<string>('');

    // ? Image States
    const [uploadImage, setUploadImage] = React.useState<File>();
    const [uploadImageShow, setUploadImageShow] = React.useState<string>();

    // ? Update State
    const [updateObject, setUpdateObject] = React.useState<PlateComplex | null>(null);

    React.useEffect(() => {
        if (categories) {
            setAllCategories(categories);
        }
    }, [categories]);

    // ? Warn For Not Showing Price On Plate (Might be illegal)
    React.useEffect(() => {
        if (!showPrice) {
            const ans = confirm("Η απόκρυψη τιμής ίσως υπόκειτε σε νομικές παραβιάσεις!");
            if (!ans) setShowPrice(true);
        }
    }, [showPrice]);

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
            setPopUp('Κενά Πεδία!');
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
            return;
        }

        if ((showDesc && !desc) || (showDesc && desc.length === 0)) {
            setDescError(true);
            setPopUp('Σφάλμα Στην Περιγραφή!');
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
            return;
        }

        if (showIcon && !uploadImage) {
            setNoImage(true);
            setPopUp('Σφάλμα Στην Εικόνα!');
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
            return;
        }

        if ((showGarnet && !gID) || (showGarnet && gID.length === 0)) {
            setGarnetError(true);
            setPopUp('Σφάλμα Στην Γαρνιτούρα!');
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
            return;
        }

        if (onlyOnSpecial && !showOnSpecial) {
            setSpecialError(true);
            setPopUp('Μη Διαθέσιμο στα Πιάτα Ημέρας!');
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
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
            catContent && refetchPlates();
            updateObject ? setPopUp('Επιτυχής Ενημέρωση Πιάτου') : setPopUp('Επιτυχής Καταχόρηση Πιάτου!');
            updateObject && setUpdateObject(null);
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
            return;
        } else {
            setError(true);
            updateObject ? setPopUp('Ανεπιτυχής Ενημέρωση Πιάτου') : setPopUp('Ανεπιτυχής Καταχόρηση Πιάτου!');
            const int = window.setInterval(() => {
                setPopUp('');
                window.clearInterval(int);
            }, 5000);
            return;
        }
    }

    return (
        <div className={style.plates}>
            <div className={style.platesView}>
                {popUp && <ErrorDiv text={popUp} />}
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
                    {(allCategories && !catContent) && allCategories.map((cat: Category, key: number) => {
                            return (
                                <div
                                    className={style.categoryView}
                                    key={key}
                                    onClick={() => {setCatContent(cat); refetchPlates();}}
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
                            )
                        
                            
                        })}
                    {(isLoadingPlates && catContent) &&
                        <div className={style.categoriesViewList_loading}>
                            <LoadingSpinner />
                            <p>Φόρτωση Πιάτων...</p>
                        </div>
                    }
                    {(isErrorPlates && catContent) && 
                        <div className={style.categoriesViewList_error}>
                            <BugSVG box={2.5} color={Colors.black} />
                            <p>Απροσδιόριστο Σφάλμα.</p>
                            <button type='button' role='button' onClick={() => refetchPlates()}>
                                Προσπαθήστε Ξανά
                            </button>
                        </div>
                    }
                    {(isFetchingPlates && catContent && !isLoadingPlates && !isErrorPlates) &&
                        <div className={style.categoriesViewList_loading}>
                            <LoadingSpinner />
                            <p>Φόρτωση Πιάτων...</p>
                        </div>
                    }
                    {(catContent && plates && !isFetchingPlates) &&
                        <ul className={style.platesViewInner}>
                            <li className={style.platesViewInnerButton} role='button' onClick={() => {setCatContent(undefined); refetchPlates(); setUpdateObject(null);}}>
                                <UpSVG box={1} color={Colors.black} />
                                Πίσω
                            </li>
                            {((catContent && plates) && plates.map((pl: PlateComplex, key: number) => {
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
                                        showGarnet={pl.showGarnet}
                                        kiloPrice={pl.kiloPrice}
                                        onlyOnSpecial={pl.onlyOnSpecial}
                                        order={pl.order}
                                        showOnSpecial={pl.showOnSpecial}
                                        visible={pl.visible}
                                        imageMimeType={pl.imageMimeType}
                                        _id={pl._id}
                                        object={pl}
                                        onClick={setUpdateObject}
                                    />
                                );
                            }))}
                        </ul>
                    }
                </div>
                <div className={style.platesSettings}>
                    <h2>Προσθήκη Πιατών</h2>
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
                            <label htmlFor='visible'>Εμφάνηση στο μενού: </label>
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
                        <div style={{ padding: '0 .5rem', marginTop: '.5rem', width: '100%' }}>
                            <SubmitButton text={updateObject ? 'Ενημέρωση' : 'Προσθήκη'} type={true} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}