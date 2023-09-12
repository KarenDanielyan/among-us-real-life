import React, { useEffect, useState } from 'react'

import '../Styles/Players.css'
import { io } from 'socket.io-client/debug';
import { ip } from '../utils/ip';
import { useSelector } from 'react-redux';
import '../Styles/Game.css'

function Game() {
  const [isSocket,setIsSoket]  = useState(false);
  const [socket,setSocket] = useState(io());
  const user = useSelector((state: AppState) => state.user);
    if(isSocket == false)
    {

      setSocket( io(`${ip}:4001/pong`,{
        query:{role : 'player'},
        closeOnBeforeunload:true,
        protocols:'ws',
        secure:true,
        randomizationFactor:0.8,
        transports: ['websocket'],
        autoConnect:false,
        auth:{
          headers:{
              'USER':JSON.stringify({user}) // user will have value after login
          },
          
          
      },
      
      }));
      setIsSoket(true);
    }
    useEffect(()=>{
      socket.connect()
      socket.on("connection",(data)=>{
        console.log("conectionnnnn",data);
      })
      return()=>{
        socket.close();
        socket.disconnect();
      }
    },[])
	
  return (
	<>
      <div id="game-container" >
        <h1>Among Us</h1>
        
        <button id="enable-sound">Enable Sound</button>
    
        <button id="report">
          <img src="../../public/images/report.png" />
        </button>
    
        <button id="emergency-meeting">
          <img id="emgimg" src="../../public/images/emergency-meeting.png" />
        </button>
    
        <p>Progress is <span id="progress">0</span>% complete</p>
        <div className="progress">
          <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{width: "0%"}}></div>
        </div>

        <h2>Tasks</h2>
        <form>
          <ol id="tasks"></ol>
          </form>
      </div>
  </>
  )
}

export default Game