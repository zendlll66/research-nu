import React from 'react'

const EditResearcher = () => {
    return (
        <div className="space-y-4">
            {selectedMember ? (
                <>
                    {console.log("Selected Member in Editpage:", selectedMember)}
                    {console.log(
                        "Selected Department in Editpage:",
                        selectedDepartment
                    )}
                    <Editpage
                        researcherId={selectedMember.id}
                        name={selectedMember.name}
                        department={selectedDepartment}
                        setSelectedMember={setSelectedMember}
                    />
                </>
            ) : (
                facultyData.map((faculty) => (
                    <div
                        key={faculty.name}
                        className="bg-white border-2 rounded-lg w-full cursor-pointer mt-10"
                    >
                        {/* Header Section */}
                        <div
                            className="relative flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => handleFacultyClick(faculty.name)}
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold">{faculty.name}</span>
                                <span className="text-sm text-gray-600">
                                    {faculty.description}
                                </span>
                            </div>
                            <span className="text-gray-600">
                                {expandedFaculty === faculty.name ? "▲" : "▼"}
                            </span>
                        </div>

                        {/* Dropdown Content */}
                        <div
                            className={`bg-gray-50 px-4 pb-4 space-y-2 overflow-hidden transition-all duration-200 ease-in-out ${expandedFaculty === faculty.name
                                    ? "max-h-[400px] opacity-100 overflow-y-auto"
                                    : "max-h-0 opacity-0 pb-0"
                                }`}
                        >
                            {/* Add Researcher Button */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => openModal(faculty.name)}
                                >
                                    Add Researcher
                                </button>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {isDeleteModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-md w-96">
                                        <h2 className="text-xl font-bold mb-4">
                                            Confirm Delete
                                        </h2>
                                        <p>
                                            Are you sure you want to delete{" "}
                                            <strong>{deleteTarget?.member.name}</strong>?
                                        </p>
                                        <div className="flex justify-end mt-6 space-x-4">
                                            <button
                                                onClick={() => setIsDeleteModalOpen(false)} // ปิด Modal
                                                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmDelete} // เรียกฟังก์ชันลบ
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Members List */}
                            {faculty.members.length > 0 ? (
                                faculty.members.map((member, index) => (
                                    <div
                                        key={`${member.name}-${index}`}
                                        className="flex justify-between items-center bg-white border rounded-lg p-2 hover:bg-gray-100"
                                        onClick={() => {
                                            handleMemberClick(member);
                                            console.log("Selected Member:", member);
                                            console.log("Selected Department:", faculty.name);
                                            if (!member.id) {
                                                console.error("Member ID is undefined:", member);
                                            }
                                            setSelectedMember(member); // เก็บข้อมูลนักวิจัยที่เลือก
                                            setSelectedDepartment(faculty.name); // เก็บแผนกของนักวิจัยที่เลือก
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={
                                                    member.imageUrl ||
                                                    "https://via.placeholder.com/150"
                                                } // กรณี imageUrl ไม่มีค่า
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://dummyimage.com/150x150/cccccc/ffffff.png&text=No+Image"; // แสดงรูป default หากรูปจาก URL โหลดไม่ได้
                                                }}
                                            />
                                            <span>{member.name}</span>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                className=" bg-orange-500 text-white px-4 py-2 rounded-md"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(member);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md text-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMember(faculty.name, member); // ส่ง `faculty.name` และ `member`
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm p-2">
                                    No members in this department.
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default EditResearcher