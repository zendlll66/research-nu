import React, { useEffect } from 'react';
const Ebookpage = () => {
  useEffect(() => {
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
      {/* ฝัง FlipBook ด้วย iframe */}
      <iframe
        className='w-full h-screen bg-white pt-[50px] md:pt-[90px]'
        src="https://heyzine.com/flip-book/8e3f740e52.html?fbclid=IwY2xjawFiAs9leHRuA2FlbQIxMAABHQjFXQ_XibzVdGYtOCetxDxlwxOJCC-1_6X0Wzf59Dn6ClCscNUJSw5s0A_aem_UD4QQE5nMLD83o2BQ7SW3w#page/1"
        title="Flipbook"
      />
    </div>
  );
};

export default Ebookpage