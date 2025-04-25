import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Analytics = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [years, setYears] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [totalResearchers, setTotalResearchers] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true); // State สำหรับ Loading Indicator
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true); // เริ่มโหลดข้อมูล
      try {
        const researcherRes = await axios.get(
          `${backendUrl}/researcher`
        );
        const researchers = researcherRes.data.data || [];

        const scopusRes = await axios.get(
          `${backendUrl}/research/Totalpapers`
        );
        const papers = scopusRes.data.data || [];

        const activityRes = await axios.get(
          `${backendUrl}/activity/count`
        );
        const activities = activityRes.data.data || [];

        setTotalResearchers(researchers.length);
        setTotalPapers(papers.length);
        setTotalActivities(activities.length);
        setPapers(papers);

        const uniqueYears = [...new Set(papers.map((item) => item.year))].sort(
          (a, b) => b - a
        );
        const uniqueSources = [
          ...new Set(papers.map((item) => item.source.toLowerCase())),
        ];
        setYears(uniqueYears);
        setSources(uniqueSources);
        setFilteredPapers(papers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // โหลดข้อมูลเสร็จสิ้น
      }
    };

    const handlePageView = () => {
      const views = parseInt(localStorage.getItem("pageViews")) || 0;
      const newViews = views + 1;
      localStorage.setItem("pageViews", newViews);
      setTotalViews(newViews);
    };

    fetchStatistics();
    handlePageView();
  }, []);

  const filterPapers = () => {
    let filtered = papers;

    // กรองตามปี
    if (selectedYear) {
      filtered = filtered.filter(
        (paper) => paper.year === parseInt(selectedYear)
      );
    }

    // กรองตามแหล่งที่มา
    if (selectedSource) {
      filtered = filtered.filter(
        (paper) => paper.source.toLowerCase() === selectedSource.toLowerCase()
      );
    }

    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter((paper) =>
        paper.paper.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPapers(filtered);
  };

  useEffect(() => {
    filterPapers();
  }, [selectedYear, selectedSource, searchTerm]);

  const barChartData = {
    labels: years,
    datasets: [
      {
        label: "Papers per Year",
        data: years.map(
          (year) => papers.filter((paper) => paper.year === year).length
        ),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const pieChartData = {
    labels: sources,
    datasets: [
      {
        label: "Papers by Source",
        data: sources.map(
          (source) =>
            papers.filter(
              (paper) => paper.source.toLowerCase() === source
            ).length
        ),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
        ],
      },
    ],
  };

  return (
    <div className="">
      <h1 className="mt-20 text-2xl font-semibold text-gray-800 mb-6">
        Research Paper Analytics
      </h1>

      {/* Loading Indicator */}
      {loading && (
        <div className="relative inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
          <DotLottieReact
            className="w-[200px] h-[200px]"
            src="https://lottie.host/74c02537-50db-4466-83a5-3b0a2be997b1/vyiCNxmzKK.lottie"
            loop
            autoplay
          />
        </div>
      )}



      {/* แสดงกราฟแท่งและกราฟวงกลม */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Papers by Year</h2>
          {!loading && <Bar data={barChartData} />}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Papers by Source</h2>
          {!loading && <Pie data={pieChartData} />}
        </div>
      </div>

      {/* ช่องค้นหา */}
      <div className="mb-6 mt-10">
        <input
          type="text"
          placeholder="Search by paper title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Dropdown สำหรับเลือกปีและแหล่งที่มา */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Select Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Select Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show Total Papers */}
      <div className="text-lg font-medium text-gray-700 mb-4">
        Total Papers: {filteredPapers.length}
      </div>

      {/* แสดงรายการ Paper */}
      <div className="overflow-y-auto h-[500px] border rounded-lg p-4 mt-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading papers...</p>
        ) : filteredPapers.length > 0 ? (
          filteredPapers.map((paper, index) => (
            <div key={index} className="p-4 border-b">
              <h2 className="text-lg font-semibold">{paper.paper}</h2>
              <p className="text-sm text-gray-500">
                {paper.year} | {paper.source}
              </p>
              <a
                href={paper.link_to_paper}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Paper
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No papers found.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;