import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { BiEdit } from "react-icons/bi"
import { FaRegBookmark, FaBookmark } from "react-icons/fa"
import { MdDelete } from 'react-icons/md'
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"
import Parser from 'html-react-parser';
import DefaultPost from '../assets/DefaultImages/postDefault.png'
import {URL} from '../url' 

const PostDetails = () => {

  const postId = useParams().id
  const [post, setPost] = useState({})
  const [imagePath, setImagePath] = useState("")
  const { user, setUser } = useContext(UserContext)
  const [bookmarkMap, setBookmarkMap] = useState(new Map())
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loader, setLoader] = useState(true)
  const [userImagePath, setUserImagePath] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
    fetchPostComments()
    createBoookmarkList(user)
    window.scrollTo(0, 0)
  }, [])

  const fetchPost = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL+"/auth/blogRoute/posts/post/" + postId, { headers: { authorization: `Bearer ${user?.token}` } })
      updateViews(res.data.viewedBy)
      setPost(res.data)
      setUserImagePath(res.data.userImagePath ? res.data.userImagePath.replace(/\\/g, '/') : "")
      setImagePath(res.data.imagePath ? res.data.imagePath.replace(/\\/g, '/') : "")
      setLoader(false)
    }
    catch (err) {
      if (err.response && err.response.status === 401) navigate("/login")
      console.log(err)
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
      const res = await axios.put(URL+"/auth/blogRoute/users/bookmarks/" + user._id, { bookmark: bookmark, status: status }, { headers: { authorization: `Bearer ${user?.token}` } })
      setUser({ ...user, bookmarks: res.data })
    }
    catch (err) {
      if (err.response.status === 401) navigate("/login")
      console.log(err)
    }
  }

  const updateViews = async (viewedBy) => {
    if (viewedBy && viewedBy.includes(user._id)) return;
    try {
      viewedBy.push(user._id)
      await axios.put(URL+"/auth/blogRoute/posts/update-views/" + postId, { viewedBy: viewedBy }, { headers: { authorization: `Bearer ${user?.token}` } })
    }
    catch (err) {
      if (err.response.status === 401) navigate("/login")
      console.log(err)
    }
  }

  const handleDeletePost = async () => {
    try {
      await axios.delete(URL+"/blogRoute/posts/delete/" + postId)
      navigate("/")
    }
    catch (err) {
      // if (err.response.status === 401) navigate("/login")
      console.log(err)
    }
  }

  const fetchPostComments = async () => {
    try {
      const res = await axios.get(URL+"/auth/blogRoute/post/comments/" + postId, { headers: { authorization: `Bearer ${user?.token}` } })
      res.data.userImagePath?.replace(/\\/g, '/')
      setComments(res.data)
    }
    catch (err) {
      if (err.response.status === 401) navigate("/login")
      console.log(err)
    }
  }

  const postComment = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(URL+"/auth/blogRoute/post/comments/create", { comment: comment, author: user.username, postId: postId, userImagePath: user.imagePath, userId: user._id, postedAt: new Date(Date.now()).toISOString() }, { headers: { authorization: `Bearer ${user?.token}` } })
      fetchPostComments()
      setComment("")
    }
    catch (err) {
      if (err.response.status === 401) navigate("/login")
      console.log(err)
    }
  }

  window.onscroll = () => {
    const ele = document.getElementById("scroll-to-top")
    if (ele && document.documentElement.scrollTop > 600) ele.style.visibility = "visible"
    else if (ele) ele.style.visibility = "hidden"
  }


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }


  return (
    <div>
      <Navbar />
      {loader
        ? (
          <div className="h-[80vh] flex justify-center items-center w-full"><Loader /></div>
        ) : (
          <div className="p-8 md:px-[200px] relative">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl post-title text-black md:text-3xl text-center font-black">{post.title}</h1>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex flex-row space-x-4">
                <Link to={"/view-profile/" + post.userId}>
                  <div className="flex"><img className="w-8 h-8 rounded-full me-1.5" src={userImagePath ? URL+"/" + userImagePath : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} />
                    <span className="text-blue-500 "><u>{post.username}</u></span></div>
                </Link>
                <div className="text-gray-300">•</div>
                <div className="text-gray-500">{new Date(post.updatedAt).toString().slice(3, 10)}, {new Date(post.updatedAt).toString().slice(11, 15)}</div>
              </div>
            </div>
            {user?._id === post?.userId && <div className="flex items-center my-1 justify-center space-x-2">
              <p className="cursor-pointer" onClick={() => navigate("/edit/" + postId)} ><BiEdit /></p>
              <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete /></p>
            </div>}
            <div className="mx-auto mt-4 text-gray-600">{post.desc}</div>
            <img src={imagePath ? URL + '/' + imagePath : DefaultPost} className="w-full mx-auto mt-8 border" alt="" />
            <div className="mx-auto mt-10">{Parser(post.content ? post.content : "")}</div>
            <div className="flex items-center mt-8 space-x-4 font-semibold">
              <p>Categories:</p>
              <div className="flex flex-wrap space-x-2">
                {post.categories?.map((c, i) => (
                  <>
                    <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
                  </>
                ))}
              </div>
            </div>
            <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
            <div className="w-full flex flex-col mt-4 md:flex-row">
              <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="Write a comment" className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0" />
              <button onClick={postComment} className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0">Add Comment</button>
            </div>
            <div className="flex flex-col mt-4">
              {comments?.map((c) => (
                <Comment key={c._id} c={c} cb={fetchPostComments} />
              ))}
            </div>
            <button onClick={scrollToTop} id="scroll-to-top" style={{ visibility: "hidden" }}>
              <svg width="34px" height="34px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(24) rotate(90)">
                  <rect width="34" height="34" fill="none"></rect>
                  <path d="M.22,10.22A.75.75,0,0,0,1.28,11.28l5-5a.75.75,0,0,0,0-1.061l-5-5A.75.75,0,0,0,.22,1.28l4.47,4.47Z" transform="translate(14.75 17.75) rotate(180)"></path>
                </g>
              </svg>
            </button>
            <div onClick={() => handleBookmark(post)} className="inpost-bookmark btn-fav">
              {(user && bookmarkMap.has(post._id) && bookmarkMap.get(post._id)) ? <FaBookmark style={{ color: "red" }} /> : <FaRegBookmark style={{ color: "red" }} />}
            </div>
          </div>
        )}
      <Footer />
    </div>
  )
}

export default PostDetails