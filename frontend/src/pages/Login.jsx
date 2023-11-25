import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useContext, useState, useEffect } from "react"
import axios from "axios"
import { UserContext } from "../context/UserContext"
import {URL} from '../url' 


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState({ status: false, message: "" })
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (user) navigate('/')
  // })

  const handleLogin = async () => {
    try {
      const res = await axios.post(URL+"/blogRoute/login", { email, password })
      setUser(res.data);
      navigate("/");
    }
    catch (err) {
      setError({ status: true, message: err.response.data })
    }
  }
  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-black">
        <h1 className="font-extrabold text-white nav-title px-5 my-auto "><Link to="/">LucidLines</Link></h1>
        <Link to="/register"><h3 className="text-white px-4 py-0.5 write-icon">Register</h3></Link>
      </div>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Log in to your account</h1>
          <input onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-black outline-0" type="text" placeholder="Enter your email" />
          <input onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-black outline-0" type="password" placeholder="Enter your password" />
          <button onClick={handleLogin} className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black ">Log in</button>
          {error.status && <h3 className="text-red-500 text-sm ">{error.message}</h3>}
          <div className="flex justify-center items-center space-x-3">
            <p>New here?</p>
            <p className="text-gray-500 hover:text-black "><Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>

  )
}

export default Login