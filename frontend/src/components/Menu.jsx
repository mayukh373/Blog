import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const Menu = () => {
  const { user } = useContext(UserContext)
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setUser(null)
      navigate("/login")
    }
    catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="nav-menu-options bg-black w-[200px] z-10 flex flex-col items-start absolute sm:top-16 right-2 md:right-24 lg:right-52 2xl:right-72 rounded-md p-4 space-y-4">
      {!user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to="/login">Login</Link></h3>}
      {!user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to="/register">Register</Link></h3>}
      {user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to={"/view-profile/" + user._id}>Profile</Link></h3>}
      {user && screen.width<=600 && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to="/write">Write</Link></h3>}
      {user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to={"/myblogs/" + user._id}>My blogs</Link></h3>}
      {user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to={"/bookmarks/" + user._id}>Bookmarks</Link></h3>}
      {user && <h3 onClick={handleLogout} className="text-white text-sm hover:text-gray-500 cursor-pointer">Logout</h3>}

    </div>
  )
}

export default Menu