'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import Carousels from '../components/Carousels';
import Footercompo from '../components/Footercompo';
import Statistics from '../components/Statistics';
import Swipecarousel from '../components/Swipecarousel';
import Analytics from '../components/Dashboard/Analytics';

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminName = localStorage.getItem("adminName");
  return (
    <div className="relative bg-white min-h-screen flex flex-col overflow-x-auto">

      {/* Background สีส้มที่อยู่ด้านหลังสุด */}
      <div
        className="absolute inset-0 -z-10 bg-orange-500"
        aria-hidden="true"
      />

      {/* เนื้อหาหลัก */}
      {/* Swipcarousel */}
      <div className="z-20 flex-grow mt-[80px]">
        <Swipecarousel />
      </div>
      <div className="flex-grow">
        {/* Carousel Section */}
        <div className="relative isolate px-6 lg:px-8">
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

          {/* Header Section */}
          <div className="mx-auto max-w-5xl py-5 text-center">
            <h1 className="text-6xl font-extrabold mt-20 tracking-tight text-orange-500 sm:text-7xl animate-fade-in">
              Faculty of Engineering Research Unit
            </h1>
            <h1>Welcome, {adminName}!</h1>
            <h2 className="text-4xl font-bold text-gray-700 mt-3 sm:text-5xl">
              Naresuan University
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Dive into the world of innovative research. Explore and collaborate with us.
            </p>


          </div>

          {/* Carousel Section */}
          <div className="relative z-10 flex justify-center mt-10 animate-slide-up">
            <Carousels />
          </div>

          {/* Stat Section */}
          <div className="mt-24 flex flex-col items-center justify-center">
            <div className="p-10 shadow-xl mb-20 w-screen bg-orange-500 ">
              <Statistics />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="fixed inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-xl sm:top-[calc(100%-30rem)]"
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

      {/* Analytics */}
      <div className=" py-10 z-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center">
          <div>
            <img src="/assets/Achievements.png" alt="" />
          </div>
          <h2 className="text-3xl font-bold text-gray-700 text-center">
            Our Achievements
          </h2>
          <div className="mt-8">
            <Analytics />
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className="z-20">
        <Footercompo />
      </div>
    </div>
  );
}
