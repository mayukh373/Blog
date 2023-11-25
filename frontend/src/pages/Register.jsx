import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useState } from "react"
import axios from 'axios'
import {URL} from '../url' 

const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState({ status: false, message: "" })
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const res = await axios.post(URL+"/blogRoute/create-account", { username, email, password, createdOn: new Date(Date.now()).toISOString() })
      setError({ status: false, message: "" })
      navigate("/login")
    }
    catch (err) {
      setError({ status: true, message: err.response.data })
      console.log(err)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-black">
        <h1 className="font-extrabold text-white nav-title px-5 my-auto "><Link to="/">LucidLines</Link></h1>
        <Link to="/login"><h3 className="text-white px-4 py-0.5 write-icon">Login</h3></Link>
      </div>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Create an account</h1>
          <input onChange={(e) => setUsername(e.target.value)} className="w-full px-2 py-2 border-2 border-black outline-0" type="text" placeholder="Enter your username" />
          <input onChange={(e) => setEmail(e.target.value)} className="w-full px-2 py-2 border-2 border-black outline-0" type="text" placeholder="Enter your email" />
          <input onChange={(e) => setPassword(e.target.value)} className="w-full text-[15px] px-2 py-2 border-2 border-black outline-0" type="password" placeholder="Enter your password (atleast 5 characters)" />
          <button onClick={handleRegister} className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black ">Register</button>
          {error.status && <h3 className="text-red-500 text-sm ">{error.message}</h3>}
          <div className="flex justify-center items-center space-x-3">
            <p>Already have an account?</p>
            <p className="text-gray-500 hover:text-black"><Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Register