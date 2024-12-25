import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ActivityDetail = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axios.get(
                    `https://project-six-rouge.vercel.app/activity/${id}`
                );
                setActivity(response.data.activity);
            } catch (error) {
                console.error("Error fetching activity:", error);
            }
        };
        fetchActivity();
    }, [id]);

    if (!activity) return <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
        <DotLottieReact
            className="w-[200px] h-[200px]"
            src="https://lottie.host/5b8d0182-13bd-40c0-b485-e4621b87aba7/LSlDgjJbnv.lottie"
            loop
            autoplay
        />
    </div>;

    return (
        <>
            <div className="p-6 mt-20 flex flex-col justify-center items-center">
                <div className="rounded-lg bg-slate-400 w-full h-[500px]">

                </div>
                <h1 className="text-2xl font-bold">{activity.topic}</h1>
                <p>{activity.detail}</p>
                <p className="border-b-2 border-slate-600 h-5 w-full"></p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem ex ab, dolores quae, recusandae sint dolorum quidem vero minima qui, laudantium culpa! Quaerat, dolore aperiam accusantium commodi natus nobis magnam perspiciatis illo. Placeat voluptatem esse nostrum, molestiae eum culpa quae voluptatum distinctio enim dolores sequi alias dolorum, odit, molestias velit.</p>
            </div>
            <div className="px-6">
                <a href="" className="text-green-400">link</a>
            </div>
        </>

    );
};

export default ActivityDetail;
