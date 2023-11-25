import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import {URL} from '../url' 


const EditProfile = ({ handleEditStatus, oldUserInfo, oldImagePath }) => {
  const userId = useParams().id
  const [file, setFile] = useState(null)
  const [links, setLinks] = useState([{ id: "0", url: "" }, { id: "1", url: "" }, { id: "2", url: "" }])
  const [userInfo, setUserInfo] = useState({ username: "", bio: "" })
  const [preview, setPreview] = useState("")
  const [error, setError] = useState({ status: false, message: "" })
  const { user, setUser } = useContext(UserContext)
  const [foo, setFoo] = useState(false)

  useEffect(() => {
    setProfileValues();
  }, [])

  const setProfileValues = () => {
    setUserInfo({ username: oldUserInfo.username, bio: oldUserInfo.bio }) 
    setLinks(oldUserInfo.links.length > 0 ? oldUserInfo.links.map(link => {
      if (link && link.url) return { ...link, url: link.url };
      else return { ...link, url: "" };
    }) : links)
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

  const handleLinkChange = (e) => {
    setLinks(links.map(app => {
      if (e.target.id === app.id) return { ...app, url: e.target.value };
      else return app;
    }))
  }

  const handleUserProfileUpdate = async () => {
    userInfo.links = links
    userInfo.imagePath = foo? null : oldImagePath
    let imagePath = "";
    if (file) {
      const data = new FormData()
      data.append("file", file)
      try {
        const imgUpload = await axios.post(URL+"/blogRoute/uploads", data)
        imagePath = imgUpload.data;
        userInfo.imagePath = imgUpload.data;
      }
      catch (err) {
        console.log(err)
      }
    }
    try {
      await axios.put(URL+"/blogRoute/update/user-profile/" + userId, {userInfo: userInfo, oldImagePath: oldImagePath, imagePath: imagePath, foo: foo})
      setError({ status: false, message: "" })
      setUser({...user, imagePath: imagePath})
      handleEditStatus(true);
    }
    catch (err) {
      setError({ status: true, message: err.response.data })
      console.log(err)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    handleEditStatus(false);
  }

  return (
    <div className="bg-white p-2 my-12 md:mx-40">
      <div className="text-xl font-bold mb-4 mt-2 text-center font-serif relative">
        <div className="h1 inline-block">Edit Profile</div>
        <span className="absolute right-0 -top-4 text-3xl cursor-pointer" onClick={handleCancel}>&times;</span>
      </div>
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row flex-wrap space-x-12 justify-center">
        <div className="flex flex-col space-y-4 items-center">
          <div className="flex h-36"><img className="w-36 rounded-full mx-auto border-2" src={preview ? preview : oldImagePath? URL+"/"+oldImagePath : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt="Rounded avatar"></img></div>
          <div className="flex shrink-1"><input onChange={(e) => handleFileChange(e.target.files[0])} type="file" className="max-w-[200px]" /></div>
        </div>
          <div className="flex flex-col justify-center space-y-6 items-center">
            <div className="flex flex-row justify-start">
              <div className="flex my-auto text-amber-400 text-xs me-2 font-semibold">USERNAME</div>
              <div className="flex border-b-2 border-black"><input className="outline-none px-2 text-sm max-w-[160px]" onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })} value={userInfo.username} type="text" placeholder="Enter your username" /></div>
            </div>
            <div className="flex flex-row justify-start space-x-4">
              <div className="flex my-auto text-amber-400 text-xs me-8 font-semibold">BIO</div>
              <div className="flex border-b-2 border-black"><input className="outline-none px-2 text-sm max-w-[160px]" onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })} value={userInfo.bio? userInfo.bio : ""} type="text" placeholder="Enter your bio" /></div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6 items-center">
            <div className="flex flex-row justify-start space-x-4">
              <div className="flex my-auto text-amber-400 text-xs font-semibold">FACEBOOK</div>
              <div className="flex border-b-2 border-black"><input className="outline-none px-2 text-sm max-w-[160px]" id="0" onChange={(e) => handleLinkChange(e)} value={links[0]? links[0].url : ""} type="url" placeholder="Link to facebook profile" /></div>
            </div>
            <div className="flex flex-row justify-start space-x-4">
              <div className="flex my-auto text-amber-400 text-xs me-2.5 font-semibold">TWITTER</div>
              <div className="flex border-b-2 border-black"><input className="outline-none px-2 text-sm max-w-[160px]" id="1" onChange={(e) => handleLinkChange(e)} value={links[1]? links[1].url : ""} type="url" placeholder="Link to twitter profile" /></div>
            </div>
            <div className="flex flex-row justify-start space-x-4">
              <div className="flex my-auto text-amber-400 text-xs me-1.5 font-semibold">LINKEDIN</div>
              <div className="flex border-b-2 border-black"><input className="outline-none px-2 text-sm max-w-[160px]" id="2" onChange={(e) => handleLinkChange(e)} value={links[2]? links[2].url : ""} type="url" placeholder="Link to linkedin profile" /></div>
            </div>
        </div>
      </div>
      {error.status && <h3 className="text-red-500 text-sm mt-1">{error.message}</h3>}
      <div className="flex justify-center mt-4 mb-4">
        <button onClick={handleUserProfileUpdate} className='bg-black w-[25%] md:w-[90px] text-white font-semibold px-4 py-2 text-lg text-center me-2'>Save</button>
      </div>
    </div>
  )
}

export default EditProfile