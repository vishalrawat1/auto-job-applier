"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QnaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    hobbies: "",
    achievements: "",
    isArmyVeteran: false,
    isPhysicallyDisabled: false,
    disabilityDetails: "",
    gender: "Prefer not to say",
    nationality: "",
    workAuthorization: "",
    willingToRelocate: false,
    criminalRecord: false,
    additionalInformation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please sign in to access this page.");
      router.push("/signin");
      return;
    }
    const user = JSON.parse(storedUser);
    setUserId(user._id);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsLoading(true);
    try {
      const payload = { ...formData, userId };     
      const response = await fetch("http://localhost:5050/router/postqna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("Information submitted successfully!");
        router.push("/");
      } else {
        alert(data.message || "Failed to submit information");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) return null; 

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Additional Information</h2>
          <p className="mt-2 text-sm text-gray-600">Please provide some more details about yourself.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hobbies */}
          <div>
            <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700">
              Hobbies
            </label>
            <textarea
              name="hobbies"
              id="hobbies"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Reading, Coding, Hiking..."
              value={formData.hobbies}
              onChange={handleChange}
            />
          </div>

          {/* Achievements */}
          <div>
            <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">
              Achievements
            </label>
            <textarea
              name="achievements"
              id="achievements"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Hackathon winner, Employee of the month..."
              value={formData.achievements}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Nationality */}
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>

            {/* Work Auth */}
            <div>
              <label htmlFor="workAuthorization" className="block text-sm font-medium text-gray-700">
                Work Authorization
              </label>
              <input
                type="text"
                name="workAuthorization"
                id="workAuthorization"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g. Citizen, Visa Type"
                value={formData.workAuthorization}
                onChange={handleChange}
              />
            </div>
            
             {/* Gender */}
             <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.gender}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Checkboxes Group */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isArmyVeteran"
                  name="isArmyVeteran"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.isArmyVeteran}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isArmyVeteran" className="font-medium text-gray-700">
                  Army Veteran
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="willingToRelocate"
                  name="willingToRelocate"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.willingToRelocate}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="willingToRelocate" className="font-medium text-gray-700">
                  Willing to Relocate
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="criminalRecord"
                  name="criminalRecord"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.criminalRecord}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="criminalRecord" className="font-medium text-gray-700">
                  Criminal Record
                </label>
              </div>
            </div>

             <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isPhysicallyDisabled"
                  name="isPhysicallyDisabled"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.isPhysicallyDisabled}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPhysicallyDisabled" className="font-medium text-gray-700">
                  Physically Disabled
                </label>
              </div>
            </div>
          </div>

          {/* Conditional Disability Details */}
          {formData.isPhysicallyDisabled && (
            <div>
              <label htmlFor="disabilityDetails" className="block text-sm font-medium text-gray-700">
                Disability Details
              </label>
              <textarea
                name="disabilityDetails"
                id="disabilityDetails"
                rows={2}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.disabilityDetails}
                onChange={handleChange}
              />
            </div>
          )}

           {/* Additional Info */}
           <div>
            <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              name="additionalInformation"
              id="additionalInformation"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.additionalInformation}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Information"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
