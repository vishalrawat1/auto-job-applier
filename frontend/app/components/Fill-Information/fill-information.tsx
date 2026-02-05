"use client";
import { useEffect, useState } from "react";

export default function FillInformation() {
  const [formData, setFormData] = useState({
    userId: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    languages: "", 
    currentLocation: {
      city: "",
      state: "",
      country: ""
    },
    preferredLocations: [] as { city: string; country: string }[],
    willingToRelocate: false,
    willingToTravel: false,
    workPreference: "",
    workAuthorization: "",
    visaStatus: "",
    requiresSponsorship: false,
    isArmyVeteran: false,
    criminalRecord: false,
    isPhysicallyDisabled: false,
    disabilityDetails: "",
    highestEducation: "",
    fieldOfStudy: "",
    graduationYear: "",
    jobInterests: [] as string[],
    employmentType: "",
    expectedSalary: {
      min: "",
      max: "",
      currency: "INR"
    },
    noticePeriod: "",
    availableStartDate: "",
    linkedInUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    personalWebsite: "",
    hobbies: "",
    achievements: "",
    additionalInformation: "",
    dataProcessingConsent: false,
    informationAccuracyConfirmed: false
  });

  const [newPrefLocation, setNewPrefLocation] = useState({ city: "", country: "" });
  const [newJobInterest, setNewJobInterest] = useState("");

  useEffect(() => {
    const storage = localStorage.getItem("user");
    if (storage) {
      const user = JSON.parse(storage);
      if (user?._id) {
        setFormData((prev) => ({
          ...prev,
          userId: user._id,
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addPreferredLocation = () => {
    if (newPrefLocation.city && newPrefLocation.country) {
      setFormData((prev) => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, newPrefLocation]
      }));
      setNewPrefLocation({ city: "", country: "" });
    }
  };

  const removePreferredLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter((_, i) => i !== index)
    }));
  };

  const addJobInterest = () => {
    if (newJobInterest.trim()) {
      setFormData((prev) => ({
        ...prev,
        jobInterests: [...prev.jobInterests, newJobInterest.trim()]
      }));
      setNewJobInterest("");
    }
  };

  const removeJobInterest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      jobInterests: prev.jobInterests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Process data before sending (e.g. split languages)
      const payload = {
        ...formData,
        languages: typeof formData.languages === 'string' 
          ? formData.languages.split(',').map(l => l.trim()).filter(Boolean)
          : formData.languages,
          
         // Convert dates if needed, usually string 'YYYY-MM-DD' works fine for Date type
      };

      const response = await fetch("http://localhost:5050/router1/postqna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json();
      console.log(data);
      if (response.ok) {
          alert("Profile saved successfully!");
      } else {
          alert("Error saving profile: " + data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Network error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Profile Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Complete your comprehensive professional profile
          </p>
        </div>

        <div className="space-y-10">
          {/* 1. Personal Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nationality *</label>
                <input type="text" name="nationality" required value={formData.nationality} onChange={handleChange} placeholder="e.g. Indian" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="group md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Languages (Comma separated)</label>
                 <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Spanish, Hindi" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* 2. Location & Mobility */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
              Location & Mobility
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current City</label>
                   <input type="text" value={formData.currentLocation.city} onChange={(e) => handleNestedChange('currentLocation', 'city', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="group">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                   <input type="text" value={formData.currentLocation.state} onChange={(e) => handleNestedChange('currentLocation', 'state', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="group">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                   <input type="text" value={formData.currentLocation.country} onChange={(e) => handleNestedChange('currentLocation', 'country', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

               {/* Preferred Locations */}
               <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preferred Locations</label>
                  <div className="flex gap-4 mb-4">
                     <input type="text" placeholder="City" value={newPrefLocation.city} onChange={(e) => setNewPrefLocation({...newPrefLocation, city: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800" />
                     <input type="text" placeholder="Country" value={newPrefLocation.country} onChange={(e) => setNewPrefLocation({...newPrefLocation, country: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800" />
                     <button type="button" onClick={addPreferredLocation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredLocations.map((loc, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2">
                        {loc.city}, {loc.country}
                        <button type="button" onClick={() => removePreferredLocation(idx)} className="hover:text-red-500">&times;</button>
                      </span>
                    ))}
                  </div>
               </div>

               <div className="flex gap-6">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" name="willingToRelocate" checked={formData.willingToRelocate} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                   <span className="text-gray-700 dark:text-gray-300">Willing to Relocate</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" name="willingToTravel" checked={formData.willingToTravel} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                   <span className="text-gray-700 dark:text-gray-300">Willing to Travel</span>
                 </label>
               </div>
            </div>
          </section>

          {/* 3. Work Authorization */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
              Work Authorization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authorization Status *</label>
                  <input type="text" name="workAuthorization" required value={formData.workAuthorization} onChange={handleChange} placeholder="e.g. Authorized to work in US" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visa Status</label>
                  <select name="visaStatus" value={formData.visaStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Status</option>
                    <option value="Citizen">Citizen</option>
                    <option value="PR">Permanent Resident</option>
                    <option value="H1B">H1B</option>
                    <option value="F1">F1</option>
                    <option value="Other">Other</option>
                  </select>
               </div>
               <div className="group">
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input type="checkbox" name="requiresSponsorship" checked={formData.requiresSponsorship} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Requires Sponsorship</span>
                  </label>
               </div>
            </div>
          </section>


          {/* 4. Education & Consents (Remaining Fields) */}
          <section>
             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
               Education & Employment
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Interests */}
               <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Job Interests (Multiple allowed)</label>
                  <div className="flex gap-4 mb-4">
                     <input type="text" placeholder="e.g. Frontend Developer" value={newJobInterest} onChange={(e) => setNewJobInterest(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800" />
                     <button type="button" onClick={addJobInterest} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.jobInterests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-2">
                        {interest}
                        <button type="button" onClick={() => removeJobInterest(idx)} className="hover:text-red-500">&times;</button>
                      </span>
                    ))}
                  </div>
               </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Highest Education</label>
                  <select name="highestEducation" value={formData.highestEducation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Education</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div className="group">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field of Study</label>
                   <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="group">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Graduation Year</label>
                   <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Salary (INR)</label>
                  <div className="flex gap-2">
                     <input type="number" placeholder="Min" value={formData.expectedSalary.min} onChange={(e) => handleNestedChange('expectedSalary', 'min', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                     <input type="number" placeholder="Max" value={formData.expectedSalary.max} onChange={(e) => handleNestedChange('expectedSalary', 'max', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
             </div>
          </section>

          {/* 5. Additional Info & URLs */}
          <section>
             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
               Additional Information
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} placeholder="LinkedIn URL" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub URL" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="Portfolio URL" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="personalWebsite" value={formData.personalWebsite} onChange={handleChange} placeholder="Personal Website" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Hobbies" className="md:col-span-2 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 h-24" />
                <textarea name="achievements" value={formData.achievements} onChange={handleChange} placeholder="Achievements" className="md:col-span-2 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 h-24" />
                <textarea name="additionalInformation" value={formData.additionalInformation} onChange={handleChange} placeholder="Any other details..." className="md:col-span-2 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 h-24" />
             </div>
             
             <div className="mt-6 space-y-3">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" name="isArmyVeteran" checked={formData.isArmyVeteran} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                   <span className="text-gray-700 dark:text-gray-300">I am an Army Veteran</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" name="criminalRecord" checked={formData.criminalRecord} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                   <span className="text-gray-700 dark:text-gray-300">I have a criminal record</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" name="isPhysicallyDisabled" checked={formData.isPhysicallyDisabled} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                   <span className="text-gray-700 dark:text-gray-300">I have a physical disability</span>
                 </label>
                 {formData.isPhysicallyDisabled && (
                    <textarea name="disabilityDetails" value={formData.disabilityDetails} onChange={handleChange} placeholder="Please provide details about disability" className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 h-24" />
                 )}
             </div>
          </section>
          
          {/* 6. Consents */}
          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
             <label className="flex items-start gap-3 cursor-pointer mb-4">
               <input type="checkbox" name="dataProcessingConsent" required checked={formData.dataProcessingConsent} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded mt-1" />
               <span className="text-gray-700 dark:text-gray-300 text-sm">I consent to the processing of my personal data for job application purposes. *</span>
             </label>
             <label className="flex items-start gap-3 cursor-pointer">
               <input type="checkbox" name="informationAccuracyConfirmed" required checked={formData.informationAccuracyConfirmed} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded mt-1" />
               <span className="text-gray-700 dark:text-gray-300 text-sm">I confirm that all information provided is accurate and true to the best of my knowledge. *</span>
             </label>
          </section>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Save Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
}