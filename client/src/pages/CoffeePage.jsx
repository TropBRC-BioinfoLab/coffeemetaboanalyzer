import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import AddressLink from "./AddressLink";
import CoffeeGallery from "./CoffeeGallery";
import TableCoffeePage from "./TableCoffeePage";

export default function CoffeePage() {
    const { id } = useParams();
    const [coffee, setCoffee] = useState(null);
    const [metabolites, setMetabolites] = useState([]);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/coffees/${id}`).then(response => {
            setCoffee(response.data)

        })
        axios.get(`/coffees-metabolite/${id}`).then(response => {
            if (response.data.metaboliteMass != null) {
                const arr = response.data.metaboliteName.map((metaboliteName, i) => {
                    const massProperties = response.data.metaboliteMass.reduce((acc, metaboliteMass) => {
                        acc[metaboliteMass.listName] = metaboliteMass.listMetabolite[i].metaboliteMass;
                        return acc;
                    }, {});
                    return {
                        metaboliteName,
                        quantMass: response.data.quantMass[i],
                        ...massProperties,
                        massSpectrum: response.data.massSpectrum[i]

                    };
                });
                setMetabolites(arr)
            }


            console.log(metabolites)
        })
    }, [id])



    if (!coffee) return '';



    return (
        <div className="-mt-4 bg-gray-100  px-8 pt-8 w-full ">
            <h1 className="text-3xl">{coffee.name}</h1>
            <AddressLink>{coffee.origin}</AddressLink>
            <div className=" flex justify-center items-center" >
                <CoffeeGallery coffee={coffee} />
            </div>
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 ">

                <div className="my-4">
                    <h2 className="font-semibold text-2xl">Description</h2>
                    {coffee.description}
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Brand </h2>
                </div>
                <div>
                    <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{coffee.brand}</div>
                </div>
            </div>

            <TableCoffeePage data={metabolites} />

        </div>
    )
}