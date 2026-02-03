"use client";
import { useState } from "react";

export default function FillInformation() {
  const [isPhysicallyDisabled, setIsPhysicallyDisabled] = useState(false);
 const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profilePicture: "",
    resume: "",
    coverLetter: "",
    linkedInProfile: "",
    githubProfile: "",
    portfolioWebsite: "",
    skills: "",
    experience: "",
    education: "",
    certifications: "",
    achievements: "",
    hobbies: "",
    gender: "",
    nationality: "",
    workAuthorization: "",
    physicallyDisabled: false,
    additionalDetails: "",
  });

  const handleSubmit=()=>{
    console.log(formData);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <form className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Profile Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Let's complete your professional profile
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Personal Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Hobbies</label>
                <input
                  type="text"
                  name="hobbies"
                  placeholder="e.g. Photography, Reading"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Achievements</label>
                <input
                  type="text"
                  name="achievements"
                  placeholder="e.g. Employee of the Month"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Gender</label>
                <div className="relative">
                  <select name="gender" className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 appearance-none cursor-pointer">
                    <option value="" disabled selected>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Nationality <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nationality"
                  required
                  placeholder="e.g. India"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              <div className="group md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Work Authorization <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="workAuthorization"
                  required
                  placeholder="e.g. Indian Passport , Aadhaar Card"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-700"></div>

          {/* Section 2: Additional Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">2</span>
              Additional Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              {[
                { name: "isArmyVeteran", label: "Army Veteran" },
                { name: "willingToRelocate", label: "Willing to Relocate" },
                { name: "criminalRecord", label: "Criminal Record" },
              ].map((item) => (
                <label key={item.name} className="relative flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input type="checkbox" name={item.name} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </label>
              ))}

              <label className="relative flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  name="isPhysicallyDisabled"
                  checked={isPhysicallyDisabled}
                  onChange={(e) => setIsPhysicallyDisabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">Physically Disabled</span>
              </label>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPhysicallyDisabled ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Disability Details</label>
              <textarea
                name="disabilityDetails"
                placeholder="Please provide details..."
                className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 min-h-[100px]"
              />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Additional Information</label>
              <textarea
                name="additionalInformation"
                placeholder="Anything else we should know?"
                className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 min-h-[120px]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}