import { Link, useLocation, useParams } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import PostsView from "../components/PostsView"
import Loader from "../components/Loader"
import { FaRegBookmark, FaBookmark } from "react-icons/fa"


const Bookmarks = () => {
    const { search } = useLocation()
    const userId = useParams().id;
    const [posts, setPosts] = useState([])
    const [loader, setLoader] = useState(true)
    const { user, setUser } = useContext(UserContext)
    const [bookmarkMap, setBookmarkMap] = useState(new Map())

    useEffect(() => {
        fetchPosts()
    }, [search])

    const fetchPosts = async () => {
        if (user.bookmarks.length !== 0) {
            await Promise.all(user.bookmarks.map(async (postId) => {
                try {
                    const res = await axios.get("http://localhost:4000/blogRoute/posts/post/" + postId)
                    if (!res.data) updateBookmark(postId, false)
                    else setPosts(current => [...current, res.data])
                }
                catch (err) {
                    console.log(err)
                }
            }))
        }
        createBoookmarkList(user)
        setLoader(false)
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
            const res = await axios.put("http://localhost:4000/blogRoute/users/bookmarks/" + user._id, { bookmark: bookmark, status: status })
            setUser({ ...user, bookmarks: res.data })
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Navbar/>
            <div className="md:px-[24px] min-h-[80vh] bg-slate-300">
                {loader ? <div className="h-[40vh] flex justify-center items-center"><Loader /></div> : (user.bookmarks.length !== 0) ?
                    <div className="flex flex-wrap flex-row justify-center">{posts.map((post, i) => (
                        <div className="relative">
                            <Link to={"/posts/post/" + post._id}> <div className="m-2 flex basis-1/4 min-w-[300px] max-w-[300px] h-[460px] home-posts relative">
                                <PostsView key={post._id} post={post} />
                            </div> </Link>
                            <div onClick={(e) => handleBookmark(post)} className="absolute bottom-4 left-56 mb-0.5 btn-fav btn-fav-true">
                                {(user && bookmarkMap.has(post._id) && bookmarkMap.get(post._id)) ? <FaBookmark style={{ color: "red" }} /> : <FaRegBookmark style={{ color: "red" }} />}
                            </div>
                        </div>
                    ))}</div> : <h3 className="text-center font-bold pt-14">No Bookmarks</h3>}
            </div>
            <Footer />
        </>
    )
}

export default Bookmarks