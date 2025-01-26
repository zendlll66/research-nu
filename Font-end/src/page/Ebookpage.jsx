import React, { useEffect, useState } from 'react';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const Ebookpage = () => {
  const [ebookLink, setEbookLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    // โหลดข้อมูลจาก API
    const fetchEbookLink = async () => {
      try {
        const response = await fetch('https://project-six-rouge.vercel.app/ebook');
        const data = await response.json();
        if (data?.data && data.data.length > 0) {
          setEbookLink(data.data[0].link_to_ebook);
        } else {
          console.error('No ebook link found in API response.');
        }
      } catch (error) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEbookLink();

    // โหลดสคริปต์เมื่อ component ถูก mount
    const script = document.createElement('script');
    script.src = "//static.fliphtml5.com/web/js/plugin/LightBox/js/fliphtml5-light-box-api-min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
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
      {/* ฝัง FlipBook ด้วย iframe */}

      <iframe
        className='w-full h-screen bg-white pt-[50px] md:pt-[90px]'
        src={ebookLink}
        title="Flipbook"
      />

    </div>
  );
};

export default Ebookpage;
