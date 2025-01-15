"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/categories.module.scss';
import TextInput from '@/helpers/inputs/text.input';
import { BinSVG, BugSVG, CategorySVG, EditSVG, EyeCloseSVG, EyeOpenSVG, ResetSVG, WarningSVG, XCircleNoFillIcon } from '@/svg';
import Colors from '@/types/colors';
import ToggleSwitch from '@/helpers/inputs/toggle.input';
import SubmitButton from '@/helpers/components/submit.button';
import { deleteCategory, getCategories, getStatsCategories, newCategory, orderFixOnCategory, updateCateogry } from '@/axios/categories';
import { useQuery } from '@tanstack/react-query';
import Category, { CategoryStats } from '@/types/categories';
import LoadingSpinner from '@/helpers/loading';
import ErrorDiv, { SetStateTypeObject, SuccessDiv } from '@/helpers/components/error.div';

const Categories = ({ token }: { token: string | undefined }) => {
    const { data: categories, isLoading, isError, refetch } = useQuery<Category[]>({
        queryKey: ['get-all-categories-admin'],
        queryFn: async () => {
            return (await getCategories()).reverse();
        }
    });

    const { data: stats } = useQuery<CategoryStats>({
        queryKey: ['get-categories-stats'],
        queryFn: async () => {
            return await getStatsCategories();
        },
    });

    // ? Categories State
    const [allCategories, setAllCategories] = React.useState<Category[]>();

    // ? Basic Page State
    const [name, setName] = React.useState<string>('');
    const [visible, setVisible] = React.useState<boolean>(true);
    const [order, setOrder] = React.useState<boolean>(false);
    const [onlyVisible, setOnlyVisble] = React.useState<boolean>(false);
    const [onlyNonVisible, setOnlyNonVisible] = React.useState<boolean>(false);

    // ? Error Handling State
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);

    // ? Pop Up For Addresing Issues
    const [popUp, setPopUp] = React.useState<SetStateTypeObject>();

    // ? Update States
    const [updateObj, setUpdateObject] = React.useState<Category>();
    const [updateName, setUpdateName] = React.useState<string>('');
    const [updateVisible, setUpdateVisible] = React.useState<boolean>(false);

    // ? Order State For Error Handling
    const [loadingCategories, setLoadingCategories] = React.useState<boolean>(false);

    // ? Drag N Drop State Mobile
    const [orderSet, setOrderSet] = React.useState<Category>();

    // ? Drag N Drop Refs
    let todoItemDragOver = React.useRef<number>(0);
    let todoItemDrag = React.useRef<number>(0);

    React.useEffect(() => {
        if (categories) {
            setAllCategories(categories);
        }
    }, [categories]);

    React.useEffect(() => {
        if (!order) {
            categories && setAllCategories(categories);
        }
    }, [order]);

    React.useEffect(() => {
        if (updateObj) {
            setUpdateName(updateObj.name);
            setUpdateVisible(updateObj.visible);
            setEmptyFields(false);
            setError(false);
        } else {
            setEmptyFields(false);
            setError(false);
            setUpdateName('');
            setUpdateVisible(false);
        }
    }, [updateObj])

    React.useEffect(() => {
        if (onlyNonVisible && onlyVisible) {
            setOnlyNonVisible(false);
            setOnlyVisble(true);
        }
    }, [onlyVisible]);

    React.useEffect(() => {
        if (onlyNonVisible && onlyVisible) {
            setOnlyVisble(false);
            setOnlyNonVisible(true);
        }
    }, [onlyNonVisible]);

    const handleDeletion = async (obj: Category) => {
        const ans = confirm("Είστε σίγουρος πως θέλετε να διαγράψετε την κατηγορία \"" + obj.name + "\"");
        if (!ans) return;

        const res = await deleteCategory(token, obj._id);

        if (res) {
            refetch();
            setPopUp({ text: 'Επιτυχής Διαγραφή!', type: "success" });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        } else {
            setPopUp({ text: 'Ανεπυτιχής Διαγραφή!', type: "error" });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        }
    }

    const handleSubmitionCreation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);

        if (name.length === 0) {
            setEmptyFields(true);
            setPopUp({ text: 'Κενά Πεδία!', type: 'error' })
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        }

        if (!visible) {
            const c = confirm('Η κατηγορία δεν θα είναι εμφανής! Θέλετε να συνεχίσετε;');
            if (!c) return;
        }

        const res = await newCategory({ name: name, visible: `${visible}` }, token);

        if (res) {
            setName('');
            setVisible(false);
            setEmptyFields(false);
            setError(false);
            refetch();
            setPopUp({ text: 'Επιτυχής Προσθήκη!', type: 'success' });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        } else {
            setError(true);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error' });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        }
    }

    const handleSubmitionUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!updateObj) return;

        setEmptyFields(false);
        setError(false);

        if (updateName.length === 0) {
            setEmptyFields(true);
            setPopUp({ text: 'Κενά Πεδία!', type: 'error' })
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        }

        if (!updateVisible) {
            const c = confirm('Η κατηγορία δεν θα είναι εμφανής! Θέλετε να συνεχίσετε;');
            if (!c) return;
        }

        const res = await updateCateogry(token, {
            _id: updateObj._id,
            name: updateName,
            visible: updateVisible,
        });

        if (res) {
            setUpdateName('');
            setUpdateVisible(false);
            setUpdateObject(undefined);
            setEmptyFields(false);
            setError(false);
            refetch();
            setPopUp({ text: 'Επιτυχής Ενημέρωση!', type: 'success' });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        } else {
            setError(true);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error' });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
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
        if (!allCategories) return;
        const categoriesClone = [...allCategories];
        const temp = categoriesClone[todoItemDrag.current];
        categoriesClone[todoItemDrag.current] = categoriesClone[todoItemDragOver.current];
        categoriesClone[todoItemDragOver.current] = temp;
        setAllCategories(categoriesClone);
    }

    // ? Handle Order Submition
    const handleOrderSumbition = async (e: React.MouseEvent) => {
        if (!order || !allCategories) return;
        setOrder(false);
        setLoadingCategories(true);

        const res = await orderFixOnCategory(token, allCategories.filter(i => ({ _id: i._id, order: i.order })));

        if (res) {
            setLoadingCategories(false);
            refetch();
            setPopUp({ text: 'Επιτυχής Αλλαγή Σειράς!', type: 'success' });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        } else {
            setOrder(true);
            setLoadingCategories(false);
            setPopUp({ text: 'Ανεπιτυχής Αλλαγή Σειράς!', type: 'error' });
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            return;
        }
    }

    const handleOrderMobile = (cat: Category) => {
        if (window.innerWidth < 620 && order && allCategories) {
            if (!orderSet) {
                setOrderSet(cat);
            } else {
                // sure there is another way...
                let temp1 = cat;
                let tempValue = cat.order;
                let temp2 = orderSet;
                temp1.order = orderSet.order;
                temp2.order = tempValue;

                const final = [];

                for (let i = 0; i < allCategories.length; i++) {
                    if (allCategories[i].order === temp1.order) {
                        final.push(temp2);
                    } else if (allCategories[i].order === temp2.order) {
                        final.push(temp1);
                    }else {
                        final.push(allCategories[i]);
                    }
                }

                setOrderSet(undefined);
                setAllCategories(final);
            }
        }
    }
    
    return (
        <div className={style.categories}>
            <div className={style.categoriesView}>
                {(popUp && popUp.type === 'error') && <ErrorDiv text={popUp.text} />}
                {(popUp && popUp.type === 'success') && <SuccessDiv text={popUp.text} />}
                <div className={style.categoriesViewList}>
                    {isLoading &&
                        <div className={style.categoriesViewList_loading}>
                            <LoadingSpinner />
                            <p>Φόρτωση Κατηγοριών...</p>
                        </div>
                    }
                    {isError &&
                        <div className={style.categoriesViewList_error}>
                            <BugSVG box={2.5} color={Colors.black} />
                            <p>Απροσδιόριστο Σφάλμα.</p>
                            <button type='button' role='button' onClick={() => refetch()}>
                                Προσπαθήστε Ξανά
                            </button>
                        </div>
                    }
                    {allCategories && allCategories.map((cat: Category, key: number) => {
                        if ((onlyVisible && cat.visible) || (onlyNonVisible && !cat.visible) || (!onlyNonVisible && !onlyVisible)) {
                            return (
                                <div 
                                    className={style.categoryView}
                                    key={key}
                                    draggable={order}
                                    onDragStart={(e: React.DragEvent) => dragStart(e, key)}
                                    onDragEnter={(e: React.DragEvent) => dragEnter(e, key)}
                                    onDragEnd={(e: React.DragEvent) => dragEnd(e)}
                                    onDragOver={(e: React.DragEvent) => e.preventDefault()}
                                    onClick={() => handleOrderMobile(cat)}
                                    style={{ opacity: orderSet?._id === cat._id ? .5 : 1 }}
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
                                        <button className={style.categotyBtn_edit} role='button' title='Ενημέρωση Κατηγορίας' type='button' onClick={() => {!order && setUpdateObject(cat)}}>
                                            <EditSVG box={1.1} color={Colors.black} />
                                        </button>
                                        <button className={style.categotyBtn_remove} role='button' title='Διαγραφή Κατηγορίας' type='button' onClick={() => {!order && handleDeletion(cat)}}>
                                            <BinSVG box={1.1} color={Colors.black} />
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
                <div className={style.categoriesSettings}>
                    <h2>Ρυθμίσεις Κατηγοριών</h2>
                    <form onSubmit={updateObj ? handleSubmitionUpdate : handleSubmitionCreation}>
                        <TextInput
                            label='name'
                            placeholder='Όνομα Κατηγορίας'
                            value={updateObj ? updateName : name}
                            setValue={updateObj ? setUpdateName : setName}
                            tabIndex={1}
                            icon={<CategorySVG box={1.4} color={Colors.white} />}

                        />
                        <div className={style.toggleDiv}>
                            <label htmlFor="visible">Εμφάνηση στο μενού: </label>
                            <ToggleSwitch 
                                banner=''
                                hasInfo={false}
                                label='visible'
                                clicked={updateObj ? updateVisible : visible}
                                setClicked={updateObj ? setUpdateVisible : setVisible}
                            />
                        </div>
                        <div style={{ padding: '0 .5rem', marginTop: '1rem', width: '100%' }} className={style.submitButtonDiv}>
                            {updateObj &&
                                <button type='button' role='button' title='Ακύρωση' onClick={() => setUpdateObject(undefined)}>
                                    <XCircleNoFillIcon box={2} color={Colors.black} />
                                </button>
                            }
                            <SubmitButton text={updateObj ? 'Ενημέρωση' : 'Προσθήκη'} type={true} />
                        </div>
                    </form>
                    <div className={style.categoriesSettingsInfo}>
                        <p>Σύνολο Κατηγορίων: <span>{stats && stats.sum}</span></p>
                        <p>Σύνολο Εμφανών Κατηγορίων: <span>{stats && stats.visible}</span></p>
                        <p>Σύνολο Κρυφών Κατηγορίων: <span>{stats && stats.notVisible}</span></p>
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
                            title='Επαναφορά Κατηγοριών'
                            onClick={() => {
                                categories && setAllCategories(categories);
                            }}
                        >
                            <ResetSVG box={1.5} color={Colors.error} />
                        </button>
                    </div>
                    <div className={style.submitOrderChange} style={{ padding: '0 .5rem', marginTop: '1rem', width: '100%' }}>
                        <button
                            type="button"
                            role='button'
                            title='Αλλαγή Σειράς'
                            onClick={handleOrderSumbition}
                            disabled={!order}
                        >
                            Αλλαγή Σειράς
                        </button>
                    </div>
                    <div className={style.filters}>
                        <div className={style.toggleDiv}>
                            <label htmlFor="showVisible">Δείτε Κατηγορίες Που Είναι Εμφανής: </label>
                            <ToggleSwitch
                                banner=''
                                hasInfo={false}
                                label='showVisible'
                                clicked={onlyVisible}
                                setClicked={setOnlyVisble}
                            />
                        </div>
                        <div className={style.toggleDiv}>
                            <label htmlFor="showNonVisible">Δείτε Κατηγορίες Που Είναι Μη Εμφανής: </label>
                            <ToggleSwitch
                                banner=''
                                hasInfo={false}
                                label='showNonVisible'
                                clicked={onlyNonVisible}
                                setClicked={setOnlyNonVisible}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories;