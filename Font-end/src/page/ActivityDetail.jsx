import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { TailSpin } from 'react-loader-spinner';

const ActivityDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [activity, setActivity] = useState(location.state?.activity || null);
    const [isLoading, setIsLoading] = useState(!activity);
    const baseUrl = "https://project-six-rouge.vercel.app";

    useEffect(() => {
        if (!activity) {
            const fetchActivity = async () => {
                try {
                    const response = await axios.get(
                        `${baseUrl}/activity/${id}`
                    );
                    const data = response.data.data || {};
                    setActivity({
                        ...data,
                        image: parseJsonSafely(data.image), // แปลงเฉพาะกรณีที่เป็น JSON
                        files: parseJsonSafely(data.files), // แปลงเฉพาะกรณีที่เป็น JSON
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

    // ฟังก์ชันช่วยแปลง JSON แบบปลอดภัย
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
            <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
                <TailSpin height="80" width="80" color="#4fa94d" />
            </div>
        );
    }

    if (!activity) {
        return <div>Activity not found</div>;
    }

    const { image = [], files = [] } = activity;

    return (
        <div className="px-40 mt-20 flex flex-col justify-center items-center">
            {/* แสดงรูปภาพ */}
            <div className=" gap-4 mt-6 flex flex-col">
                {image.length > 0 ? (
                    image.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden bg-slate-400">
                            <img
                                src={img}
                                alt={`news-image-${index}`}
                                className="w-full h-full"
                            />
                        </div>
                    ))
                ) : (
                    <p>No Images Available</p>
                )}
            </div>

            <h1 className="text-2xl font-bold mt-4">{activity.topic}</h1>
            <p className="mt-2 indent-10">{activity.detail}</p>

            <div className="border-b-2 border-slate-600 h-5 w-full mt-4"></div>

            <div className="mt-4 flex flex-col">
                <span className="font-bold">Date: {activity.time}</span>
                <span className="text-sm ml-2">POST BY: {activity.admin}</span>

                {/* แสดงไฟล์ */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Attached Files</h2>
                    <ul className="mt-4 list-disc list-inside space-y-2 ">
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <li key={index}>
                                    <a
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.split("/").pop()}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <p>No Files Available</p>
                        )}
                    </ul>
                </div>

                {/* แสดงลิงค์ */}
                <div className="mt-6 mb-20">
                    <h2 className="text-xl font-semibold">Related Links</h2>
                    <ul className="mt-4 list-disc list-inside space-y-2">
                        {activity.link ? (
                            <li>
                                <a
                                    href={activity.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {activity.link}
                                </a>
                            </li>
                        ) : (
                            <p>No Links Available</p>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;
