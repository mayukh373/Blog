import { useNavigate, useParams } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import axios from "axios"
import { useContext, useEffect, useReducer, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"
import Parser from 'html-react-parser';

const PostDetails = () => {

  const postId = useParams().id
  const [post, setPost] = useState({})
  const { user } = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost();
    fetchPostComments();
  }, [postId])

  const fetchPost = async () => {
    try {
      const res = await axios.get("http://localhost:4000/auth/blogRoute/posts/" + postId, { headers: { 'Authorization': 'Bearer ' + user.token } })
      setPost(res.data)
      setLoader(false)
    }
    catch (err) {
      console.log(err)
      navigate('/login')
    }
  }

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete("http://localhost:4000/auth/blogRoute/posts/delete/" + postId, { headers: { 'authorization': 'Bearer ' + user.token } })
      navigate("/")
    }
    catch (err) {
      console.log(err)
    }

  }

  const fetchPostComments = async () => {
    setLoader(true)
    try {
      const res = await axios.get("http://localhost:4000/blogRoute/post/comments/" + postId)
      setComments(res.data)
      setLoader(false)
    }
    catch (err) {
      setLoader(true)
      console.log(err)
    }
  }

  const postComment = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:4000/blogRoute/post/comments/create", { comment: comment, author: user.username, postId: postId, userId: user._id, postedAt: new Date(Date.now()).toISOString() })
      fetchPostComments()
      setComment("")
      window.location.reload(true)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar />
      {loader ? <div className="h-[80vh] flex justify-center items-center w-full"><Loader /></div> : <div className="px-8 md:px-[200px] mt-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
          {user?._id === post?.userId && <div className="flex items-center justify-center space-x-2">
            <p className="cursor-pointer" onClick={() => navigate("/edit/" + postId)} ><BiEdit /></p>
            <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete /></p>
          </div>}
        </div>
        <div className="flex items-center justify-between mt-2 md:mt-4">
          <p>@{post.username}</p>
          <div className="flex space-x-2">
            <p><em>Last modified:</em></p>
            <p><em>{new Date(post.updatedAt).toString().slice(3, 10)}, {new Date(post.updatedAt).toString().slice(11, 15)}</em></p>
          </div>
        </div>
        <div className="mx-auto mt-8">{post.desc}</div>
        <img src={post.photo} className="w-full  mx-auto mt-8" alt="" />
        <div className="mx-auto mt-8">{Parser(post.content ? post.content : "")}</div>
        <div className="flex items-center mt-8 space-x-4 font-semibold">
          <p>Categories:</p>
          <div className="flex justify-center items-center space-x-2">
            {post.categories?.map((c, i) => (
              <>
                <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
              </>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
          {comments?.map((c) => (
            <Comment key={c._id} c={c} />
          ))}
        </div>
        {/* write a comment */}
        <div className="w-full flex flex-col mt-4 md:flex-row">
          <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="Write a comment" className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0" />
          <button onClick={postComment} className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0">Add Comment</button>
        </div>
      </div>}
      <Footer />
    </div>
  )
}

export default PostDetails