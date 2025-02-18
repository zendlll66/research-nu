import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MoreNews = () => {
  const [newsItems, setNewsItems] = useState([]); // เก็บข่าว
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // เก็บจำนวนหน้าจาก API
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://project-six-rouge.vercel.app/activity?page=${currentPage}`
        );

        const data = response.data.data.map((item) => ({
          ...item,
          image: JSON.parse(item.image || "[]"),
          files: JSON.parse(item.files || "[]"),
        }));

        setNewsItems(data);
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNewsItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleViewDetail = (item) => {
    if (item?.id) {
      navigate(`/activity/${item.id}`, { state: { activity: item } });
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [...Array(5)].map((_, i) => totalPages - 4 + i);
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-20">
      <h1 className="text-2xl font-bold text-orange-500 mb-4">All News</h1>

      {/* ✅ Skeleton Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {Array(10).fill(0).map((_, index) => (
            <div
              key={index}
              className="w-full max-w-[300px] mx-auto h-auto bg-gray-200 animate-pulse shadow-lg rounded-lg overflow-hidden"
            >
              <div className="h-52 bg-gray-300"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                <div className="h-6 bg-gray-400 rounded w-full"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : newsItems.length === 0 ? (
        <p className="text-center text-gray-500">No news available.</p>
      ) : (
        <>
          {/* ✅ ปรับ Grid ให้ Responsive ดีขึ้น */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleViewDetail(item)}
                className="w-full max-w-[300px] mx-auto h-auto bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="h-52 overflow-hidden">
                  {item.image.length > 0 ? (
                    <img
                      src={item.image[0]}
                      alt="news"
                      className="w-full h-full object-cover object-top "
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-md">
                    {item.topic || "No Topic"}
                  </span>
                  <h2 className="mt-2 font-bold text-lg text-orange-500">{item.topic || "No Topic"}</h2>
                  
                  {/* ✅ ตัดเนื้อหาที่ยาวเกิน 100 ตัวอักษร */}
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {item.detail.length > 100 ? `${item.detail.substring(0, 100)}...` : item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {currentPage > 3 && totalPages > 5 && (
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                1
              </button>
            )}

            {currentPage > 4 && totalPages > 5 && (
              <span className="px-3 py-1 text-gray-600">...</span>
            )}

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 3 && totalPages > 5 && (
              <span className="px-3 py-1 text-gray-600">...</span>
            )}

            {currentPage < totalPages - 2 && totalPages > 5 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                {totalPages}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MoreNews;
