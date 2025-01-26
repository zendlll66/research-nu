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
import Analytics from "./Dashboard/Analytics";

// Register Chart.js components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Sidenav = () => {
  const [selected, setSelected] = useState("Post News"); // State สำหรับการเลือกเมนู

  return (
    <div className="flex bg-orange-50">
      <Sidebar selected={selected} setSelected={setSelected} />
      <MainContent selected={selected} />
    </div>
  );
};

export default Sidenav;

const Sidebar = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-orange-300 bg-white p-2"
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

const NavOption = ({ Icon, title, selected, setSelected, open }) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title
        ? "bg-orange-100 text-orange-800"
        : "text-slate-500 hover:bg-orange-50"
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

const Logo = () => (
  <motion.div
    layout
    className="grid size-10 shrink-0 place-content-center rounded-md bg-orange-600"
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

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-orange-300 transition-colors hover:bg-orange-50"
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

const MainContent = ({ selected }) => {
  return (
    <div className="flex-grow  ">
      {selected === "Post News" && <Postpage />}
      {selected === "Edit" && <Editpage />}
      {selected === "Analytics" && <Analytics />}
      {selected === "Edit Ebook" && <EditEbook />}
    </div>
  );
};
