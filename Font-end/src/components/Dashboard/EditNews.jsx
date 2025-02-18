import React, { useState, useEffect } from "react";
import axios from "axios";
import EditNewsModel from "../EditNewsModel";

const EditNews = () => {
  const [activeTab, setActiveTab] = useState("Edit/Delete");
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [editFormData, setEditFormData] = useState({
    topic: "",
    detail: "",
    link: "",
    image: null,
    files: null,
  });

  // ดึงข้อมูลข่าวทั้งหมด
  const fetchNews = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://project-six-rouge.vercel.app/activity?page=${page}`
      );
      setNewsList(response.data.data || []);
      setTotalPages(response.data.total_pages || 1); // ตั้งค่า totalPages จาก API
    } catch (error) {
      console.error("Error fetching news:", error);
      alert(`❌ Failed to fetch news: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // ฟังก์ชันลบข่าว
  const handleDelete = async (activityId) => {
    if (!window.confirm("คุณต้องการลบข่าวนี้ใช่หรือไม่?")) return;
    try {
      await axios.delete(`https://project-six-rouge.vercel.app/activity/${activityId}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setNewsList(newsList.filter((news) => news.id !== activityId));
      alert("ลบข่าวสำเร็จ!");
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("ลบข่าวไม่สำเร็จ!");
    }
  };

  // ฟังก์ชันเมื่อกด Edit
  const handleEdit = (news) => {
    setActiveTab("EditNews");
    setSelectedNews(news);
    setEditFormData({
      topic: news.topic,
      detail: news.detail,
      link: news.link || "",
      image: null,
      files: null,
    });
  };

  // ฟังก์ชันบันทึกข้อมูลหลังแก้ไข
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("topic", editFormData.topic);
    data.append("detail", editFormData.detail);
    data.append("link", editFormData.link);
    if (editFormData.image) {
      data.append("image", editFormData.image);
    }
    if (editFormData.files) {
      data.append("files", editFormData.files);
    }

    try {
      await axios.put(
        `https://project-six-rouge.vercel.app/activity/${selectedNews.id}/edit`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("อัปเดตข่าวสำเร็จ!");

      // อัปเดต newsList หลังแก้ไข
      const updatedList = newsList.map((news) =>
        news.id === selectedNews.id ? { ...news, ...editFormData } : news
      );
      setNewsList(updatedList);

      // กลับไปยัง Tab "Edit/Delete"
      setActiveTab("Edit/Delete");
    } catch (error) {
      console.error("Error updating news:", error);
      alert("อัปเดตข่าวไม่สำเร็จ!");
    }
  };

  // ฟังก์ชันตัดข้อความ
  const truncateText = (text, maxLength = 300) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchNews(newPage, searchTerm); // ดึงข้อมูลใหม่เมื่อเปลี่ยนหน้า
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("Edit/Delete")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "Edit/Delete"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Edit/Delete
        </button>
        {activeTab === "EditNews" && (
          <button
            onClick={() => setActiveTab("EditNews")}
            className="px-4 py-2 rounded-md bg-orange-600 text-white"
          >
            Edit News
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "Edit/Delete" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Edit/Delete News</h1>

          {/* Search Bar */}
          {/* <div className="mb-6">
            <input
              type="text"
              placeholder="ค้นหาข่าว..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div> */}

          {isLoading ? (
            <p>Loading news...</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    className="p-4 border rounded-md shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg md:text-xl">{news.topic}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Detail: {truncateText(news.detail)}
                    </p>
                    {news.link && (
                      <p className="text-sm text-blue-500 truncate mt-1">
                        Link:{" "}
                        <a href={news.link} target="_blank" rel="noopener noreferrer">
                          {news.link}
                        </a>
                      </p>
                    )}
                    <div className="flex space-x-4 mt-3">
                      <button
                        onClick={() => handleEdit(news)}
                        className="text-white bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600 transition-colors text-sm md:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(news.id)}
                        className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm md:text-base"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "EditNews" && (
        <EditNewsModel editFormData={editFormData} />
      )}
    </div>
  );
};

export default EditNews;