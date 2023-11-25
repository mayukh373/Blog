import { useEffect, useState, useContext } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import axios from "axios"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import { FaFacebookSquare, FaLinkedin, FaTwitterSquare } from "react-icons/fa";
import Loader from "../components/Loader"
import { UserContext } from "../context/UserContext"
import { BiCalendar, BiSolidEditAlt, BiLink } from 'react-icons/bi'
import { FaRegBookmark, FaBookmark } from "react-icons/fa"
import PostsView from "../components/PostsView"
import EditProfile from './EditProfile'
import ChangePassword from '../components/ChangePassword'
import DeleteAccount from "../components/DeleteAccount"
import ChangeEmail from "../components/ChangeEmail"
import {URL} from '../url' 

export default function ViewProfile() {

    // const { search } = useLocation()
    const userId = useParams().id;
    const [posts, setPosts] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loader, setLoader] = useState(true);
    const { user, setUser } = useContext(UserContext)
    const [tab, setTab] = useState("0");
    const [userInfo, setUserInfo] = useState({});
    const [imagePath, setImagePath] = useState({});
    const navigate = useNavigate();
    const url = window.location.href;
    const [modal, setModal] = useState(false);
    const [toggle, setToggle] = useState("chngemail");
    const [bookmarkMap, setBookmarkMap] = useState(new Map())

    useEffect(() => {
        fetchUserInfo();
        fetchPosts();
        createBoookmarkList(user)
    }, [userId])

    const fetchPosts = async () => {
        try {
            const res = await axios.get(URL+"/blogRoute/posts/user/" + userId)
            res.data.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : (a.updatedAt > b.updatedAt) ? -1 : 0)
            setPosts(res.data)
            if (res.data.length === 0) {
                setNoResults(true)
            }
            else {
                setNoResults(false)
            }
        }
        catch (err) {
            // if (err.response.status === 401) navigate("/login")
            console.log(err)
        }
    }

    const fetchUserInfo = async () => {
        setLoader(true)
        const ele = document.getElementById("0");
        try {
            const res = await axios.get(URL+"/blogRoute/users/" + userId)
            setUserInfo(res.data)
            setImagePath(res.data.imagePath? res.data.imagePath.replace(/\\/g, '/') : "")
            setLoader(false)
            ele.classList.add("tab-grow-right")
        }
        catch (err) {
            // if (err.response.status === 401) navigate("/login")
            setLoader(true)
            console.log(err)
        }
    }

    const createBoookmarkList = (user) => {
        if (!user || !user.bookmarks) return;
        const Bookmarks = user.bookmarks
        if (!Bookmarks) return;
        Bookmarks.map(item => {
            setBookmarkMap(new Map(bookmarkMap.set(item, true)))
        })
    }

    const handleBookmark = (post) => {
        if (!user) return;
        let status = true;
        if (bookmarkMap.has(post._id)) {
            status = !(bookmarkMap.get(post._id))
            setBookmarkMap(new Map(bookmarkMap.set(post._id, status)))
        }
        else setBookmarkMap(new Map(bookmarkMap.set(post._id, true)))
        updateBookmark(post._id, status)
    }

    const updateBookmark = async (bookmark, status) => {
        try {
            const res = await axios.put(URL+"/blogRoute/users/bookmarks/" + user._id, { bookmark: bookmark, status: status })
            setUser({ ...user, bookmarks: res.data })
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleTab = (id) => {
        if (id === tab) return;
        if (tab === "2" && id !== "2") {
            document.getElementById(toggle).style.borderRight = "";
            setToggle("chngemail")
        }
        const toSet = document.getElementById(id), current = document.getElementById(tab);
        if (id > tab) {
            toSet.classList.add("tab-grow-right");
            current.classList = "tab-shrink-right";
        }
        else {
            toSet.classList.add("tab-grow-left");
            current.classList = "tab-shrink-left"
        }
        setTab(id);
    }

    const handleEditStatus = async (status) => {
        if (status) {
            await fetchUserInfo();
        }
        setModal(false)
    }

    const handleToggle = (e) => {
        const ele = document.getElementById(toggle);
        ele.style.borderRight = "";
        e.target.style.borderRight = "2px solid white";
        setToggle(e.target.id);
    }
    return (
        <>
            <Navbar />
            <div className="view-profile-main min-h-[70vh]">
                <div className="relative">
                    <div className="profile-nav-container p-5">
                        <div className="h3 flex"><button className="tab-shrink-left" id="0" onClick={(e) => handleTab(e.target.id)}>Profile</button></div>
                        <div className="h3 flex"><button className="tab-shrink-left" id="1" onClick={(e) => handleTab(e.target.id)}>Blogs</button></div>
                        {user && userInfo._id === user._id && <div className="h3 flex"><button className="tab-shrink-left" id="2" onClick={(e) => handleTab(e.target.id)}>Account Settings</button></div>}
                    </div>
                </div>
                {tab === "1" ?
                    //display blogs
                    <div>
                        <div className="md:px-[24px] min-h-[80vh] ">
                            {loader ? <div className="h-[40vh] flex justify-center items-center"><Loader /></div> : !noResults ?
                                <div className="flex flex-wrap flex-row justify-center">{posts.map((post, i) => (
                                    <div className="relative">
                                        <Link to={"/posts/post/" + post._id}> <div className="m-2 flex basis-1/4 min-w-[300px] max-w-[300px] h-[460px] home-posts relative">
                                            <PostsView key={post._id} post={post} />
                                        </div> </Link>
                                        <div onClick={(e) => handleBookmark(post)} className="absolute bottom-4 left-56 mb-0.5 btn-fav btn-fav-true">
                                            {(user && bookmarkMap.has(post._id) && bookmarkMap.get(post._id)) ? <FaBookmark style={{ color: "red" }} /> : <FaRegBookmark style={{ color: "red" }} />}
                                        </div>
                                    </div>
                                ))}</div> : <h3 className="text-center font-bold mt-16">No posts available</h3>}
                        </div>
                    </div> : tab === "0" ?
                        //or display user info
                        <div className="min-h-[55vh] mt-2">
                            {loader ? <div className="h-[40vh] flex justify-center items-center"><Loader /></div> :
                                <div className="flex flex-row flex-wrap justify-center space-x-12">
                                    <div className="flex flex-col items-center w-48 shrink-0">
                                        <div className="flex mx-auto my-auto"><img className="w-40 h-40 rounded-full mx-auto border-4 border-black p-1" src={imagePath ? URL + "/" + imagePath : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt="Rounded avatar"></img></div>
                                        {<div className="flex mt-2">
                                            <button className="edit-profile bg-black text-white p-1 mb-2" onClick={() => setModal(true)}>
                                                <div className="flex">
                                                    <div className="my-auto me-1"><BiSolidEditAlt /></div>
                                                    <div className="pe-1">Edit Profile</div>
                                                </div>
                                            </button>
                                        </div>}
                                    </div>
                                    <div className="flex flex-col p-2 w-[340px] ">
                                        <div className="flex text-center text-white username-txt">{userInfo.username}</div>
                                        <div className="flex text-sm mb-2 font-medium">
                                            <div className="my-auto me-1"><BiCalendar /></div>
                                            <div>Joined: {new Date(userInfo.createdOn).toString().slice(3, 10)}, {new Date(userInfo.createdOn).toString().slice(11, 15)}</div>
                                        </div>
                                        <div className="user-bio text-base">{userInfo.bio ? userInfo.bio : ""}</div>
                                        <div className="flex flex-row space-x-4 mt-2">
                                            {userInfo.links[0] && userInfo.links[0].url && <div><a href={userInfo.links[0].url}><FaFacebookSquare style={{ fontSize: "1.5em", color: "rgb(66, 103, 178" }} /></a></div>}
                                            {userInfo.links[1] && userInfo.links[1].url && <div><a href={userInfo.links[1].url}><FaTwitterSquare style={{ fontSize: "1.5em" }} /></a></div>}
                                            {userInfo.links[2] && userInfo.links[2].url && <div><a href={userInfo.links[2].url}><FaLinkedin style={{ fontSize: "1.5em", color: "rgb(10, 102, 194)" }} /></a></div>}
                                            <div className="profile-link"><a onClick={async () => { await navigator.clipboard.writeText(url) }}><BiLink style={{ fontSize: "1.5em" }} /></a></div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div> :
                        //display user account settings
                        (user && user._id === userInfo._id)? <div className="flex flex-col max-md:space-y-4 md:flex-row md:mx-40 md:space-x-8 justify-center my-8 h-[150px] text-sm">
                            <div className="flex flex-row justify-center max-md:space-x-8 md:space-y-4 md:flex-col">
                                <div onClick={(e) => handleToggle(e)} style={{ borderRight: "2px solid white" }} id="chngemail" className="px-1 flex btn-accinfo cursor-pointer text-center">Change Email</div>
                                <div onClick={(e) => handleToggle(e)} id="chngpw" className="px-1 flex btn-accinfo cursor-pointer text-center">Change Password</div>
                                <div onClick={(e) => handleToggle(e)} id="accdel" className="px-1 flex btn-accinfo cursor-pointer text-center text-red-500">Delete Account</div>
                            </div>
                            <div className="flex justify-center">
                                {toggle === "chngemail" && <ChangeEmail oldInfo={userInfo} currentEmail={userInfo.email} userId={userId} />}
                                {toggle === "chngpw" && <ChangePassword userId={userId} />}
                                {toggle === "accdel" && <DeleteAccount userId={userId} />}
                            </div>
                        </div> : ""}
            </div>
            {modal && <div className="profile-edit-modal" id="editprofile"><EditProfile handleEditStatus={handleEditStatus} oldUserInfo={userInfo} oldImagePath={imagePath} /></div>}
            <Footer />
        </>
    );
}