"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Signin from "../signin/signin";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {

    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser)  {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
  
    checkUser();
    
    // Listen for storage events (login/logout from other tabs or same tab)

    const handleStorageChange = () => checkUser();
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for same-tab updates
    return () => {
        window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  return (    
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
               <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              <Link href="/">JobApplier</Link>
            </span>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link> */}
            <Link
              href="/find-job"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Find Job
            </Link>
            <Link
              href="/test"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Test
            </Link>
          </div>

          {/* Right Side: Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {user ? (
              
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Hello, {user.name}</span>
                    <button 
                        onClick={handleLogout}
                        className="hidden md:flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-95"
                    >
                        Sign Out
                    </button>
                    <button 
                        className="hidden md:flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-95"
                    >
                        <Link href="/fill-information">Fill Information</Link>
                    </button>
                </div>
            ) : (
                <button className="hidden md:flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95">
                    <Link href="/signin">Sign In</Link>
                </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}