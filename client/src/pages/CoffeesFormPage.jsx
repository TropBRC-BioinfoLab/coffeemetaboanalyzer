import PhotosUploader from "./PhotosUploader";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "./AdminNav.jsx";
import { Navigate, useParams } from "react-router-dom";


export default function CoffeesFormPage() {

    const { id } = useParams()
    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [selectQuantMass, setSelectQuantMass] = useState([])
    const [quantMass, setQuantMass] = useState('');
    const [metaboliteData, setMetaboliteData] = useState([]);
    const [selectMetaboliteData, setSelectMetaboliteData] = useState({})
    const [redirect, setRedirect] = useState(false)


    useEffect(() => {
        if (!id) {
            axios.get('/admin-quantMasses').then(({ data }) => {
                setSelectQuantMass(data)
            })
            axios.get('/admin-metabolites').then(({ data }) => {
                setSelectMetaboliteData(data)
            })
            return;
        }
        axios.get('/coffees/' + id)
            .then(response => {
                const { data } = response
                setName(data.name)
                setOrigin(data.origin)
                setAddedPhotos(data.photos)
                setDescription(data.description)
                setBrand(data.brand)
                setQuantMass(data.quantMass)
            })

        axios.get('/admin-quantMasses').then(({ data }) => {
            setSelectQuantMass(data)
        })
        axios.get('/admin-metabolites').then(({ data }) => {
            setSelectMetaboliteData(data)
        })

    }, [id])

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

    async function saveCoffee(ev) {
        ev.preventDefault();
        const coffeeData = {
            name, origin, addedPhotos, description, brand, quantMass, metaboliteData
        }
        if (id) {
            //update
            await axios.put('/coffees', {
                id,
                ...coffeeData
            })
            setRedirect(true)
        }
        else {
            // new place
            await axios.post('/coffees', coffeeData)
            setRedirect(true)
        }

    }

    async function deleteCoffee(ev) {
        ev.preventDefault();
        if (id) {
            //delete
            await axios.delete('/coffee/'+id, {
                id
            })
            setRedirect(true)
        }

    }

    // function splitAndConvert() {

    //     const parts = inputText.split(/[,\s]+/);

    //     const parsedNumbers = [];

    //     for (let i = 0; i < parts.length; i++) {

    //         const number = parseFloat(parts[i]);


    //         if (!isNaN(number)) {

    //             parsedNumbers.push(number);
    //         }
    //     }

    //     setMass(parsedNumbers);
    // };




    if (redirect) {
        return <Navigate to={'/admin/coffee'} />
    }


    return (
        <div>
            <AdminNav />
            <form onSubmit={saveCoffee}>
                {preInput('Name', 'Name of the Coffee')}
                <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Name, for example: Gayo Coffee" />
                {preInput('Origin', 'Origin of the coffee')}
                <input type="text" value={origin} onChange={ev => setOrigin(ev.target.value)} placeholder="Origin, for example: Aceh" />
                {preInput('Photos', 'more = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput('Description', 'Description of the coffee')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput('Brand', 'Brand of the Coffee')}
                <input type="text" value={brand} onChange={ev => setBrand(ev.target.value)} placeholder="Starbucks, Kapal Api" />
                {preInput("QuantMass", "Quant Mass of the coffee")}
                <select value={quantMass} onChange={ev => { setQuantMass(ev.target.value) }} className="w-full group flex items-center text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 py-2 px-3 rounded-2xl border">
                    {selectQuantMass.length > 0 && selectQuantMass.map((s) => (
                        <option key={s._id} value={s._id}>{s.tagName}</option>
                    ))}
                </select>
                {preInput("Metabolite Data", "Data metabolites of the coffee")}
                <select value={metaboliteData} onChange={ev => { setMetaboliteData(ev.target.value) }} className="w-full group flex items-center text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 py-2 px-3 rounded-2xl border">
                    {selectMetaboliteData.length > 0 && selectMetaboliteData.map((s) => (
                        <option key={s._id} value={s._id}>{s.tagName}</option>
                    ))}
                </select>

                <button className="primary my-4">Save</button>
            </form>

            <button className='bg-red-400 p-2 w-full rounded-2xl text-white -mt-2' onClick={(e) => deleteCoffee(e)}>
                Delete 
            </button>
        </div>
    )
}