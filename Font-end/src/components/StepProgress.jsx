import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditNews from "./Dashboard/EditNews";

const StepProgress = () => {
  const fileInputRef = useRef(null); // ✅ ใช้ useRef เพื่อเข้าถึง input file

  const initialFormState = {
    topic: "",
    detail: "",
    images: [],
    files: [],
    admin: "",
    link: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("Post");
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ดึงข้อมูล fname และ lname จาก localStorage และตั้งค่า admin
  useEffect(() => {
    const fname = localStorage.getItem("fname");
    const lname = localStorage.getItem("lname");

    if (fname && lname) {
      setFormData((prev) => ({
        ...prev,
        admin: `${fname} ${lname}`,
      }));
    }
  }, []);

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
        [name]: e.target.value || "",
      }));
    }
  };

  const sendLineBroadcast = async (newsId) => {
    try {
      if (!newsId) {
        console.error("❌ Error: newsId is undefined!");
        return;
      }

      // ✅ ดึง Token จาก localStorage
      const token = localStorage.getItem("token");

      const newsUrl = `https://research-nu-nine.vercel.app/activity/${newsId}`;
      const response = await axios.post(
        "https://project-six-rouge.vercel.app/broadcast/send",
        {
          message: `📢New Topic: ${formData.topic}\n🔗 Read more: ${newsUrl}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ เพิ่ม Token ใน Header
          },
        }
      );

      console.log("✅ Line Broadcast Sent:", response.data);
    } catch (error) {
      console.error("❌ Error sending Line Broadcast:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanData = {
      topic: formData.topic || "",
      detail: formData.detail || "",
      admin: formData.admin || "",
      link: formData.link || "",
      images: Array.isArray(formData.images) ? formData.images : [],
      time: new Date().toISOString(),
    };

    const data = new FormData();
    data.append("topic", cleanData.topic);
    data.append("detail", cleanData.detail);
    data.append("admin", cleanData.admin);
    data.append("time", cleanData.time);
    data.append("link", cleanData.link);

    if (cleanData.images.length > 0) {
      cleanData.images.forEach((image) => {
        if (image) data.append("image", image);
      });
    } else {
      data.append("image", ""); // ✅ ป้องกัน undefined
    }

    console.log("📌 Cleaned FormData:", [...data.entries()]);

    try {
      // ✅ ดึง Token จาก localStorage
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://project-six-rouge.vercel.app/activity/new",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ เพิ่ม Token ใน Header
          },
        }
      );

      console.log("✅ Success:", response.data);
      alert("News posted successfully!");

      const newsId = response.data.activityId || null;
      if (newsId) {
        await sendLineBroadcast(newsId);
      }

      setNewsList([...newsList, response.data]);

      setFormData(initialFormState);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("❌ Error posting news:", error.response?.data || error.message);
      alert(`Failed to post news: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <div className="flex flex-col sm:flex-row sm:space-x-4 border-b mb-6">
        <button
          className={`px-4 py-2 font-bold w-full sm:w-auto text-center ${
            activeTab === "Post" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Post")}
        >
          Post News
        </button>
        <button
          className={`px-4 py-2 font-bold w-full sm:w-auto text-center ${
            activeTab === "Edit/Delete" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Edit/Delete")}
        >
          Edit/Delete News
        </button>
      </div>

      {activeTab === "Post" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Post News</h1>
          <form id="news-form" onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="mt-1 w-full"
                ref={fileInputRef}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Files</label>
              <input
                type="file"
                name="files"
                multiple
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700">Admin</label>
              <input
                type="text"
                name="admin"
                value={formData.admin}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
                readOnly // ทำให้ฟิลด์ admin เป็น read-only
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
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