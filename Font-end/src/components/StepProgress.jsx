import React, { useState } from "react";  
import { FiCheck } from "react-icons/fi";

const StepProgress = () => {
    const [step, setStep] = useState(0);
    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <div className="space-y-4 mt-20 px-4 md:px-8 lg:px-20 xl:px-40">
            <div className="flex flex-row items-center justify-center space-x-2 md:space-x-4 scale-[0.8] md:scale-100">
                {[...Array(totalSteps)].map((_, index) => {
                    const currentStep = index + 1;
                    return (
                        <React.Fragment key={currentStep}>
                            <div className={`flex flex-row w-10 h-10 transition-all duration-150 ${currentStep <= step ? 'bg-[#6366F1] outline outline-[5px] outline-[#6366F1]/[.55] text-white' : 'border-2 border-[#E0E0E0]'} rounded-full justify-center items-center`}>
                                {currentStep <= step ? <FiCheck /> : currentStep}
                            </div>
                            {currentStep < totalSteps && (
                                <div className={`w-16 md:w-20 h-1 transition-all duration-150 ${currentStep <= step ? 'bg-[#6366F1]' : 'bg-[#E0E0E0]'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className="bg-gray-300 p-4 rounded-md h-40 flex items-center justify-center text-center">
                <p className="text-lg md:text-xl">Step {step + 1} Content</p>
            </div>
            <div className="space-x-2 flex flex-row justify-end">
                <button 
                    className="hover:bg-black hover:bg-opacity-10 text-black px-4 py-2 rounded-lg disabled:opacity-50" 
                    onClick={handlePrev} 
                    disabled={step === 0}
                >
                    Prev
                </button>
                <button 
                    className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50" 
                    onClick={handleNext} 
                    disabled={step === totalSteps}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepProgress;
