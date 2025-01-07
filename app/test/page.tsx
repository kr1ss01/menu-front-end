"use client"

import * as React from 'react';
import style from '@/styles/pages/test/index.module.scss'
import Colors from '@/types/colors';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/helpers/loading';
import { getCategories } from '@/axios/categories';
import Category from '@/types/categories';
import { BugSVG, CategorySVG, ExpandSVG, EyeCloseSVG, EyeOpenSVG, GarnetSVG, PlateSVG } from '@/svg';
import TextInput from '@/helpers/inputs/text.input';
import NumberInput from '@/helpers/inputs/number.input';
import DropDownInput from '@/helpers/inputs/dropdown.input';
import Garnet from '@/types/garnets';
import { getGarnets } from '@/axios/garnets';
import TextAreaInput from '@/helpers/inputs/textarea.input';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import SubmitButton from '@/helpers/components/submit.button';

import { useAuthContext } from '../context/auth.contexts';

export default function Page() {
    const { token } = useAuthContext();

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

    // ? Image States
    const [uploadImage, setUploadImage] = React.useState<File>();
    const [uploadImageShow, setUploadImageShow] = React.useState<string>();

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

    return (
        <div className={style.plates}>
            <div className={style.platesView}>
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
                    {allCategories && allCategories.map((cat: Category, key: number) => {
                        return (
                            <div
                                className={style.categoryView}
                                key={key}
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
                </div>
                <div className={style.platesSettings}>
                    <h2>Προσθήκη Πιατών</h2>
                    <form>
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
                            <SubmitButton text='Προσθήκη' type={true} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}