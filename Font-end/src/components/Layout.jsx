import React from 'react'
import { NavHome } from './NavHome'
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className=''>
            <div className=''>
                <div className='fixed py-5 md:py-8 left-[50%] translate-x-[-50%] z-50'>
                    
                </div>
            </div>
            <main className=""> 
                <Outlet /> 
            </main>
        </div>
    )
}

export default Layout