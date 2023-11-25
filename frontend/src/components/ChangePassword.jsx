import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {URL} from '../url' 


export default function ChangePassword({userId}) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordAgain, setNewPasswordAgain] = useState("");
    const [error, setError] = useState({ status: false, message: "" });
    const navigate = useNavigate();

    const changePassword = async () => {
        try {
            await axios.put(URL+"/blogRoute/update/user-password/"+userId, {currentPassword, newPassword})
            navigate("/login")
        }
        catch(err) {
            setError({ status: true, message: err.response.data })
            console.log(err)
        }
    }

    return (
        <div className="flex flex-col justify-center space-y-2 w-[380px]">
            <div className="flex flex-row justify-between">
                <div className="flex my-auto text-md">Current password</div>
                <div className="flex border-2"><input onChange={(e) => setCurrentPassword(e.target.value)} value={currentPassword} className="outline-none px-1 py-2 text-gray-500 text-sm" type="password" placeholder="Enter current password" /></div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex my-auto">New password</div>
                <div className="flex border-2"><input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className="outline-none px-1 py-2 text-gray-500 text-sm" type="password" placeholder="Enter new password" /></div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex my-auto">Confirm New password</div>
                <div className="flex border-2"><input onChange={(e) => setNewPasswordAgain(e.target.value)} value={newPasswordAgain} className="outline-none px-1 py-2 text-gray-500 text-sm" type="password" placeholder="Confirm new password" /></div>
            </div>
            {error.status && <div className="text-center text-red-500 text-sm">{error.message}</div>}
            <div className="flex justify-center mt-2">
                {(currentPassword && newPassword && newPasswordAgain && newPassword === newPasswordAgain)? <button onClick={changePassword} className='bg-black w-[35%] md:w-[125px] text-white py-2 text-sm text-center'>Change Password</button> :
                <button disabled style={{opacity: "0.5"}} className='bg-black w-[35%] md:w-[125px] text-white py-2 text-sm text-center'>Change Password</button>}
            </div>
        </div>
    );
}