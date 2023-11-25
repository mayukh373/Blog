import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {URL} from '../url' 

export default function DeleteAccount({userId}) {

    const [password, setPassword] = useState("")
    const [error, setError] = useState({ status: false, message: "" });
    const navigate = useNavigate()
    const {setUser} = useContext(UserContext)

    const deleteAccount = async () => {
        if (password.length < 5) {
            setError({status: true, message: "Incorrect Password!"})
            return;
        }
        try {
            const res = await axios.delete(URL+"/blogRoute/delete/user/"+userId, {data: {password: password}})
            console.log(res.data)
            setError({status: false, message: ""})
            setUser(null)
            navigate("/login")
        }
        catch(err) {
            setError({status: true, message: err.response.data})
            console.log(err)
        }
    }

    return (
        <div className="flex flex-col justify-center w-[380px] h-[136px] text-center font-bold space-y-4">
            <div className="flex mt-8">
                Deleting your account will permanently delete all your data from our database! This action cannot be undone. Type your password to confirm.
            </div>
            <div className="flex justify-center"><input onChange={(e) => setPassword(e.target.value)} value={password} className="outline-none px-1 py-2 text-gray-500 text-sm border-2 border-red-500" type="password"  /></div>
            {error.status && <div className="text-center text-red-500 text-sm">{error.message}</div>}
            <div className="flex justify-center mt-2">
                <button onClick={deleteAccount} className='bg-red-600 w-[35%] md:w-[90px] text-white px-2 py-1 text-base text-center'>CONFIRM</button>
            </div>
        </div>
    );
}