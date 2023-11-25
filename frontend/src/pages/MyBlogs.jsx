import { Link, useLocation, useParams } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import PostsView from "../components/PostsView"
import Loader from "../components/Loader"
import { FaRegBookmark, FaBookmark } from "react-icons/fa"
import {URL} from '../url' 


const MyBlogs = () => {
  const { search } = useLocation()
  const userId = useParams().id;
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(false)
  const { user, setUser } = useContext(UserContext)
  const [bookmarkMap, setBookmarkMap] = useState(new Map())

  useEffect(() => {
    fetchPosts()
    createBoookmarkList(user)
  }, [search])

  const fetchPosts = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL+"/blogRoute/posts/user/" + userId)
      res.data.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : (a.updatedAt > b.updatedAt) ? -1 : 0)
      setPosts(res.data)
      if (res.data.length === 0) {
        setNoResults(true)
      }
      else {
        setNoResults(false)
      }
      setLoader(false)

    }
    catch (err) {
      console.log(err)
      setLoader(true)
    }
  }

  const createBoookmarkList = (user) => {
    if (!user || !user.bookmarks) return;
    const Bookmarks = user.bookmarks
    if (!Bookmarks) return;
    Bookmarks.map(item => {
      setBookmarkMap(new Map(bookmarkMap.set(item, true)))
    })
  }

  const handleBookmark = (post) => {
    if (!user) return;
    let status = true;
    if (bookmarkMap.has(post._id)) {
      status = !(bookmarkMap.get(post._id))
      setBookmarkMap(new Map(bookmarkMap.set(post._id, status)))
    }
    else setBookmarkMap(new Map(bookmarkMap.set(post._id, true)))
    updateBookmark(post._id, status)
  }

  const updateBookmark = async (bookmark, status) => {
    try {
      const res = await axios.put(URL+"/blogRoute/users/bookmarks/" + user._id, { bookmark: bookmark, status: status })
      setUser({ ...user, bookmarks: res.data })
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Navbar/>
      <div className="md:px-[24px] min-h-[80vh] bg-slate-300">
      <div className="text-center border-b-2 border-black mb-2" style={{fontSize:"2em", fontWeight: "bold", fontFamily:"serif"}}>My Blogs</div>
        {loader ? <div className="h-[40vh] flex justify-center items-center"><Loader /></div> : !noResults ?
          <div className="flex flex-wrap flex-row justify-center">{posts.map((post, i) => (
            <div className="relative">
                <Link to={"/posts/post/" + post._id}> <div className="m-2 flex basis-1/4 min-w-[300px] max-w-[300px] h-[460px] home-posts relative">
                    <PostsView key={post._id} post={post} />
                </div> </Link>
                <div onClick={(e) => handleBookmark(post)} className="absolute bottom-4 left-56 mb-0.5 btn-fav btn-fav-true">
                    {(user && bookmarkMap.has(post._id) && bookmarkMap.get(post._id)) ? <FaBookmark style={{ color: "red" }} /> : <FaRegBookmark style={{ color: "red" }} />}
                </div>
            </div>
        ))}</div> : <h3 className="text-center font-bold pt-14">No posts available</h3>}
      </div>
      <Footer />
    </>
  )
}

export default MyBlogs