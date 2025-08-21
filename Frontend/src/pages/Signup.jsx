import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Navbarnew } from "../Components/Navbarnew";
import backendUrl from "../api";
import { toast } from 'react-hot-toast';
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name:'',
    username: '',
    password: '',
    email: ''
  });
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name:'',
      username: '',
      password: '',
      email: ''
    };
    if (!/^[a-zA-Z]+$/.test(name)) {
      newErrors.name = 'Username should contain only alphabets';
      valid = false;
    }
    // Username validation (only alphabets)
    if (!/^[a-zA-Z]+$/.test(username)) {
      newErrors.username = 'Username should contain only alphabets';
      valid = false;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    // Email validation (must end with @gmail.com)
    if (!email.endsWith('@gmail.com')) {
      newErrors.email = 'Only Gmail addresses are allowed (@gmail.com)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
  
    try {
      const response = await axios.post(`${backendUrl}/student/signup`, {
        name,
        email,
        username,
        password
      });
  
      toast.success("Signup Successfully!");
  
      setTimeout(() => {
        setLoading(false);
        navigate("/Login");
      }, 2000);
  
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed!");
      }
    }
  };
  
  return (
    <>
      <Navbarnew />

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <SyncLoader color="#36d7b7" size={15} />
        </div>
      )}
      
      <div className="bg-gradient-to-r from-[#1c1a3b] via-[#903d37] to-[#903d37] flex items-center justify-center h-screen w-full px-5 sm:px-0">
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
          <div
            className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1617251137884-f135eccf6942?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <p className="text-xl font-bold text-gray-600 text-center">Hello Students! Create An Account!</p>

            <div className="mt-4">
  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className={`text-gray-700 border rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700 ${
      errors.name ? 'border-red-500' : 'border-gray-300'
    }`}
    type="text"
    required
  />
  {errors.name && (
    <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
  )}
</div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`text-gray-700 border rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                type="text"
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs italic mt-1">{errors.username}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`text-gray-700 border rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                type="email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mt-4 flex flex-col justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`text-gray-700 border rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                type="password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleSignup}
                disabled={loading}
                className={`bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-4 flex items-center w-full text-center">
              <Link to="/Login" className="font-bold text-xs text-gray-500 capitalize text-center w-full">
                Have an account? <span className="font-bold text-blue-700">Login</span>
              </Link>
              <Link to="/HR/Signup" className="font-bold text-xs text-gray-500 capitalize text-center w-full">
                HR ,Signup? <span className="font-bold text-blue-700">Signup</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}