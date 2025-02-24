import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Carousels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ฟังก์ชันแปลงวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("th-TH", options); // ใช้ 'th-TH' สำหรับภาษาไทย
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
        );
        const data = response.data.data
          .map((item) => ({
            ...item,
            image: JSON.parse(item.image || "[]"),
            files: JSON.parse(item.files || "[]"),
          }))
          .slice(0, 10); // ✅ จำกัดแค่ 10 ข่าวล่าสุด

        setNewsItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNewsItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetail = (item) => {
    if (item?.id) {
      navigate(`/activity/${item.id}`, { state: { activity: item } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < newsItems.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="p-6 relative w-full lg:w-[1000px] overflow-hidden flex flex-col">
      <div className="relative flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-orange-500">News Blog</h1>
          <a href="/more-news" className="text-sm font-light text-orange-500">
            Show more News
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className={`relative h-10 w-10 z-10 rounded-lg bg-white text-orange-500 border-[1px] border-orange-500 flex items-center justify-center cursor-pointer ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentIndex === 0}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className={`relative h-10 w-10 z-10 rounded-lg bg-white text-orange-500 border-[1px] border-orange-500 flex items-center justify-center cursor-pointer ${
              currentIndex === newsItems.length - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentIndex === newsItems.length - 1}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full mt-4">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * 260}px)`,
          }}
        >
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-[250px] h-auto mx-2 space-y-5 rounded-md flex-shrink-0 animate-pulse"
                  >
                    <div className="rounded-lg bg-orange-200 w-full h-[150px]"></div>
                    <div className="h-4 bg-orange-200 rounded w-2/3"></div>
                  </div>
                ))
            : newsItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleViewDetail(item)}
                  className="w-[250px] h-[290px] overflow-hidden mx-2 space-y-5 rounded-md flex-shrink-0 
                    transition-all duration-300 hover:translate-y-[-15px] cursor-pointer hover:shadow-xl bg-white"
                >
                  <div className="rounded-lg overflow-hidden bg-orange-100 w-full h-[150px]">
                    {item.image?.length > 0 ? (
                      item.image.map((img, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden w-full h-[150px]"
                        >
                          <img
                            src={img}
                            alt={`news-image-${index}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="w-full px-2 space-y-2 text-black">
                    <span className="text-[12px] bg-orange-500 text-white w-fit px-2 py-1 rounded-md">
                      {formatDate(item.time) || "No Date"} {/* แสดงวันที่ที่แปลงแล้ว */}
                    </span>
                    <h1 className="font-bold text-orange-500">
                      {item.topic || "No Topic"}
                    </h1>
                    <p className="text-[12px] text-gray-700 line-clamp-2">
                      {item.detail || "No detail available."}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Carousels;