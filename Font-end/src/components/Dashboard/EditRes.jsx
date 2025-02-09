import React from 'react'
import { useState ,useEffect} from 'react'
const EditRes = () => {
    const [expandedFaculty, setExpandedFaculty] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // ควบคุมการแสดง Modal
    const [selectedDepartment, setSelectedDepartment] = useState(""); // เก็บชื่อ Department
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit Researcher Modal
    const [editFormData, setEditFormData] = useState(null); // Data for editing
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // ✅ Success Modal State
    const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false); // ✅ Success Modal สำหรับ Edit

    const [facultyData, setFacultyData] = useState([
        {
            name: "Electrical and Computer Engineering",
            description:
                "Focuses on the design and integration of computer systems, hardware, and electrical circuits.",
            members: ["Alice", "Bob", "Charlie"],
        },
        {
            name: "Mechanical Engineering",
            description:
                "Focuses on chemical processes and the production of materials and energy.",
            members: ["Dave", "Eve", "Frank"],
        },
        {
            name: "Civil Engineering",
            description:
                "Specializes in the design, construction, and maintenance of infrastructure projects.",
            members: ["Grace", "Hank"],
        },
        {
            name: "Industrial Engineering",
            description:
                "Focuses on optimizing processes, systems, and organizations to improve efficiency.",
            members: ["Ivy", "Jack"],
        },
        {
            name: "Others", // เพิ่มหมวดหมู่ est.
            description: "For researchers without a defined department.",
            members: ["Kim", "Lee"], // รายชื่อนักวิจัยในหมวดหมู่นี้
        },
    ]);

    //เพิ่ม Reasercher คนใหม่
    const handleAddNewResearcher = async (formData) => {
        try {
            console.log("📌 Received formData:", formData);
            const formattedDepartment = formData.department;

            // ✅ ตรวจสอบว่าเป็น FormData จริงหรือไม่
            if (!(formData instanceof FormData)) {
                console.error("🚨 formData is not an instance of FormData!");
                return;
            }

            if (formData.image) {
                formData.append("image", formData.image);
            }

            const response = await fetch(
                `https://project-six-rouge.vercel.app/researcher/${formattedDepartment}/new`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ...formData,
                        // image: formData.image, // ส่ง Base64 รูปไปยัง API
                        // position: formData.position, // ✅ ส่งตำแหน่ง
                        // position_thai: formData.position_thai, // ✅ ส่งตำแหน่งภาษาไทย
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();
            console.log("📌 Full API Response:", response, result);

            if (response.ok) {
                setIsSuccessModalOpen(true); // ✅ แสดง Success Modal แทนการใช้ alert()
                // window.location.reload(); // เพิ่มคำสั่งนี้เพื่อรีเฟรชหน้า
                // alert(`Successfully added ${formData.name} to ${formData.department}`);
                // Fetch ข้อมูลใหม่หรืออัปเดต `facultyData`
            } else {
                alert("Failed to add researcher: " + result.message);
            }
        } catch (error) {
            console.error("Error adding new researcher:", error);
            alert("Error adding new researcher.");
        }
    };

    //ลบข้อมูล Reasearcher
    // ฟังก์ชันสำหรับลบนักวิจัย
    const handleDeleteMember = (facultyName, member) => {
        setDeleteTarget({ facultyName, member });
        setIsDeleteModalOpen(true); // เปิด Modal
    };

    //Add researcher Modal
    const AddResearcherModal = ({ isOpen, onClose, onSubmit, department }) => {
        const [formData, setFormData] = useState({
            name: "",
            name_thai: "",
            position: "ไม่ระบุ", // ✅ เพิ่มตำแหน่ง
            position_thai: "ไม่ระบุ", // ✅ เพิ่มตำแหน่งภาษาไทย
            department: department || "",
            faculty: "Engineering, Naresuan University",
            contact: "",
            phone: "",
            office: "",
            image: null,
            imagePreview: null,
        });

        const [isSubmitting, setIsSubmitting] = useState(false); // ✅ ป้องกันกดซ้ำ


        useEffect(() => {
            if (isOpen) {
                setFormData({
                    name: "",
                    name_thai: "",
                    position: "ไม่ระบุ",
                    position_thai: "ไม่ระบุ",
                    department: department || "",
                    faculty: "Engineering, Naresuan University",
                    contact: "",
                    phone: "",
                    office: "",
                    image: null,
                    imagePreview: null, // ✅ รีเซ็ตพรีวิวทุกครั้งที่เปิด modal
                });
                setIsSubmitting(false); // ✅ รีเซ็ตปุ่มเมื่อเปิด Modal ใหม่
            }
        }, [isOpen, department]);

        const handleChange = (e) => {
            const { name, value, files } = e.target;

            if (name === "image" && files?.length > 0) {
                const file = files[0];

                setFormData((prev) => ({
                    ...prev,
                    image: file,
                    imagePreview: URL.createObjectURL(file), // ✅ ใช้ URL.createObjectURL สำหรับพรีวิว
                }));

                console.log("📸 Image file selected:", file);
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log("📌 Submitting formData:", formData);

            const data = new FormData();
            data.append("name", formData.name);
            data.append("name_thai", formData.name_thai);
            data.append("position", formData.position);
            data.append("position_thai", formData.position_thai);
            data.append("department", formData.department);
            data.append("faculty", formData.faculty);
            data.append("contact", formData.contact);
            data.append("phone", formData.phone);
            data.append("office", formData.office);

            if (isSubmitting) return; // ✅ ป้องกันการกดซ้ำ
            setIsSubmitting(true); // ✅ ปิดปุ่มชั่วคราว

            await onSubmit(formData);
            setIsSubmitting(false); // ✅ เปิดปุ่มหลังดำเนินการเสร็จ

            setIsSuccessModalOpen(true); // ✅ เปิด Success Modal เมื่อ Submit สำเร็จ
            setTimeout(() => {
                setIsSuccessModalOpen(false); // ✅ ปิด Modal อัตโนมัติหลัง 3 วินาที
                onClose(); // ✅ ปิดฟอร์มการเพิ่มนักวิจัย
            }, 3000);

            if (formData.image) {
                data.append("image", formData.image);
            }

            console.log("📌 Final FormData before submit:", [...data.entries()]);

            try {
                const response = await fetch(
                    `https://project-six-rouge.vercel.app/researcher/${formData.department}/new`,
                    {
                        method: "POST",
                        body: data,
                    }
                );

                const result = await response.json();
                console.log("📌 API Response:", result);
                if (response.ok) {
                    // alert(
                    //   `Successfully added ${formData.name} to ${formData.department}`
                    // );
                    window.location.reload();
                } else {
                    alert("Failed to add researcher: " + result.message);
                }
            } catch (error) {
                console.error("🚨 Error adding new researcher:", error);
                alert("An error occurred while adding the researcher.");
            }
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md w-[570px] flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Add New Researcher
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        {/* ✅ พรีวิวรูปภาพ */}
                        <div className="flex flex-col items-center">
                            {formData.imagePreview ? (
                                <img
                                    src={formData.imagePreview}
                                    alt="Preview"
                                    className="h-40 w-40 object-cover rounded-full mb-4"
                                />
                            ) : (
                                <div className="h-40 w-40 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-2"
                                onChange={handleChange}
                            />
                        </div>

                        {/* 🔹 Row 1: Position (EN) + Name */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full sm:w-1/3 p-2 border rounded"
                            >
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                                <option value="PROF.">PROF.</option>
                                <option value="PROF. DR.">PROF. DR.</option>
                                <option value="ASSOC. PROF.">ASSOC. PROF.</option>
                                <option value="ASSOC. PROF. DR.">ASSOC. PROF. DR.</option>
                                <option value="ASST. PROF.">ASST. PROF.</option>
                                <option value="ASST. PROF. DR.">ASST. PROF. DR.</option>
                                <option value="DR.">DR.</option>
                                <option value="LECTURER.">LECTURER.</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Ms.">Ms.</option>
                            </select>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                required
                                className="w-full sm:w-2/3 p-2 border rounded"
                                onChange={handleChange}
                            />
                        </div>

                        {/* 🔹 Row 2: Position (TH) + Name (TH) */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <select
                                name="position_thai"
                                value={formData.position_thai}
                                onChange={handleChange}
                                className="w-full sm:w-1/3 p-2 border rounded"
                            >
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                                <option value="ศาสตราจารย์">ศาสตราจารย์</option>
                                <option value="ศาสตราจารย์ ดร.">ศาสตราจารย์ ดร.</option>
                                <option value="รองศาสตราจารย์">รองศาสตราจารย์</option>
                                <option value="รองศาสตราจารย์ ดร.">รองศาสตราจารย์ ดร.</option>
                                <option value="ผู้ช่วยศาสตราจารย์">ผู้ช่วยศาสตราจารย์</option>
                                <option value="ผู้ช่วยศาสตราจารย์ ดร.">
                                    ผู้ช่วยศาสตราจารย์ ดร.
                                </option>
                                <option value="อาจารย์">อาจารย์</option>
                                <option value="นาย">นาย</option>
                                <option value="นาง">นาง</option>
                                <option value="นางสาว">นางสาว</option>
                            </select>
                            <input
                                type="text"
                                name="name_thai"
                                placeholder="ชื่อภาษาไทย"
                                className="w-full sm:w-2/3 p-2 border rounded"
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            type="email"
                            name="contact"
                            placeholder="Email"
                            className="w-full p-2 border rounded"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="w-full p-2 border rounded"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="office"
                            placeholder="Office"
                            className="w-full p-2 border rounded"
                            onChange={handleChange}
                        />
                        <label className="block text-sm font-medium text-gray-700">
                            Department:
                            <select
                                disabled
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Department</option>
                                <option value="Electrical and Computer Engineering">
                                    Electrical and Computer Engineering
                                </option>
                                <option value="Mechanical Engineering">
                                    Mechanical Engineering
                                </option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Industrial Engineering">
                                    Industrial Engineering
                                </option>
                                <option value="Others">Others</option>
                            </select>
                        </label>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    // Edit Researcher Modal
    const EditResearcherModal = ({ isOpen, onClose, initialData, onSubmit }) => {
        const [formData, setFormData] = useState(initialData);

        useEffect(() => {
            if (initialData) {
                setFormData(initialData);
            }
        }, [initialData]);

        const handleChange = (e) => {
            const { name, value, files } = e.target;

            if (name === "image" && files?.length > 0) {
                const file = files[0];

                setFormData((prev) => ({
                    ...prev,
                    image: file, // ✅ เก็บเป็นไฟล์ File Object
                    imagePreview: URL.createObjectURL(file), // ✅ พรีวิวรูปภาพก่อนอัปโหลด
                }));

                console.log("📸 Image file selected:", file);
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            await onSubmit(formData);
            setIsEditSuccessModalOpen(true); // ✅ เปิด Success Modal เมื่อ Submit สำเร็จ

            setTimeout(() => {
                setIsEditSuccessModalOpen(false); // ✅ ปิด Modal อัตโนมัติหลัง 3 วินาที
                onClose(); // ✅ ปิดฟอร์มการแก้ไข
            }, 3000);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md w-[570px] flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Edit Researcher</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        {/* Image Preview and Upload */}
                        <div className="flex flex-col items-center">
                            {formData.imagePreview || formData.imageUrl ? (
                                <img
                                    src={formData.imagePreview || formData.imageUrl}
                                    alt="Profile"
                                    className="h-40 w-40 object-cover rounded-full mb-4"
                                />
                            ) : (
                                <div className="h-40 w-40 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-2"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Text Fields */}
                        {/* 🔹 Row 1: Position (EN) + Name */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full sm:w-1/3 p-2 border rounded"
                            >
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                                <option value="PROF.">PROF.</option>
                                <option value="PROF. DR.">PROF. DR.</option>
                                <option value="ASSOC. PROF.">ASSOC. PROF.</option>
                                <option value="ASSOC. PROF. DR.">ASSOC. PROF. DR.</option>
                                <option value="ASST. PROF.">ASST. PROF.</option>
                                <option value="ASST. PROF. DR.">ASST. PROF. DR.</option>
                                <option value="DR.">DR.</option>
                                <option value="LECTURER.">LECTURER.</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Ms.">Ms.</option>
                            </select>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder="Name"
                                required
                                className="w-full sm:w-2/3 p-2 border rounded"
                                onChange={handleChange}
                            />
                        </div>

                        {/* 🔹 Row 2: Position (TH) + Name (TH) */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <select
                                name="position_thai"
                                value={formData.position_thai}
                                onChange={handleChange}
                                className="w-full sm:w-1/3 p-2 border rounded"
                            >
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                                <option value="ศาสตราจารย์">ศาสตราจารย์</option>
                                <option value="ศาสตราจารย์ ดร.">ศาสตราจารย์ ดร.</option>
                                <option value="รองศาสตราจารย์">รองศาสตราจารย์</option>
                                <option value="รองศาสตราจารย์ ดร.">รองศาสตราจารย์ ดร.</option>
                                <option value="ผู้ช่วยศาสตราจารย์">ผู้ช่วยศาสตราจารย์</option>
                                <option value="ผู้ช่วยศาสตราจารย์ ดร.">
                                    ผู้ช่วยศาสตราจารย์ ดร.
                                </option>
                                <option value="อาจารย์">อาจารย์</option>
                                <option value="นาย">นาย</option>
                                <option value="นาง">นาง</option>
                                <option value="นางสาว">นางสาว</option>
                            </select>
                            <input
                                type="text"
                                name="name_thai"
                                value={formData.name_thai}
                                placeholder="ชื่อภาษาไทย"
                                className="w-full sm:w-2/3 p-2 border rounded"
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            type="email"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="office"
                            value={formData.office}
                            onChange={handleChange}
                            placeholder="Office"
                            className="w-full p-2 border rounded"
                        />

                        {/* Dropdown Select for Department */}
                        <label className="block text-sm font-medium text-gray-700">
                            Department:
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            >
                                <option value="Electrical and Computer Engineering">
                                    Electrical and Computer Engineering
                                </option>
                                <option value="Mechanical Engineering">
                                    Mechanical Engineering
                                </option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Industrial Engineering">
                                    Industrial Engineering
                                </option>
                                <option value="Others">Others</option>
                            </select>
                        </label>

                        {/* Submit & Cancel Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const fetchResearchers = async () => {
        try {
            const response = await fetch(
                "https://project-six-rouge.vercel.app/researcher"
            );
            const data = await response.json();

            console.log("📌 Fetched Data from API:", data); // ✅ ตรวจสอบข้อมูลจาก API

            if (data.status === "ok" && Array.isArray(data.data)) {
                const departments = [
                    "Electrical and Computer Engineering",
                    "Mechanical Engineering",
                    "Civil Engineering",
                    "Industrial Engineering",
                    "Others",
                ];

                const groupedData = departments.map((dept) => ({
                    name: dept,
                    description: `Focuses on ${dept} studies.`,
                    members: data.data
                        .filter((researcher) => researcher.department === dept)
                        .map((res) => ({
                            id: res.id,
                            name: res.name || "Unknown",
                            name_thai: res.name_thai || "ไม่ระบุ",
                            position: res.position || "ไม่ระบุ", // ✅ ดึงตำแหน่ง
                            position_thai: res.position_thai || "ไม่ระบุ", // ✅ ดึงตำแหน่งภาษาไทย
                            department: res.department || "Unspecified",
                            contact: res.contact || "-",
                            phone: res.phone || "-",
                            office: res.office || "-",
                            imageUrl: res.image,
                        })),
                }));

                setFacultyData(groupedData);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    // โหลดข้อมูลเมื่อคอมโพเนนต์ mount
    useEffect(() => {
        fetchResearchers();
    }, []);

    useEffect(() => {
        console.log("📌 Faculty Data Updated:", facultyData);
    }, [facultyData]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                "https://project-six-rouge.vercel.app/researcher"
            );
            const data = await response.json();

            if (data.status === "ok" && Array.isArray(data.data)) {
                const departments = [
                    "Electrical and Computer Engineering",
                    "Mechanical Engineering",
                    "Civil Engineering",
                    "Industrial Engineering",
                    "Others",
                ];

                const groupedData = departments.map((dept) => ({
                    name: dept,
                    description: `Focuses on ${dept} studies.`,
                    members: data.data
                        .filter((researcher) => researcher.department === dept)
                        .map((res) => ({
                            id: res.id,
                            name: res.name || "Unknown",
                            name_thai: res.name_thai || "ไม่ระบุ",
                            position: res.position || "ไม่ระบุ", // ✅ ดึงตำแหน่ง
                            position_thai: res.position_thai || "ไม่ระบุ", // ✅ ดึงตำแหน่งภาษาไทย
                            department: res.department || "Unspecified",
                            contact: res.contact || "-",
                            phone: res.phone || "-",
                            office: res.office || "-",
                            imageUrl: res.image || "https://via.placeholder.com/150",
                        })),
                }));

                console.log("Fetched Faculty Data:", groupedData);
                setFacultyData(groupedData);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    // Handle Edit Submit
    const handleEditSubmit = async (updatedData) => {
        const formattedDepartment = updatedData.department;
        const researcherId = updatedData.id;
        const updateUrl = `https://project-six-rouge.vercel.app/researcher/${formattedDepartment}/${researcherId}/update`;

        const data = new FormData();
        data.append("name", updatedData.name);
        data.append("name_thai", updatedData.name_thai);
        data.append("position", updatedData.position); // ✅ ส่งตำแหน่ง
        data.append("position_thai", updatedData.position_thai); // ✅ ส่งตำแหน่งภาษาไทย
        data.append("department", updatedData.department);
        data.append("contact", updatedData.contact);
        data.append("phone", updatedData.phone);
        data.append("office", updatedData.office);

        if (updatedData.image && updatedData.image instanceof File) {
            data.append("image", updatedData.image); // ✅ อัปโหลดรูปใหม่หากมีการเปลี่ยนแปลง
        }

        try {
            const response = await fetch(updateUrl, {
                method: "PUT",
                body: data, // ✅ ใช้ `FormData` เพื่ออัปโหลดรูป
            });

            if (response.ok) {
                // alert("Researcher updated successfully!");
                await fetchData(); // โหลดข้อมูลใหม่
                setIsEditModalOpen(false); // ปิด Modal
            } else {
                alert("Failed to update researcher.");
            }
        } catch (error) {
            console.error("Error updating researcher:", error);
        }
    };

    // Open Edit Modal
    const handleEditClick = (member) => {
        console.log("📌 Member Selected for Editing:", member); // ✅ ตรวจสอบค่าของสมาชิกก่อนแก้ไข
        setEditFormData(member); // Set data for editing
        setIsEditModalOpen(true); // Open modal
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        const { facultyName, member } = deleteTarget;
        const department = facultyName;
        const researcherId = member.id;

        const deleteUrl = `https://project-six-rouge.vercel.app/researcher/${department}/${researcherId}`;
        if (isProcessing) return; // ✅ ป้องกันการกดซ้ำ

        setIsProcessing(true); // ✅ ปิดปุ่มชั่วคราว

        try {
            const response = await fetch(deleteUrl, { method: "DELETE" });
            const result = await response.json();

            if (response.ok) {
                // alert(`${member.name} has been deleted successfully.`);
                setFacultyData((prevFacultyData) =>
                    prevFacultyData.map((faculty) =>
                        faculty.name === facultyName
                            ? {
                                ...faculty,
                                members: faculty.members.filter(
                                    (existingMember) => existingMember.id !== researcherId
                                ),
                            }
                            : faculty
                    )
                );
            } else {
                alert(`Failed to delete: ${result.message}`);
            }
        } catch (error) {
            console.error("Error deleting researcher:", error);
            alert("An error occurred while trying to delete the researcher.");
        } finally {
            setIsDeleteModalOpen(false); // ปิด Modal
            setDeleteTarget(null); // รีเซ็ตค่า
            setIsProcessing(false); // ✅ เปิดปุ่มกลับมา
        }
    };

    const handleFacultyClick = (facultyName) => {
        setExpandedFaculty((prev) => (prev === facultyName ? null : facultyName));
    };

    const handleMemberClick = (member) => {
        if (!member || !member.id) {
            console.error("Invalid member selected:", member);
            return;
        }
        setSelectedMember(member); // เก็บข้อมูลนักวิจัยที่เลือก
    };

    //เปิดปิด Modal Add Researcher
    const openModal = (department) => {
        const mappedDepartment = department === "est." ? "Other" : department; // ถ้าเลือก est. ให้ map เป็น "Other"
        setSelectedDepartment(mappedDepartment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://project-six-rouge.vercel.app/researcher"
                );
                const data = await response.json();

                if (data.status === "ok" && Array.isArray(data.data)) {
                    const departments = [
                        "Electrical and Computer Engineering",
                        "Mechanical Engineering",
                        "Civil Engineering",
                        "Industrial Engineering",
                        "Others",
                    ];

                    const groupedData = departments.map((dept) => ({
                        name: dept,
                        description: `Focuses on ${dept} studies.`,
                        members: data.data
                            .filter((researcher) => researcher.department === dept)
                            .map((res) => ({
                                id: res.id,
                                name: res.name || "Unknown",
                                name_thai: res.name_thai || "ไม่ระบุ",
                                position: res.position || "ไม่ระบุ", // ✅ ดึงตำแหน่ง
                                position_thai: res.position_thai || "ไม่ระบุ", // ✅ ดึงตำแหน่งภาษาไทย
                                department: res.department || "Unspecified",
                                contact: res.contact || "-",
                                phone: res.phone || "-",
                                office: res.office || "-",
                                imageUrl: res.image || "https://via.placeholder.com/150",
                            })),
                    }));

                    console.log("📌 Faculty Data Updated (After Fetch):", groupedData);
                    setFacultyData(groupedData);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("📌 Faculty Data Updated (After Fetch):", facultyData);
    }, [facultyData]);
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
                                                onClick={confirmDelete}
                                                className={`px-4 py-2 text-white rounded ${isProcessing ? "bg-gray-400" : "bg-red-500"
                                                    }`}
                                                disabled={isProcessing} // ✅ ป้องกันการกดซ้ำ
                                            >
                                                {isProcessing ? "Deleting..." : "Delete"}
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
                                                className=" bg-blue-500 text-white px-4 py-2 rounded-md"
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

            {isEditModalOpen && (
                <EditResearcherModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={editFormData}
                    onSubmit={handleEditSubmit}
                />
            )}

            {/* ✅ Success Modal เมื่อแก้ไขเสร็จ */}
            {isEditSuccessModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md text-center w-[400px]">
                        <h2 className="text-green-600 text-lg font-bold">Success!</h2>
                        <p className="mt-2 text-gray-700">
                            Researcher information has been updated successfully.
                        </p>
                        <button
                            onClick={() => setIsEditSuccessModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            {/* ✅ Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md text-center w-[400px]">
                        <h2 className="text-green-600 text-lg font-bold">Success!</h2>
                        <p className="mt-2 text-gray-700">
                            Researcher has been added successfully.
                        </p>
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Component */}
            <AddResearcherModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={(formData) => {
                    handleAddNewResearcher(formData); // เรียกฟังก์ชัน handleAddNewResearcher
                    console.log("Submitted data:", formData);
                    // คุณสามารถใส่ logic การส่ง API หรืออัปเดต State ที่นี่
                    closeModal();
                }}
                department={selectedDepartment}
            />
        </div>

    )
}

export default EditRes