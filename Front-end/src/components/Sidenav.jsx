import { useState, useEffect } from "react";
import {
  FiBarChart,
  FiHome,
  FiEdit,
  FiFilePlus,
  FiChevronRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { MdOutlineBookmarkAdd,MdOutlineFiberManualRecord } from "react-icons/md";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FaRegRegistered } from "react-icons/fa6";

// Main Sidenav Component
const Sidenav = () => {
  // อ่านค่า selected จาก localStorage
  const [selected, setSelected] = useState(
    () => localStorage.getItem("selectedMenu") || "Post News"
  );

  // บันทึก selected ลงใน localStorage เมื่อเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("selectedMenu", selected);
  }, [selected]);

  return (
    <div className="flex bg-orange-50">
      <Sidebar selected={selected} setSelected={setSelected} />
      <MainContent selected={selected} />
    </div>
  );
};

export default Sidenav;

// Sidebar with State Management
const Sidebar = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />
      <div className="space-y-1">
        <NavOption
          Icon={FiFilePlus}
          title="Manage News"
          selected={selected}
          setSelected={setSelected}
          open={open}

        />
        <NavOption
          Icon={FiEdit}
          title="Manage Researcher"
          selected={selected}
          setSelected={setSelected}
          open={open}

        />
        <NavOption
          Icon={FiBarChart}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <NavOption
          Icon={MdOutlineBookmarkAdd}
          title="Manage Ebook"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <NavOption
          Icon={FiHome}
          title="Line Broadcast"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />

        <NavOption
          Icon={FaRegRegistered}
          title="Register"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />

        <NavOption
          Icon={MdOutlineFiberManualRecord}
          title="Manual"
          selected={selected}
          setSelected={setSelected}
          open={open}
          
        />

      </div>

     
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

// Navigation Option Component
const NavOption = ({ Icon, title, selected, setSelected, open }) => {
  const navigate = useNavigate(); // ใช้ Hook สำหรับเปลี่ยนหน้า
  const location = useLocation();
  const path = `/dashboard/${title.toLowerCase().replace(/\s+/g, "")}`;
  const handleNavigation = () => {
    setSelected(title);
    const path = title.toLowerCase().replace(/\s+/g, ""); // แปลงชื่อเป็น path เช่น "Post News" -> "post-news"
    navigate(`/dashboard/${path}`);
  };
  const isActive = location.pathname === path;

  return (
    <motion.button
      layout
      onClick={handleNavigation} // เปลี่ยนจาก setSelected เป็น handleNavigation
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${isActive ? "bg-orange-200 text-orange-800" : "text-slate-500 hover:bg-slate-100"
        }`}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="ml-2 text-xs font-medium"
        >
          {title}
        </motion.span>
      )}
    </motion.button>
  );
};

// Title Section in Sidebar
const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-orange-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-orange-50">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">Dashboard</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Logo Component
const Logo = () => (
  <motion.div
    layout
    className="grid size-10 shrink-0 place-content-center rounded-md bg-orange-600  p-1"
  >

    <a href="/" className="-m-1.5 p-1.5">
      <img
        alt="Logo"
        src="/assets/logo.png"
        className=""
      />
    </a>
  </motion.div>
);



// Toggle Sidebar Open/Close
const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
      </div>
    </motion.button>
  );
};

// Main Content Area
const MainContent = () => {
  return (
    <div className="flex-1 p-4">
      <Outlet /> {/* ตรงนี้จะแสดง Children จาก Route */}
    </div>
  );
};
