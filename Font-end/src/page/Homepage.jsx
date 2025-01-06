'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import Carousels from '../components/Carousels';
import Footercompo from '../components/Footercompo';
import Statistics from '../components/Statistics';

const navigation = [
  { name: 'HOME', href: '/' },
  { name: 'RESEARCH', href: '/research' },
  { name: 'EBOOK', href: '/ebook' },

]

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const newsItems = [
    {
      image: 'https://via.placeholder.com/800x400',
      title: 'News Title 1',
      description: 'Description for news 1',
      link: '/news/1'
    },
    {
      image: 'https://via.placeholder.com/800x400',
      title: 'News Title 2',
      description: 'Description for news 2',
      link: '/news/2'
    },]
  return (

    <div className="bg-white min-h-screen  flex flex-col overflow-x-auto ">
      <div className="flex-grow ">
        <div className="relative isolate px-6 pt-14 lg:px-8 ">
          <div
            aria-hidden="true"
            className="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          {/* Header Section */}
          <div className="mx-auto max-w-5xl py-5 text-center">
            <h1 className="text-6xl font-extrabold mt-20 tracking-tight text-gray-900 sm:text-7xl animate-fade-in">
              Faculty of Engineering Research
            </h1>
            <h2 className="text-4xl font-bold text-indigo-600 mt-3 sm:text-5xl">
              Naresuan University
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Dive into the world of innovative research. Explore and collaborate with us.
            </p>

            <div className="mt-10 flex justify-center gap-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus:outline-none transition-transform transform hover:scale-105"
              >
                Get started
              </a>
              <a href="#" className="text-sm font-semibold text-indigo-700 hover:underline">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>


          {/* Carousel Section */}
          <div className='relative z-10 flex justify-center mt-10 animate-slide-up'>
            <Carousels />
          </div>


          <div
            aria-hidden="true"
            className="fixed inset-x-0 top-[calc(100%-13rem)] z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
        {/* Stat Section */} 
        <div className="mt-24 justify-center flex flex-col items-center">
          <div className="bg-indigo-700 p-10 rounded-lg shadow-xl mb-20 w-fit px-80">
            <Statistics />
          </div>
        </div>

      </div>

      <div className='z-20'>
        <Footercompo />
      </div>
    </div>
  )
}




