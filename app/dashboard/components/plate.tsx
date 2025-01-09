"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/plate.module.scss';
import * as PlateTypes from '@/types/plate';
import { useQuery } from '@tanstack/react-query';
import { deletePlate, fixPlateOrder, newPlate, updatePlateWithImage } from '@/axios/plates';
import LoadingSpinner from '@/helpers/loading';
import TextInput from '@/helpers/inputs/text.input';
import { BinSVG, CategorySVG, EyeCloseSVG, EyeOpenSVG, GarnetSVG, PlateSVG, ResetSVG, SaveSVG, XCircleFillIcon } from '@/svg';
import Colors from '@/types/colors';
import Category from '@/types/categories';
import { getCategories } from '@/axios/categories';
import Garnet from '@/types/garnets';
import { getGarnets } from '@/axios/garnets';
import NumberInput from '@/helpers/inputs/number.input';
import SubmitButton from '@/helpers/components/submit.button';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import DropDownInput from '@/helpers/inputs/dropdown.input';
import ImageInput from '@/helpers/inputs/image.input';
import TextAreaInput from '@/helpers/inputs/textarea.input';
import { PlatePreview, PlateViewDashboard } from '@/helpers/plate';
import { getPlatesByCategory } from '@/axios/complex';

const Plate = ({ token }: { token: string | undefined }) => {
    const { data: plates, isLoading, refetch } = useQuery<PlateTypes.PlateCategories[]>({
        queryKey: ['get-all-plates'],
        queryFn: async () => {
            return await getPlatesByCategory();
        }
    });

    React.useEffect(() => {
        if (plates) setAllPlates(plates.reverse());
    }, [plates]);

    // ? Basic States
    const [allPlates, setAllPlates] = React.useState<PlateTypes.PlateCategories[] | null>(null);
    const [objUpdate, setObjUpdate] = React.useState<PlateTypes.PlateCategories | null>(null);
    const [showPlates, setShowPlates] = React.useState<PlateTypes.PlateComplex[] | null>(null);
    const [addPlate, setAddPlate] = React.useState<boolean>(false);
    const [order, setOrder] = React.useState<boolean>(false);

    const [test, setTest] = React.useState<string>('');

    // ? Slider Refs
    const updatePlateRef = React.useRef<HTMLDivElement>(null);
    const addPlateRef = React.useRef<HTMLDivElement>(null);

    // ? Handle Open And Closing Animation For Add Category Menu (Modal)
    const handleOpenAndCloseAddMenu = (type: boolean) => {
        if (type) {
            if (addPlateRef && addPlateRef.current) addPlateRef.current.style.transform = 'translateY(0)';
            setAddPlate(true);
        } else {
            if (addPlateRef && addPlateRef.current) addPlateRef.current.style.transform = 'translateY(100%)';
            setAddPlate(false);
        }
    }

    // ? Handle Open And Closing Animation For Update Category Menu (Modal)
    const handleOpenAndCloseUpdateMenu = (type: boolean) => {
        if (type) {
            if (updatePlateRef && updatePlateRef.current) updatePlateRef.current.style.transform = 'translateY(0)';
        } else {
            if (updatePlateRef && updatePlateRef.current) updatePlateRef.current.style.transform = 'translateY(100%)';
            setObjUpdate(null);
        }
    }

    return (
        <>
            {showPlates && <ShowPlatesOnCategory plates={showPlates} setClose={setShowPlates} token={token} refetch={refetch} />}
            <div className={style.plates}>
                <HandleAddPlate
                    ref={addPlateRef}
                    close={handleOpenAndCloseAddMenu}
                    refetch={refetch}
                    token={token}
                />
                <h2>Τροποποίηση Πιάτου</h2>
                <ul className={style.platesCont}>
                    {
                        isLoading ?
                            <div className={style.loadingCont}>
                                <LoadingSpinner />
                                <span>Φόρτωση</span>
                            </div>
                        :
                            allPlates && allPlates.length < 1 ?
                                <li className={style.noPlates}>
                                    <p>Δεν έχετε ακόμη πιάτα.</p>
                                </li>
                            :
                                allPlates && allPlates.map((pl: PlateTypes.PlateCategories, key: number) => {
                                    return (
                                        <li
                                            key={key}
                                            className={style.categoriesBanner}
                                            style={{ color: !pl.category.visible ? Colors.error : 'initial' }}
                                            onClick={() => {
                                                setShowPlates(pl.plates);
                                            }}
                                        >
                                            {pl.category.visible ?
                                                <EyeOpenSVG box={1} color={Colors.black} />
                                            :
                                                <EyeCloseSVG box={1} color={Colors.error} />
                                            }
                                            {pl.category.name}
                                        </li>
                                        // <PlateViewDashboard
                                        //     availability={pl.availability}
                                        //     category={pl.category}
                                        //     desc={pl.desc}
                                        //     garnet={pl.garnet}
                                        //     image={pl.image}
                                        //     imageMimeType={pl.imageMimeType}
                                        //     kiloPrice={pl.kiloPrice}
                                        //     name={pl.name}
                                        //     onlyOnSpecial={pl.onlyOnSpecial}
                                        //     order={pl.order}
                                        //     price={pl.price}
                                        //     showDesc={pl.showDesc}
                                        //     showGarnet={pl.showGarnet}
                                        //     showIcon={pl.showIcon}
                                        //     showOnSpecial={pl.showOnSpecial}
                                        //     showPrice={pl.showPrice}
                                        //     visible={pl.visible}
                                        //     _id={pl._id}
                                        //     key={key}
                                        // />
                                    )
                                })
                    }
                </ul>
                <button type='button' role='button' className={style.addBtn} onClick={() => handleOpenAndCloseAddMenu(true)}>
                    Προσθήκη Πιάτου
                </button>
            </div>
        </>
    )
}

const HandleAddPlate = React.forwardRef((
    {
        close,
        refetch,
        token,
    }:
    {
        close: (type: boolean) => void,
        refetch: () => void,
        token: string | undefined,
    },
    ref: React.ForwardedRef<HTMLDivElement>
) => {
    const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ['get-all-categories'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    const { data: garnets, isLoading: isLoadingGarnets } = useQuery<Garnet[]>({
        queryKey: ['get-all-garnets'],
        queryFn: async () => {
            return await getGarnets();
        }
    });

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

    // ? Image States
    const [uploadImage, setUploadImage] = React.useState<File>();
    const [uploadImageShow, setUploadImageShow] = React.useState<string>();

    // ? Warn For Not Showing Price On Plate (Might be illegal)
    React.useEffect(() => {
        if (!showPrice) {
            alert("Η απόκρυψη τιμής ίσως έχει σοβαρές συνέπειες!");
        }
    }, [showPrice]);

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
            return;
        }

        if ((showDesc && !desc) || (showDesc && desc.length === 0)) {
            setDescError(true);
            return;
        }

        if (showIcon && !uploadImage) {
            setNoImage(true);
            return;
        }

        if ((showGarnet && !gID) || (showGarnet && gID.length === 0)) {
            setGarnetError(true);
            return;
        }

        if (onlyOnSpecial && !showOnSpecial) {
            setSpecialError(true);
            return;
        }

        const FD = new FormData();

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

        const res = await newPlate(token, FD);

        if (res) {
            setName('');
            setPrice(0);
            setDesc('');
            setCID('');
            setGID('');
            setGarnetName('');
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            refetch();
            close(false);
        } else {
            setError(true);
            return;
        }
    };

    return (
        <div className={style.addPlateDiv} ref={ref}>
            <form autoComplete='off' autoCorrect='off' autoCapitalize='off' onSubmit={handleSubmition}>
                <PlatePreview
                    image={uploadImageShow}
                    desc={desc}
                    availability={availability}
                    kiloPrice={kiloPrice}
                    name={name}
                    price={price}
                    showDesc={showDesc}
                    showGarnet={showGarnet}
                    showIcon={showIcon}
                    showPrice={showPrice}
                    garnetName={garnetName}
                />
                <div className={style.errorDiv}>
                    {emptyFields && <p className={style.error}>Κενά Πεδία!</p>}
                    {error && <p className={style.error}>Απροσδιόριστο Σφάλμα!</p>}
                    {noImage && <p className={style.error}>Ορίστε Εικόνα!</p>}
                    {descError && <p className={style.error}>Δεν Υπάρχει Περιγραφή!</p>}
                    {garnetError && <p className={style.error}>Δεν Υπάρχει Γαρνιτούρα!</p>}
                    {specialError && <p className={style.error}>Το Πιάτο Δεν Ανήκει Στα Πιάτα Ημέρας!</p>}
                    {uploadImageTooLarge && <p className={style.error}>Μεγάλο Αρχείο Εικόνας!</p>}
                </div>
                <ImageInput
                    label='image_on_plate'
                    placeholder='Επιλογή εικόνας...'
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
                <div style={{ padding: '0 3rem', marginTop: '.5rem', width: '100%' }}>
                    <SubmitButton text='Προσθήκη' type={true} />
                </div>
            </form>
            <div className={style.closeDiv}>
                <button role='button' type='button' onClick={() => close(false)} className={style.closeButton}>
                    Κλείσιμο
                </button>
            </div>
        </div>
    )
});

const ShowPlatesOnCategory = ({
    plates,
    setClose,
    token,
    refetch,
}: {
    plates: PlateTypes.PlateComplex[],
    setClose: React.Dispatch<React.SetStateAction<PlateTypes.PlateComplex[] | null>>,
    token: string | undefined,
    refetch: () => void,
}) => {
    const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ['get-all-categories-plate'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    const { data: garnets, isLoading: isLoadingGarnets } = useQuery<Garnet[]>({
        queryKey: ['get-all-garnets-plate'],
        queryFn: async () => {
            return await getGarnets();
        }
    });

    // ? Update Object State
    const [updateObj, setUpdateObj] = React.useState<PlateTypes.PlateComplex | null>(null);

    // ? Plates Clone State
    const [platesState, setPlatesState] = React.useState<PlateTypes.PlateComplex[]>(plates);

    //  ? Fill States For Update Object
    const [id, setID] = React.useState<string>('');
    const [gID, setGID] = React.useState<string>('');
    const [cID, setCID] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [desc, setDesc] = React.useState<string>('');
    const [price, setPrice] = React.useState<number>(0);
    const [visible, setVisible] = React.useState<boolean>(false);
    const [showIcon, setShowIcon] = React.useState<boolean>(false);
    const [showDesc, setShowDesc] = React.useState<boolean>(false);
    const [showPrice, setShowPrice] = React.useState<boolean>(false);
    const [kiloPrice, setKiloPrice] = React.useState<boolean>(false);
    const [showGarnet, setShowGarnet] = React.useState<boolean>(false);
    const [availability, setAvailability] = React.useState<boolean>(false);
    const [showOnSpecial, setShowOnSpecial] = React.useState<boolean>(false);
    const [onlyOnSpecial, setOnlyOnSpecial] = React.useState<boolean>(false);

    // ? Update Image States
    const [uploadImage, setUploadImage] = React.useState<File>();
    const [uploadImageShow, setUploadImageShow] = React.useState<Buffer | string>(); // Fuck my types...

    // ? Fuck Me State AGAIN
    const [garnetName, setGarnetName] = React.useState<string>('');

    // ? Order State
    const [order, setOrder] = React.useState<boolean>(false);

    // ? Error Handling State
    const [error, setError] = React.useState<boolean>(false);
    const [noImage, setNoImage] = React.useState<boolean>(false);
    const [descError, setDescError] = React.useState<boolean>(false);
    const [garnetError, setGarnetError] = React.useState<boolean>(false);
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [specialError, setSpecialError] = React.useState<boolean>(false);
    const [uploadImageTooLarge ,setUploadImageTooLarge] = React.useState<boolean>(false);

    // ? Drag N Drop Refs
    let todoItemDragOver = React.useRef<number>(0);
    let todoItemDrag = React.useRef<number>(0);

    React.useEffect(() => {
        if (updateObj) {
            setOrder(false);
            // @ts-ignore
            setID(updateObj._id);
            setGID(updateObj.garnet._id);
            setCID(updateObj.category._id);
            setName(updateObj.name);
            setDesc(updateObj.desc ? updateObj.desc : '');
            setPrice(updateObj.price);
            setVisible(updateObj.visible);
            setShowIcon(updateObj.showIcon);
            setShowDesc(updateObj.showDesc);
            setShowPrice(updateObj.showPrice);
            setKiloPrice(updateObj.kiloPrice);
            setShowGarnet(updateObj.showGarnet);
            setAvailability(updateObj.availability);
            setShowOnSpecial(updateObj.showOnSpecial);
            setOnlyOnSpecial(updateObj.onlyOnSpecial);
            setUploadImageShow(updateObj.image);
        } else {
            setID('');
            setGID('');
            setCID('');
            setName('');
            setDesc('');
            setPrice(0);
            setVisible(false);
            setShowIcon(false);
            setShowDesc(false);
            setShowPrice(false);
            setKiloPrice(false);
            setShowGarnet(false);
            setAvailability(false);
            setShowOnSpecial(false);
            setOnlyOnSpecial(false);
            setUploadImageShow(undefined);
        }
    }, [updateObj]);

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
            return;
        }

        if ((showDesc && !desc) || (showDesc && desc.length === 0)) {
            setDescError(true);
            return;
        }

        // if (showIcon && !uploadImage) {
        //     setNoImage(true);
        //     return;
        // }

        if ((showGarnet && !gID) || (showGarnet && gID.length === 0)) {
            setGarnetError(true);
            return;
        }

        if (onlyOnSpecial && !showOnSpecial) {
            setSpecialError(true);
            return;
        }

        const FD = new FormData();

        FD.append('_id', id);
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

        const res: boolean = await updatePlateWithImage(token, FD);

        if (res) {
            setName('');
            setPrice(0);
            setDesc('');
            setCID('');
            setGID('');
            setGarnetName('');
            setUploadImage(undefined);
            setUploadImageShow(undefined);
            refetch();
            setClose(null);
        } else {
            setError(true);
            return;
        }
    }

    const handleDeletion = async () => {
        const ans = confirm("Είστε σίγουρος πως θέλετε να διαγράψετε το πίατο \"" + name + "\"");
        if (!ans) return true;

        const res = await deletePlate(token, id);

        if (res) refetch();
        if (!res) return false;
    }

    const dragStart = (e: React.DragEvent, index: number) => {
        if (!order) return;
        todoItemDrag.current = index;
    }

    const dragEnd = (e: React.DragEvent) => {
        if (!order) return;
        if (!plates) return;
        const platesClone = [...platesState];
        const temp = platesClone[todoItemDrag.current];
        platesClone[todoItemDrag.current] = platesClone[todoItemDragOver.current];
        platesClone[todoItemDragOver.current] = temp;
        setPlatesState(platesClone);
    }

    const dragEnter = (e: React.DragEvent, index: number) => {
        if (!order) return;
        todoItemDragOver.current = index;
    }

    const handleOrderSubmition = async () => {
        if (!order || !platesState) return;
        setOrder(false);

        const orderFix: PlateTypes.PlateFixOrder[] = []

        for (let i = 0; i < platesState.length; i++) {
            orderFix.push({
                // @ts-ignore
                _id: platesState[i]._id,
                order: platesState[i].order,
                categoryID: platesState[i].category._id,
                name: platesState[i].name,
            });
        }

        const res = await fixPlateOrder(token, orderFix.reverse());

        if (res) {
            refetch();
            return;
        } else {
            setOrder(true);
            return;
        }
    }

    return (
        <div className={style.showPlates}>
            <div className={style.showPlatesInner}>
                <div className={style.showPlatesInnerDisplay}>
                    <div className={style.showPlatesInnerDisplayControlls}>
                        <button type="button" role='button' title='Ακύρωση' onClick={() => setClose(null)} className={style.cancelButton}>
                            <XCircleFillIcon box={1.8} color={Colors.black} />
                        </button>
                        {/* <h2>Πιάτα στην κατηγορία {plates[0].category.name}</h2> */}
                    </div>
                    <ul className={style.showPlatesInnerDisplayItems} style={{ listStyle: 'none' }}>
                        {platesState.map((pl: PlateTypes.PlateComplex, key: number) => {
                            return (
                                <li
                                    style={{ width: '100%' }}
                                    key={key}
                                    draggable={order}
                                    onDragStart={(e: React.DragEvent) => dragStart(e, key)}
                                    onDragEnter={(e: React.DragEvent) => dragEnter(e, key)}
                                    onDragEnd={(e: React.DragEvent) => dragEnd(e)}
                                    onDragOver={(e: React.DragEvent) => e.preventDefault()}
                                >
                                    <PlateViewDashboard 
                                        availability={pl.availability}
                                        category={pl.category}
                                        desc={pl.desc}
                                        garnet={pl.garnet}
                                        image={pl.image}
                                        imageMimeType={pl.imageMimeType}
                                        kiloPrice={pl.kiloPrice}
                                        name={pl.name}
                                        onlyOnSpecial={pl.onlyOnSpecial}
                                        order={pl.order}
                                        price={pl.price}
                                        showDesc={pl.showDesc}
                                        showGarnet={pl.showGarnet}
                                        showIcon={pl.showIcon}
                                        showOnSpecial={pl.showOnSpecial}
                                        showPrice={pl.showPrice}
                                        visible={pl.visible}
                                        _id={pl._id}
                                        object={pl}
                                        onClick={setUpdateObj}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {updateObj ?
                    isLoadingCategories || isLoadingGarnets ?
                        <div className={style.updatePlatesInnerLoader}>
                            <div>
                                <LoadingSpinner width={50} />
                            </div>
                            <p>Φόρτωση</p>
                        </div>
                    :
                        <form className={style.updatePlatesInner} autoComplete='off' autoCorrect='off' autoCapitalize='off' onSubmit={handleSubmition}>
                                <ImageInput
                                    label='image_on_plate'
                                    placeholder='Επιλογή εικόνας...'
                                    size={1.3}
                                    setUploadImage={setUploadImage}
                                    //@ts-ignore
                                    setUploadImageShow={setUploadImageShow}
                                    setUploadImageTooLarge={setUploadImageTooLarge}
                                    noImage={noImage}
                                    setNoImage={setNoImage}
                                    uploadImage={uploadImage}
                                    //@ts-ignore
                                    uploadImageShow={uploadImageShow}
                                    uploadImageTooLarge={uploadImageTooLarge}
                                />
                                <TextInput
                                    label='name_update'
                                    placeholder='Όνομα Πιάτου'
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
                                    label='price_update'
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
                                <DropDownInput
                                    icon={<CategorySVG box={1.2} color={Colors.white} />}
                                    text={'Επιλογή Κατηγορίας'}
                                    content={categories}
                                    value={cID}
                                    setValue={setCID}
                                    takeForComp='_id'
                                    takeForDisplay='name'
                                />
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
                                <TextAreaInput
                                    label='description_update'
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
                                    <label htmlFor='visible_update'>Εμφάνηση στο μενού: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={visible}
                                        setClicked={setVisible}
                                        hasInfo={false}
                                        label='visible_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='availability_update'>Διαθεσιμότητα: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={availability}
                                        setClicked={setAvailability}
                                        hasInfo={false}
                                        label='availability_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='show_image_update'>Προβολή εικόνας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={showIcon}
                                        setClicked={setShowIcon}
                                        hasInfo={false}
                                        label='show_image_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='show_desc_update'>Προβολή περιγραφής: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={showDesc}
                                        setClicked={setShowDesc}
                                        hasInfo={false}
                                        label='show_desc_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='show_price_update'>Προβολή τιμής: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={showPrice}
                                        setClicked={setShowPrice}
                                        hasInfo={false}
                                        label='show_price_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='kilo_price_update'>Ζυγιζόμενο: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={kiloPrice}
                                        setClicked={setKiloPrice}
                                        hasInfo={false}
                                        label='kilo_price_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='show_garnet_update'>Προβολή γαρνιτούρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={showGarnet}
                                        setClicked={setShowGarnet}
                                        hasInfo={false}
                                        label='show_garnet_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='show_on_special_update'>Πιάτο ημέρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={showOnSpecial}
                                        setClicked={setShowOnSpecial}
                                        hasInfo={false}
                                        label='show_on_special_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.toggleDiv}>
                                    <label htmlFor='show_only_on_special_update' title='Δεν θα εμφανίζεται στο μενού - μόνο στα πιάτα ημέρας'>Μόνο στα ημέρας: </label>
                                    <ToggleSwitch
                                        banner=''
                                        clicked={onlyOnSpecial}
                                        setClicked={setOnlyOnSpecial}
                                        hasInfo={false}
                                        label='show_only_on_special_update'
                                        error={error}
                                        setError={setError}
                                    />
                                </div>
                                <div className={style.objUpdateButtons}>
                                    <button type='submit' role='button' title='Αποθήκευση Αλλαγών' className={style.submitButton}>Αποθήκευση</button>
                                    {/* <SubmitButton text='Αποθήκευση' type={false} /> */}
                                    <button type='button' role='button' title='Διαγραφή Πιάτου' className={style.actionButton} onClick={() => handleDeletion()}>
                                        <BinSVG box={1.5} color={Colors.error} />
                                        </button>
                                    <button type='button' role='button' title='Ακύρωση' className={style.actionButton} onClick={() => setUpdateObj(null)}>
                                        <XCircleFillIcon box={1.5} color={Colors.black} />
                                        </button>
                                </div>
                        </form>
                :
                    <div className={style.updatePlatesInnerNoContent}>
                        <p id={style.choosePlate}>Επιλέξτε ένα πίατο για να το επεξεργαστίται.</p>
                        <span id={style.choosePlateSub}>Μπορείτε να κάνετε κλίκ σε οποιοδήποτε πιάτο θέλτε.</span>
                        <div role='presentation' className={style.hrDiv}></div>
                        <div className={style.orderLayout}>
                            <p>Αλλαγή σειράς των πιάτων στην εμφανίση στο μενού.</p>
                            <ToggleSwitch
                                banner=''
                                clicked={order}
                                setClicked={setOrder}
                                hasInfo={false}
                                label='fix_order_plates'
                            />
                        </div>
                        <div className={style.orderControlls}>
                            <button type="button" role='button' title='Επαναφορά' onClick={() => setPlatesState(plates)} disabled={!order}>
                                <ResetSVG box={2} color={Colors.black} />
                            </button>
                            <button type='button' role='button' title='Αποθήκευση' onClick={handleOrderSubmition} disabled={!order}><SaveSVG box={2} color={Colors.black} /></button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Plate;