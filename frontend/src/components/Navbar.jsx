import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsSearch } from 'react-icons/bs'
import { FaBars } from 'react-icons/fa'
import { useContext, useState, useRef, useEffect } from "react"
import Menu from "./Menu"
import { UserContext } from "../context/UserContext"


const Navbar = ({ posts }) => {

  const [prompt, setPrompt] = useState("")
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const path = useLocation().pathname
  const { user } = useContext(UserContext)
  const searchBar = useRef(null)
  const items = useRef(null)
  const styles = {
    display: {
      visibility: path == "/" ? "" : "hidden"
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
  })

  const handleClick = (e) => {
    if (searchBar.current) {
      if (!searchBar.current.contains(e.target) && items.current) items.current.style.display = "none"
      else if (items.current) items.current.style.display = ""
    }
  }

  const toSearch = async (e) => {
    const search = e.target.value;
    setPrompt(search)
  }

  const suggestions = (search) => {
    search = search.trim().toLowerCase();
    if (search.length < 2) return;
    const options = posts.filter((post) => post.title.toLowerCase().includes(search) === true)
    options.sort((a, b) => ((a.title).localeCompare(b.title)) === 1 ? 1 : ((a.title).localeCompare(b.title)) === -1 ? -1 : 0)
    return (
      <div ref={items} className="flex flex-col text-sm shadow-md">
        {options.length ?
          <div className="flex flex-col">{options.slice(0, 5).map((post) => {
            return <div key={post._id} className="flex flex-col p-3 border-b hover:text-fuchsia-800 bg-gray-100">
              <Link to={"/posts/post/" + post._id}>
                {post.title.substring(0, 50)}...<br />
                <em>{post.username}, {new Date(post.updatedAt).toString().slice(3, 10)}, {new Date(post.updatedAt).toString().slice(11, 15)}</em>
              </Link>
            </div>
          })}<div onClick={() => navigate(prompt ? "?search=" + prompt : "/")} className="p-1 text-center text-sky-500 bg-gray-100 hover:cursor-pointer">See all</div></div>
          : <div className="flex px-3 bg-gray-100">No results</div>}
      </div>
    )
  }

  return (
    <div className="nav-container px-4 items-center justify-between md:px-[50px] py-4 border-b-4 border-zinc-950 bg-black">
      <div className="flex basis-1/3 font-extrabold text-white nav-title px-5 "><Link to="/">LucidLines</Link></div>
      <div className="breakpoint-xsm"></div>

      <div ref={searchBar} className="flex basis-2/3 nav-search justify-center space-x-1" style={styles.display}>
        <div onClick={() => navigate(prompt ? "?search=" + prompt : "/")} className="flex cursor-pointer me-2 my-auto"><BsSearch style={{ color: "white" }} /></div>
        <div className="flex flex-col relative space-y-1 w-[200px] md:w-[300px]">
          <input onChange={(e) => toSearch(e)} value={prompt} className="flex outline-none px-3 bg-gray-200 rounded-full py-1" placeholder="Search..." type="text" />
          <div className="flex flex-col absolute top-8 z-10 w-[200px] md:w-[300px]">{suggestions(prompt)}</div>
        </div>
      </div>

      {user ?
        <div className="flex show-user-options space-x-4 basis-1/3">
          <Link to="/write"><h3 className="text-white px-4 py-0.5 write-icon">Write</h3></Link>
          <button onClick={() => setMenu(!menu)} className="btn-check cursor-pointer px-5 py-1.5 relative "><FaBars style={{ color: "white" }} /></button>
          {menu && <Menu />}
        </div> :
        <div className="show-user-options flex justify-end basis-1/3 space-x-4">
          <div className="flex"><Link to="/login"><h3 className="text-white px-4 py-0.5 write-icon">Login</h3></Link></div>
          <div className="flex"><Link to="/register"><h3 className="text-white px-4 py-0.5 write-icon">Register</h3></Link></div>
        </div>}

      <button onClick={() => setMenu(!menu)} className="btn-check nav-menu flex justify-end basis-1/3">
        <p className="cursor-pointer relative"><FaBars style={{ color: "white" }} /></p>
        {menu && <Menu />}
      </button>
    </div>
  )
}

export default Navbar 