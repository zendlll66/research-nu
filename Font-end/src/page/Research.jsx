import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

const Research = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("viewMode") || "withImage"
  );
  const baseImageUrl = "https://project-six-rouge.vercel.app";

  const faculties = [
    "Industrial Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical and Computer Engineering",
    "Others",
  ];

  useEffect(() => {
    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);

      try {
        const encodedFaculty = encodeURIComponent(selectedFaculty);
        const response = await fetch(
          `https://project-six-rouge.vercel.app/researcher/${encodedFaculty}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (json.status === "ok" && Array.isArray(json.data)) {
          setResearchers(json.data);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, [selectedFaculty]);

  const navigate = useNavigate();

  const handleClick = (faculty, id, researcher) => {
    navigate(`/researcher/${encodeURIComponent(faculty)}/${id}`, {
      state: { researcher },
    });
  };

  const handleViewToggle = () => {
    const newViewMode = viewMode === "withImage" ? "withoutImage" : "withImage";
    setViewMode(newViewMode);
    localStorage.setItem("viewMode", newViewMode);
  };

  const filteredResearchers = researchers.filter((researcher) =>
    researcher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>

      <div
        aria-hidden="true"
        className="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-white opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mt-20 p-6">
        <div className="flex flex-col items-center p-4 rounded-lg shadow bg-black bg-opacity-10">
          <h1 className="text-2xl font-bold mb-4">Researcher Data</h1>
          <div className="mb-4 w-full flex p-2 rounded-lg">
            <input
              type="text"
              className="border outline-none rounded-lg p-2 w-full mx-20"
              placeholder="Search researchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-4 flex outline-none flex-col sm:flex-row justify-between items-center space-y-3">
            <select
              className="border rounded-lg p-3"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="" disabled>
                Select Department
              </option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>

            {/* Toggle Switch */}
            <div className="flex items-center space-x-4 ">
              <span className="text-sm font-medium text-gray-700">View with Image</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode === "withImage"}
                  onChange={handleViewToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer dark:bg-gray-700 peer-checked:bg-orange-600 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white   after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
            <DotLottieReact
              className="w-[200px] h-[200px]"
              src="https://lottie.host/5b8d0182-13bd-40c0-b485-e4621b87aba7/LSlDgjJbnv.lottie"
              loop
              autoplay
            />
          </div>
        )}
        {error && <div className="text-red-500">Error: {error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredResearchers.map((researcher) => (
            <div
              key={researcher.id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-lg"
              onClick={() => handleClick(researcher.faculty, researcher.id, researcher)}
            >
              {viewMode === "withImage" && (
                <div className="rounded-t-lg mb-3 grid place-items-center">
                  <img
                    className="rounded-md h-40 object-cover"
                    src={researcher.image}
                    alt={researcher.name}
                  />
                </div>
              )}
              <div className="flex items-center overflow-hidden max-w-full">
                <h2 className="font-semibold flex items-center gap-2 overflow-hidden">
                {researcher.position}{researcher.name}
                </h2>
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                <FiMail /> {researcher.contact || "-"}
              </p>
              <p className="text-gray-500 flex items-center gap-2">
                <FiPhone /> {researcher.phone || "-"}
              </p>
              <p className="text-gray-500 flex items-center gap-2">
                <FiMapPin /> {researcher.office || "-"}
              </p>
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="fixed  inset-x-0 top-[calc(100%-13rem)] z-[-10] transform-gpu overflow-hidden blur-xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-500 to-white opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Research;
