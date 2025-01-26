import React, { useState, useEffect } from "react";
import axios from "axios";
import EditNews from "./Dashboard/EditNews";

const StepProgress = () => {
  const [formData, setFormData] = useState({
    topic: "",
    detail: "",
    image: null,
    files: null,
    admin: "",
    link: "", // เพิ่มฟิลด์ link
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("Post");
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch news items
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(""); // Reset error
      try {
        const response = await axios.get(
          "https://project-six-rouge.vercel.app/activity"
        );
        setNewsList(response.data.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to fetch news.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: name === "files" ? files : files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("topic", formData.topic);
    data.append("detail", formData.detail);
    if (formData.image) {
      data.append("image", formData.image); // เพิ่มเฉพาะเมื่อ image ไม่เป็น null
    }
    if (formData.files) {
      Array.from(formData.files).forEach((file) => data.append("files", file)); // รองรับหลายไฟล์
    }
    data.append("admin", formData.admin);
    if (formData.link) {
      data.append("link", formData.link); // เพิ่มเฉพาะเมื่อมีค่า
    }
    data.append("time", new Date().toISOString());

    try {
      const response = await axios.post(
        "https://project-six-rouge.vercel.app/activity/new",
        data
      );
      console.log("Success:", response.data);
      alert("News posted successfully!");

      // อัปเดตรายการข่าว
      setNewsList([...newsList, response.data]);

      // รีเซ็ตฟอร์ม
      setFormData({
        topic: "",
        detail: "",
        image: null,
        files: null,
        admin: "",
        link: "",
      });
    } catch (error) {
      console.error("Error posting news:", error.response?.data || error.message);
      alert(
        `Failed to post news: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      await axios.delete(
        `https://project-six-rouge.vercel.app/activity/${activityId}`
      );
      setNewsList(newsList.filter((news) => news.id !== activityId));
      alert("News deleted successfully!");
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Failed to delete news. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          className={`px-4 py-2 font-bold ${
            activeTab === "Post"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Post")}
        >
          Post News
        </button>
        <button
          className={`px-4 py-2 font-bold ${
            activeTab === "Edit/Delete"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Edit/Delete")}
        >
          Edit/Delete News
        </button>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === "Post" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Post News</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
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
                value={formData.detail}
                onChange={handleChange}
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
                accept="image/*"
                onChange={handleChange}
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
                onChange={handleChange}
                multiple
                className="mt-1"
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>

            {/* Admin */}
            <div>
              <label htmlFor="admin" className="block text-sm font-medium text-gray-700">
                Admin
              </label>
              <input
                type="text"
                id="admin"
                name="admin"
                value={formData.admin}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post News"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "Edit/Delete" && <EditNews />}
    </div>
  );
};

export default StepProgress;
