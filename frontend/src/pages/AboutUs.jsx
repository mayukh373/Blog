import React from 'react';
import { FaUsers, FaHandsHelping, FaFeatherAlt, FaFacebookSquare, FaTwitterSquare, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EXPERTISE from '../assets/DefaultImages/AboutUsEXPERTISE.png'
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext';
import {URL} from '../url' 

const AboutUs = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { user } = useContext(UserContext)
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-12 mb-4 p-2">
        <div className="flex flex-col about-us-top py-12 text-black shadow-black">
          <div className="text-center about-us-h1">Discover.Connect.Unwind</div>
          <div className="text-center about-us-h2">You write, we deliver</div>
          <button className="mx-auto border-2 border-black p-2 my-[4%] hover:bg-red-50" onClick={() => user ? navigate("/write") : navigate("/login")} >Start Writing</button>
          <div className="text-center">
            We believe in the power of words to inspire, inform, and connect people from all walks of life.
          </div>
        </div>

        <div className="justify-center md:justify-between mission-box flex flex-wrap md:h-56">
          <div className="flex flex-col m-4 md:ms-20 space-y-2 justify-center md:basis-1/3">
            <div className="about-us-subtitle flex" ><FaFeatherAlt className="me-2.5 my-auto" />Our Mission</div>
            <div className="about-us-text">
              At <strong>LucidLines</strong>, we aim to provide a diverse range of high-quality articles that cater to the varied interests of our audience.
            </div>
          </div>
          <img className="h-60 shadow-md m-1 md:-mt-2 md:me-2" src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </div>

        <div>
          <div className="about-us-subtitle flex justify-center text-center mb-2 font-bold">What Sets Us Apart</div>
          <div className="flex flex-row flex-wrap text-black max-md:space-y-2 md:space-x justify-center">
            <div className="flex flex-col space-y-4 md:basis-1/3 p-5 apart-box text-center">
              <img width={30} className="mx-auto" src={EXPERTISE} />
              <div className="text-sm"> Expertise and Authenticity</div>
              <div className="about-us-text font-light text-sm">
                Our team of passionate writers and experts are dedicated to delivering content that is well-researched, accurate, and reliable.
              </div>
            </div>
            <div className="flex flex-col space-y-4 md:basis-1/3 p-5 apart-box text-center">
              <FaUsers className="mx-auto" style={{ fontSize: "24px" }} />
              <div className="text-sm"> Diverse Perspectives</div>
              <div className="about-us-text font-light text-sm">
                Our content reflects a broad range of perspectives, ensuring that we cover topics that resonate with people from various backgrounds and interests.
              </div>
            </div>
            <div className="flex flex-col space-y-4 md:basis-1/3 p-5 apart-box text-center">
              <img width={30} className="mx-auto" src="https://static.thenounproject.com/png/4653373-200.png" />
              <div className="text-sm">Engaging and User-Friendly Design</div>
              <div className="about-us-text font-light text-sm">
                Our user-friendly design ensures that you can easily navigate through our articles, finding the information you need in a visually appealing and accessible format.
              </div>
            </div>
          </div>
        </div>

        <div className="about-us-box community-box">
          <h2 className="about-us-subtitle flex justify-center mb-4"><FaHandsHelping className="my-auto me-2" /> Join Our Community</h2>

          <p className="about-us-text text-center md:mx-16">
            We invite you to join our community by following us on social media, and actively participating in the discussions that unfold within our comment sections.
            As we continue to grow and evolve, we are excited to have you with us every step of the way.
          </p>

          <div className="space-x-4 social-icons flex justify-center">
            <a href="https://www.facebook.com"><FaFacebookSquare style={{ fontSize: "2em" }} className="" /></a>
            <a href='https://www.twitter.com'><FaTwitterSquare style={{ fontSize: "2em" }} /></a>
            <a href="https://www.linkedin.com"><FaLinkedin style={{ fontSize: "2em" }} /></a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;


