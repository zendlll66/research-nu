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
            <div className="rounded-lg bg-slate-400 w-full">
                <img
                    src={`${baseUrl}${activity.imageUrl}`}
                    alt={activity.topic}
                    className="w-full h-full object-cover"
                />
            </div>

            <h1 className="text-2xl font-bold mt-4">{activity.topic}</h1>
            <p className="mt-2">{activity.detail}</p>

            <div className="border-b-2 border-slate-600 h-5 w-full mt-4"></div>

            <div className="mt-4 flex flex-col">
                <span className="font-bold">Date: {activity.time}</span>
                <span className="text-sm ml-2">
                    POST BY: {activity.admin}
                </span>

                {/* แสดงไฟล์ที่แนบมา */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Attached Files:</h2>
                    {files.length > 0 ? (
                        files.map((file, index) => (
                            <a
                                key={index}
                                href={`${baseUrl}${activity.filesUrl}`}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline mt-2 block"
                            >
                                {file}
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-500">No files attached.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;
