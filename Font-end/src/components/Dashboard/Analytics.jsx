import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { FiUsers, FiFileText, FiClipboard, FiEye } from "react-icons/fi";
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

  const [totalResearchers, setTotalResearchers] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const researcherRes = await axios.get(
          "https://project-six-rouge.vercel.app/researcher"
        );
        const researchers = researcherRes.data.data || [];

        const scopusRes = await axios.get(
          "https://project-six-rouge.vercel.app/research/scopus"
        );
        const papers = scopusRes.data.data || [];

        const activityRes = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
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
        setLoading(false);
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
    if (selectedYear) {
      filtered = filtered.filter(
        (paper) => paper.year === parseInt(selectedYear)
      );
    }
    if (selectedSource) {
      filtered = filtered.filter(
        (paper) => paper.source.toLowerCase() === selectedSource.toLowerCase()
      );
    }
    setFilteredPapers(filtered);
  };

  useEffect(() => {
    filterPapers();
  }, [selectedYear, selectedSource]);

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


  // Skeleton Loader
  const Skeleton = () => (
    <div className="p-6 bg-white shadow-lg rounded-lg animate-pulse">
      <div className="w-16 h-16 bg-gray-200 mx-auto rounded-full mb-4"></div>
      <div className="w-24 h-6 bg-gray-200 mx-auto mb-2"></div>
      <div className="w-32 h-4 bg-gray-200 mx-auto"></div>
    </div>
  );

  return (
    <div className="p-[80px]">
      <div className="max-w-6xl mx-auto  grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            {/* จำนวนนักวิจัย */}
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FiUsers className="text-indigo-600 mx-auto text-4xl mb-4" />
              <h3 className="text-3xl font-bold">{totalResearchers}</h3>
              <p className="text-gray-600">Total Researchers</p>
            </div>

            {/* จำนวน paper */}
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FiFileText className="text-indigo-600 mx-auto text-4xl mb-4" />
              <h3 className="text-3xl font-bold">{totalPapers}</h3>
              <p className="text-gray-600">Total Papers</p>
            </div>

            {/* จำนวนข่าวทั้งหมด */}
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FiClipboard className="text-indigo-600 mx-auto text-4xl mb-4" />
              <h3 className="text-3xl font-bold">{totalActivities}</h3>
              <p className="text-gray-600">Total News</p>
            </div>

            {/* จำนวนผู้เข้าชม */}
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FiEye className="text-indigo-600 mx-auto text-4xl mb-4" />
              <h3 className="text-3xl font-bold">{totalViews}</h3>
              <p className="text-gray-600">Total Views</p>
            </div>
          </>
        )}
      </div>
      <h1 className="mt-20 text-2xl font-semibold text-gray-800 mb-6">
        Research Paper Analytics
      </h1>

      {/* แสดงกราฟแท่งและกราฟวงกลม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-700 rounded-xl bg-opacity-10  p-20 mb-20">
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Papers by Year</h2>
          <Bar data={barChartData} />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Papers by Source</h2>
          <Pie data={pieChartData} />
        </div>
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
        {filteredPapers.map((paper, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Analytics;
