import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiFileText, FiClipboard, FiEye } from "react-icons/fi";

const Statistics = () => {
  const [totalResearchers, setTotalResearchers] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);

  // นับ Views จาก Local Storage
  const handlePageView = () => {
    const views = parseInt(localStorage.getItem("pageViews")) || 0;
    const newViews = views + 1;
    localStorage.setItem("pageViews", newViews);
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
          "https://project-six-rouge.vercel.app/research/Totalpapers"
        );
        const papers = scopusRes.data.data || [];

        // 3. ดึงข้อมูลกิจกรรม (ข่าวและไฟล์)
        const activityRes = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
        );
        const activities = activityRes.data.data || [];

        // 4. ดึงข้อมูลจำนวนผู้เยี่ยมชม
        const viewsRes = await axios.get(
          "https://project-six-rouge.vercel.app/home/stats"
        );
        const visitors = viewsRes.data.Visitors;

        // อัปเดต state
        setTotalResearchers(researchers.length);
        setTotalPapers(papers.length);
        setTotalActivities(activities.length);
        setTotalVisitors(visitors); // อัปเดตจำนวนผู้เยี่ยมชม
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
    <div className="p-6 bg-gray-200 shadow-lg rounded-lg animate-pulse">
      <div className="w-16 h-16 bg-gray-300 mx-auto rounded-full mb-4"></div>
      <div className="w-1/2 h-6 bg-gray-300 mx-auto mb-2"></div>
      <div className="w-full h-4 bg-gray-300 mx-auto"></div>
    </div>
  );

  return (
    <div className="sm:max-w-5xl  mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center rounded-lg sm:p-6 p-8 ">
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
            <FiUsers className="text-orange-500 mx-auto text-4xl mb-4" />
            <h3 className="text-3xl font-bold text-orange-500">{totalResearchers}</h3>
            <p className="text-gray-700">Total Researchers</p>
          </div>

          {/* จำนวน paper */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <FiFileText className="text-orange-500 mx-auto text-4xl mb-4" />
            <h3 className="text-3xl font-bold text-orange-500">{totalPapers}</h3>
            <p className="text-gray-700">Total Papers</p>
          </div>

          {/* จำนวนข่าวทั้งหมด */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <FiClipboard className="text-orange-500 mx-auto text-4xl mb-4" />
            <h3 className="text-3xl font-bold text-orange-500">{totalActivities}</h3>
            <p className="text-gray-700">Total News</p>
          </div>

          {/* จำนวนผู้เข้าชม */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <FiEye className="text-orange-500 mx-auto text-4xl mb-4" />
            <h3 className="text-3xl font-bold text-orange-500">{totalVisitors}</h3>
            <p className="text-gray-700">Total Views</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
