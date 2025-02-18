import { useState, useEffect } from "react";

const Editpage = ({ setSelectedMember, researcherId, name, department }) => {
  const [cards, setCards] = useState([]); // State สำหรับเก็บข้อมูลโครงการ
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ข้อความในช่องค้นหา
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //ยืนยันการลบ
  const [deleteTarget, setDeleteTarget] = useState(null); // เก็บข้อมูลของโครงการที่จะลบ
  const [selectedYear, setSelectedYear] = useState(""); // เก็บปีที่เลือก
  const [currentScopusId, setCurrentScopusId] = useState(null);
  const [selectedSource, setSelectedSource] = useState(""); // ✅ ฟิลเตอร์ Source ที่เพิ่มใหม่
  const token = localStorage.getItem("token");

  // ✅ เก็บ researcherId, name, department ใน localStorage
  const [selectedResearcher, setSelectedResearcher] = useState(() => {
    const savedData = localStorage.getItem("selectedResearcher");
    return savedData ? JSON.parse(savedData) : null;
  });


  useEffect(() => {
    if (researcherId && name && department) {
      const researcherData = { researcherId, name, department };
      setSelectedResearcher(researcherData);
      localStorage.setItem(
        "selectedResearcher",
        JSON.stringify(researcherData)
      );
    }
  }, [researcherId, name, department]);

  const [newProject, setNewProject] = useState({
    paper: "",
    year: "",
    source: "",
    cited: "",
    link_to_paper: "",
  }); // State สำหรับเก็บข้อมูลฟอร์มโครงการใหม่

  // ดึงข้อมูลจาก API เมื่อ department หรือ researcherId เปลี่ยน
  // ฟังก์ชันดึงข้อมูล
  useEffect(() => {
    const researcher = researcherId || selectedResearcher?.researcherId;
    const researcherDepartment = department || selectedResearcher?.department;

    const fetchResearcherData = async () => {
      try {
        if (!researcher || !researcherDepartment) {
          console.error("🚨 Researcher ID or Department is missing");
          return;
        }

        const apiUrl = `https://project-six-rouge.vercel.app/researcher/${researcherDepartment}/${researcher}`;
        console.log("📌 Fetching researcher data from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ส่ง token ใน header
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("📌 Fetched researcher data:", data);

          if (data.status === "ok" && Array.isArray(data.data)) {
            setCards(
              data.data
                .filter((item) => item.paper !== null)
                .map((item) => ({
                  id: item.research_id || item.id,  // ✅ เช็กว่ามี `scopus_id` หรือไม่ ถ้าไม่มีใช้ `id`
                  title: item.paper,
                  year: item.year,
                  source: item.source,
                  cited: item.cited,
                  link_to_paper: item.link_to_paper,
                }))
            );

          } else {
            console.error("🚨 Unexpected data structure:", data);
          }
        } else {
          console.error("🚨 Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("🚨 Error fetching researcher data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearcherData();
  }, [researcherId, department, selectedResearcher]);

  // ใช้ researcherId และ department เป็น dependency

  // กรองโปรเจกต์ตามข้อความใน searchTerm
  // ✅ ฟิลเตอร์ข้อมูลตามเงื่อนไขที่เลือก
  const filteredCards = cards.filter((card) => {

    const matchesSearch = card.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear
      ? card.year.toString() === selectedYear
      : true;
    const matchesSource = selectedSource
      ? card.source === selectedSource
      : true;
    return matchesSearch && matchesYear && matchesSource;
  });

  const openAddModal = () => {
    setNewProject({
      paper: "",
      year: "",
      source: "",
      cited: "",
      link_to_paper: "",
    }); // รีเซ็ตข้อมูลก่อนเปิด Modal
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (card, index) => {
    setDeleteTarget({ card, index });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  };

  // เปิด/ปิด Modal ของ Add Researcher
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };


  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewProject({
      paper: "",
      year: "",
      source: "",
      cited: "",
      link_to_paper: "",
    });
  };

  // เพิ่มการ์ดใหม่
  // เพิ่มโครงการวิจัยใหม่ผ่าน API
  // ส่งข้อมูลไปยัง API เพื่อเพิ่มโครงการใหม่
  const handleAddProject = async () => {
    const formattedDepartment = department;
    const apiUrl = `https://project-six-rouge.vercel.app/researcher/${formattedDepartment}/${researcherId}/new`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ ส่ง token ใน header
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Project added:", result);

        setCards((prevCards) => [
          ...prevCards,
          {
            id: result.research_id,
            title: newProject.paper,
            year: newProject.year,
            source: newProject.source,
            cited: newProject.cited,
            link_to_paper: newProject.link_to_paper,
          },
        ]);
        window.location.reload();
        alert("Project added successfully!");
      } else {
        console.error("Failed to add project:", response.statusText);
        alert("Failed to add project. Please try again.");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("An error occurred while adding the project.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { card, index } = deleteTarget;
    console.log("📌 Deleting Card:", card); // ✅ ดูค่า card ก่อน

    if (!card.id) {
      console.error("🚨 Error: card.id is undefined!");
      alert("Error: Cannot delete this project (ID is missing).");
      return;
    }

    const formattedDepartment = department;
    const apiUrl = `https://project-six-rouge.vercel.app/researcher/${formattedDepartment}/${researcherId}/${card.id}`;

    console.log("📌 DELETE Request to:", apiUrl); // ✅ เช็ก URL ว่าถูกต้องไหม

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Project deleted successfully!");
        setCards((prevCards) => prevCards.filter((_, i) => i !== index));
      } else {
        console.error("Failed to delete project:", response.statusText);
        alert("Failed to delete project. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("An error occurred while deleting the project.");
    } finally {
      closeDeleteModal();
    }
  };




  const handleEdit = (card) => {
    console.log("📌 Editing Project:", card);
    setNewProject({
      paper: card.title,
      year: card.year,
      source: card.source,
      cited: card.cited,
      link_to_paper: card.link_to_paper,
    });
    setCurrentScopusId(card.id);
    console.log("📌 Current Scopus ID:", card.id);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const formattedDepartment = department;
    const apiUrl = `https://project-six-rouge.vercel.app/researcher/${formattedDepartment}/${researcherId}/${currentScopusId}/edit`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ ส่ง token ใน header
        },
        body: JSON.stringify(newProject),
      });

      const result = await response.json();
      console.log("📌 Project updated:", result);

      if (response.ok) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === currentScopusId
              ? {
                ...card,
                title: newProject.paper,
                year: newProject.year,
                source: newProject.source,
                cited: newProject.cited,
                link_to_paper: newProject.link_to_paper,
              }
              : card
          )
        );
        alert("Project updated successfully!");
        closeEditModal();
      } else {
        console.error("🚨 Failed to update project:", result.message);
        alert("Failed to update project. Please try again.");
      }
    } catch (error) {
      console.error("🚨 Error updating project:", error);
      alert("An error occurred while updating the project.");
    }
  };

  // 🔹 เมื่อกดปุ่ม "BACK" ให้ลบค่าจาก localStorage เพื่อป้องกันการกลับมาอัตโนมัติ
  const handleBack = () => {
    setSelectedResearcher(null);
    localStorage.removeItem("selectedResearcher");
    setSelectedMember(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <button
          className="px-4 py-2 bg-orange-600 text-white rounded-md"
          onClick={() => {
            setSelectedResearcher(null);
            localStorage.removeItem("selectedResearcher");
            setSelectedMember(null);
          }}
        >
          BACK
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={openAddModal}
        >
          + Add Research
        </button>
      </div>

      <h1 className="text-2xl font-bold mt-6 text-orange-600">
        Editing Research for: {name}
      </h1>
      <h1 className="text-xl font-bold mt-6 text-orange-600">
        ({selectedResearcher?.department || department})
      </h1>

      <div className="relative mt-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="ค้นหาโปรเจกต์..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 px-4 py-2 border rounded-md"
        />
        {/* ✅ Dropdown เลือก Years */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Years</option>
          {[...new Set(cards.map((card) => card.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* ✅ Dropdown เลือก Source */}
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Sources</option>
          {[...new Set(cards.map((card) => card.source))].map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : filteredCards.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="border p-4 rounded-lg shadow-lg bg-white flex flex-col justify-between h-40 relative cursor-pointer" // เพิ่ม cursor-pointer ตรงนี้
              onClick={() => {
                if (card.link_to_paper) {
                  window.open(card.link_to_paper, "_blank");
                } else {
                  alert("No link available for this paper.");
                }
              }}
              
            >
              <h2 className="font-bold line-clamp-3 overflow-hidden text-ellipsis break-words">
                {card.title}
              </h2>

              <div className="text-sm text-gray-500">
                {card.year} | Source: {card.source}
              </div>
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ป้องกันไม่ให้เหตุการณ์ส่งไปยัง card
                    handleEdit(card); // ส่งข้อมูล card ที่ต้องการแก้ไข
                  }}
                  className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(card, index);
                  }}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          No projects found.
        </div>
      )}

      {/* Delete Comfirm Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this project?</p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Edit*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.paper}
                onChange={(e) =>
                  setNewProject({ ...newProject, paper: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Year"
                value={newProject.year}
                onChange={(e) =>
                  setNewProject({ ...newProject, year: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Source"
                value={newProject.source}
                onChange={(e) =>
                  setNewProject({ ...newProject, source: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Cited"
                value={newProject.cited}
                onChange={(e) =>
                  setNewProject({ ...newProject, cited: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Link to Paper"
                value={newProject.link_to_paper}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    link_to_paper: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)} // ปิด Modal
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit} // บันทึกการแก้ไข
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Add New Project</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.paper}
                onChange={(e) =>
                  setNewProject({ ...newProject, paper: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Year"
                value={newProject.year}
                onChange={(e) =>
                  setNewProject({ ...newProject, year: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Source"
                value={newProject.source}
                onChange={(e) =>
                  setNewProject({ ...newProject, source: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Cited"
                value={newProject.cited}
                onChange={(e) =>
                  setNewProject({ ...newProject, cited: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Link to Paper"
                value={newProject.link_to_paper}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    link_to_paper: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editpage;
