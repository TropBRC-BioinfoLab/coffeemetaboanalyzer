import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);
    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const data = await axios.post('/login', { email, password },)
            setUser(data);
            alert('Login successful')
            setRedirect(true);
        }
        catch (e) {
            alert('Login failed')
        }

    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <div >
       
            <div className="mt-4 grow items-center justify-around">
                <div className="mb-64">
                    <h1 className="text-4xl text-center mb-4">Login Admin</h1>
                    <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                        <h2 className="flex ml-3  text-gray-800">Email</h2>
                        <input type="email" placeholder="your@email.com"
                            value={email}
                            onChange={ev => setEmail(ev.target.value)} />


                        <h2 className="flex ml-3  text-gray-800">Password</h2>
                        <input type="password" placeholder="password"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)} />
                        <button className="primary mt-2">Login</button>

                    </form>
                    <div className="flex mt-2 justify-center">
                                           <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000"

                        data-name="Flat Color"
                        viewBox="0 0 24 24"
                        className="icon flat-color w-10 h-20 flex"
                    >
                        <g>
                            <path
                                fill="#2780E3"
                                d="M2.3 6.26c.25.29.44.49.46.51 3.34 3.52 5.25 3.75 6.93 4a9.2 9.2 0 011.17.19 8.19 8.19 0 00-2.37 2.95A5.53 5.53 0 008 15.49a9.88 9.88 0 01-1.51-.72C3 12.73 1.26 9.07 2.3 6.26zm1.13-1.73c.4.48.76.84.76.85 2.86 3 4.26 3.18 5.74 3.35a7.45 7.45 0 013.07.89 8.42 8.42 0 013.35-.74h.2c0-.11-.08-.21-.13-.32a9.51 9.51 0 00-4-4.19A9.4 9.4 0 006.9 3a5.76 5.76 0 00-3.47 1.53z"
                            ></path>
                            <path
                                fill="#000"
                                d="M21.7 11.14c1 2.8-.71 6.47-4.21 8.5-3.26 1.9-7 1.76-9-.13.31-.39.65-.79.8-1 2.4-2.64 3.62-2.79 5-3 1.68-.2 3.59-.43 6.93-3.95.04.06.23-.13.48-.42zM7.8 17.21c2.91-3.2 4.62-3.4 6.27-3.6 1.48-.18 2.88-.35 5.74-3.35 0 0 .36-.38.76-.86a5.73 5.73 0 00-3.47-1.49 9.46 9.46 0 00-5.57 1.34 9.51 9.51 0 00-3.94 4.2A6.21 6.21 0 007 16a5 5 0 00.32 1.76z"
                            ></path>
                        </g>
                    </svg>
 
                    </div>
                </div>



            </div>


        </div>


    );
}