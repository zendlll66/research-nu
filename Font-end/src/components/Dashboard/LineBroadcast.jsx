import { useState, useRef } from "react";
import axios from "axios";
import { GrAnnounce } from "react-icons/gr";
import { IoIosRocket } from "react-icons/io";

const LineBroadcast = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [link, setLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "line_broadcast");
    formData.append("cloud_name", "dv9rio4jw");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv9rio4jw/image/upload",
        formData
      );
      setImage(response.data.secure_url);
    } catch {
      alert(":x: อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setIsUploading(false);
    }
  };

  const sendBroadcast = async () => {
    if (!message && !image && !link) {
      alert("กรุณากรอกข้อความ อัปโหลดรูป หรือใส่ลิงก์อย่างน้อยหนึ่งอย่าง");
      return;
    }

    if (isUploading) {
      alert(":hourglass_flowing_sand: กรุณารอให้รูปอัปโหลดเสร็จก่อน...");
      return;
    }

    try {
      const payload = { message, image, link };
      const response = await fetch("https://project-six-rouge.vercel.app/broadcast/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(":white_check_mark: ส่งข้อความถึงทุกคนสำเร็จ!");
        setMessage("");
        setImage(null);
        setPreviewImage(null);
        setLink("");
        if (inputFileRef.current) inputFileRef.current.value = "";
      } else {
        alert(":x: เกิดข้อผิดพลาด: " + data.error);
      }
    } catch {
      alert(":x: ไม่สามารถส่งข้อความได้ กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4 flex justify-center items-center gap-2 p-2 rounded-md">
          <GrAnnounce />
          LINE Broadcast
        </h2>

        {/* Message Input */}
        <textarea
          className="w-full p-2 border rounded-md mb-3 resize-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />

        {/* Link Input */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Link (If there is)</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Paste the link..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Upload photo (If there is)</label>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-md"
          />
          {isUploading && <p className="text-yellow-500 text-sm mt-2">Uploading...</p>}
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div className="mb-3 flex justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-md"
            />
          </div>
        )}

        {/* Send Button */}
        <button
          className={`w-full px-4 py-2 text-white font-bold rounded-md transition-all ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={sendBroadcast}
          disabled={isUploading}
        >
          <div className="flex justify-center items-center gap-2">
            <IoIosRocket /> {isUploading ? "Uploading..." : "Send Broadcast"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default LineBroadcast;