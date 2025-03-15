import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // สถานะการโหลด
  const [loginSuccess, setLoginSuccess] = useState(false); // สถานะล็อกอินสำเร็จ
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true); // ตั้งค่าเป็นกำลังโหลด

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      console.error("Backend URL is not defined");
      setIsLoading(false);
      return;
    }

    const jsonData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();

      setIsLoading(false); // สิ้นสุดการโหลด

      if (response.ok) {
        if (data.status === "ok") {
          localStorage.setItem("token", data.token); // เก็บ Token
          localStorage.setItem("fname", data.fname); // เก็บชื่อผู้ใช้
          localStorage.setItem("lname", data.lname); // เก็บชื่อผู้ใช้
          setLoginSuccess(true); // ตั้งค่าการล็อกอินสำเร็จ
          setTimeout(() => {
            navigate("/"); // ไปหน้า Dashboard
          }, 1500); // รอ 1.5 วินาทีหลังจากที่ login สำเร็จ
        } else {
          alert(`Login failed: ${data.message}`);
        }
      } else {
        alert(`HTTP Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="transform scale-100 fixed inset-0 overflow-hidden z-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <Spline scene="https://prod.spline.design/TpD1f5OOpibtvUtk/scene.splinecode" />
      </div>

      <div className='inset-0 bg-black opacity-50 backdrop-blur-md py-[72px] px-[48px] h-full w-full  absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] '></div>

      <div className='bg-white py-[72px] px-[48px] h-[450px] w-[500px] rounded-[24px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl'>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-orange-500 w-16 h-16"></div>
            <p className="ml-4 text-orange-500">Loading...</p>
          </div>
        ) : loginSuccess ? (
          <div className="text-center">
            <p className="text-green-500">Login Success!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative h-full flex flex-col items-center space-y-[25px]">
            <h1 className="font-bold text-[24px]">Welcome back</h1>
            <div>
              <input
                className="hover:border-orange-500 focus:border-orange-500 border-2 h-[40px] w-[300px] p-3 outline-none rounded-[12px]"
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                className="hover:border-orange-500 focus:border-orange-500 border-2 h-[40px] w-[300px] p-3 outline-none rounded-[12px]"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-[50%] translate-y-[-50%] text-orange-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye/> : <FaEyeSlash/>}
              </button>
            </div>
            <div className="">
              <button
                type="submit"
                className="hover:bg-orange-500 bg-[#E5E5E5] w-[300px] h-[40px] rounded-[12px] text-white"
              >
                SIGN IN
              </button>
              <div className="text-center mt-2">
                <Link to="/request-reset" className="text-orange-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;