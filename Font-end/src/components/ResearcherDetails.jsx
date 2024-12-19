import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ResearcherDetails = () => {
  const { faculty, id } = useParams(); // รับค่า faculty และ id จาก URL
  const [researcherData, setResearcherData] = useState([]); // ข้อมูลนักวิจัย
  const [loading, setLoading] = useState(true); // สถานะ Loading
  const [error, setError] = useState(null); // ข้อผิดพลาดถ้ามี
  const [selectedYear, setSelectedYear] = useState(""); // ปีที่เลือก

  useEffect(() => {
    const fetchResearcher = async () => {
      try {
        const response = await fetch(
          `https://project-six-rouge.vercel.app/researcher/${encodeURIComponent(
            faculty
          )}/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (json.status === "ok" && Array.isArray(json.data)) {
          setResearcherData(json.data); // เก็บข้อมูลนักวิจัย
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        setError(err.message); // เก็บข้อความข้อผิดพลาด
      } finally {
        setLoading(false);
      }
    };

    fetchResearcher();
  }, [faculty, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!researcherData || researcherData.length === 0)
    return <div>No researcher data available.</div>;

  // ดึงชื่อผู้วิจัย
  const researcherName = researcherData[0]?.researcher_name;

  // ดึงปีทั้งหมดและลบค่าซ้ำ
  const years = [...new Set(researcherData.map((paper) => paper.year))];

  // กรองข้อมูลตามปีที่เลือก
  const filteredPapers = selectedYear
    ? researcherData.filter((paper) => paper.year === parseInt(selectedYear))
    : researcherData;

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold mb-4">{researcherName}</h1>
      <h2 className="text-lg font-semibold mb-4">Research Papers</h2>

      {/* Dropdown เลือกปี */}
      <div className="mb-4">
        <select
          className="border rounded-lg p-2"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* แสดงรายการงานวิจัย */}
      <div className="space-y-4">
        {filteredPapers.map((paper, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-lg"
          >
            <h3 className="text-md font-semibold">{paper.paper}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Year:</span> {paper.year}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Source:</span> {paper.source}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Citations:</span> {paper.cited}
            </p>
            <a
              href={paper.link_to_paper}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Paper
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearcherDetails;
