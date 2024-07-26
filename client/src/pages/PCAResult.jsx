import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { PCA } from "ml-pca"
import * as d3 from "d3"
import * as _ from "underscore"
import Plot from 'react-plotly.js';


export default function PCAResult() {
    const [data, setData] = useState(null);
    const [tagName, setTagName] = useState(null)
    const location = useLocation();

    useEffect(() => {
        axios.get(`/admin-metabolites`).then(response => {
            const temp = []
            const tmp = []
            const temporary = []
            if (response.data) {
                response.data.map((listKopi, i) => {

                    listKopi.dataMetabolite.map((metaboliteData, ii) => {
                        const row = {
                            Name: metaboliteData.listName
                        }
                        const metaboliteName = []
                        metaboliteData.listMetabolite.map((metaboliteList, iii) => {
                            row[metaboliteList.metaboliteName] = metaboliteList.metaboliteMass
                            metaboliteName.push(`${metaboliteList.metaboliteName}`)
                        })
                        tmp.push(listKopi.tagName)
                        temp.push(row)
                    })

                })
            }
            const DataTemp = _.map(location.state, _.propertyOf(temp))
            setData(DataTemp)
            const TagNameTemp = _.map(location.state, _.propertyOf(tmp))
            setTagName(TagNameTemp)


        })
    }, [])

    if (data == null) return '';



    function asMatrix(value) {
        const aoo = value;
        // we assume that the first object contains the same keys as the rest of the array
        const headers = Object.keys(aoo[0]);
        const array = [];
        array.headers = headers;
        /*
        for (let index = 0; index < headers.length; ++index) {
          array.push(aoo.map((row) => row[headers[index]]));
        }
      */
        ///*
        for (let rowNo = 0; rowNo < aoo.length; ++rowNo) {
            const row = aoo[rowNo];
            const rowData = [];
            for (let columnNo = 0; columnNo < headers.length; ++columnNo) {
                const column = headers[columnNo];
                rowData.push(row[column]);
            }
            array.push(rowData);
        }
        //*/
        return array;
    }


    function scale(value) {
        // const clone = JSON.parse(JSON.stringify(value));
        // const df = asDataFrame(clone);
        // df.columns.forEach((column) => {
        //     const values = df[column];
        //     df[column] = values.map((v) => {
        //         if (v !== null && v !== undefined) {
        //             return v ;
        //         }
        //         return v;
        //     });
        // });
        // return df;

        const clone = JSON.parse(JSON.stringify(value));
        const df = asDataFrame(clone);
        df.columns.forEach((column) => {
            const values = df[column];
            const mean = d3.mean(values);
            const sd = d3.deviation(values);
            df[column] = values.map((v) => {
                if (v !== null && v !== undefined) {
                    return (v - mean) / sd;
                }
                return v;
            });
        });
        return df;
    }

    function asDataFrame(value) {
        // check if value is array of objects (aoo)
        if (value === undefined || value === null)
            throw new Error("No data passed to function.");
        if (
            !Array.isArray(value) ||
            typeof value[0] !== "object" ||
            value[0] === null
        ) {
            throw new Error("First argument must be an array of objects");
        }

        const aoo = value;
        // columns: if parsed using d3, the aoo will already have a columns prop
        // -> create it otherwise
        if (!value.columns) {
            const set = new Set();
            for (const row of aoo) {
                for (const key of Object.keys(row)) set.add(key);
            }
            aoo.columns = [...set];
        }
        // create getters and setters for columns
        aoo.columns.forEach((column) => {
            if (!Object.getOwnPropertyDescriptor(aoo, column)) {
                Object.defineProperty(aoo, column, {
                    get: function () {
                        return this.map((row) => row[column]);
                    },
                    set: function (array) {
                        if (!array) {
                            throw new Error(`No data passed to set ${column} column.`);
                        }
                        if (array.length !== this.length) {
                            throw new Error(
                                `Data length (${array.length}) different from column ${column} length (${this.length}).`
                            );
                        }
                        this.forEach((row, index) => (row[column] = array[index]));
                    }
                });
            }
        });
        return aoo;
    }

    const data_scaled = scale(data.map(({ Name, ...columnsToKeep }) => columnsToKeep))
    const pca_scaled = new PCA(asMatrix(data_scaled), { center: true, scale: true })
    // console.log(pca_scaled)
    const explainedVariances = pca_scaled.getExplainedVariance();
    const explainedVariancesNames = explainedVariances.map((explainedVariance, i) => `PC${i + 1}`);
    const scores = pca_scaled
        .predict(asMatrix(scale(data.map((row) => _.omit(row, ["Name"])))))
        .toJSON()
        .map((row, rowIndex) => {
            const columns = Object.keys(data[rowIndex]);
            const rowObj = {
                Name: data[rowIndex]["Name"]
            };
            columns.forEach((column, colIndex) => {
                rowObj[`PC${colIndex + 1}`] = row[colIndex];
            });
            return rowObj;
        });
    console.log(scores)

    const loadings = pca_scaled
        .getEigenvectors()
        .data.map((eigenvectorForPCs, variableIndex) => {
            const variable = Object.keys(data[0])[variableIndex];
            const row = {
                Variable: variable
            };
            eigenvectorForPCs.forEach((value, pcIndex) => {
                row[`PC${pcIndex + 1}`] = value;
            });
            return row;
        });
    // console.log(loadings)

    const pcsToDisplay = ["PC1", "PC2"]
    const scalingFactor = 1.2;
    const domains = ["scores", "loadings"].reduce((obj, source, i) => {
        const data = i === 0 ? scores : loadings;
        obj[source] = {};
        pcsToDisplay.forEach((pc) => {
            obj[source][pc] = [
                d3.min(data.map((row) => row[pc])) * scalingFactor,
                d3.max(data.map((row) => row[pc])) * scalingFactor
            ];
        });
        return obj;
    }, {});
    const coordinate_x = []
    const coordinate_y = []
    const coordinate_Name = []
    scores.map((score, i) => {
        coordinate_Name.push(score["Name"]);
        coordinate_x.push(score["PC1"]);
        coordinate_y.push(score["PC2"]);
    }
    );

    const graph_scatter = []
    data.map((x, i) => {
        const arr = {}
        for (let ii = 0; ii < graph_scatter.length; ii++) {
            if (graph_scatter[ii].name == tagName[i]) {
                graph_scatter[ii].x.push(coordinate_x[i])
                graph_scatter[ii].y.push(coordinate_y[i])
                graph_scatter[ii].text.push(coordinate_Name[i])
                arr["name"] = "aaa";
                break;
            }
        }

        if (Object.keys(arr).length > 0) {
            arr["name"] = "aaa";
        } else {
            arr["x"] = [coordinate_x[i]]
            arr["y"] = [coordinate_y[i]]
            arr["mode"] = 'markers+text'
            arr["type"] = 'scatter'
            arr["name"] = tagName[i]
            arr["text"] = [coordinate_Name[i]]
            arr["textposition"] = 'top center'
            arr["textfont"] = {
                family: 'Raleway, sans-serif'
            }
            arr["marker"] = { size: 12 }
            graph_scatter.push(arr)
        }


    })

    const annot = []
    // loadings.map((x, i) => {
    //     const arr = {}
    //     arr["x"] = x.PC1
    //     arr["y"] = x.PC2
    //     arr["axref"] = 'x'
    //     arr["ayref"] = 'y'
    //     // arr["text"] = x.Variable 
    //     arr["showarrow"] = true
    //     arr["ax"] = 0
    //     arr["ay"] = 0
    //     arr["arrowsize"] = 2
    //     arr["arrowhead"] = 2
    //     arr["xanchor"] = "right"
    //     arr["yanchor"] = "top"

    //     annot.push(arr);

    // })
    // {
    //     x: 5,
    //     y: 5,
    //     axref: 'x',
    //     ayref: 'y',
    //     // text: "Test",
    //     showarrow: true,
    //     ax: 0,
    //     ay: 0,
    //     arrowsize: 1,
    //     arrowhead: 1,
    //     xanchor: "right",
    //     yanchor: "top"

    // },
    // {
    //     x: 5,
    //     y: 5,
    //     text: "Test",
    //     showarrow: true,
    //     ax: 0,
    //     ay: 0,
    //     xanchor: "center",
    //     yanchor: "bottom",
    //     yshift:5

    // },
    loadings.map((x, i) => {
        const arr = {}
        const arr2 = {}
        arr["x"] = x.PC1
        arr["y"] = x.PC2
        arr["axref"] = "x"
        arr["ayref"] = "y"

        arr["showarrow"] = true
        arr["ax"] = 0
        arr["ay"] = 0
        arr["arrowsize"] = 1
        arr["arrowhead"] = 1
        arr["xanchor"] = "right"
        arr["yanchor"] = "top"
        arr2["x"] = x.PC1
        arr2["y"] = x.PC2
        arr2["showarrow"] = true
        arr2["ax"] = 0
        arr2["ay"] = 0
        arr2["text"] = x.Variable
        arr2["xanchor"] = "center"
        arr2["yanchor"] = "bottom"
        arr2["yshift"] = 5

        annot.push(arr);
        annot.push(arr2);

    })
    // const coordinate_x_vector = []
    // const coordinate_y_vector = []
    // const coordinate_Name_vector = []
    // loadings.map((loading, i) => {
    //     coordinate_Name_vector.push(loading["Variable"]);
    //     coordinate_x_vector.push(loading["PC1"]);
    //     coordinate_y_vector.push(loading["PC2"]);
    // }
    // );

    // console.log(annot)



    return (
        <div>

            <Plot
                data={[
                    {
                        x: explainedVariancesNames,
                        y: explainedVariances,
                        type: 'bar'
                    }
                ]}
                layout={{
                    width: 600,
                    height: 500,
                    xaxis: {
                        title: "Component"
                    },
                    yaxis: {
                        title: "Proportion of Variance"
                    },
                    title: 'Proportion of Variance Graph'
                }}
            />

            <Plot
                data={graph_scatter}
                layout={{
                    xaxis: {
                        range: domains.scores[pcsToDisplay[0]],
                        title: `${explainedVariancesNames[0]} (${(explainedVariances[0] * 100).toFixed(2)}%)`
                    },
                    yaxis: {
                        range: domains.scores[pcsToDisplay[1]],
                        title: `${explainedVariancesNames[1]} (${(explainedVariances[1] * 100).toFixed(2)}%)`
                    },
                    width: 600,
                    height: 500,
                    title: 'PCA Score Plot'
                }}
            />

            <Plot

                layout={{
                    xaxis: {
                        range: domains.loadings[pcsToDisplay[0]],
                        title: `${explainedVariancesNames[0]} (${(explainedVariances[0] * 100).toFixed(2)}%)`
                    },
                    yaxis: {
                        range: domains.loadings[pcsToDisplay[1]],
                        title: `${explainedVariancesNames[1]} (${(explainedVariances[1] * 100).toFixed(2)}%)`
                    },
                    width: 600,
                    height: 500,
                    title: 'Eigen Vector',
                    annotations: annot
                }}
            />
            <div>
                <div className="text-lg ">
                    Note:
                </div>
                <div className=" text-sm opacity-80" >
                    If the diagram does not show anything, go back to the previous page and make sure:
                </div>
                <div className="text-sm opacity-80">
                    1. If selecting two coffee samples, ensure that none of the metabolite data values are 0 for any of the selected samples.
                </div>
                <div className="text-sm opacity-80">
                    2. Ensure the length of each metabolite data set is the same for all selected coffee samples.
                </div>



            </div>
        </div>

    )


}
