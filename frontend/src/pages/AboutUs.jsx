
import React from 'react';
import { FaUsers, FaHandsHelping, FaBookOpen, FaFeatherAlt, FaMagic } from 'react-icons/fa';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-box">
        <h1 className="about-us-title"><FaBookOpen /> Welcome to Blog Market</h1>

        <p className="about-us-text">
          At Blog Market, we believe in the power of words to inspire, inform, and connect people from all walks of life.
          Our commitment is to deliver content that sparks curiosity, fosters meaningful conversations, and enriches the lives of our readers.
        </p>
      </div>

      <div className="about-us-box mission-box">
        <h2 className="about-us-subtitle"><FaFeatherAlt /> Our Mission</h2>

        <p className="about-us-text">
          At the heart of Blog Market is a mission to provide a diverse range of high-quality articles that cater to the varied interests of our audience.
          Whether you're a seasoned enthusiast or a curious novice, our goal is to offer content that captivates, educates, and entertains.
          We are dedicated to creating a space where knowledge meets passion, fostering a community that thrives on shared interests and a hunger for learning.
        </p>
      </div>

      <div className="about-us-box apart-box">
        <h2 className="about-us-subtitle"><FaMagic /> What Sets Us Apart</h2>

        <h3 className="about-us-subsubtitle"><FaUsers /> Expertise and Authenticity</h3>
        <p className="about-us-text">
          Our team of passionate writers and experts are dedicated to delivering content that is well-researched, accurate, and reliable.
          We strive to provide information that you can trust, ensuring that every article is backed by a commitment to quality and authenticity.
        </p>

        <h3 className="about-us-subsubtitle"><FaUsers /> Diverse Perspectives</h3>
        <p className="about-us-text">
          Blog Market takes pride in celebrating diversity. Our content reflects a broad range of perspectives, ensuring that we cover topics that resonate with people from various backgrounds and interests.
          We believe that a diversity of voices leads to a richer, more inclusive conversation.
        </p>

        <h3 className="about-us-subsubtitle"><FaUsers /> Engaging and User-Friendly Design</h3>
        <p className="about-us-text">
          We understand the value of your time and strive to make your browsing experience seamless and enjoyable.
          Our user-friendly design ensures that you can easily navigate through our articles, finding the information you need in a visually appealing and accessible format.
        </p>
      </div>

      <div className="about-us-box community-box">
        <h2 className="about-us-subtitle"><FaHandsHelping /> Join Our Community</h2>

        <p className="about-us-text">
          Blog Market is more than just a platform; it's a community of like-minded individuals who share a passion for learning and exploration.
          We invite you to join our community by subscribing to our newsletter, following us on social media, and actively participating in the discussions that unfold within our comment sections.
        </p>

        <p className="about-us-text">
          Thank you for being a part of the Blog Market journey. As we continue to grow and evolve, we are excited to have you with us every step of the way.
          Stay tuned for captivating content that will inform, inspire, and ignite your curiosity.
        </p>

        <div className="social-icons">
          <a href='https://www.facebook.com/'><FaFacebook className="icon" /></a>
          <a href='https://www.instagram.com/accounts/login/?hl=en'> <FaInstagram className="icon" /> </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;


