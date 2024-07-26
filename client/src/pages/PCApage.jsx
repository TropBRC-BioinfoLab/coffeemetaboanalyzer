import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { PCA } from "ml-pca"
import * as d3 from "d3"
import * as _ from "underscore"
import Plot from 'react-plotly.js';
import { TablePCA } from "./TablePCA"
import { Typography } from "@material-tailwind/react"

export default function PCAPage() {

    const [listMetaboliteName, setListMetaboliteName] = useState(null);

    useEffect(() => {
        axios.get(`/admin-metabolites`).then(response => {

            const temporary = []
            if (response.data) {
                response.data.map((listKopi, i) => {

                    listKopi.dataMetabolite.map((metaboliteData, ii) => {
                        const row = {
                            Name: metaboliteData.listName
                        }
                        const list = {
                            Name: metaboliteData.listName,
                            metaboliteName: []
                        }
                        const metaboliteName = []
                        metaboliteData.listMetabolite.map((metaboliteList, iii) => {
                            row[metaboliteList.metaboliteName] = metaboliteList.metaboliteMass
                            metaboliteName.push(`${metaboliteList.metaboliteName}`)
                        })
                        list["metaboliteName"] = metaboliteName.join(" | ")
                        temporary.push(list)

                    })

                })
            }
            setListMetaboliteName(temporary)
            
        })
    }, [])

    if (listMetaboliteName == null) return '';

    return (
        <div>
            <div className="ml-2 w-full lg:w-8/12">
                <Typography

                    color="black"
                    className="text-2xl mb-2 font-black"
                >
                    Steps to Perform PCA on Coffee Data

                </Typography>
                <Typography variant="lead" color="black" className="mb-6">
                    <ul>
                        <li className="text-lg ">
                            1. View the Coffee Data Table
                        </li>
                        <p className="text-sm opacity-80">
                            You will see a table displaying a list of coffee samples. Each row represents a different coffee sample
                        </p>
                        <li className="text-lg ">
                            2. Select Coffee Samples
                        </li>
                        <p className="text-sm opacity-80">
                            Each row in the table has a checkbox. Select the coffee samples you want to include in the PCA analysis by clicking the checkboxes.
                        </p>
                        <li className="text-lg ">
                            3. Verify Your Selection
                        </li>
                        <p className="text-sm opacity-80">
                            Ensure that all desired coffee samples are selected. You can scroll through the table and adjust your selection if necessary.
                        </p>
                        <li className="text-lg ">
                            4. Check Metabolite Data Conditions
                        </li>
                        <p className="text-sm opacity-80">
                            If selecting two coffee samples, ensure that none of the metabolite data values are 0 for any of the selected samples. 
                            
                        </p>
                        <p className="text-sm opacity-80">
                            Ensure the length of each metabolite data set is the same for all selected coffee samples.
                        </p>
                        <li className="text-lg ">
                            5. Click the "Result" Button
                        </li>
                        <p className="text-sm opacity-80">
                            Click the "Result" button to proceed with the PCA analysis.
                        </p>
                    </ul>
                                 
                </Typography>
            </div>
            <TablePCA data={listMetaboliteName} />
        </div>

    )
}
