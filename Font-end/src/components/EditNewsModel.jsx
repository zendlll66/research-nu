import React, { useState, useEffect } from "react";

const EditNewsModel = ({ editFormData, setEditFormData, setActiveTab, selectedNews, newsList, setNewsList }) => {
    

    // ฟังก์ชันบันทึกข้อมูลหลังแก้ไข
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("topic", editFormData.topic);
        data.append("detail", editFormData.detail);
        data.append("link", editFormData.link); // เพิ่ม link
        if (editFormData.image) {
            data.append("image", editFormData.image);
        }
        if (editFormData.files) {
            data.append("files", editFormData.files);
        }

        try {
            await axios.put(
                `https://project-six-rouge.vercel.app/activity/${selectedNews.id}/edit`,
                data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // ✅ ส่ง Token ใน Header
                },
            });
            alert("อัปเดตข่าวสำเร็จ!");

            // อัปเดต newsList หลังแก้ไข
            const updatedList = newsList.map((news) =>
                news.id === selectedNews.id ? { ...news, ...editFormData } : news
            );
            setNewsList(updatedList);

            // กลับไปยัง Tab "Edit/Delete"
            setActiveTab("Edit/Delete");
        } catch (error) {
            console.error("Error updating news:", error);
            alert("อัปเดตข่าวไม่สำเร็จ!");
        }
    };

    // ฟังก์ชันเปลี่ยนข้อมูลในฟอร์ม
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };


    return (
        <div>
            <h1 className="text-2xl  font-bold mb-6">Edit News</h1>
            <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Topic */}
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                        Topic
                    </label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        value={editFormData.topic}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Detail */}
                <div>
                    <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
                        Detail
                    </label>
                    <textarea
                        id="detail"
                        name="detail"
                        value={editFormData.detail}
                        onChange={handleInputChange}
                        rows="4"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    ></textarea>
                </div>

                {/* Link */}
                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                        Link
                    </label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        value={editFormData.link}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                {/* Image */}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                </div>

                {/* Files */}
                <div>
                    <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                        Additional Files
                    </label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab("Edit/Delete")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditNewsModel