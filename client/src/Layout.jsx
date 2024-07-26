import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Layout(){
    return(
        <div className="flex flex-col min-h-screen">
            <div className="p-4 bg-blues">  <Header /> </div>
           
            <div className="p-4"><Outlet /></div>
        </div>
    )
}