import React from 'react'

const Footercompo = () => {
  return (
    <footer className="bg-gray-800 text-white py-5 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">Faculty of Engineering</h1>
            <p className="text-sm">Research and Development</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400">Home</a>
            <a href="#" className="hover:text-gray-400">About</a>
            <a href="#" className="hover:text-gray-400">Contact</a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          <p>&copy; 2023 Faculty of Engineering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footercompo