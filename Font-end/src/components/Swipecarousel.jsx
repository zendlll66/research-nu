import React, { useState } from "react"; 
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = () => {
    const slides = [
        {
            image: "assets/one.jpg",
            title: "Engineering Research Hub",
            description: "Access the latest research papers, statistics, and researcher profiles from Naresuan University.",
            link: "https://www.youtube.com/",
            label: "01"
        },
        {
            image: "assets/two.jpg",
            title: "Stay Updated via LINE",
            description: "Never miss an update! Receive notifications about new research and important updates via LINE Broadcast.",
            link: "https://line.me/R/ti/p/@852pnhej",
            label: "02"
        },
        {
            image: "assets/three.jpg",
            title: "eBooks & Knowledge Resources",
            description: "Download eBooks and explore full research articles to enhance your learning and development.",
            link: "https://www.google.com/",
            label: "03"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="w-full mx-auto overflow-hidden">
            <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-2xl">
                <div className="relative flex w-full h-96">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute w-full h-full transition-opacity duration-700 ${
                                index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                <div className="bg-black bg-opacity-50 h-full flex flex-col items-center justify-center text-white text-center px-4">
                                    <AnimatePresence mode="wait">
                                        {index === currentSlide && (
                                            <motion.div
                                                key={currentSlide}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.5 }}
                                                className="space-y-4"
                                            >
                                                <motion.h2
                                                    className="text-4xl font-bold mb-2 text-orange-500"
                                                    initial={{ opacity: 0, x: -50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2, duration: 0.5 }}
                                                >
                                                    {slide.title}
                                                </motion.h2>
                                                <motion.p
                                                    className="text-lg mb-4"
                                                    initial={{ opacity: 0, x: 50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4, duration: 0.5 }}
                                                >
                                                    {slide.description}
                                                </motion.p>
                                                <a href={slide.link} target="_blank" rel="noopener noreferrer">
                                                    <motion.button
                                                        className="px-6 py-3  bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.6, duration: 0.5 }}
                                                    >
                                                        {slide.label === "02" ? "QR Line" : "Learn More"}
                                                    </motion.button>
                                                </a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                    <motion.button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 hover:p-4 duration-300 rounded-full shadow-lg"
                    >
                        <FiArrowLeft size={24} />
                    </motion.button>
                    <motion.button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 hover:p-4 duration-300 rounded-full shadow-lg"
                    >
                        <FiArrowRight size={24} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
