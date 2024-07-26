import axios from 'axios';
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import AdminNav from './AdminNav';


export default function QuantMassFormPage() {

    const { id } = useParams()
    const [metabolites, setMetabolites] = useState([
        { quantMass: '', metaboliteName: '', massSpectrum: '', },
    ]);
    const [tagName, setTagName] = useState('');
    const [redirect, setRedirect] = useState(false)


    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/quantMass/' + id)
            .then(response => {
                const { data } = response
                setTagName(data.tagName)
                setMetabolites(data.datametabolite)
            })
    }, [id])


    const handleTagNameChange = (event) => {
        setTagName(event.target.value);
    };


    function uploadFile(ev, index) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('massSpectrum', files[i])
        }



        axios.post('/upload-massSpectrum', data, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(response => {
            console.log(response)
            const newMetabolites = [...metabolites];
            newMetabolites[index].massSpectrum = response.data;
            setMetabolites(newMetabolites);
        })
    }


    async function saveMetabolite(ev) {
        ev.preventDefault();
        const metabolitesData = {
            tagName, metabolites,
        }
        if (id) {
            //update
            await axios.put('/quantMass', {
                id,
                ...metabolitesData
            })
            setRedirect(true)
        }
        else {
            // new place
            await axios.post('/quantMass', metabolitesData)
            setRedirect(true)
        }


    }

    if (redirect) {
        return <Navigate to={'/admin/quantMass'} />
    }



    const addMetabolite = (event) => {
        event.preventDefault();
        setMetabolites([...metabolites, { quantMass: '', metaboliteName: '' }]);
    };

    const removeMetabolite = (index, event) => {
        event.preventDefault();
        const newMetabolites = [...metabolites];
        newMetabolites.splice(index, 1);
        setMetabolites(newMetabolites);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newMetabolites = [...metabolites];
        newMetabolites[index] = { ...newMetabolites[index], [name]: value };
        setMetabolites(newMetabolites);
    };



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


    async function deleteQuantMass(ev) {
        ev.preventDefault();
        if (id) {
            //delete
            await axios.delete('/quantMass/' + id, {
                id
            })
            setRedirect(true)
        }

    }


    return (
        <div>
            <AdminNav />
            <form onSubmit={saveMetabolite}>
                {preInput("Tag Name", "identifier for this data")}
                <input type="text" value={tagName} onChange={(e) => handleTagNameChange(e)} placeholder="lorem ipsum" />
                {preInput("Quant Mass and Mass Spectrum", "")}
                <div className="grid grid-cols-7">
                    <div className="flex justify-center items-center col-span-2">
                        <h2 className="text-xl mt-4">Metabolite Name</h2>
                    </div>
                    <div className="flex justify-center items-center col-span-2">
                        <h2 className="text-xl mt-4">Quant Mass</h2>
                    </div>
                    <div className="flex justify-center items-center col-span-2">
                        <h2 className="text-xl mt-4">Mass Spectrum</h2>
                    </div>
                </div>
                <div>
                    {metabolites.map((metabolite, index) => (
                        <div key={index} className="grid grid-cols-7">

                            <input
                                className="col-span-2"
                                type="text"
                                name="metaboliteName"
                                value={metabolite.metaboliteName}
                                placeholder='1.2345'
                                onChange={(e) => { handleInputChange(index, e) }}
                            />
                            <input
                                className="col-span-2"
                                type="text"
                                name="quantMass"
                                value={metabolite.quantMass}
                                placeholder='lorem ipsum'
                                onChange={(e) => { handleInputChange(index, e) }}
                            />
                            <div className='col-span-2'>
                                <input type="text" value={metabolite.massSpectrum} />
                                <label className=" cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl  text-2xl text-gray-600">
                                    <input type="file" name="massSpectrum" className="hidden" onChange={(e) => { uploadFile(e, index) }} />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                    </svg>
                                    Upload
                                </label>
                            </div>

                            <div className="grid grid-cols-subgrid gap-0.5 mb-0.5">
                                <button className="bg-red-400 rounded-full w-40 ml-10" onClick={(e) => removeMetabolite(index, e)}>Remove</button>
                                <button className="bg-blue-400 rounded-full w-40 ml-10" onClick={(e) => addMetabolite(e)}>Add Metabolite</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="primary my-4">Save</button>
            </form>

            <button className='bg-red-400 p-2 w-full rounded-2xl text-white -mt-2' onClick={(e) => deleteQuantMass(e)}>
                Delete 
            </button>

        </div>
    )
}
