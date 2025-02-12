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

  // ✅ ดึง Token จาก LocalStorage
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
    data.append("detail", formData.detail);
    data.append("admin", formData.admin);
    data.append("time", new Date().toISOString());

    if (formData.link) {
      data.append("link", formData.link);
    }

    // ✅ อัปโหลดหลายไฟล์
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
            Authorization: `Bearer ${token}`, // ✅ ส่ง Token ใน Header
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <div className="flex space-x-4 border-b mb-6">
        <button
          className={`px-4 py-2 font-bold ${activeTab === "Post" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("Post")}
        >
          Post News
        </button>
        <button
          className={`px-4 py-2 font-bold ${activeTab === "Edit/Delete" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("Edit/Delete")}
        >
          Edit/Delete News
        </button>
      </div>

      {activeTab === "Post" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Post News</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Topic</label>
              <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detail</label>
              <textarea name="detail" value={formData.detail} onChange={handleChange} rows="4" className="mt-1 p-2 w-full border border-gray-300 rounded-md" required></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Files</label>
              <input type="file" name="files" multiple onChange={handleChange} className="mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input type="url" name="link" value={formData.link} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="https://example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Admin</label>
              <input type="text" name="admin" value={formData.admin} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md" required />
            </div>

            <div className="flex justify-end space-x-4">
              <button type="submit" disabled={isSubmitting} className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50">
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
