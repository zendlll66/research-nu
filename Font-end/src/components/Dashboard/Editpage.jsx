import React, { useState } from "react";

const Editpage = ({setSelectedMember}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State เปิด/ปิดเมนู
    const [activeMenu, setActiveMenu] = useState(null); // ใช้เก็บเมนูที่ active

    const handleSetting = (index) => {
        setActiveMenu(activeMenu === index ? null : index); // Toggle เปิด/ปิดเมนู
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEdit = () => {
        alert("Edit Clicked");
    };

    const handleDelete = () => {
        alert("Delete Clicked");
    };

    const handleBack = () =>{
        setSelectedMember(null);
    };

    return (
        <div>
            <div>
                <button className="mx-10  bg-indigo-600 text-white px-2 py-1 rounded-md"
                onClick={handleBack}>
                    BACK
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:mx-10 md:mx-10 mt-10">
                {/* Card 1 */}
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="relative bg-white border-2 rounded-lg h-[100px] w-full"
                    >
                        {/* ปุ่ม 3 จุด */}
                        <div
                            className="flex space-x-[2px] absolute top-0 right-0 m-3 rounded-md p-2 cursor-pointer hover:bg-black hover:bg-opacity-10"
                            onClick={() => handleSetting(index)} // ระบุ index เพื่อเปิดเมนูเฉพาะ card
                        >
                            <div className="bg-black w-[6px] h-[6px] rounded-xl"></div>
                            <div className="bg-black w-[6px] h-[6px] rounded-xl"></div>
                            <div className="bg-black w-[6px] h-[6px] rounded-xl"></div>
                        </div>

                        {/* เมนูที่ติดกับด้านล่างของ 3 จุด */}
                        {activeMenu === index && (
                            <div className="absolute top-10 right-2 mt-1 bg-white border shadow-lg rounded-lg w-[120px] z-50">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                        {/* เนื้อหาใน Card */}
                        <div className="flex flex-col justify-center h-full ml-6">
                            <span>Title {index + 1}</span>
                            <div className="bg-black rounded-[50px] w-1/2 h-6 bg-opacity-5 px-3">
                                <span>Lorem ipsum</span>
                            </div>
                            <span className="opacity-60 text-[12px]">descript</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Editpage