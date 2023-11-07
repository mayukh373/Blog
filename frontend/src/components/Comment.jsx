import axios from "axios"
import { MdDelete } from "react-icons/md"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const Comment = ({ c }) => {

  const { user } = useContext(UserContext)

  const deleteComment = async (id) => {
    try {
      await axios.delete("http://localhost:4000/blogRoute/post/comments/delete/" + id)
      window.location.reload(true)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="px-2 py-2 bg-gray-200 rounded-lg my-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-600">@{c.author}</h3>
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