import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

const ActivityDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [activity, setActivity] = useState(location.state?.activity || null);
    const [isLoading, setIsLoading] = useState(!activity);
    const [selectedImage, setSelectedImage] = useState(null); // ✅ เก็บรูปที่ถูกเลือก
    const baseUrl = "https://project-six-rouge.vercel.app";

    const formatDate = (isoString) => {
        if (!isoString) return "No Date";
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    useEffect(() => {
        if (!activity) {
            const fetchActivity = async () => {
                try {
                    const response = await axios.get(`${baseUrl}/activity/${id}`);
                    const data = response.data.data || {};
                    setActivity({
                        ...data,
                        image: parseJsonSafely(data.image),
                        files: parseJsonSafely(data.files),
                    });
                } catch (error) {
                    console.error("Error fetching activity:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchActivity();
        }
    }, [id, activity]);

    const parseJsonSafely = (str) => {
        try {
            return JSON.parse(str || "[]");
        } catch (error) {
            console.warn("Invalid JSON:", str);
            return [];
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                <TailSpin height="80" width="80" color="#F97316" />
            </div>
        );
    }

    if (!activity) {
        return <div className="text-center text-gray-500 mt-20">Activity not found</div>;
    }

    const { image = [], files = [], topic, detail, time, admin, link } = activity;

    return (
        <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-lg rounded-lg">
            {/* ✅ รูปภาพหลัก พร้อมให้กดดูขนาดเต็ม */}
            {image.length > 0 ? (
                <div
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                    onClick={() => setSelectedImage(image[0])} // ✅ กดที่รูปแล้วขยาย
                >
                    <img src={image[0]} alt="Activity" className="w-full object-cover hover:opacity-80 transition-all" />
                </div>
            ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                    No Image Available
                </div>
            )}

            {/* ✅ หัวข้อข่าว */}
            <h1 className="text-2xl font-bold text-orange-600 mt-6">{topic}</h1>

            {/* ✅ รายละเอียดข่าว */}
            <p className="mt-4 text-gray-700 leading-relaxed indent-[40px]">{detail}</p>

            {/* ✅ ข้อมูลข่าวเพิ่มเติม */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {formatDate(time)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Posted by:</strong> {admin}
                </p>
            </div>

            {/* ✅ รายการรูปภาพเพิ่มเติม */}
            {image.length > 1 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">More Images</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {image.slice(1).map((img, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                                onClick={() => setSelectedImage(img)} // ✅ ให้กดดูรูปเต็ม
                            >
                                <img src={img} alt={`news-image-${index}`} className="w-full h-32 object-cover hover:opacity-80 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ✅ ไฟล์แนบ */}
            {files.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800">Attached Files</h2>
                    <ul className="mt-3 space-y-2">
                        {files.map((file, index) => (
                            <li key={index}>
                                <a href={file} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                                    📄 {file.split("/").pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ✅ ลิงก์ที่เกี่ยวข้อง */}
            {link && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800">Download Files</h2>
                    <ul className="mt-3">
                        <li>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                                🔗 {link}
                            </a>
                        </li>
                    </ul>
                </div>
            )}

            {/* ✅ Modal สำหรับดูรูปขนาดเต็ม */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex justify-center items-center z-50"
                    onClick={() => setSelectedImage(null)} // ✅ กดปิดเมื่อคลิกที่พื้นหลัง
                >
                    <div className="relative max-w-4xl w-full p-4"> 
                        <img src={selectedImage} alt="Full View" className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityDetail;
