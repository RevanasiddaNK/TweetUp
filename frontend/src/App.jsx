import { Navigate, Routes } from "react-router-dom";
import { Route } from "react-router-dom";


import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage.jsx";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./components/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

function App() {

  const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/authCheck");
				const data = await res.json();

				if (data.error) return null;
				
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

  if(isLoading){
    
    return (
      <div className=" h-screen flex justify-center items-center">
        <LoadingSpinner size="lg"/>
      </div>
    )

  }


  return (

	  <div className='flex max-w-6xl mx-auto'>

      {authUser && <Sidebar/>}

      <Routes>
      
          <Route path = '/' element =  { authUser ?  <HomePage/> : < Navigate to="/login"/> } />
          <Route path = '/signUp' element = {!authUser ?  <SignUpPage/> : <Navigate to= "/"/> } />
          <Route path = '/login' element = { !authUser ?  <LoginPage/> : <Navigate to= "/"/> } />
          <Route path="/notifications" element = { authUser ?  <NotificationPage/> : < Navigate to="/login"/>} />
          <Route path="/profile/:username" element = {  authUser ?  <ProfilePage/> : < Navigate to="/login"/>} />

      </Routes>

      {authUser && <RightPanel/> }
			
		</div>

	);
}

export default App