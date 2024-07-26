import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import DownloadBtn from "./DownloadBtn";
import DebouncedInput from "./DebouncedInput";
import axios from "axios";

const TableCoffeePage = ({ data }) => {

  const columnHelper = createColumnHelper();

  const downloadFile = async (filename) => {
    console.log(`${filename}`)
    const response = await axios.get(`/massSpectrum/${filename}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
  };

  const columns = data.length > 0 ? [
    columnHelper.accessor("", {
      id: "No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "No",
    }),
    ...Object.keys(data[0]).map((key) => {
      return columnHelper.accessor(key, {
        cell: (info) => {
          if (key === 'massSpectrum') {
            return (
              <span onClick={() => downloadFile(info.getValue())} className="cursor-pointer">{info.getValue()}</span>
            );
          } else {
            return <span>{info.getValue()}</span>;
          }
        },
        header: () => {
          switch (key) {
            case 'massSpectrum':
              return "Mass Spectrum";
            case 'quantMass':
              return "Quant Mass";
            case 'metaboliteName':
              return "Metabolite Name";
            default:
              return key;
          }
        },
      });
    }),
  ] : [
        columnHelper.accessor("", {
          id: "No",
          cell: (info) => <span>{info.row.index + 1}</span>,
          header: "No",
        }),

        columnHelper.accessor("metaboliteName", {
          cell: (info) => <span>{info.getValue()}</span>,
          header: "Metabolite Name",
        }),
        columnHelper.accessor("quantMass", {
          cell: (info) => <span>{info.getValue()}</span>,
          header: "Quant Mass",
        }),

        columnHelper.accessor("massSpectrum", {
          cell: (info) => (
            <span onClick={() => downloadFile(info.getValue())} className="cursor-pointer">{info.getValue()}</span>
          ),
          header: "Mass Spectrum",
        }),
  ];


  useEffect(() => {

    // console.log(data)

  })
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-2 max-w-full mx-auto text-white fill-gray-400 ">
      <div className="flex justify-between mb-2">
        <div className="w-full flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-10 bg-blues rounded-l-2xl p-0.5 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 -ml-2 mt-0.5 outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 rounded-r-2xl bg-blues text-white placeholder-white"
            placeholder="Search all columns..."
          />
        </div>
        <DownloadBtn data={data} fileName={"peoples"} />
      </div>
      <table className="border border-gray-700 w-full text-left">
        <thead className="bg-blues">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="capitalize px-3.5 py-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`
                ${i % 2 === 0 ? "bg-blue-950" : "bg-blue-800"}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3.5 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="text-center h-32 bg-blue-950">
              <td colSpan={12}>No Record Found!</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* pagination */}
      <div className="flex items-center justify-end  gap-2 bg-blue-950 -mt-0">
        <button
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
          className="p-1 border bg-blue-800 px-2 disabled:opacity-70"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
          className="p-1 border bg-blue-800 px-2 disabled:opacity-70"
        >
          {">"}
        </button>

        <span className="flex items-center gap-1 ">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16  bg-blue-800"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-blue-800 rounded-full border"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default TableCoffeePage;
