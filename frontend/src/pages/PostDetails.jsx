import { useNavigate, useParams, Link } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"
import Parser from 'html-react-parser';
import DefaultPost from '../assets/DefaultImages/postDefault.png'

const PostDetails = () => {

  const postId = useParams().id
  const [post, setPost] = useState({})
  const [imagePath, setImagePath] = useState("")
  const { user } = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loader, setLoader] = useState(true)
  const [userImagePath, setUserImagePath] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
    fetchPostComments();
  }, [postId])

  const fetchPost = async () => {
    setLoader(true)
    try {
      const res = await axios.get("http://localhost:4000/auth/blogRoute/posts/post/" + postId, { headers: { 'Authorization': 'Bearer ' + user.token } })
      updateViews(res.data.viewedBy)
      setPost(res.data)
      setUserImagePath(res.data.userImagePath ? res.data.userImagePath.replace(/\\/g, '/') : "")
      setImagePath(res.data.imagePath ? res.data.imagePath.replace(/\\/g, '/') : "")
      setLoader(false)
    }
    catch (err) {
      console.log(err)
      navigate('/login')
    }
  }

  const updateViews = async (viewedBy) => {
    if (viewedBy && viewedBy.includes(user._id)) return;
    try {
      console.log(viewedBy)
      viewedBy.push(user._id)
      const res = await axios.put("http://localhost:4000/blogRoute/posts/update-views/" + postId, { viewedBy: viewedBy })
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleDeletePost = async () => {
    try {
      await axios.delete("http://localhost:4000/blogRoute/posts/delete/" + postId, { data: { imagePath: imagePath } }, { headers: { 'authorization': 'Bearer ' + user.token } })
      navigate("/")
    }
    catch (err) {
      console.log(err)
    }
  }

  const fetchPostComments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/blogRoute/post/comments/" + postId)
      res.data.userImagePath?.replace(/\\/g, '/')
      setComments(res.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  const postComment = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:4000/blogRoute/post/comments/create", { comment: comment, author: user.username, postId: postId, userImagePath: user.imagePath, userId: user._id, postedAt: new Date(Date.now()).toISOString() })
      fetchPostComments()
      setComment("")
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar />
      {loader ? <div className="h-[80vh] flex justify-center items-center w-full"><Loader /></div> : <div className="p-8 md:px-[200px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl post-title text-black md:text-3xl text-center font-black">{post.title}</h1>
          {user?._id === post?.userId && <div className="flex items-center justify-center space-x-2">
            <p className="cursor-pointer" onClick={() => navigate("/edit/" + postId)} ><BiEdit /></p>
            <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete /></p>
          </div>}
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-row space-x-4">
            <Link to={"/view-profile/" + post.userId}>
              <div className="flex"><img className="w-8 h-8 rounded-full me-1.5" src={userImagePath ? "http://localhost:4000/" + userImagePath : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} />
                <span className="text-blue-500 "><u>{post.username}</u></span></div>
            </Link>
            <div className="text-gray-300">•</div>
            <div className="text-gray-500">{new Date(post.updatedAt).toString().slice(3, 10)}, {new Date(post.updatedAt).toString().slice(11, 15)}</div>
          </div>
        </div>
        <div className="mx-auto mt-8 text-gray-600">{post.desc}</div>
        <img src={imagePath ? 'http://localhost:4000/' + imagePath : DefaultPost} className="w-full mx-auto mt-8 border" alt="" />
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
        {/* write a comment */}
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
      </div>}
      <Footer />
    </div>
  )
}

export default PostDetails