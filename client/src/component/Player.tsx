import React, { useEffect, useState } from 'react'
import '../Styles/Players.css'
import { io } from 'socket.io-client'
import Game from './Game';
import SignIn from './Signin';
import { socket } from '../utils/ip';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/redux';
function Player() {
	console.log("ddd",import.meta.env);
	const dispatch = useDispatch()
	const user = useSelector((state: AppState) => state.user);
	const navigate = useNavigate()
	if(!user)
		navigate("/",{replace:true})
	const [userSubmit,setUserSubmit] = useState(false);
	const [logoutSubmit, setLogoutSubmit] = useState(false);
	useEffect(()=>{
		console.log(`My states:\nUser: ${userSubmit}\tLogout: ${logoutSubmit}`);

	},[userSubmit])
	useEffect(()=>{
		if(logoutSubmit == true)
			dispatch(setUser(null));
	},[logoutSubmit])
	// const [socket,setSocket] = useState(io("ws://localhost:4242"));
  return (
	<>
		
		<>
			{userSubmit ? (<Game/>) : (
			<>
				<div id="logout-container">
					<button id="username-submit" onClick={()=> setLogoutSubmit(true)}>Logout</button>
				</div>
				<div id="username-container">
					<h1>Enter Your Username</h1>
					<input id="username-input" type="text" placeholder="Enter your username"/>
					<button id="username-submit" onClick={()=> setUserSubmit(true)}>Submit</button>
				</div>
			</>
		)}
		</>
		)}
	</>
  )
}

export default Player