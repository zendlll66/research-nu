import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiFileText, FiClipboard, FiEye } from "react-icons/fi";

const Statistics = () => {
  const [totalResearchers, setTotalResearchers] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  // นับ Views จาก Local Storage
  const handlePageView = () => {
    const views = parseInt(localStorage.getItem("pageViews")) || 0;
    const newViews = views + 1;
    localStorage.setItem("pageViews", newViews);
    setTotalViews(newViews);
  };

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // 1. ดึงข้อมูลนักวิจัย
        const researcherRes = await axios.get(
          "https://project-six-rouge.vercel.app/researcher"
        );
        const researchers = researcherRes.data.data || [];

        // 2. ดึงข้อมูล Scopus (Paper)
        const scopusRes = await axios.get(
          "https://project-six-rouge.vercel.app/research/scopus"
        );
        const papers = scopusRes.data.data || [];

        // 3. ดึงข้อมูลกิจกรรม (ข่าวและไฟล์)
        const activityRes = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
        );
        const activities = activityRes.data.data || [];

        // นับ paper ทั้งหมดจาก Scopus
        const totalPapers = papers.length;

        // อัปเดต state
        setTotalResearchers(researchers.length);
        setTotalPapers(totalPapers);
        setTotalActivities(activities.length);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    handlePageView();
    fetchStatistics();
  }, []);

  // Skeleton Loader
  const Skeleton = () => (
    <div className="p-6 bg-white shadow-lg rounded-lg animate-pulse">
      <div className="w-16 h-16 bg-gray-200 mx-auto rounded-full mb-4"></div>
      <div className="w-24 h-6 bg-gray-200 mx-auto mb-2"></div>
      <div className="w-32 h-4 bg-gray-200 mx-auto"></div>
    </div>
  );

  return (
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
  );
};

export default Statistics;
