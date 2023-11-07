import Parser from 'html-react-parser';

const HomePosts = ({post}) => {

  return (
    <div className="w-full flex mt-8 space-x-4">
    {/* left */}
    <div className="w-[35%] h-[200px] flex justify-center items-center">
    <img src={post.photo} alt="" className="h-full w-full object-cover"/>
    </div>
    {/* right */}
    <div className="flex flex-col w-[65%]">
      <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">
      {post.title}
      </h1>
      <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
       <p>@{post.username}</p>
       <div className="flex space-x-2 text-sm">
       <p><em>Last modified:</em></p>
       <p><em>{new Date(post.updatedAt).toString().slice(3, 15)}</em></p>
       </div>
      </div>
      <div className="text-sm md:text-md">{Parser(post.desc ? post.desc : "")}</div>
    </div>

    </div>
  )
}

export default HomePosts

