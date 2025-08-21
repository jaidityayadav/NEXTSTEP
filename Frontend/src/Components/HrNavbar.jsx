import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Nextlogo from "../assets/Nextlogo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { HrProfile } from "./HrProfile";

const navItems = [
  { text: "Home", href: "/" },
  { text: "Contact Us", href: "/contact" },
];

export function HrNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should be managed based on the login state
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in (you could get this from localStorage, context, or API)
    const token = localStorage.getItem("authorization"); // Or check any other global state
    setIsLoggedIn(!!token);
  }, []);

  const renderNavItems = () => {
    const items = [];

    navItems.forEach((item) => {
      items.push(
        <Link key={item.href} to={item.href}>
          <button className="mt-2 text-md hover:text-black">{item.text}</button>
        </Link>
      );
    });

    // Conditionally render Dashboard only if HR is logged in
    if (isLoggedIn) {
      items.push(
        <Link key="/HR/HrDashboard" to="/HR/HrDashboard">
          <button className="mt-2 text-md hover:text-black">Dashboard</button>
        </Link>
      );
    }

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
    });

    // Conditionally render Dashboard and Profile only if HR is logged in
    if (isLoggedIn) {
      items.push(
        <Link
          key="/HR/HrDashboard"
          to="/HR/HrDashboard"
          className="py-2 hover:underline text-left text-lg"
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
      );
     
      items.push(
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

  const handleLogout = () => {
    // Log out logic (clear localStorage, API call, etc.)
    localStorage.removeItem("authorization");
    setIsLoggedIn(false); // Update state on logout
    navigate("/login"); // Redirect to login page or home
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-[#1c1a3b] to-[#379090]">
        <div className="flex justify-between items-center text-sm font-extrabold text-white px-5 pt-1 pb-4">
          <h1 className="text-xl">NextStep</h1>

          <div className="ml-auto flex space-x-4 hidden md:flex pr-4 mt-4">
            {renderNavItems()}
          </div>

          <div className="flex ">
            <div className="md:block mr-4 mt-4">
              {isLoggedIn && <HrProfile />} {/* Show HrProfile only if logged in */}
            </div>
            <button
              className="block mt-3 md:hidden text-white text-2xl focus:outline-none"
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
