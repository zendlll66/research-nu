import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      console.error("Backend URL is not defined");
      return;
    }

    const jsonData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();

      if (response.ok) {
        if (response.ok && data.status === "ok") {
          localStorage.setItem("token", data.token); // เก็บ Token หลังล็อกอิน
          navigate("/dashboard"); // ไปหน้า Dashboard
        } else {
          alert(`Login failed: ${data.message}`);
        }
      } else {
        alert(`HTTP Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  



  return (
    <>
      <div className="transform scale-100 fixed inset-0 overflow-hidden z-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <Spline scene="https://prod.spline.design/TpD1f5OOpibtvUtk/scene.splinecode" />

      </div>

      <div className='inset-0 bg-black opacity-50 backdrop-blur-md py-[72px] px-[48px] h-full w-full  absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] '>
      </div>

      <div className='bg-white py-[72px] px-[48px] h-[450px] w-[500px] rounded-[24px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl'>

        <form onSubmit={handleSubmit} className="relative h-full flex flex-col items-center space-y-[25px]">
          <h1 className="font-bold text-[24px]">Welcome back</h1>
          <div>
            <input
              className="hover:border-[#246BFD] focus:border-[#246BFD] border-2 h-[40px] w-[300px] p-3 outline-none rounded-[12px]"
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="hover:border-[#246BFD] focus:border-[#246BFD] border-2 h-[40px] w-[300px] p-3 outline-none rounded-[12px]"
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="">
            <button
              type="submit"
              className="hover:bg-[#246BFD] bg-[#E5E5E5] w-[300px] h-[40px] rounded-[12px] text-white"
            >
              SIGN IN
            </button>
          </div>
        </form>
      </div>
    </>

  );
};

export default Login;
