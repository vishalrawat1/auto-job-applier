"use client";

import React, { useEffect, useState } from "react";
import { useUserInfo, UserInfoType } from "../../hooks/useUserInfo";

type QuestionDef = { key: keyof UserInfoType; question: string };

const QUESTION_BANK: QuestionDef[] = [
  { key: "highestEducation", question: "What is your highest level of education?" },
  { key: "fieldOfStudy", question: "What is your primary field of study?" },
  { key: "graduationYear", question: "In what year did you or will you graduate?" },
  { key: "willingToRelocate", question: "Are you willing to relocate for this position?" },
  { key: "willingToTravel", question: "Are you willing to travel for business?" },
  { key: "workAuthorization", question: "What is your current work authorization status?" },
  { key: "requiresSponsorship", question: "Do you require visa sponsorship now or in the future?" },
  { key: "noticePeriod", question: "What is your required notice period?" },
  { key: "expectedSalary", question: "What are your expected salary requirements?" },
  { key: "languages", question: "What languages are you proficient in?" },
  { key: "githubUrl", question: "Please provide a link to your GitHub." },
  { key: "portfolioUrl", question: "Please provide a link to your personal portfolio." },
  { key: "achievements", question: "Describe your professional achievements." }
];

const getRandomQuestions = (userProfile: UserInfoType | null) => {
  if (!userProfile) return [];
  // Only include questions where the answer is actually present in the user's datamodel
  const availableQuestions = QUESTION_BANK.filter(q => {
    const val = userProfile[q.key];
    return val !== undefined && val !== null && val !== "" && (Array.isArray(val) ? val.length > 0 : true);
  });

  const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
  // Pick exactly 80% of the relevant questions
  const count = Math.ceil(availableQuestions.length * 0.8);
  return shuffled.slice(0, count);
};

interface Job {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
}

export default function FindJob() {
  const { userInfo, loading: uiLoading, error: uiError } = useUserInfo();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [randomQuestions, setRandomQuestions] = useState<QuestionDef[]>([]);

  useEffect(() => {
    // Only attempt to fetch jobs once userInfo is loaded
    if (!uiLoading && userInfo) {
      // Determine what to search for. Prioritize jobInterests, fallback to fieldOfStudy
      const interests = userInfo.jobInterests && userInfo.jobInterests.length > 0 
        ? userInfo.jobInterests[0] // Taking the first one for simplicity
        : userInfo.fieldOfStudy || "software";

      setSearchTerm(interests);

      const fetchJobs = async () => {
        setJobsLoading(true);
        try {
          // Try fetching with the user's specific interest first
          let response = await fetch(
            `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(interests)}&limit=50`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch jobs from API");
          }
          
          let rawData = await response.json();
          let jobsList = rawData.jobs;
          
          // If no jobs found, fallback to a guaranteed search term ("software")
          if (!jobsList || jobsList.length === 0) {
            setSearchTerm("software");
            response = await fetch(
              `https://remotive.com/api/remote-jobs?search=software&limit=500`
            );
            rawData = await response.json();
            jobsList = rawData.jobs;
          }
          
          if (jobsList && Array.isArray(jobsList)) {
            // Remotive properties already perfectly match your Job interface
            setJobs(jobsList.slice(0, 50));
          } else {
            setJobs([]);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
          setJobsLoading(false);
        }
      };

      fetchJobs();
    }
  }, [uiLoading, userInfo]);




  if (uiLoading) return <div className="p-8 text-center text-gray-600">Loading your profile...</div>;
  if (uiError) return <div className="p-8 text-center text-red-600">Error: {uiError}</div>;
  if (!userInfo) return <div className="p-8 text-center text-gray-600">Please sign in to view recommended jobs.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Jobs Matching Your Profile
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Based on your interest in <span className="font-semibold text-blue-600">{searchTerm}</span>
          </p>
        </div>

        {jobsLoading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mt-10">
            <p className="text-xl font-semibold">Oops! Could not load jobs.</p>
            <p>{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            <p className="text-xl">No jobs found matching your interests right now.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={`${job.company_name} logo`}
                        className="w-12 h-12 rounded-full object-contain bg-gray-50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {job.company_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.company_name}
                      </h3>
                      <p className="text-sm text-gray-500">{job.candidate_required_location}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {job.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {job.job_type.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                      {job.category}
                    </span>
                    {job.salary && (
                      <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setRandomQuestions(getRandomQuestions(userInfo));
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Apply Now
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Posted {new Date(job.publication_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                Apply to {selectedJob.company_name}
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 pb-6 border-b border-gray-100 flex items-center space-x-4">
                 {selectedJob.company_logo ? (
                    <img src={selectedJob.company_logo} alt="logo" className="w-12 h-12 rounded-full object-contain" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold">{selectedJob.company_name.charAt(0)}</span>
                    </div>
                  )}
                 <div>
                   <h3 className="font-semibold text-gray-900">{selectedJob.title}</h3>
                   <p className="text-sm text-gray-500">{selectedJob.candidate_required_location}</p>
                 </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => { 
                e.preventDefault(); 
                alert(`Application for ${selectedJob.title} at ${selectedJob.company_name} submitted successfully!`); 
                setSelectedJob(null); 
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                  <input type="url" defaultValue={userInfo?.linkedInUrl || ""} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                  <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder={`Why are you a good fit for ${selectedJob.company_name}?`}></textarea>
                </div>
                
                {/* Dynamically generated questions (Random 80% from DB) */}
                {randomQuestions.length > 0 && (
                  <>
                    <div className="pt-2 pb-2">
                      <h4 className="text-md font-semibold text-gray-900 border-b border-gray-100 pb-2">Additional Company Questions</h4>
                    </div>
                    {randomQuestions.map((qItem, idx) => {
                      const ans = userInfo?.[qItem.key];
                      const displayVal = Array.isArray(ans) ? ans.join(", ") : typeof ans === 'boolean' ? (ans ? 'Yes' : 'No') : String(ans || "");
                      return (
                        <div key={idx}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {qItem.question} <span className="text-red-500">*</span>
                          </label>
                          <textarea 
                            required
                            defaultValue={displayVal}
                            rows={2} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-blue-50" 
                            placeholder="Your answer..."
                          ></textarea>
                        </div>
                      )
                    })}
                  </>
                )}
                
                <div className="pt-4 flex space-x-3">
                  <button type="button" onClick={() => setSelectedJob(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
