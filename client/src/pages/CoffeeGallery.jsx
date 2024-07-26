import { useState } from "react";
import Carousel from "./Carousel";

export default function CoffeeGallery({ coffee }) {
    // const [showAllPhotos, setShowAllPhotos] = useState(false);

    // if (showAllPhotos) {
    //     return (
    //         <div className="absolute inset-0 bg-black text-white min-w-full min-h-screen">
    //             <div className="bg-black p-8 grid gap-4">
    //                 <div>
    //                     <h2 className="text-3xl mr-48">Photos of {coffee.name}</h2>
    //                     <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
    //                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    //                             <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    //                         </svg>
    //                         Close photos
    //                     </button>
    //                 </div>
    //                 {
    //                     coffee?.photos?.length > 0 && coffee.photos.map(photo => (
    //                         <div>
    //                             <img src={'http://localhost:4000/uploads/' + photo} alt="" />
    //                         </div>
    //                     ))
    //                 }
    //             </div>


    //         </div>
    //     )
    // }

    return (
        <div className="flex justify-center items-center py-4 w-screen bg-gray-300" >
            <div className="max-w-md">
                <Carousel>
                    {coffee?.photos?.length > 0 && coffee.photos.map((photo, index) => (
                        <img  key={index} src={'http://localhost:4000/uploads/' + photo} alt={`Image ${index}`} />
                    ))}
                </Carousel>
            </div>
        </div>

    )
}


// <div className="relative">
//     <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
//         <div>
//             {coffee.photos?.[0] && (
//                 <div>
//                     <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={'http://localhost:4000/uploads/' + coffee.photos[0]} alt="" />
//                 </div>

//             )}
//         </div>
//         <div className="grid ">
//             {coffee.photos?.[1] && (
//                 <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={'http://localhost:4000/uploads/' + coffee.photos[1]} alt="" />
//             )}
//             <div className="overflow-hidden">
//                 {coffee.photos?.[2] && (
//                     <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover relative top-2" src={'http://localhost:4000/uploads/' + coffee.photos[2]} alt="" />
//                 )}
//             </div>
//         </div>
//     </div>
//     <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500 ">
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//             <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
//             <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
//         </svg>
//         Show more photos</button>
// </div>