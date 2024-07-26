import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "./AdminNav";
import CoffeeImg from "./CoffeeImg";

export default function CoffeesPage() {
    const [coffees, setCoffees] = useState([]);
    useEffect(() => {
        axios.get('/admin-coffees').then(({ data }) => {
            setCoffees(data)
        })
    }, [])


    return (
        <div>
            <AdminNav />

            <div className="text-center">
                <Link className=" inline-flex gap-1 bg-blues text-white py-2 px-6 rounded-full " to={'/admin/coffee/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Add new Coffee
                </Link>
            </div>
            <div className="mt-4">
                {coffees.length > 0 && coffees.map(coffee => (
                    <Link to={'/admin/coffee/' + coffee._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-2 " key={coffee._id}>
                        <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                            <CoffeeImg coffee={coffee} />
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{coffee.name}</h2>
                            <p className="text-sm mt-2">{coffee.description}</p>
                        </div>
                    </Link>
                ))}
            </div>



        </div>
    )
}