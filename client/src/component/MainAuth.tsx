import React, { useEffect } from 'react'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/redux';

import { useState } from 'react';
import { ip } from '../utils/ip';


export const SetStatus =async (id,num)=>{
	
	fetch(`${ip}:7000/users/status`, {
		method: 'PATCH',
		body: JSON.stringify({userid:id,status:num}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	.then(res => res)
	.then(data=>console.log(data))
}
const MainAuth = () => {
	console.log("ft_auttthhththt");
	const navigate = useNavigate();
	const user = useSelector((state: AppState) => state.user);
	const [currentUser, setCurrentUser] = useState(user);
	const dispatch = useDispatch();
	const login = (params:object) => {
		console.log("email =>",params.email);
		
		console.log("loggginnn",ip);
		
		if(!currentUser)
		{
					fetch(`${ip}:7000/auth/42/login`, {
			method: 'POST',
			body: JSON.stringify({params}),
			headers: {
				'Content-Type': 'application/json',
			},
			})
			.then(response => {
				//console.log( response.json());
				
				return response.json()})
			.then(data => {
				console.log("ddddddddd",data);
				if (!data.istwofactorenabled)
				{	
					SetStatus(data.id,0);
					dispatch(setUser(null));
					dispatch(setUser(data));
					console.log(data.status);
					
					navigate("/home",{replace:true})
				}
				else
				{
					setCurrentUser(data);
				}
				// Process the response data received from the server
				console.log(data);
			})
			.catch(error => {
				console.log("errorrr",error);
				
				navigate("/",{replace:true})
				// Handle any errors that occur during the request
				console.log(error);
			});
		}
		else
		{
			navigate("/home",{replace:true})
		}
		
	}
	useEffect(() => {
		// Parse the URL parameters
		const queryParams = queryString.parse(window.location.search);
	
		// Convert the parsed parameters to a URL-encoded string
		const params = new URLSearchParams(queryParams).toString();
	
		// Append the URL-encoded parameters to the server endpoint
		console.log(ip);
	
		const url = `${ip}:7000/auth/42/redirect?${params}`;
		//console.log("qqqqqqqqqqqqqq",queryParams);
		
		// Send the GET request using fetch()
		fetch(url)
		  .then(response => {
			if (!response.ok) {
				console.log("nottt okkkk");
			  throw new Error('Request failed');
			  
			}
			return response.json(); // assuming the server returns JSON data
		  })
		  .then(data => {
			// Process the response data
			login(data);
			console.log(data);
		  })
		  .catch(error => {
			// Handle any errors
			console.log(error);
		  });
	  }, []);
  return (
	<>

			<div>Auth 42</div>
	</>
  )
}

export default MainAuth
