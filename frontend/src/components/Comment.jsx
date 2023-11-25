import axios from "axios"
import { MdDelete } from "react-icons/md"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { Link } from 'react-router-dom'
import {URL} from '../url' 

const Comment = ({ c, cb }) => {

  const { user } = useContext(UserContext)

  const deleteComment = async (id) => {
    try {
      await axios.delete(URL+"/blogRoute/post/comments/delete/" + id)
      cb()
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="px-2 py-2 bg-gray-200 rounded-lg my-2">
      <div className="flex items-center justify-between">
        <div className="flex">
          <Link to={"/view-profile/" + c.userId} className="flex flex-row space-x-2 m-0.5">
            <div><img className="w-6 h-6 rounded-full" src={c.userImagePath ? "http://localhost:4000/" + c.userImagePath : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} /></div>
            <div className="font-bold text-sky-500 hover:text-sky-700">{c.author}</div>
          </Link>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <p>{new Date(c.postedAt).toString().slice(3, 10)}, {new Date(c.postedAt).toString().slice(11, 15)}</p>
          {user?._id === c?.userId ?
            <div className="flex items-center justify-center space-x-2">
              <p className="cursor-pointer" onClick={() => deleteComment(c._id)}><MdDelete /></p>
            </div> : ""}
        </div>
      </div>
      <p className="px-4 mt-2">{c.comment}</p>
    </div>
  )
}

export default Comment