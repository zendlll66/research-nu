import React, { useState, useEffect } from "react"; 
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Carousels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // State เช็คการโหลด
  const navigate = useNavigate();

  // ดึงข้อมูลข่าวจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
        );
        console.log(response.data);
        setNewsItems(response.data.allActivities || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);  // เมื่อโหลดเสร็จหรือ error จะ set ให้เป็น false
      }
    };
    fetchData();
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/activity/${id}`);
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
        <h1 className="text-xl font-bold">News Blog</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className={`relative h-10 w-10 z-10 rounded-lg bg-white border-[1px] border-black border-opacity-30 flex items-center justify-center cursor-pointer ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentIndex === 0}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className={`relative h-10 w-10 z-10 rounded-lg bg-white border-[1px] border-black border-opacity-30 flex items-center justify-center cursor-pointer ${
              currentIndex === newsItems.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
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
            ? Array(4)  // แสดง Skeleton 4 ชิ้นขณะรอโหลด
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-[250px] h-auto mx-2 space-y-5 rounded-md flex-shrink-0 animate-pulse"
                  >
                    <div className="rounded-lg bg-gray-300 w-full h-[150px]"></div>
                    <div className="w-full space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
            : newsItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleViewDetail(item.id)}
                  className="w-[250px] h-auto mx-2 space-y-5 rounded-md flex-shrink-0 
                  transition-all duration-300 hover:translate-y-[-15px] cursor-pointer"
                >
                  <div className="rounded-lg bg-slate-400 w-full h-[150px]">
                    {/* {item.image && (
                      <img
                        src={item.image}
                        alt={item.topic}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    )} */}
                  </div>
                  <div className="w-full">
                    <span className="text-[12px] bg-white text-opacity-15 border border-gray-400 w-fit p-[2px] rounded-md">
                      {item.topic}
                    </span>
                    <h1 className="font-bold">{item.topic}</h1>
                    <p className="text-[12px]">{item.detail}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Carousels;
