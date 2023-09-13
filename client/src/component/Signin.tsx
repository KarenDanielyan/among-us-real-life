import React, { useEffect, useState } from "react";
import photo from "@SRC_DIR/public/images/pong.jpg";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Signin.css"; // Import the CSS file for styling

import { useSelector } from "react-redux";
import { CLIENT_ID, GOOGLE_REDIRECT_URI, ip, redirect_link } from "../utils/ip";

/*import React from 'react';

const LoginPage = () => {
  const handleGoogleSignIn = () => {
    // Implement the logic for Google sign-in here
  };

  const handle42SignIn = () => {
    // Implement the logic for 42 sign-in here
  };

  return (
    <div className="parallax-container">
      <div className="parallax-content">
        <h1>Welcome to the Login Page!</h1>
        <button onClick={handleGoogleSignIn>Sign in with Google</button>
        <button onClick={handle42SignIn}>Sign in with 42</button>
      </div>
    </div>
  );
};

export default LoginPage; 



*/

function getUrl() {

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const option = {
    redirect_uri: GOOGLE_REDIRECT_URI as string,
    client_id: CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(option);
  return `${rootUrl}?${qs.toString()}`;
}

const SignIn = () => {

	
  const [stopGoogle, setStopGoogle] = useState(false)
  const [stopft, setStopFt] = useState(false)
  const user = useSelector(state=>state.user)
  const navigate = useNavigate();
  const defaultGooglePos = {
    top: 50,
    left: 50
  }
  const defaultFtPos = {
    top: 60,
    left: 20
  }
  const [ftStyle, setFtStyle] = useState(defaultFtPos)
  const [googleStyle, setGoogleStyle] = useState(defaultGooglePos)
  const handleGoogleSignIn = () => {
    // if (user) navigate("/home", {replace: true});
    // Implement the logic for Google sign-in here
  };

  
 

  useEffect(()=>{
    window.addEventListener("keydown", ()=>{
      setStopGoogle(true);
      setStopFt(true);
    })
  })
 useEffect(()=>{
  if (user) navigate("/home", {replace: true});
  console.log("StGoo: ", stopGoogle);
  console.log("stdpp: ", stopft);
  

 }, [ftStyle, stopGoogle, stopft])
  const ft_link =
    redirect_link as string;
  console.log("=====================================");
  console.log( ft_link);  
  console.log("=====================================");
  
  return (
    <>
       <Link
                        to={getUrl()}
                        >
                        {" "}
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                          alt=""
                          srcSet=""
                        />{" "}
        </Link>
		<Link
                        to={ft_link}
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
                          alt=""
                          srcSet=""
                        />{" "}
        </Link>
    </>
	
  );
};

export default SignIn;
