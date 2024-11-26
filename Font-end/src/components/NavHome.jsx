import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";  // นำเข้า useNavigate และ Link

export const NavHome = () => {
  return (
    <div className="">
      <SlideTabs />
    </div>
  );
};

const SlideTabs = () => {
  const [hoverPosition, setHoverPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [selectedPosition, setSelectedPosition] = useState({
    left: 0,
    width: 0,
    opacity: 1,
  });

  const [selectedTab, setSelectedTab] = useState(null); // เก็บแท็บที่ถูกเลือก
  const navigate = useNavigate();  // ใช้ useNavigate สำหรับการเปลี่ยนหน้า

  // ปรับตำแหน่ง cursor เมื่อขนาดหน้าจอเปลี่ยนแปลง
  useEffect(() => {
    const handleResize = () => {
      // รีเฟรชตำแหน่ง cursor ทุกครั้งที่หน้าจอมีการย่อขยาย
      if (selectedTab !== null) {
        const selectedTabRef = document.querySelectorAll('li')[selectedTab];
        if (selectedTabRef) {
          setSelectedPosition({
            left: selectedTabRef.offsetLeft,
            width: selectedTabRef.offsetWidth,
            opacity: 1,
          });
        }
      }

      if (hoverPosition.opacity !== 0) {
        // ถ้ามีการ hover อยู่
        const hoverTabRef = document.querySelectorAll('li')[selectedTab];
        if (hoverTabRef) {
          setHoverPosition({
            left: hoverTabRef.offsetLeft,
            width: hoverTabRef.offsetWidth,
            opacity: 1,
          });
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedTab, hoverPosition]);

  return (
    <ul
      onMouseLeave={() => {
        setHoverPosition((pv) => ({
          ...pv,
          opacity: 0, // ซ่อน cursor hover เมื่อเมาส์ออกจากพื้นที่
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border-2 border-gray-300 bg-white p-1 backdrop-blur-[10px] bg-opacity-20 shadow-2xl "
    >
      {["Home", "Research", "Ebook", "Dashboard", "Login"].map((label, index) => (
        <Tab
          key={index}
          label={label}
          setHoverPosition={setHoverPosition}
          setSelectedPosition={setSelectedPosition}
          setSelectedTab={setSelectedTab}
          isSelected={selectedTab === index}
          index={index}
          navigate={navigate}  // ส่ง navigate ลงไปใน Tab
        />
      ))}

      {/* Cursor สีเทาสำหรับ hover */}
      <Cursor position={hoverPosition} className="bg-gray-300 bg-opacity-35" />

      {/* Cursor สีดำสำหรับคลิก */}
      <Cursor position={selectedPosition} className="bg-black" />
    </ul>
  );
};

const Tab = ({
  label,
  setHoverPosition,
  setSelectedPosition,
  setSelectedTab,
  isSelected,
  index,
  navigate, // รับ navigate
}) => {
  const ref = useRef(null);

  const handleClick = () => {
    if (!ref?.current) return;

    const { width } = ref.current.getBoundingClientRect();

    // อัปเดตตำแหน่งที่ถูกเลือก
    setSelectedTab(index);
    setSelectedPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });

    // ซ่อน hoverPosition เมื่อคลิก
    setHoverPosition((pv) => ({ ...pv, opacity: 0 }));

    // เปลี่ยนหน้าไปที่ path ที่เกี่ยวข้อง
    switch (label) {
      case "Home":
        navigate("/");
        break;
      case "Research":
        navigate("/research");
        break;
      case "Ebook":
        navigate("/ebook");
        break;
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Login":
        navigate("/foradmin");
        break;
      default:
        break;
    }
  };

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current || isSelected) {
          // รีเซ็ต hoverPosition เมื่อ hover อยู่บน selected tab
          setHoverPosition((pv) => ({ ...pv, opacity: 0 }));
          return;
        }

        const { width } = ref.current.getBoundingClientRect();

        setHoverPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={handleClick}  // ใช้ handleClick ในการจัดการการคลิก
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase transition-colors duration-200 md:px-5 md:py-3 md:text-base
        ${isSelected ? "text-white font-bold" : "text-black"}
        ${!isSelected ? "hover:text-black" : ""}`}
    >
      {label}
    </li>
  );
};

const Cursor = ({ position, className }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className={`absolute z-0 h-7 md:w-2 rounded-full ${className} md:h-12`}
    />
  );
};
