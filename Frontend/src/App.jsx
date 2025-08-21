import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { InternshipPage } from "./pages/InternshipPage";
import { SignUp } from "./pages/Signup";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Toaster } from 'react-hot-toast';
import { HRSignUp } from './pages/HRSignup';
import { HRLogin } from './pages/HRLogin';
import { PostInternship } from "./pages/PostInternship";
import { DashboardNav } from "./Components/DashboardNav";
import { Dashboard } from "./pages/Dashboard";
import { HrDashboard } from "./pages/HrDashboard";
import { EditInternship } from "./pages/EditInternship";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"


function App() {
  return (
    <>

      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Internship" element={<InternshipPage />} />
          <Route path="/Dashboard" element={<Dashboard/>} />
          <Route path="/HR/Signup" element={<HRSignUp />} />
          <Route path="/HR/PostInternship" element={<PostInternship />} />
          <Route path="/HR/EditInternship/:id" element={<EditInternship />} />
          <Route path="/HR/Login" element={<HRLogin />} />
          <SpeedInsights/>
          <Analytics/>
          <Route path="/HR/HrDashboard" element={<HrDashboard />} />
    
          

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App