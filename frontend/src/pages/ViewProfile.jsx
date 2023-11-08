import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import axios from "axios"
import { UserContext } from "../context/UserContext"
import { useNavigate, useParams } from "react-router-dom"

export default function ViewProfile() {
    return (
        <div>
            <Navbar />
            <div className="mx-auto w-2/3 flex flex-row justify-evenly">
                <div className="text-3xl text-center">
                    <div className="mt-10">POSTS</div>
                    <div className="mt-3">200</div>
                </div>
                <div>
                    <img className="w-36 rounded-full shadow-xl dark:shadow-gray-400 mx-auto my-5" src="https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg" alt="Rounded avatar"></img>
                    <div className="text-center">Username</div>
                    <div><em>Started writing on 26 Nov, 2013</em></div>
                </div>
                <div className="text-3xl text-center">
                    <div className="mt-10">COMMENTS</div>
                    <div className="mt-3">200</div>
                </div>
            </div>
            <div>View Profile</div>
            <Footer />
        </div>
    );
}