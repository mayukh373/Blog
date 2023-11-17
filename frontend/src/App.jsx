import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PostDetails from './pages/PostDetails'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import EditProfile from './pages/EditProfile'
import ViewProfile from './pages/ViewProfile'
import { UserContextProvider } from './context/UserContext'
import { CategoryContextProvider } from './context/CategoryContext'
import MyBlogs from './pages/MyBlogs'
import AboutUs from './pages/AboutUs'
import Bookmarks from './pages/Bookmarks'
import './App.css'

const App = () => {
  return (
    <CategoryContextProvider>
      <UserContextProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/write" element={<CreatePost />} />
          <Route exact path="/posts/post/:id" element={<PostDetails />} />
          <Route exact path="/view-profile/:id" element={<ViewProfile />} />
          <Route exact path="/edit/:id" element={<EditPost />} />
          <Route exact path="/myblogs/:id" element={<MyBlogs />} />
          <Route exact path="/bookmarks/:id" element={<Bookmarks />} />
          <Route exact path="/edit-profile/:id" element={<EditProfile />} />
          <Route exact path="/about-us" element={<AboutUs />} />
        </Routes>
      </UserContextProvider>
    </CategoryContextProvider>
  )
}

export default App