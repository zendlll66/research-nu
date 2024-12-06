import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // ตรวจสอบสถานะการล็อกอิน (ตัวอย่าง: ตรวจสอบ Token ใน localStorage)
  const isLoggedIn = !!localStorage.getItem("token"); // true หากมี Token

  // ถ้าไม่ได้ล็อกอิน ให้เปลี่ยนไปหน้า /login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // ถ้าล็อกอินแล้ว แสดงหน้าที่ร้องขอ
  return children;
};

export default ProtectedRoute;
