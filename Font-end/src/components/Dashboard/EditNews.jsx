import React, { useState, useEffect } from "react";
import axios from "axios";

const EditNews = () => {
  const [activeTab, setActiveTab] = useState("Edit/Delete");
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [editFormData, setEditFormData] = useState({
    topic: "",
    detail: "",
    image: null,
    files: null,
  });

  // ดึงข้อมูลข่าวทั้งหมด
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
        );
        setNewsList(response.data.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        alert("ดึงข้อมูลข่าวไม่สำเร็จ!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // ฟังก์ชันลบข่าว
  const handleDelete = async (activityId) => {
    if (!window.confirm("คุณต้องการลบข่าวนี้ใช่หรือไม่?")) return;

    try {
      await axios.delete(`https://project-six-rouge.vercel.app/activity/${activityId}`);
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
      image: null, // สำหรับอัปโหลดภาพใหม่
      files: null, // สำหรับอัปโหลดไฟล์ใหม่
    });
  };

  // ฟังก์ชันเปลี่ยนข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  // ฟังก์ชันบันทึกข้อมูลหลังแก้ไข
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("topic", editFormData.topic);
    data.append("detail", editFormData.detail);
    if (editFormData.image) {
      data.append("image", editFormData.image);
    }
    if (editFormData.files) {
      data.append("files", editFormData.files);
    }

    try {
      await axios.put(
        `https://project-six-rouge.vercel.app/activity/${selectedNews.id}/edit`,
        data
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("Edit/Delete")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "Edit/Delete"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Edit/Delete
        </button>
        {activeTab === "EditNews" && (
          <button
            onClick={() => setActiveTab("EditNews")}
            className="px-4 py-2 rounded-md bg-yellow-600 text-white"
          >
            Edit News
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "Edit/Delete" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Edit/Delete News</h1>
          {isLoading ? (
            <p>Loading news...</p>
          ) : (
            <div className="space-y-4">
              {newsList.map((news) => (
                <div key={news.id} className="p-4 border rounded-md shadow">
                  <h3 className="font-bold">{news.topic}</h3>
                  <p className="text-sm text-gray-500">Detail: {news.detail}</p>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleEdit(news)}
                      className="text-white bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "EditNews" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Edit News</h1>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={editFormData.topic}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Detail */}
            <div>
              <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
                Detail
              </label>
              <textarea
                id="detail"
                name="detail"
                value={editFormData.detail}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              ></textarea>
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            {/* Files */}
            <div>
              <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                Additional Files
              </label>
              <input
                type="file"
                id="files"
                name="files"
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab("Edit/Delete")}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditNews;
