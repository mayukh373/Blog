import axios from "axios"
import Footer from "../components/Footer"
import PostsView from "../components/PostsView"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"
import { CategoryContext } from "../context/CategoryContext"
import { FaRegBookmark, FaBookmark, FaCaretDown, FaCheckSquare, FaRegSquare } from "react-icons/fa"
import { Scrollbar } from 'react-scrollbars-custom'
import {URL} from '../url' 


const Home = () => {

  const search = useLocation().search.substring(8)
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(false)
  const { user, setUser } = useContext(UserContext)
  const categories = useContext(CategoryContext)
  const [bookmarkMap, setBookmarkMap] = useState(new Map())
  const [displayPosts, setDisplayPosts] = useState([])
  const [showCats, setShowCats] = useState(false)
  const [checked, setChecked] = useState([])
  const [sort, setSort] = useState(false)
  console.log(URL)
  useEffect(() => {
    fetchPostsWithQuery()
  }, [search])

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchPosts()
    createBoookmarkList(user)
  }, [])

  const fetchPostsWithQuery = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL+"/blogRoute/posts/" + search)
      setDisplayPosts(res.data)
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

  const fetchPosts = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL+"/blogRoute/posts")
      setPosts(res.data)
      if (!search) setDisplayPosts(res.data)
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

  const handleFilter = (category) => {
    if (checked.includes(category)) {
      setChecked(checked.filter((cat) => cat !== category))
    }
    else {
      setChecked([...checked, category])
    }
  }

  const fetchCategories = () => {
    return (
      categories.map((category, i) => {
        return <div onClick={() => handleFilter(category)} className="flex mx-2 space-x-1 cursor-default" key={i}>
          {checked.includes(category) ? <FaCheckSquare className="my-auto" /> : <FaRegSquare className="my-auto" />}
          <div>{category}</div>
        </div>
      })
    )
  }

  const checkFitler = (post) => {
    let flag = true;
    checked.map((cat) => {
      flag = flag & post.categories.includes(cat);
    })
    return flag;
  }

  const displaySort = () => {
    return (
      <div className="flex flex-col">
        <button className="text-white bg-zinc-900 border border-black p-1" onClick={() => setDisplayPosts([...displayPosts].sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : (a.updatedAt > b.updatedAt) ? -1 : 0))}>Most Recent</button>
        <button className="text-white bg-zinc-900 border border-black p-1" onClick={() => setDisplayPosts([...displayPosts].sort((a, b) => (a.viewedBy.length < b.viewedBy.length) ? 1 : (a.viewedBy.length > b.viewedBy.length) ? -1 : 0))}>Most Viewed</button>
      </div>
    )
  }

  return (
    <>
      <div className="z-20 sticky top-0"><Navbar posts={posts} /></div>
      <div className="md:px-[24px] min-h-[80vh] bg-slate-200 py-4">
        <div className="flex flex-row space-x-4 justify-center p-2 mb-2">
          <div className="flex flex-col relative">
            <button onClick={() => setShowCats(!showCats)} className="flex flex-row rounded-sm text-white bg-zinc-900 px-2 py-1 border border-black">Category<FaCaretDown style={showCats ? { rotate: "180deg", transition: "500ms" } : { rotate: "0deg", transition: "500ms" }} className="my-auto ms-1" /></button>
            {showCats && <Scrollbar style={{ width: 250, height: 250 , position: "absolute"}} className="flex flex-col p-2 top-10 z-10 text-white bg-zinc-900">{fetchCategories()}</Scrollbar>}
          </div>
          <div className="flex flex-col relative">
            <button onClick={() => setSort(!sort)} className="flex flex-row rounded-sm text-white bg-zinc-900 px-2 py-1 border border-black w-[107.33px] justify-between">Sort<FaCaretDown style={sort ? { rotate: "180deg", transition: "500ms" } : { rotate: "0deg", transition: "500ms" }} className="my-auto" /></button>
            {sort && <div className="flex flex-col absolute top-10 z-10 text-black h-[55px] w-[107.33px]">{displaySort()}</div>}
          </div>
          <button className="rounded-sm text-gray-300 bg-zinc-900 px-2 py-1 border border-black" onClick={() => setChecked([])}>Reset</button>
        </div>
        {loader ? <div className="h-[40vh] flex justify-center items-center"><Loader /></div> : !noResults ?
          <div className="flex flex-wrap flex-row justify-center">{displayPosts.map((post, i) => (
            checkFitler(post) ? <div className="relative">
              <Link to={"/posts/post/" + post._id}> <div className="m-2 flex basis-1/4 min-w-[300px] max-w-[300px] h-[460px] relative">
                <PostsView key={post._id} post={post} />
              </div> </Link>
              <div onClick={(e) => handleBookmark(post)} className="absolute bottom-4 left-56 mb-0.5 btn-fav btn-fav-true">
                {(user && bookmarkMap.has(post._id) && bookmarkMap.get(post._id)) ? <FaBookmark style={{ color: "red" }} /> : <FaRegBookmark style={{ color: "red" }} />}
              </div>
            </div> : ""
          ))}</div> : <h3 className="text-center font-bold py-40 text-lg">No posts available</h3>}
      </div>
      <Footer />
    </>
  )
}

export default Home