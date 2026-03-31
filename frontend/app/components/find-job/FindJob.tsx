"use client";

import React, { useEffect, useState } from "react";
import { useUserInfo } from "../../hooks/useUserInfo";

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
          const response = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(interests)}`);
          if (!response.ok) {
            throw new Error("Failed to fetch jobs");
          }
          const data = await response.json();
          // Remotive API returns { "0-legal-notice": "...", "job-count": 123, jobs: [...] }
          if (data && data.jobs) {
            setJobs(data.jobs.slice(0, 50)); // Limit to top 50
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
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    View & Apply
                  </a>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Posted {new Date(job.publication_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
