import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Nextlogo from "../assets/Nextlogo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
const navItems = [

  { text: "Help", href: "/contact" },
  { text: "Internships", href: "/internship" },
  
];

export function DashboardNav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const renderNavItems = () => {
    const items = [];

    navItems.forEach((item) => {
      items.push(
        <Link key={item.href} to={item.href}>
          <button className="mt-2 text-md hover:text-black">{item.text}</button>
        </Link>
      );
    });
    return items;
  };

  const renderSidebarNavItems = () => {
    const items = [];
    navItems.forEach((item) => {
      items.push(
        <Link
          key={item.href}
          to={item.href}
          className="py-2 hover:underline text-left text-lg"
          onClick={toggleSidebar}
        >
          {item.text}
        </Link>
      );
      if (item.text === "Home" && isLoggedIn) {
        items.push(
          <Link
            key="/profile"
            to="/dashboard"
            className="py-2 hover:underline text-left text-lg"
            onClick={toggleSidebar}
          >
            Profile
          </Link>
        );
      }
    });
    if (isLoggedIn) {
      items.splice(
        items.findIndex((item) => item.key === "/signup"),
        1,
        <button
          key="logout-sidebar"
          onClick={() => {
            handleLogout();
            toggleSidebar();
          }}
          className="py-2 hover:underline text-left text-lg"
        >
          Log Out
        </button>
      );
    }
    return items;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
  
      <div className="bg-gradient-to-r from-[#1c1a3b] to-[#379090]">
        <div className="flex justify-between items-center text-sm font-extrabold text-white px-5 pt-1 pb-4">
          <h1 className="text-xl">NextStep</h1>
          
          <div className="ml-auto flex space-x-4 hidden md:flex pr-4 mt-4">
          <Profile/>
            {renderNavItems()}
       
          </div>
          <div className="flex ">
          <div className="   md:block mr-4 mt-4" >
          
          </div>
          <div className="mr-3 mt-3 md:hidden"><Profile/></div>
           
          <button
            className="flex block mt-3 md:hidden text-white text-2xl focus:outline-none"
            onClick={toggleSidebar}
          >
          
            &#9776;
          </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-black text-white transform transition-transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} w-2/3 z-50`}
      >
        <div className="flex flex-col h-full">
          <button className="text-2xl self-end p-4" onClick={toggleSidebar}>
            &times;
          </button>
                 
          <nav className="flex flex-col gap-5 mt-10 px-5">
            {renderSidebarNavItems()}
          
          </nav>
        </div>
      </div>
    </div>
  );
}
