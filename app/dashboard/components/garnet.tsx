"use client"

import * as React from 'react';
import style from '@/styles/pages/dashboard/components/garnets.module.scss';
import Garnet from '@/types/garnets';
import { useQuery } from '@tanstack/react-query';
import { getGarnets, newGarnet, updateGarnet } from '@/axios/garnets';
import TextInput from '@/helpers/inputs/text.input';
import Colors from '@/types/colors';
import { BinSVG, BugSVG, EditSVG, GarnetSVG, WarningSVG, XCircleNoFillIcon } from '@/svg';
import SubmitButton from '@/helpers/components/submit.button';
import LoadingSpinner from '@/helpers/loading';
import ErrorDiv, { SetStateTypeObject, SuccessDiv } from '@/helpers/components/error.div';
import { deleteGarnet } from '@/axios/complex';
import DeleteInterface from '@/types/delete';
import SearchInput from '@/helpers/inputs/search.input';

const Garnets = ({ token }: { token: string | undefined }) => {
    const { data: garnets, isLoading, isError, refetch } = useQuery<Garnet[]>({
        queryKey: ['get-all-garnets-admin'],
        queryFn: async () => {
            return (await getGarnets()).reverse();
        }
    });

    // ? Categories State
    const [allGarnets, setAllGarnets] = React.useState<Garnet[]>();

    // ? Basic Page State
    const [name, setName] = React.useState<string>('');

    // ? Error Handling State
    const [emptyFields, setEmptyFields] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);

    // ? Pop Up For Addresing Issues
    const [popUp, setPopUp] = React.useState<SetStateTypeObject>();

    // ? Update States
    const [updateObj, setUpdateObject] = React.useState<Garnet>();
    const [updateName, setUpdateName] = React.useState<string>('');

    // ? Search Filter
    const [search, setSearch] = React.useState<string>('');


    React.useEffect(() => {
        if (garnets) {
            setAllGarnets(garnets);
        }
    }, [garnets]);

    React.useEffect(() => {
        if (updateObj) {
            setUpdateName(updateObj.name);
            setEmptyFields(false);
            setError(false);
        } else {
            setEmptyFields(false);
            setError(false);
            setUpdateName('');
        }
    }, [updateObj]);

    const handleDeletion = async (obj: Garnet) => {
        const ans = confirm("Είστε σίγουρος πως θέλετε να διαγράψετε την γαρνιτούρα: \"" + obj.name + "\"");
        if (!ans) return;

        const res: DeleteInterface | undefined = await deleteGarnet(token, obj._id);

        if (res?.deletionOK) {
            refetch();
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Επιτυχής Διαγραφή!', type: 'success', intID: int });
            return;
        } else {
            if (res?.hasPlates) {
                const int = window.setInterval(() => {
                    setPopUp(undefined);
                    window.clearInterval(int);
                }, 5000);
                setPopUp({ text: 'Ανεπιτυχής Διαγραφή! Υπάρχουν πιάτα στην γαρνιτούρα!', type: 'error', intID: int });
                return;
            } else {
                const int = window.setInterval(() => {
                    setPopUp(undefined);
                    window.clearInterval(int);
                }, 5000);
                setPopUp({ text: 'Ανεπιτυχής Διαγραφή!', type: 'error', intID: int });
                return;
            }
        }
    }

    const handleSubmitionCreation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmptyFields(false);
        setError(false);

        if (name.length === 0) {
            setEmptyFields(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Κενά Πεδία!', type: 'error', intID: int })
            return;
        }

        const res = await newGarnet(token, { name: name });

        if (res) {
            setName('');
            setEmptyFields(false);
            setError(false);
            refetch();
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Επιτυχής Προσθήκη!', type: 'success', intID: int });
            return;
        } else {
            setError(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error', intID: int });
            return;
        }
    }

    const handleSubmitionUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!updateObj) return;

        setEmptyFields(false);
        setError(false);

        if (name.length === 0) {
            setEmptyFields(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Κενά Πεδία!', type: 'error', intID: int })
            return;
        }

        const res = await updateGarnet(token, {
            _id: updateObj._id,
            name: updateName,
        });

        if (res) {
            setUpdateName('');
            setUpdateObject(undefined);
            setEmptyFields(false);
            setError(false);
            refetch();
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Επιτυχής Ενημέρωση!', type: 'success', intID: int });
            return;
        } else {
            setError(true);
            const int = window.setInterval(() => {
                setPopUp(undefined);
                window.clearInterval(int);
            }, 5000);
            setPopUp({ text: 'Απροσδιόριστο Σφάλμα!', type: 'error', intID: int });
            return;
        }
    }

    
    return (
        <div className={style.garnets}>
            <div className={style.garnetsView}>
                {(popUp && popUp.type === 'error') && <ErrorDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                {(popUp && popUp.type === 'success') && <SuccessDiv text={popUp.text} intID={popUp.intID} setPopUp={setPopUp} />}
                <div className={style.garnetsViewList}>
                    {isLoading &&
                        <div className={style.garnetsViewList_loading}>
                            <LoadingSpinner />
                            <p>Φόρτωση Γαρνιτούρας...</p>
                        </div>
                    }
                    {isError &&
                        <div className={style.garnetsViewList_error}>
                            <BugSVG box={2.5} color={Colors.black} />
                            <p>Απροσδιόριστο Σφάλμα.</p>
                            <button type='button' role='button' onClick={() => refetch()}>
                                Προσπαθήστε Ξανά
                            </button>
                        </div>
                    }
                    {allGarnets &&
                        <div className={style.garnet_filters} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <SearchInput
                                tabIndex={0}
                                label='search'
                                placeholder='Αναζήτηση...'
                                value={search}
                                setValue={setSearch}
                            />
                        </div>
                    }
                    {allGarnets && allGarnets.map((cat: Garnet, key: number) => {
                        if (search.length > 0 && !cat.name.toLowerCase().includes(search.toLowerCase())) return;
                        return (
                            <div 
                                className={style.garnetView}
                                key={key}
                            >
                                <div className={style.garnetView_left}>
                                    <p>{cat.name}</p>
                                </div>
                                <div className={style.garnetView_right}>
                                    <button className={style.garnetBtn_edit} role='button' title='Ενημέρωση Γαρνιτούρας' type='button' onClick={() => {setUpdateObject(cat)}}>
                                        <EditSVG box={1.1} color={Colors.black} />
                                    </button>
                                    <button className={style.garnetBtn_remove} role='button' title='Διαγραφή Γαρνιτούρας' type='button' onClick={() => {handleDeletion(cat)}}>
                                        <BinSVG box={1.1} color={Colors.black} />
                                    </button>
                                </div>
                            </div>
                        );
                })}
                </div>
                <div className={style.garnetsSettings}>
                    <h2>Ρυθμίσεις Γαρνιτούρας</h2>
                    <form onSubmit={updateObj ? handleSubmitionUpdate : handleSubmitionCreation}>
                        <TextInput
                            label='name'
                            placeholder='Όνομα Γαρνιτούρας'
                            value={updateObj ? updateName : name}
                            setValue={updateObj ? setUpdateName : setName}
                            tabIndex={1}
                            icon={<GarnetSVG box={1.4} color={Colors.white} />}

                        />
                        <div style={{ padding: '0 .5rem', marginTop: '1rem', width: '100%' }} className={style.submitButtonDiv}>
                            {updateObj &&
                                <button type='button' role='button' title='Ακύρωση' onClick={() => setUpdateObject(undefined)}>
                                    <XCircleNoFillIcon box={2} color={Colors.black} />
                                </button>
                            }
                            <SubmitButton text={updateObj ? 'Ενημέρωση' : 'Προσθήκη'} type={true} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Garnets;