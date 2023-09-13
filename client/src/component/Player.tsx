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
		if(userSubmit)
			navigate("/game",{replace:true})
		if(logoutSubmit == true)
			dispatch(setUser(null));
	},[logoutSubmit,userSubmit])
	// const [socket,setSocket] = useState(io("ws://localhost:4242"));
	console.log(user);
	
  return (
	<>
		
		<>
			
			<>
				<div>
					<img src={user.avatarurl} alt=""  style={{borderRadius:"50%",width:"300px"}} />
				</div>
				<div>
					<h1>{user.displayname}</h1>
				</div>
				<div id="logout-container">
					<button id="username-submit" onClick={()=> setLogoutSubmit(true)}>Logout</button>
				</div>
				<div id="username-container">

					<button id="username-submit" onClick={()=> setUserSubmit(true)}>join game</button>
				</div>
			</>
		</>
		
	</>
  )
}

export default Player