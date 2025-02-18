import React from 'react';
import { FaFacebookSquare, FaFax } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
const Footercompo = () => {
  return (
    <footer className="bg-gray-800 text-white py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center space-x-4  p-4 ">

          {/* Left */}
          <div className="mb-4 md:mb-0 font-light p-4 ">
            <h1 className="text-2xl font-bold text-center mb-2 text-orange-400 uppercase">Contact Us</h1>

            <p className="text-sm max-w-[400px] indent-5 mb-2">งานบริการวิชาการ วิจัยและนวัตกรรม
              สำนักงานเลขานุการคณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร
              99 หมู่ 9 ถนนพิษณุโลก-นครสวรรค์ ตำบลท่าโพธิ์
              อำเภอเมือง จังหวัดพิษณุโลก 65000</p>

            <p>
              <p>
                หน่วยวิเทศสัมพันธ์ โทร.4007
              </p>
              งานบริการวิชาการ วิจัยและนวัตกรรม
              หน่วยสนับสนุนการวิจัย โทร.4007
            </p>
            <div className='flex items-center gap-2'>
              <IoCall />
              <p>0-5596-4007(Research support unit)</p>
            </div>
            <div className='flex items-center gap-2'>
              <IoCall />
              <p>0-5596-4007 (International Relations Unit)</p>
            </div>
            <div className='flex items-center gap-2'>
              <IoCall />
              <p>0-5596-4092 (Academic Service Unit)</p>
            </div>
            <div className='flex items-center gap-2'>
              <IoCall />
              <p>0-5596-4092 (Business Development and Innovation Unit)</p>
            </div>
            <div className='flex items-center gap-2'>
              <IoCall />
              <p>0-5596-4092 (Business and Innovation Service Center (USIS))</p>
            </div>
            <div className='flex items-center gap-2'>
              <FaFax />
              <p>FAX : 0-5596-4000</p>
            </div>
            <div className='flex items-center gap-2'>
              <MdEmail />
              <span>engineering@nu.ac.th</span>
            </div>

          </div>

          {/* Middle - Embedded Map */}
          <div className=' p-4 '>
            <h2 className="text-lg font-semibold text-center mb-2 uppercase text-orange-400">Maps</h2>
            <iframe
              className='rounded-md w-full h-60'
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1606.3883659987741!2d100.19676497654868!3d16.743960168264586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30dfbe99c0e7b961%3A0xa63fc6eafd099302!2z4LiE4LiT4Liw4Lin4Li04Lio4Lin4LiB4Lij4Lij4Lih4Lio4Liy4Liq4LiV4Lij4LmMIOC4oeC4q-C4suC4p-C4tOC4l-C4ouC4suC4peC4seC4ouC4meC5gOC4o-C4qOC4p-C4ow!5e0!3m2!1sth!2sth!4v1739069629006!5m2!1sth!2sth"

              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">

            </iframe>
          </div>


          {/* Right */}
          <div className="flex flex-col  p-4 ">
            <h1 className='text-center mb-2 text-orange-400 font-bold uppercase'>Social</h1>
            <div className='flex flex-col gap-2 justify-center items-center'>
              <div className='flex  items-center gap-2 '>
                <FaFacebookSquare />
                <a href="https://www.facebook.com/eng.nu" className="hover:text-orange-400">Facebook</a>
              </div>
              <div className='flex items-center gap-2'>
                <FiInstagram />
                <a href="#" className="hover:text-orange-400 uppercase">instagram</a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-4 text-center text-sm">
          <p>&copy; 2023 Faculty of Engineering. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footercompo;
