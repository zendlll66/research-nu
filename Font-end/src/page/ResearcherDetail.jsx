import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

    if (loading) return
    <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
        <DotLottieReact
            className="w-[200px] h-[200px]"
            src="https://lottie.host/5b8d0182-13bd-40c0-b485-e4621b87aba7/LSlDgjJbnv.lottie"
            loop
            autoplay
        />
    </div>;
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
            <div
                aria-hidden="true"
                className="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
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
                className="fixed inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
            </div>

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
