import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Research = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(""); // ภาควิชาที่เลือก
  const [researchers, setResearchers] = useState([]); // ข้อมูลนักวิจัย
  const [loading, setLoading] = useState(false); // สถานะ Loading
  const [error, setError] = useState(null); // ข้อผิดพลาดถ้ามี

  const faculties = [
    "Industrial Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical and Computer Engineering",
  ];

  useEffect(() => {
    // if (!selectedFaculty) return; // หากไม่มีการเลือกภาควิชา ไม่ต้อง fetch

    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);

      try {
        const encodedFaculty = encodeURIComponent(selectedFaculty); // เข้ารหัสชื่อภาควิชา
        const response = await fetch(
          `https://project-six-rouge.vercel.app/researcher/${encodedFaculty}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (json.status === "ok" && Array.isArray(json.data)) {
          setResearchers(json.data); // เก็บข้อมูลนักวิจัย
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        setError(err.message); // เก็บข้อความข้อผิดพลาด
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, [selectedFaculty]); // Fetch ข้อมูลใหม่เมื่อ selectedFaculty เปลี่ยน

  const navigate = useNavigate();

  const handleClick = (faculty, id) => {
    navigate(`/researcher/${encodeURIComponent(faculty)}/${id}`);
  };

  return (
    <div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mt-20 p-6">
        <h1 className="text-2xl font-bold mb-4">Researcher Data</h1>

        {/* เลือกภาควิชา */}
        <div className="mb-4">
          <select
            className="border rounded-lg p-2"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)} // เปลี่ยนภาควิชาที่เลือก
          >
            <option value="" disabled>
              Select Faculty
            </option>
            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>

        {/* สถานะ Loading หรือ Error */}
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}

        {/* แสดงข้อมูลนักวิจัย */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchers.map((researcher) => (
            <div
              key={researcher.id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-lg"
              onClick={() => handleClick(researcher.department, researcher.id)}
            >
              <h2 className="text-lg font-semibold">{researcher.name}</h2>
              <p className="text-gray-600">{researcher.faculty}</p>
              <p className="text-gray-500">{researcher.department || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Research;
