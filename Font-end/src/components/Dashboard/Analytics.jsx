import React, { useState, useEffect } from "react";
import axios from "axios";

const Analytics = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [years, setYears] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get(
          "https://project-six-rouge.vercel.app/research/scopus"
        );
        const data = response.data.data || [];
        
        // เก็บข้อมูลงานวิจัยทั้งหมด
        setPapers(data);

        // ดึงปีและแหล่งที่มาจากข้อมูล
        const uniqueYears = [
          ...new Set(data.map((item) => item.year)),
        ].sort((a, b) => b - a);
        const uniqueSources = [...new Set(data.map((item) => item.source))];

        setYears(uniqueYears);
        setSources(uniqueSources);
        setFilteredPapers(data);  // เริ่มต้นแสดงทั้งหมด
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, []);

  // ฟังก์ชันกรองข้อมูลตามปีและแหล่งที่มา
  const filterPapers = () => {
    let filtered = papers;

    if (selectedYear) {
      filtered = filtered.filter((paper) => paper.year === parseInt(selectedYear));
    }
    if (selectedSource) {
      filtered = filtered.filter((paper) => paper.source === selectedSource);
    }

    setFilteredPapers(filtered);
  };

  // เรียกใช้ filter เมื่อเลือกปีหรือแหล่งที่มา
  useEffect(() => {
    filterPapers();
  }, [selectedYear, selectedSource]);

  return (
    <div className="border-2 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Research Paper Analytics
      </h1>

      {/* Dropdown เลือกปี */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Select Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown เลือกแหล่งที่มา */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Select Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

      {/* แสดงจำนวน Paper ที่กรองได้ */}
      <div className="text-lg font-medium text-gray-700 mb-4">
        Total Papers: {filteredPapers.length}
      </div>

      {/* แสดงรายการ Paper */}
      <div className="overflow-y-auto h-[500px] border rounded-lg p-4">
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
