import React, { useState } from "react"; 
import { FiCheck } from "react-icons/fi";

const StepProgress = () => {
    const [step, setStep] = useState(0); // เริ่มต้นที่ step = 0
    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) { // เพิ่มขึ้นจนถึง totalSteps
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 0) { // ลดลงจนถึง step 0
            setStep(step - 1);
        }
    };

    return (
        <div className="space-y-4 mt-20">
            <div className="flex flex-row space-x-2 items-center justify-center">
                {[...Array(totalSteps)].map((_, index) => {
                    const currentStep = index + 1;
                    return (
                        <React.Fragment key={currentStep}>
                            {/* Step number */}
                            <div className={`flex flex-row w-10 h-10 transition-all duration-150 ${currentStep <= step ? 'bg-[#6366F1] outline outline-[5px] outline-[#6366F1]/[.55] text-white' : 'border-2 border-[#E0E0E0]'} rounded-full justify-center items-center`}>
                                {currentStep <= step ? <FiCheck /> : currentStep}
                            </div>
                            {/* Line between steps */}
                            {currentStep < totalSteps && (
                                <div className={`w-20 h-1 transition-all duration-150 ${currentStep <= step ? 'bg-[#6366F1]' : 'bg-[#E0E0E0]'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className="bg-gray-300 p-4 rounded-md h-40">
                
                <p>Step {step+1} Content</p>
            </div>
            <div className="space-x-2 flex flex-row justify-end">
                <button 
                    className="hover:bg-black hover:bg-opacity-10 text-black px-4 py-2 rounded-lg" 
                    onClick={handlePrev} 
                    disabled={step === 0} // Disable prev when at step 0
                >
                    Prev
                </button>
                <button 
                    className="bg-black text-white px-4 py-2 rounded-lg" 
                    onClick={handleNext} 
                    disabled={step === totalSteps} // Disable next when at totalSteps
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepProgress;
