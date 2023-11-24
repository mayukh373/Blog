import { Link } from 'react-router-dom'
import { FaFacebookSquare, FaTwitterSquare, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <>
      <div className="text-white w-full bg-black px-8 md:px-[300px] flex flex-col space-y-6 justify-center text-sm md:text-md py-8 ">
        <div className="flex flex-row flex-wrap space-x-4 justify-center w-full">
          <Link to="/about-us">About</Link>
          <Link to="/">Blogs</Link>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
          <p>Terms of Service</p>
        </div>
        <div className="space-x-4 flex justify-center w-full">
          <a href="https://www.facebook.com"><FaFacebookSquare style={{ fontSize: "2em"}}/></a>
          <a href='https://www.twitter.com'><FaTwitterSquare style={{ fontSize: "2em" }} /></a>
          <a href="https://www.linkedin.com"><FaLinkedin style={{ fontSize: "2em" }} /></a>
        </div>
      </div>
      <p className="py-2 pb-6 text-center text-white bg-black text-sm">All rights reserved @LucidLines 2023</p>
    </>
  )
}

export default Footer