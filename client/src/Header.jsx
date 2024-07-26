import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
    const { user } = useContext(UserContext);
    return (
        <header className='flex justify-between bg-blues '>
            <div>
                <a href="" className="flex items-center gap-1">
                    <Link to={"/"}> <img className="w-40 " src="/src/assets/logo-ipb.png" alt="" /> </Link>
                    
                </a>
            </div>

            <div className='flex gap-10  py-2 px-4 text-white'>
                <Link to={"/"}> <div>Home</div> </Link>
                <div className=' border-l border-gray-300'></div>
                <Link to={'/pca'}><div>PCA</div></Link>
                <div className=' border-l border-gray-300'></div>
                <Link to={"/teams"}><div>Teams</div></Link>
                {!!user && (
                    <div>                     
                        <Link to={"/admin"}><div className=' border-l border-gray-300 px-10'>Admin</div></Link>
                    </div>
                )}
            </div>


        </header >
    )

}