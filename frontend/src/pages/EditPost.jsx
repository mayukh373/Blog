import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { ImCross } from 'react-icons/im'
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import 'quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

const EditPost = () => {

  const postId = useParams().id
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const res = await axios.get("http://localhost:4000/auth/blogRoute/posts/" + postId, { headers: { 'authorization': 'Bearer ' + user.token } })
      setTitle(res.data.title)
      setContent(res.data.content)
      setDesc(res.data.desc)
      setFile(res.data.photo)
      setCats(res.data.categories)
    }
    catch (err) {
      console.log(err)
      navigate(-1)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const post = {
      title,
      desc,
      content,
      username: user.username,
      userId: user._id,
      categories: cats,
      updatedAt: new Date(Date.now()).toISOString()
    }

    // if(file){
    //   const data=new FormData()
    //   const filename=Date.now()+file.name
    //   data.append("img",filename)
    //   data.append("file",file)
    //   post.photo=filename
    //   // console.log(data)
    //   //img upload
    //   try{
    //     const imgUpload=await axios.post(URL+"/api/upload",data)
    //     // console.log(imgUpload.data)
    //   }
    //   catch(err){
    //     console.log(err)
    //   }
    // }
    //post upload

    try {
      const res = await axios.put("http://localhost:4000/auth/blogRoute/posts/" + postId, post, { headers: { 'authorization': 'Bearer ' + user.token } })
      navigate("/posts/post/" + res.data._id)
    }
    catch (err) {
      console.log(err)
    }
  }

  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i, 1)
    setCats(updatedCats)
  }

  const addCategory = () => {
    let updatedCats = [...cats]
    updatedCats.push(cat)
    setCat("")
    setCats(updatedCats)
  }
  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl '>Update a post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none' />
          <textarea style={{resize: "none", overflow: "hidden"}} rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder='Enter post description' className ='px-4 py-2 outline-none' />
          <input onChange={(e) => setFile(e.target.files[0])} type="file" className='px-4' />
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <input value={cat} onChange={(e) => setCat(e.target.value)} className='px-4 py-2 outline-none' placeholder='Enter post category' type="text" />
              <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer'>Add</div>
            </div>

            {/* categories */}
            <div className='flex px-4 mt-3'>
              {cats?.map((c, i) => (
                <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'>
                  <p>{c}</p>
                  <p onClick={() => deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross /></p>
                </div>
              ))}


            </div>
          </div>
          <ReactQuill className="ms-4" theme="snow" value={content} onChange={setContent} />
          <button onClick={handleUpdate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'>Update</button>
        </form>

      </div>
      <Footer />
    </div>
  )
}

export default EditPost