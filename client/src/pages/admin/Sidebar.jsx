import { ChartNoAxesColumn, SquareLibrary, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Transparent Mobile Menu Button */}
            <div className="lg:hidden fixed top-9 left-8 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-black dark:text-white bg-transparent p-1"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-40" onClick={() => setIsOpen(false)}>
                    <div
                        className="bg-white dark:bg-black w-[250px] h-full p-5 space-y-6 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='space-y-4'>
                            <Link
                                to="dashboard"
                                className="flex items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <ChartNoAxesColumn size={22} />
                                <h1>Dashboard</h1>
                            </Link>
                            <Link
                                to="course"
                                className="flex items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <SquareLibrary size={22} />
                                <h1>Courses</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Layout (unchanged) */}
            <div className='flex'>
                <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  p-5 sticky top-0  h-screen">
                    <div className='space-y-4 mt-20'>
                        <Link to="dashboard" className="flex items-center gap-2">
                            <ChartNoAxesColumn size={22} />
                            <h1>Dashboard</h1>
                        </Link>
                        <Link to="course" className="flex items-center gap-2">
                            <SquareLibrary size={22} />
                            <h1>Courses</h1>
                        </Link>
                    </div>
                </div>

                <div className='flex-1 p-10 bg-white dark:bg-black'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Sidebar
