import axios from 'axios'
import { useState, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import {URL} from '../url' 

export default function ChangeEmail({ currentEmail, userId }) {

    const [email, setEmail] = useState("");
    const [error, setError] = useState({ status: false, message: "" });
    const [currEmail, setCurrEmail] = useState(currentEmail);

    const ChangeEmail = async () => {
        try {
            const res = await axios.put(URL+"/blogRoute/update/user-email/"+userId, {email: email})
            setError({ status: false, message: "" });
            setCurrEmail(email);
        }
        catch(err) {
            setError({ status: true, message: err.response.data })
            console.log(err)
        }

    }

    return (
        <div className="flex flex-col justify-center space-y-2 w-[380px] h-[136px] max-md:mx-0.5">
            <div className="flex flex-row space-x-12 max-md:justify-centr">
                <div className="flex my-auto text-md">Current email</div>
                <div className="flex my-auto text-md">{currEmail}</div>
            </div>
            <div className="flex flex-row space-x-14 max-md:justfy-center">
                <div className="flex my-auto text-md">New email</div>
                <div className="flex border-2"><input onChange={(e) => setEmail(e.target.value)} value={email} className="outline-none px-1 py-2 text-gray-500 text-sm" type="text" placeholder="Enter new email" /></div>
            </div>
            {error.status && <div className="text-center text-red-500 text-sm">{error.message}</div>}
            <div className="flex justify-center mt-1">
                <button onClick={ChangeEmail} className='bg-black w-[25%] md:w-[50px] text-white py-1 text-sm text-center'>Save</button>
            </div>
        </div>
    );
}