import React, { useEffect, useState } from 'react'
import AdminNav from './AdminNav'
import { Link } from 'react-router-dom'
import axios from 'axios';



export default function QuantMassPage() {
  const [quantMasses, setQuantMasses] = useState([]);
  useEffect(() => {
    axios.get('/admin-quantMasses').then(({ data }) => {
      setQuantMasses(data)
    })
  }, [])

  return (
    <div>
      <AdminNav />
      <div className="text-center">
        <Link className=" inline-flex gap-1 bg-blues text-white py-2 px-6 rounded-full " to={'/admin/quantMass/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new QuantMass
        </Link>
      </div>
      <div className="mt-4">
        {quantMasses.length > 0 && quantMasses.map(quantMass => (
          <Link to={'/admin/quantMass/' + quantMass._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-2 " key={quantMass._id}>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{quantMass.tagName}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
