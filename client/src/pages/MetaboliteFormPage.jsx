import axios from 'axios';
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import AdminNav from './AdminNav';

export const MetaboliteFormPage = () => {
    const { id } = useParams()
    const [tagName, setTagName] = useState('');

    const [dataMetabolites, setDataMetabolites] = useState({
        dataMetabolite: [
            {
                listName: '',
                listMetabolite: [{
                    metaboliteName: '',
                    metaboliteMass: 0,
                }
                ]
            }

        ]
    })

    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/metabolite/' + id)
            .then(response => {
                const { data } = response
                setTagName(data.tagName)
                setDataMetabolites({
                    dataMetabolite: data.dataMetabolite
                })
            })
    }, [id])



    const addMetabolite = (index, e) => {
        e.preventDefault()
        setDataMetabolites({
            ...dataMetabolites,
            dataMetabolite: dataMetabolites.dataMetabolite.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        listMetabolite: [...item.listMetabolite, { metaboliteName: '', metaboliteMass: 0 }],
                    }
                    : item
            ),
        });
    };

    const removeMetabolite = (dataMetaboliteIndex, listMetaboliteIndex, e) => {
        e.preventDefault();
        const newDataMetabolites = [...dataMetabolites.dataMetabolite];
        newDataMetabolites[dataMetaboliteIndex].listMetabolite.splice(listMetaboliteIndex, 1);
        setDataMetabolites({
            dataMetabolite: newDataMetabolites
        });
    };

    const addList = (index, e) => {
        e.preventDefault()
        const newDataMetabolite = {
            listName: '',
            listMetabolite: [{
                metaboliteName: '',
                metaboliteMass: 0,
            }
            ]

        }
        setDataMetabolites(prevData => ({
            ...prevData,
            dataMetabolite: [...prevData.dataMetabolite, newDataMetabolite]
        })
        )

    };

    const RemoveDataMetabolite = (dataMetaboliteIndex, e) => {
        e.preventDefault()
        const newDataMetabolites = [...dataMetabolites.dataMetabolite];
        newDataMetabolites.splice(dataMetaboliteIndex, 1);
        setDataMetabolites({
            dataMetabolite: newDataMetabolites
        });
    };

    const handleInputChangelistMetabolite = (dataMetaboliteIndex, listMetaboliteIndex, event) => {
        const { name, value } = event.target;
        const newDataMetabolites = [...dataMetabolites.dataMetabolite];
        newDataMetabolites[dataMetaboliteIndex].listMetabolite[listMetaboliteIndex][name] = value;
        setDataMetabolites({
            dataMetabolite: newDataMetabolites
        });

        console.log(dataMetabolites)
    };

    const handleInputChangelistName = (dataMetaboliteIndex, event) => {
        const { value } = event.target;
        const newDataMetabolites = [...dataMetabolites.dataMetabolite];
        newDataMetabolites[dataMetaboliteIndex].listName = value;
        setDataMetabolites({
            dataMetabolite: newDataMetabolites
        });
    };


    const handleTagNameChange = (event) => {
        setTagName(event.target.value);
    };


    async function saveDataMetabolites(ev) {
        ev.preventDefault();
        const listMetaboliteData = {
            tagName, dataMetabolites,
        }
        if (id) {
            //update
            await axios.put('/metabolite', {
                id,
                ...listMetaboliteData
            })
            setRedirect(true)
        }
        else {
            // new place
            await axios.post('/metabolite', listMetaboliteData)
            setRedirect(true)
        }


    }

    async function deleteDataMetabolites(ev) {
        ev.preventDefault();
        if (id) {
            //delete
            await axios.delete('/metabolite/' + id, {
                id
            })
            setRedirect(true)
        }

    }

    if (redirect) {
        return <Navigate to={'/admin/metabolite'} />
    }


    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>

        )
    }

    return (
        <div>
            <AdminNav />
            <form onSubmit={saveDataMetabolites}>
                {preInput("Tag Name", "identifier for this data")}
                <input type="text" value={tagName} onChange={(e) => handleTagNameChange(e)} placeholder="lorem ipsum" />
                {preInput("Metabolite Data", "")}


                <div>
                    {

                        dataMetabolites.dataMetabolite.map((list, index) => {
                            return (
                                <div key={index} className='border-b-2 border-b-gray-300'>
                                    <div>
                                        <div className='flex justify-between'>
                                            <h2 className="text-xl mt-4">List Name</h2>
                                            <div className='mt-4'>
                                                <button className="bg-red-400 rounded-full w-40 ml-2" onClick={(e) => RemoveDataMetabolite(index, e)}>Remove List</button>
                                                <button className="bg-blue-400 rounded-full w-40 ml-2" onClick={(e) => addList(index, e)}>Add List</button>
                                            </div>
                                        </div>
                                        <input type="text" value={list.listName} onChange={(e) => handleInputChangelistName(index, e)} placeholder="lorem ipsum" />
                                    </div>
                                    <div className="grid grid-cols-5">
                                        <div className="flex justify-center items-center col-span-2">
                                            <h2 className="text-xl mt-4">Metabolite Name</h2>
                                        </div>
                                        <div className="flex justify-center items-center col-span-2">
                                            <h2 className="text-xl mt-4">Metabolite Mass</h2>
                                        </div>
                                    </div>


                                    {list.listMetabolite.map((metabolite, indexchild) => (
                                        <div key={indexchild} className="grid grid-cols-5 mb-4">

                                            <input
                                                className="col-span-2"
                                                type="text"
                                                name="metaboliteName"
                                                value={metabolite.metaboliteName}
                                                placeholder='lorem ipsum'
                                                onChange={(e) => { handleInputChangelistMetabolite(index, indexchild, e) }}
                                            />
                                            <input
                                                className="col-span-2"
                                                type="number"
                                                name="metaboliteMass"
                                                value={metabolite.metaboliteMass}
                                                placeholder='1.2345'
                                                onChange={(e) => { handleInputChangelistMetabolite(index, indexchild, e) }}
                                            />
                                            <div className="grid grid-cols-subgrid gap-0.5 mb-0.5">
                                                <button className="bg-red-400 rounded-full w-40 ml-10" onClick={(e) => removeMetabolite(index, indexchild, e)}>Remove</button>
                                                <button className="bg-blue-400 rounded-full w-40 ml-10" onClick={(e) => addMetabolite(index, e)}>Add Metabolite</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>)


                        })

                    }
                </div>
                <button className="primary my-4">Save</button>
            </form>

            <button className='bg-red-400 p-2 w-full rounded-2xl text-white -mt-2' onClick={(e) => deleteDataMetabolites(e)}>
                Delete
            </button>


        </div>
    )
}
