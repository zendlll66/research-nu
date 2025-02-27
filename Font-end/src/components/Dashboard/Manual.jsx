import React, { useState } from 'react';

const Manual = () => {
  // สถานะสำหรับหัวข้อที่เลือก
  const [selectedTopic, setSelectedTopic] = useState('manageNews');
  // สถานะสำหรับรูปที่กำลังแสดง
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ข้อมูลรูปภาพตามหัวข้อ
  const topics = {
    manageNews: {
      title: 'Manage News',
      images: Array.from({ length: 4 }, (_, i) => `/assets/Manual/news/${i + 1-1}.jpg`),
    },
    manageResearcher: {
      title: 'Manage Researcher',
      images: Array.from({ length: 5 }, (_, i) => `/assets/Manual/research/${i + 1-1}.jpg`),
    },
    analytics: {
      title: 'Analytics',
      images: Array.from({ length: 1 }, (_, i) => `/assets/Manual/analytics/${i + 1-1}.jpg`),
    },
    manageEbooks: {
      title: 'Manage Ebooks',
      images: Array.from({ length: 3 }, (_, i) => `/assets/Manual/ebook/${i + 1-1}.jpg`),
    },
    lineBroadcast: {
      title: 'Line Broadcast',
      images: Array.from({ length: 1 }, (_, i) => `/assets/Manual/line/${i + 1-1}.jpg`),
    },
    register: {
      title: 'Register',
      images: Array.from({ length: 1 }, (_, i) => `/assets/Manual/register/${i + 1-1}.jpg`),
    },
  };

  // ฟังก์ชันเปลี่ยนหัวข้อ
  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setCurrentImageIndex(0); // รีเซ็ตรูปภาพเป็นรูปแรกเมื่อเปลี่ยนหัวข้อ
  };

  // ฟังก์ชันแสดงรูปถัดไป
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < topics[selectedTopic].images.length - 1 ? prevIndex + 1 : 0
    );
  };

  // ฟังก์ชันแสดงรูปก่อนหน้า
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : topics[selectedTopic].images.length - 1
    );
  };

  return (
    <div className="m-20 ml-20">
      <h1 className="text-2xl font-bold mb-10 uppercase">Manual</h1>

      {/* ปุ่มเลือกหัวข้อ */}
      <div className="flex space-x-4 mb-8">
        {Object.keys(topics).map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicChange(topic)}
            className={`px-4 py-2 rounded-lg ${
              selectedTopic === topic
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {topics[topic].title}
          </button>
        ))}
      </div>

      {/* แสดงรูปภาพ */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-2xl">
          <img
            src={topics[selectedTopic].images[currentImageIndex]}
            alt={`${topics[selectedTopic].title} รูปที่ ${currentImageIndex + 1}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {/* ปุ่มเปลี่ยนรูป */}
          <button
            onClick={handlePreviousImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 rounded-full shadow-md"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 rounded-full shadow-md"
          >
            &gt;
          </button>
        </div>
        <p className="text-gray-600">
          รูปที่ {currentImageIndex + 1} จาก {topics[selectedTopic].images.length}
        </p>
      </div>
    </div>
  );
};

export default Manual;