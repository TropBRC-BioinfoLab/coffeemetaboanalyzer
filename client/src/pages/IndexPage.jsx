import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    Typography,
} from "@material-tailwind/react";


export default function IndexPage() {
    const [coffees, setCoffees] = useState([])
    useEffect(() => {
        axios.get('/coffees').then(response => {
            setCoffees(response.data)
        })
    }, [])
    return (
        <div>
            <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
                <div className="absolute top-0 h-full w-full bg-[url('/src/assets/background-home-90.png')] bg-cover bg-center" />
                <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
                <div className="max-w-8xl container relative mx-auto">
                    <div className="flex flex-wrap items-center">
                        <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
                            <Typography

                                color="white"
                                className="text-2xl mb-6 font-black"
                            >
                                CoffeeMetaboAnalyzer
                            </Typography>
                            <Typography variant="lead" color="white" className="text-lg opacity-80">
                                A web-based platform for analyzing and visualizing coffee metabolite data, allowing researchers and other users to manage coffee metabolite data and perform Principal Component Analysis (PCA) with ease.
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
                <Typography

                    color="black"
                    className="text-2xl mt-6 font-black"
                >
                    Coffee Gallery
                </Typography>
                <Typography variant="lead" color="black" className="text-lg opacity-80">
                   list of all available coffees 
                  </Typography>

                
                
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {coffees.length > 0 && coffees.map(coffee => (
                    <Link className="" key={coffee._id} to={'/coffee/' + coffee._id}>
                        <div className="bg-gray-500 mb-2 rounded-2xl flex ">
                            {coffee.photos?.[0] && (
                                <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/' + coffee.photos?.[0]} alt="" />
                            )}
                        </div>
                        <h2 className="font-bold">{coffee.name}</h2>
                        <h3 className="text-sm  text-gray-500"> {coffee.origin} </h3>
                        <div className="mt-1">
                            <span className="text-sm font-bold"> Brand: {coffee.brand}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    )
}