import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { CategoryContext } from "../context/CategoryContext";
import 'quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import DefaultPost from '../assets/DefaultImages/postDefault.png'
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"
import {URL} from '../url' 



const EditPost = () => {

  const postId = useParams().id
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const [imagePath, setImagePath] = useState("")
  const categories = useContext(CategoryContext)
  const [preview, setPreview] = useState("")
  const [checked, setChecked] = useState([])
  const [foo, setFoo] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL+"/auth/blogRoute/posts/post/" + postId, { headers: { 'authorization': 'Bearer ' + user.token } })
      setTitle(res.data.title)
      setContent(res.data.content)
      setDesc(res.data.desc)
      setImagePath(res.data.imagePath ? res.data.imagePath.replace(/\\/g, '/') : "")
      setChecked(res.data.categories)
    }
    catch (err) {
      console.log(err)
      navigate(-1)
    }
  }

  const handleFileChange = (pfile) => {
    setFile(pfile)
    if (!pfile) {
      setPreview("")
      return;
    }
    setFoo(true)
    const fileReader = new FileReader();
    fileReader.readAsDataURL(pfile)
    fileReader.onload = () => {
      setPreview(fileReader.result)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const post = {
      title,
      desc,
      content,
      username: user.username,
      userId: user._id,
      categories: checked,
      updatedAt: new Date(Date.now()).toISOString(),
      imagePath: foo? null : imagePath
    }

    if (file) {
      const data = new FormData()
      data.append("file", file)
      try {
        const imgUpload = await axios.post(URL+"/blogRoute/uploads", data)
        post.imagePath = imgUpload.data;
      }
      catch (err) {
        console.log(err)
      }
    }
    try {
      await axios.put(URL+"/auth/blogRoute/posts/post/" + postId, { post: post, oldImageData: imagePath, foo: foo }, { headers: { 'authorization': 'Bearer ' + user.token } })
      navigate("/posts/post/" + postId)
    }
    catch (err) {
      console.log(err)
    }
  }

  const fetchCategories = () => {
    return (
      categories.map((category, i) => {
        return <div onClick={() => handleCategory(category)} className="flex mx-2 space-x-1 cursor-default" key={i}>
          {checked.includes(category) ? <FaCheckSquare className="my-auto" /> : <FaRegSquare className="my-auto" />}
          <div>{category}</div>
        </div>
      })
    )
  }

  const handleCategory = (category) => {
    if (checked.includes(category)) {
      setChecked(checked.filter((cat) => cat !== category))
    }
    else {
      setChecked([...checked, category])
    }
  }

  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[140px] py-8 bg-slate-200'>
        <h1 className='font-bold md:text-2xl text-xl'>Edit post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none create-title' />
          <input style={{ resize: "none", overflow: "hidden" }} value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder='Enter post description' className='px-4 py-2 outline-none create-desc' />
          <img src={preview ? preview : imagePath ? URL+'/' + imagePath : DefaultPost} alt="post image"></img>
          <input onChange={(e) => handleFileChange(e.target.files[0])} type="file" />
          <div className="flex flex-col">
            <div className="border border-b-0 cats px-2 py-1">Choose one or more categories</div>
            <div className="flex flex-col space-y-2 py-1 h-40 overflow-y-scroll blog-cats-container">{fetchCategories()}</div>
          </div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Start Writing.."
            modules={
              {
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' },
                  { 'indent': '-1' }, { 'indent': '+1' }],
                  ['link', 'video'],
                  ['clean']
                ]
              }
            }
            formats={[
              'header', 'font', 'size',
              'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet', 'indent',
              'link', 'video'
            ]}
          />

          <div className="flex justify-center">
            {(content.replace(/<(.|\n)*?>/g, '').trim().length === 0 || !desc || !title || checked.length === 0) ?
              <button onClick={handleUpdate} disabled style={{ opacity: 0.5 }} className='bg-black w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg'>Create</button>
              : <button onClick={handleUpdate} className='bg-black w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg'>Save</button>
            }
            <button onClick={handleCancel} className='bg-black w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg ms-2'>Cancel</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default EditPost