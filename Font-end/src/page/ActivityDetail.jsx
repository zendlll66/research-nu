import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { TailSpin } from 'react-loader-spinner';

const ActivityDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [activity, setActivity] = useState(location.state?.activity || null);
    const [isLoading, setIsLoading] = useState(!activity);
    const baseImageUrl = "https://project-six-rouge.vercel.app";

    useEffect(() => {
        if (!activity) {
            const fetchActivity = async () => {
                try {
                    const response = await axios.get(
                        `https://project-six-rouge.vercel.app/activity/${id}`
                    );
                    console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
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
                <TailSpin
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        );
    }

    if (!activity) {
        return <div>Activity not found</div>;
    }

    console.log(activity); // ตรวจสอบข้อมูล activity

    return (
        <>
            <div className="p-6 mt-20 flex flex-col justify-center items-center">
                <div className="rounded-lg bg-slate-400 w-full h-[500px] ">
                    <img
                        src={`${baseImageUrl}${activity.imageUrl}`}
                        alt={activity.topic}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-2xl font-bold mt-4">{activity.topic}</h1>
                <p className="mt-2">{activity.detail}</p>
                <p className="border-b-2 border-slate-600 h-5 w-full mt-4"></p>
                <p className="mt-4">
                    <span className="font-bold">Date:</span> {activity.time}
                </p>
            </div>
            <div className="px-6 mt-4">
                <a href={activity.link} className="text-green-400">link</a>
            </div>
        </>
    );
};

export default ActivityDetail;