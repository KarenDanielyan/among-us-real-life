import React from 'react'
import '../Styles/Admin.css'
function Admin() {
  return (
	<>
	<h1>Admin Console</h1>
		<form>
			<label htmlFor="impostor">Number of impostors:</label>
			<input id="impostor" type="number" min={1} max={10} placeholder='sdsddsd'/>
			<button id="impostor-button">Set Impostors</button>
			<label htmlFor="players">Number of Players: /</label>
			<label></label>
			<input id="players" type="text"  value="0"/>
			<button id="start-game">Start Game</button>
		</form>
		
	</>
  )
}

export default Admin