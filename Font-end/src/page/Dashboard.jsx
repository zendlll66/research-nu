import React from "react";
import { useNavigate } from "react-router-dom";
import Sidenav from "../components/Sidenav";

const Dashboard = () => {
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนเส้นทาง

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ Token
    navigate("/"); // เปลี่ยนเส้นทางไปหน้า Login
  };

  return (
    <div className="pt-[-20%]">
      
      <Sidenav />
      {/* <button onClick={handleLogout} className="absolute top-0 right-0 mr-3  rounded-md px-1 py-1 text-red-500">Logout</button> */}
      
    </div>
  );
};

export default Dashboard;
