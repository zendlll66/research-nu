import React, { useState, useEffect } from "react";
import axios from "axios";
import EditNews from "./Dashboard/EditNews";

const StepProgress = () => {
  const [formData, setFormData] = useState({
    topic: "",
    detail: "",
    images: [],
    files: [],
    admin: "",
    link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("Post");
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ดึง Token จาก LocalStorage
  const token = localStorage.getItem("token");

  // Fetch news items
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get("https://project-six-rouge.vercel.app/activity");
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
    const { name, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!token) {
      alert("❌ Authentication failed! กรุณา Login ก่อนโพสต์ข่าว");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("topic", formData.topic);
    data.append("admin", formData.admin);
    data.append("time", new Date().toISOString());

    // ถ้า Detail เป็นค่าว่าง ให้ส่ง null แทน
    data.append("detail", formData.detail.trim() ? formData.detail : "");

    // ถ้า Link เป็นค่าว่าง ให้ส่ง null แทน
    data.append("link", formData.link.trim() ? formData.link : "");

    formData.images.forEach((image) => data.append("image", image));
    formData.files.forEach((file) => data.append("files", file));

    console.log("📌 FormData Entries:", [...data.entries()]);

    try {
      const response = await axios.post(
        "https://project-six-rouge.vercel.app/activity/new",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Success:", response.data);
      alert("🎉 News posted successfully!");

      setNewsList([...newsList, response.data]);

      setFormData({
        topic: "",
        detail: "",
        images: [],
        files: [],
        admin: "",
        link: "",
      });
    } catch (error) {
      console.error("❌ Error posting news:", error.response?.data || error.message);
      alert(`❌ Failed to post news: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-md">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 border-b mb-6">
        <button
          className={`px-4 py-2 font-bold text-sm sm:text-base ${
            activeTab === "Post"
              ? "border-b-2 border-orange-600 text-orange-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Post")}
        >
          Post News
        </button>
        <button
          className={`px-4 py-2 font-bold text-sm sm:text-base ${
            activeTab === "Edit/Delete"
              ? "border-b-2 border-orange-600 text-orange-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Edit/Delete")}
        >
          Edit/Delete News
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "Post" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Post News</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Detail</label>
              <textarea
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                rows="4"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              ></textarea>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>

            {/* Additional Files */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Files
              </label>
              <input
                type="file"
                name="files"
                multiple
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>

            {/* Admin */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin</label>
              <input
                type="text"
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
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 text-sm sm:text-base"
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