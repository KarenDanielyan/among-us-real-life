
import './App.css'
import Player from './component/Player'

import SignIn from './component/Signin'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './component/Auth';

import MainAuth from './component/MainAuth';

function App() {
 

  return (

    <Router>
   
    <Routes>
      <Route path="/"  element={<SignIn />} />
      <Route path="/home"  element={<Player />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/ft_auth" element={<MainAuth />} />
        
      </Routes>
    
  </Router>
    
  )
}

export default App
