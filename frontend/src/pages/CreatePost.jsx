import React from "react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { CategoryContext } from "../context/CategoryContext";
import axios from 'axios'
import 'quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import { Navigate, useNavigate } from 'react-router-dom'
import DefaultPost from '../assets/DefaultImages/postDefault.png'


const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const { user } = useContext(UserContext)
  const categories = useContext(CategoryContext)
  const [cats, setCats] = useState("")
  const navigate = useNavigate()
  const [preview, setPreview] = useState("")

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (user === null) navigate('/login');
    const post = {
      title,
      desc,
      content,
      username: user.username,
      userId: user._id,
      categories: cats,
      imagePath: null,
      userImagePath: user.imagePath? user.imagePath : null,
      updatedAt: new Date(Date.now()).toISOString()
    }

    if (file) {
      const data = new FormData()
      data.append("file", file)
      try {
        const imgUpload = await axios.post("http://localhost:4000/blogRoute/uploads", data)
        post.imagePath = imgUpload.data;
      }
      catch (err) {
        console.log(err)
      }
    }
    try {
      const res = await axios.post("http://localhost:4000/auth/blogRoute/create-post", post, { headers: { 'authorization': 'Bearer ' + user.token } })
      navigate("/posts/post/" + res.data._id)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleFileChange = (pfile) => {
    setFile(pfile)
    if (!pfile) {
      setPreview("")
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(pfile)
    fileReader.onload = () => {
      setPreview(fileReader.result)
    }
  }

  const fetchCategories = () => {
    return (
      categories.map((category, i) => {
        return <div key={i}>
          <label><input type="checkbox" className="mx-2" id={i} name={category} onClick={(e) => handleCategory(e)} />{category}</label>
        </div>
      })
    )
  }

  const handleCategory = (e) => {
    if (e.target.checked) {
      setCats([...cats, e.target.name])
    }
    else {
      setCats(cats.filter((cat) => cat !== e.target.name))
    }
  }

  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] my-8'>
        <h1 className='font-bold md:text-2xl text-xl ms-4'>Create a post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none' />
          <textarea style={{ resize: "none", overflow: "hidden" }} rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder='Enter post description' className='px-4 py-2 outline-none' />
          <img src={preview ? preview : DefaultPost} alt="post image"></img>
          <input onChange={(e) => handleFileChange(e.target.files[0])} type="file" className='px-4' />
          <div className="flex flex-col">
            <div className="mb-2">Choose one or more categories</div>
            <div className="flex flex-col space-y-2 h-40 overflow-y-scroll ">{fetchCategories()}</div>
          </div>
          <ReactQuill className="ms-4" theme="snow" value={content} onChange={setContent} placeholder="Start Writing.." />
          <div className="flex justify-center">
            {(content.replace(/<(.|\n)*?>/g, '').trim().length === 0 || !desc || !title || cats.length === 0) ?
              <button onClick={handleCreate} disabled style={{ opacity: 0.5 }} className='bg-black w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg'>Create</button>
              : <button onClick={handleCreate} className='bg-black w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg'>Create</button>
            }
            <button onClick={handleCancel} className='bg-black w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg ms-2'>Cancel</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default CreatePost