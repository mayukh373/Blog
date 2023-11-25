import { FaRegEye } from 'react-icons/fa';
import DefaultPost from '../assets/DefaultImages/postDefault.png'
import {URL} from '../url' 

const HomePosts = ({ post }) => {

  const imagePath = post.imagePath?.replace(/\\/g, '/')
  const userImagePath = post.userImagePath?.replace(/\\/g, '/')

  return (
    <>
      <div className="flex flex-col w-100 bg-white relative">
        <div className="post-cover">
          <img src={imagePath ? URL+'/' + imagePath : DefaultPost} alt="post image" />
        </div>
        <div className="flex flex-col space-y-0.5 m-2 text-sm font-semibold text-gray-500 items-center">
          <div className="flex flex-row space-x-1">
            <div className="flex my-auto"><img className="w-8 h-8 p-0.5 rounded-full mx-auto" src={userImagePath ? URL + "/" + userImagePath : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} /></div>
            <div className="flex my-auto">{post.username}</div>
          </div>
          <div className="flex text-sm ms-1">
            <em>{new Date(post.updatedAt).toString().slice(3, 10)}, {new Date(post.updatedAt).toString().slice(11, 15)}</em>
          </div>
        </div>
        <div className="flex text-md font-bold text-center justify-center px-1 border-b h-[100px]">
          {post.title}
        </div>
        <div className="flex flex-row space-x-1 absolute right-4 bottom-2 post-view-stats" >
          <FaRegEye style={{ margin: "auto 4px", fontSize: "1.3em" }} />
          <div className="my-auto">{post.viewedBy.length}</div>
        </div>
      </div>
    </>
  )
}

export default HomePosts

