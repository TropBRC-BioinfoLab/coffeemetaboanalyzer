import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdminNav from './AdminNav';
import { Link } from 'react-router-dom';

export const MetabolitePage = () => {
    const [metabolites, setMetabolites] = useState([]);
    useEffect(() => {
        axios.get('/admin-metabolites').then(({ data }) => {
            setMetabolites(data)
        })
    }, [])

    return (
        <div>
            <AdminNav />
            <div className="text-center">
                <Link className=" inline-flex gap-1 bg-blues text-white py-2 px-6 rounded-full " to={'/admin/metabolite/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new Metabolite
                </Link>
            </div>
            <div className="mt-4">
                {metabolites.length > 0 && metabolites.map(metabolite => (
                    <Link to={'/admin/metabolite/' + metabolite._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-2 " key={metabolite._id}>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{metabolite.tagName}</h2>
                        </div>
                    </Link>
                    
                ))}
            </div>
        </div>
    )
}
