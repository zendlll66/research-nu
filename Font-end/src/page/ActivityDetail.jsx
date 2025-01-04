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
                    setActivity(response.data.data || {});
                } catch (error) {
                    console.error("Error fetching activity:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchActivity();
        }
    }, [id, activity]);

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

    // ตรวจสอบว่า files มีหรือไม่
    const files = activity.files ? JSON.parse(activity.files) : [];

    return (
        <div className="px-40 mt-20 flex flex-col justify-center items-center">
            {/* แสดงรูปภาพ */}
            <div className=" gap-4 mt-6 flex flex-col">
                {activity.imageUrl.map((img, index) => (
                    <div key={index} className="rounded-lg  overflow-hidden bg-slate-400 ">
                        <img
                            src={`https://project-six-rouge.vercel.app${img}`}
                            alt={`news-image-${index}`}
                            className="w-full h-full "
                        />
                    </div>
                ))}
            </div>

            <h1 className="text-2xl font-bold mt-4">{activity.topic}</h1>
            <p className="mt-2">{activity.detail}</p>

            <div className="border-b-2 border-slate-600 h-5 w-full mt-4"></div>

            <div className="mt-4 flex flex-col">
                <span className="font-bold">Date: {activity.time}</span>
                <span className="text-sm ml-2">
                    POST BY: {activity.admin}
                </span>

                {/* แสดงไฟล์ */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Attached Files</h2>
                    <ul className="mt-4 list-disc list-inside space-y-2 mb-20">
                        {activity.filesUrl.map((file, index) => (
                            <li key={index}>
                                <a
                                    href={`https://project-six-rouge.vercel.app${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {activity.files}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;
