import React, { useState } from "react";
import {
    FiBarChart,
    FiChevronDown,
    FiChevronsRight,
    FiDollarSign,
    FiHome,
    FiMonitor,
    FiShoppingCart,
    FiTag,
    FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { PolarArea, Line } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Register components of Chart.js
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const polarData = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
        {
            label: 'Polar Dataset',
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(201, 203, 207, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'Line Dataset',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
    ],
};

const PolarChart = () => {
    return (
        <div>
            <PolarArea data={polarData} />

        </div>
    );
};

const LineChart = () => {
    return (
        <div>
            <Line data={lineData} />
        </div>
    );
};


const Sidenav = () => {
    return (
        <div className="flex bg-indigo-50">
            <Sidebar />
            <ExampleContent />
        </div>
    )
}

export default Sidenav

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState("Dashboard");

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
                <Option
                    Icon={FiHome}
                    title="Dashboard"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={FiMonitor}
                    title="View Site"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={FiBarChart}
                    title="Analytics"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={FiUsers}
                    title="Members"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
            </div>

            <ToggleClose open={open} setOpen={setOpen} />
        </motion.nav>
    );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
    return (
        <motion.button
            layout
            onClick={() => setSelected(title)}
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
            {notifs && open && (
                <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-indigo-500 px-2 py-0.5 text-xs text-white"
                >
                    {notifs}
                </motion.span>
            )}
        </motion.button>
    );
};


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
                {open && <FiChevronDown className="mr-2" />}
            </div>
        </div>
    );
};

const Logo = () => {
    // Temp logo from https://logoipsum.com/
    return (
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
};

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
                    <FiChevronsRight
                        className={`transition-transform ${open && "rotate-180"}`}
                    />
                </motion.div>
                {open && (
                    <motion.span
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.125 }}
                        className="text-xs font-medium"
                    >
                        Hide
                    </motion.span>
                )}
            </div>
        </motion.button>
    );
};

const ExampleContent = () =>
    <div className="h-[300vh] w-full">
        <div className='flex'>
            <div className='m-10 w-[600px] h-[600px] rounded-[24px] shadow-lg '>
                <PolarChart />
            </div>
            <div className='m-10 w-[600px] h-[600px] rounded-[24px] shadow-lg '>
                <LineChart />
            </div>
        </div>
    </div>;