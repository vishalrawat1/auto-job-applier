"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUserInfo, UserInfoType } from "../../hooks/useUserInfo";

// ── Static Question Bank (mirrors similarity_service.py) ──────────────────
type QuestionDef = { key: keyof UserInfoType; question: string };

const QUESTION_BANK: QuestionDef[] = [
  { key: "highestEducation",    question: "What is your highest level of education?" },
  { key: "fieldOfStudy",        question: "What is your primary field of study?" },
  { key: "graduationYear",      question: "In what year did you or will you graduate?" },
  { key: "willingToRelocate",   question: "Are you willing to relocate for this position?" },
  { key: "willingToTravel",     question: "Are you willing to travel for business?" },
  { key: "workAuthorization",   question: "What is your current work authorization status?" },
  { key: "requiresSponsorship", question: "Do you require visa sponsorship now or in the future?" },
  { key: "noticePeriod",        question: "What is your required notice period?" },
  { key: "expectedSalary",      question: "What are your expected salary requirements?" },
  { key: "languages",           question: "What languages are you proficient in?" },
  { key: "githubUrl",           question: "Please provide a link to your GitHub." },
  { key: "portfolioUrl",        question: "Please provide a link to your personal portfolio." },
  { key: "achievements",        question: "Describe your professional achievements." },
];

// ── Similarity API types ───────────────────────────────────────────────────
interface MatchResult {
  page_question: string;
  matched_key: keyof UserInfoType | null;
  matched_question: string | null;
  score: number;
  is_match: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getDisplayValue(val: unknown): string {
  if (val === undefined || val === null || val === "") return "";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

const SIMILARITY_API = "http://localhost:8000/match";
const SIMILARITY_THRESHOLD = 0.5;

// ── Page questions to fetch from the job portal (simulated / expandable) ──
// In a real scenario these would be scraped from the actual job application page.
// Here we seed them with a realistic set of application form questions.
const PAGE_QUESTIONS_POOL = [
  "What's the highest degree you've earned?",
  "Which subject did you major in?",
  "What year will you complete your degree?",
  "Are you open to relocating if required?",
  "Can you travel domestically or internationally for work?",
  "Do you have the right to work without visa sponsorship?",
  "Will you need employer-sponsored work authorization?",
  "How many days' notice must you give before starting?",
  "What salary range are you expecting?",
  "Which languages do you speak fluently?",
  "Can you share your GitHub profile?",
  "Do you have an online portfolio we can review?",
  "Tell us about a major professional achievement.",
  "Do you identify as a veteran?",
  "Where are you currently located?",
  "Describe your hobbies outside of work.",
  "Is there anything else you'd like us to know about you?",
];

// ── Job interface ─────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────
export default function FindJob() {
  const { userInfo, loading: uiLoading, error: uiError } = useUserInfo();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [pageQuestions, setPageQuestions] = useState<string[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [matchLoading, setMatchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Fetch jobs ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!uiLoading && userInfo) {
      const interests =
        userInfo.jobInterests && userInfo.jobInterests.length > 0
          ? userInfo.jobInterests[0]
          : userInfo.fieldOfStudy || "software";

      setSearchTerm(interests);

      const fetchJobs = async () => {
        setJobsLoading(true);
        try {
          let response = await fetch(
            `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(interests)}&limit=50`
          );
          if (!response.ok) throw new Error("Failed to fetch jobs from API");

          let rawData = await response.json();
          let jobsList = rawData.jobs;

          if (!jobsList || jobsList.length === 0) {
            setSearchTerm("software");
            response = await fetch(
              `https://remotive.com/api/remote-jobs?search=software&limit=50`
            );
            rawData = await response.json();
            jobsList = rawData.jobs;
          }

          setJobs(Array.isArray(jobsList) ? jobsList.slice(0, 50) : []);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
          setJobsLoading(false);
        }
      };

      fetchJobs();
    }
  }, [uiLoading, userInfo]);

  // ── Open modal: fetch questions from the "page" and run similarity ────
  const openJobModal = useCallback(
    async (job: Job) => {
      setSelectedJob(job);
      setSubmitted(false);
      setAnswers({});
      setMatchResults([]);

      // Simulate fetching questions from the job application page.
      // In production, replace this with an actual scrape/API call for `job.url`.
      const shuffled = [...PAGE_QUESTIONS_POOL].sort(() => 0.5 - Math.random());
      const fetchedQuestions = shuffled.slice(0, Math.ceil(PAGE_QUESTIONS_POOL.length * 0.7));
      setPageQuestions(fetchedQuestions);

      if (!userInfo) return;

      setMatchLoading(true);
      try {
        const res = await fetch(SIMILARITY_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_questions: fetchedQuestions,
            threshold: SIMILARITY_THRESHOLD,
          }),
        });

        if (!res.ok) throw new Error("Similarity service unavailable");

        const data: { results: MatchResult[] } = await res.json();
        setMatchResults(data.results);

        // Pre-fill answers for matched questions
        const autoAnswers: Record<number, string> = {};
        data.results.forEach((r, idx) => {
          if (r.is_match && r.matched_key) {
            const val = userInfo[r.matched_key];
            autoAnswers[idx] = getDisplayValue(val);
          }
        });
        setAnswers(autoAnswers);
      } catch {
        // Fallback: try local matching when similarity service is down
        const fallbackResults: MatchResult[] = fetchedQuestions.map((pq) => {
          const pqLower = pq.toLowerCase();
          const match = QUESTION_BANK.find((bq) =>
            bq.question.toLowerCase().split(" ").some((w) => w.length > 4 && pqLower.includes(w))
          );
          return {
            page_question: pq,
            matched_key: match?.key ?? null,
            matched_question: match?.question ?? null,
            score: match ? 0.6 : 0,
            is_match: !!match,
          };
        });
        setMatchResults(fallbackResults);

        const autoAnswers: Record<number, string> = {};
        fallbackResults.forEach((r, idx) => {
          if (r.is_match && r.matched_key) {
            const val = userInfo[r.matched_key];
            autoAnswers[idx] = getDisplayValue(val);
          }
        });
        setAnswers(autoAnswers);
      } finally {
        setMatchLoading(false);
      }
    },
    [userInfo]
  );

  // ── Submit application ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate network delay for submission
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  // ── Render guards ─────────────────────────────────────────────────────
  if (uiLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading your profile…</p>
        </div>
      </div>
    );
  if (uiError)
    return (
      <div className="p-8 text-center text-red-600">
        Error loading profile: {uiError}
      </div>
    );
  if (!userInfo)
    return (
      <div className="p-8 text-center text-gray-600">
        Please sign in to view recommended jobs.
      </div>
    );

  const autoFilledCount = matchResults.filter((r) => r.is_match).length;
  const totalCount = matchResults.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Jobs Matching Your Profile
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Based on your interest in{" "}
            <span className="font-semibold text-blue-600">{searchTerm}</span>
          </p>
        </div>

        {/* Job Grid */}
        {jobsLoading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
                      <h3 className="text-lg font-bold text-gray-900">{job.company_name}</h3>
                      <p className="text-sm text-gray-500">{job.candidate_required_location}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{job.title}</h2>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {job.job_type.replace("_", " ")}
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
                    id={`apply-btn-${job.id}`}
                    onClick={() => openJobModal(job)}
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

      {/* ── Application Modal ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-xl font-bold text-white line-clamp-1">
                  Apply to {selectedJob.company_name}
                </h2>
                <p className="text-blue-200 text-sm mt-0.5">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => { setSelectedJob(null); setSubmitted(false); }}
                className="text-blue-200 hover:text-white focus:outline-none transition-colors"
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitted ? (
              /* ── Success state ── */
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-500 mb-6">
                  Your application for <strong>{selectedJob.title}</strong> at{" "}
                  <strong>{selectedJob.company_name}</strong> has been sent.
                </p>
                <button
                  onClick={() => { setSelectedJob(null); setSubmitted(false); }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Back to Jobs
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <div className="overflow-y-auto flex-1">
                {/* Auto-fill summary banner */}
                {!matchLoading && matchResults.length > 0 && (
                  <div className="mx-6 mt-5 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">{autoFilledCount} of {totalCount}</span> questions
                      were auto-filled from your profile using AI similarity matching (threshold ≥ {SIMILARITY_THRESHOLD}).
                      {autoFilledCount < totalCount && (
                        <> Please complete the remaining <span className="font-semibold">{totalCount - autoFilledCount}</span> manually.</>
                      )}
                    </p>
                  </div>
                )}

                <form id="application-form" className="p-6 space-y-5" onSubmit={handleSubmit}>
                  {/* ── Loading state ── */}
                  {matchLoading && (
                    <div className="flex flex-col items-center py-8 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
                      <p className="text-sm">Fetching questions & matching with your profile…</p>
                    </div>
                  )}

                  {/* ── Dynamic page questions ── */}
                  {!matchLoading && pageQuestions.map((pq, idx) => {
                    const result = matchResults[idx];
                    const isAutoFilled = result?.is_match ?? false;
                    const score = result?.score ?? 0;

                    return (
                      <div key={idx} className="group">
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <label
                            htmlFor={`pq-${idx}`}
                            className="block text-sm font-medium text-gray-700 flex-1"
                          >
                            {pq}
                          </label>
                          {result && (
                            isAutoFilled ? (
                              <span
                                title={`Similarity score: ${(score * 100).toFixed(0)}% — matched to "${result.matched_question}"`}
                                className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 cursor-help"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Auto-filled {(score * 100).toFixed(0)}%
                              </span>
                            ) : (
                              <span
                                title={`Low similarity score: ${(score * 100).toFixed(0)}%`}
                                className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 cursor-help"
                              >
                                Manual {(score * 100).toFixed(0)}%
                              </span>
                            )
                          )}
                        </div>

                        <textarea
                          id={`pq-${idx}`}
                          rows={2}
                          required
                          value={answers[idx] ?? ""}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          placeholder={isAutoFilled ? "" : "Your answer…"}
                          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
                            isAutoFilled
                              ? "border-green-300 bg-green-50 focus:ring-green-400 focus:border-green-400"
                              : "border-gray-300 bg-white focus:ring-blue-400 focus:border-blue-400"
                          }`}
                        />
                      </div>
                    );
                  })}

                  {/* ── Action buttons ── */}
                  {!matchLoading && (
                    <div className="pt-2 flex gap-3 sticky bottom-0 bg-white pb-1">
                      <button
                        type="button"
                        onClick={() => { setSelectedJob(null); setSubmitted(false); }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-application-btn"
                        type="submit"
                        disabled={submitting}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                          submitting
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {submitting ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Submitting…
                          </span>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
