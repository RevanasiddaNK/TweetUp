import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";


import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage.jsx";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./components/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

function App() {
	
  return (

	  <div className='flex max-w-6xl mx-auto'>

      <Sidebar/>

      <Routes>
          <Route path = '/' element = {<HomePage/>} />
          <Route path = '/signUp' element = { <SignUpPage/>} />
          <Route path = '/login' element = {<LoginPage/>} />
          <Route path="/notifications" element = { <NotificationPage /> } />
          <Route path="/profile/:username" element = {<ProfilePage />} />

      </Routes>

      <RightPanel/>
			
		</div>

	);
}

export default App