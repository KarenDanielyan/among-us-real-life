import React, { useEffect, useState } from 'react'
import '../Styles/Players.css'
import { io } from 'socket.io-client'
import Game from './Game';
import SignIn from './Signin';
function Player() {
	console.log("ddd",import.meta.env);
	
	const [submit,setSubmit] = useState(false);
	useEffect(()=>{
			console.log("hello",submit);
			

	},[submit])
	// const [socket,setSocket] = useState(io("ws://localhost:4242"));
  return (
	<>
	
		{submit ? (<Game/>) : (
				<>
				<div id="username-container">
				<h1>Enter Your Username</h1>
				<input type="text" id="username-input" placeholder="Enter your username"/>
				<button id="submit-username" onClick={()=> setSubmit(true)}>Submit</button>
			</div>
			
			
			</>
			
			)
		}
		</>
		
  )
}

export default Player