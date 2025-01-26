import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";

const Carousel = () => {
    const slides = [
        {
            image: "https://via.placeholder.com/1200x400",
            title: "slide 1",
            description: "Supporting in-person discussions about preprints",
        },
        {
            image: "https://via.placeholder.com/1200x400/aaaaaa",
            title: "Slide 2",
            description: "Another beautiful description here.",
        },
        {
            image: "https://via.placeholder.com/1200x400/cccccc",
            title: "Slide 3",
            description: "More details about this slide.",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className=" w-full  mx-auto overflow-hidden bg-black bg-opacity-30">
            <div className=" w-full max-w-6xl mx-auto overflow-hidden rounded-lg">
                {/* Slides */}
                <div className="relative flex w-full h-96">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute w-full h-full transition-transform duration-700 ${index === currentSlide ? "translate-x-0" : "translate-x-full"
                                }`}
                            style={{
                                transform: `translateX(${(index - currentSlide) * 100}%)`,
                            }}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                <div className="bg-black bg-opacity-50 h-full flex flex-col items-center justify-center text-white text-center px-4">
                                    <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                                    <p className="mb-4">{slide.description}</p>
                                    <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded">
                                        Learn more
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-[100%]"
                >
                    <FiArrowLeft />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                >
                    <FiArrowRight />
                </button>
            </div>
        </div>

    );
};

export default Carousel;
