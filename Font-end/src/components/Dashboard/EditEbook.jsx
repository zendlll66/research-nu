import React, { useState } from "react";
import LoadingSussFully from "../LoadingSussFully";

const EditEbook = () => {
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ ฟังก์ชันอัปเดตลิงก์ Ebook
  const handleSubmit = async () => {
    setMessage("");
    setIsLoading("loading");

    // ✅ ดึง token จาก localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://project-six-rouge.vercel.app/ebook/edit/1",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ส่ง token ใน header
          },
          body: JSON.stringify({ link_to_ebook: link }),
        }
      );

      if (response.ok) {
        setIsLoading("success");
      } else {
        setMessage("Failed to update the link.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating link:", error);
      setMessage("An error occurred. Please try again.");
      setIsLoading(false);
    } finally {
      setShowConfirm(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 relative">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Ebook Link
        </h1>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              Ebook Link
            </label>
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter new ebook link"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Save
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <p className="text-lg font-medium text-gray-700">
              Are you sure you want to change the Ebook?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadingSussFully isLoading={isLoading} />
    </div>
  );
};

export default EditEbook;
