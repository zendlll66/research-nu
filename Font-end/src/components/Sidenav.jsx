import React, { useState } from "react";
import {
  FiBarChart,
  FiHome,
  FiEdit,
  FiFilePlus,
  FiChevronRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { PolarArea, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import Postpage from "./Dashboard/Postpage";
import Editpage from "./Dashboard/Editpage";
import EditEbook from "./Dashboard/EditEbook";

import { MdOutlineBookmarkAdd } from "react-icons/md";



// Register Chart.js components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Dummy chart data
const polarData = {
  labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
  datasets: [
    {
      label: "Polar Dataset",
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(201, 203, 207, 0.2)",
        "rgba(54, 162, 235, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(255, 205, 86, 1)",
        "rgba(201, 203, 207, 1)",
        "rgba(54, 162, 235, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const lineData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Line Dataset",
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

// Charts
const PolarChart = () => <PolarArea data={polarData} />;
const LineChart = () => <Line data={lineData} />;

// Main Sidenav Component
const Sidenav = () => {
  const [selected, setSelected] = useState("Post News"); // State สำหรับการเลือกเมนู
  
  return (
    <div className="flex bg-indigo-50">
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
          title="Post News"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <NavOption
          Icon={FiEdit}
          title="Edit"
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
          title="Edit Ebook"
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
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)} // อัปเดต selected เมื่อคลิก
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title
        ? "bg-indigo-100 text-indigo-800"
        : "text-slate-500 hover:bg-slate-100"
        }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
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
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">TomIsLoading</span>
              <span className="block text-xs text-slate-500">Pro Plan</span>
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
    className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
  >
    <svg
      width="24"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-slate-50"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#000000"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#000000"
      ></path>
    </svg>
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
          <FiChevronRight className={`transition-transform ${open && "rotate-180"}`} />
        </motion.div>
      </div>
    </motion.button>
  );
};



// Main Content Area
const MainContent = ({ selected }) => {
  const [expandedFaculty, setExpandedFaculty] = useState(null); // เก็บคณะที่ถูกเลือก
  const [selectedMember, setSelectedMember] = useState(null); // เก็บชื่อสมาชิกที่ถูกเลือก

  const facultyData = [
    {
      name: "Electrical & Computer Engineering",
      description: "Focuses on the design and integration of computer systems, hardware, and electrical circuits.",
      members: ["Alice", "Bob", "Charlie", "ZEnd"],
    },
    {
      name: "Mechanical Engineering",
      description: "Focuses on chemical processes and the production of materials and energy.",
      members: ["Dave", "Eve", "Frank"],
    },
    {
      name: "Civil Engineering",
      description: "Specializes in the design, construction, and maintenance of infrastructure projects such as buildings, roads, and bridges.",
      members: ["Dave", "Eve", "Frank"],
    },
    {
      name: "Industrial Engineering",
      description: "Focuses on optimizing complex processes, systems, and organizations to improve efficiency and productivity.",
      members: ["Dave", "Eve", "Frank"],
    },
  ];


  const handleFacultyClick = (facultyName) => {
    setExpandedFaculty((prev) => (prev === facultyName ? null : facultyName));
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member); // ตั้งค่าชื่อสมาชิกที่ถูกเลือก
  };

  const handleAddMember = () => {
    alert("Add Member Clicked");
  };
  return (
    <div className="flex-grow p-6">

      {selected === "Post News" && <Postpage />}
      {selected === "Edit" &&
        (<div className="space-y-4">
          {selectedMember ? (
            <Editpage
              member={selectedMember}
              setSelectedMember={setSelectedMember}
            />
          ) : (
            facultyData.map((faculty) => (
              <div
                key={faculty.name}
                className="bg-white border-2 rounded-lg w-full cursor-pointer mt-10"
              >
                {/* Faculty Header */}
                <div
                  className="relative flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => handleFacultyClick(faculty.name)}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{faculty.name}</span>
                    <span className="text-sm text-gray-600">
                      {faculty.description}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    {expandedFaculty === faculty.name ? "▲" : "▼"}
                  </span>
                </div>

                {/* Faculty Members */}
                <div
                  className={`bg-gray-50 px-4  pb-4 space-y-2 overflow-hidden transition-all duration-200 ease-in-out ${expandedFaculty === faculty.name
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0 pb-0"
                    }`}
                >
                  <div className="flex justify-end">
                    <button
                      className="bg-green-300 w-10 h-full rounded-md"
                      onClick={handleAddMember}
                    >
                      +
                    </button>
                  </div>

                  {faculty.members.map((member) => (
                    <div
                      key={member}
                      className="cursor-pointer bg-white border rounded-lg p-2 hover:bg-gray-100"
                      onClick={() => handleMemberClick(member)} // แสดงหน้า Postpage เมื่อกด
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        )
      }
      {selected === "Analytics" && (
        <div className=" border-2 ">
          <div className="h-[400px] ">
            <PolarChart />
          </div>
          <div className="h-[300px]">
            <LineChart />
          </div>

        </div>


      )}
      {selected === "Edit Ebook" && <EditEbook />}
    </div>
  );
};
