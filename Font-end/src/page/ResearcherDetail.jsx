import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen } from "react-icons/fi";

const ResearcherDetails = () => {
    const location = useLocation();
    const { researcher } = location.state || {};

    const { faculty, id } = useParams();
    const [researcherData, setResearcherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSource, setSelectedSource] = useState("");

    const baseImageUrl = "https://project-six-rouge.vercel.app";

    useEffect(() => {
        const fetchResearcher = async () => {
            try {
                const response = await fetch(
                    `https://project-six-rouge.vercel.app/researcher/${encodeURIComponent(faculty)}/${id}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                if (json.status === "ok" && Array.isArray(json.data)) {
                    setResearcherData(json.data);
                } else {
                    throw new Error("Unexpected data format");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResearcher();
    }, [faculty, id]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
                <DotLottieReact
                    className="w-[200px] h-[200px]"
                    src="https://lottie.host/5b8d0182-13bd-40c0-b485-e4621b87aba7/LSlDgjJbnv.lottie"
                    loop
                    autoplay
                />
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;
    if (!researcherData || researcherData.length === 0)
        return <div>No researcher data available.</div>;

    const researcherName = researcherData[0]?.researcher_name;
    const years = [...new Set(researcherData.map((paper) => paper.year))];
    const sources = [...new Set(researcherData.map((paper) => paper.source.toLowerCase()))];

    const filteredPapers = researcherData.filter((paper) => {
        return (
            (selectedYear ? paper.year === parseInt(selectedYear) : true) &&
            (selectedSource ? paper.source.toLowerCase() === selectedSource : true)
        );
    });

    return (
        <div className="p-6 mt-20">
            <div className="rounded-t-lg mb-3 grid place-items-center ">
                <img
                    className="rounded-md h-full object-cover "
                    src={`${baseImageUrl}${researcher.imageUrl}`}
                    alt={researcher.name}
                />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex justify-center items-center gap-3">
                {/* <FiBookOpen className="text-indigo-500" /> */}
                {researcherName}
            </h1>

            {/* Contact Information */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-5 flex items-center gap-3">
                    <FiCalendar className="text-indigo-500" />
                    Contact Information
                </h2>
                <p className="flex items-center gap-2">
                    <FiMail className="text-indigo-500" /> Email: {researcher.contact}
                </p>
                <p className="flex items-center gap-2">
                    <FiPhone className="text-indigo-500" /> Phone: {researcher.phone}
                </p>
                <p className="flex items-center gap-2">
                    <FiMapPin className="text-indigo-500" /> Office: {researcher.office}
                </p>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-6">Research Papers</h2>

            {/* Dropdown Filters */}
            <div className="flex space-x-4 mb-6">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Year
                    </label>
                    <select
                        className="border rounded-lg p-2 w-full"
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

                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Source
                    </label>
                    <select
                        className="border rounded-lg p-2 w-full"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
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

            {/* Display Filtered Papers */}
            <div className="space-y-4">
                {filteredPapers.map((paper, index) => (
                    <div
                        key={index}
                        className="bg-white border rounded-lg p-4 shadow hover:shadow-lg"
                    >
                        <h3 className="text-md font-semibold flex items-center gap-3">
                            <FiBookOpen className="text-indigo-500" />
                            {paper.paper}
                        </h3>
                        <p className="text-sm text-gray-600">
                            <FiCalendar className="inline-block text-indigo-500" /> {paper.year}
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
