"use client";
import React, { useEffect, useState } from 'react';

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const Field = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 last:border-0 pb-2 last:pb-0">
        <span className="font-medium text-gray-600">{label}:</span>
        <span className="text-gray-800 text-right">{value || 'N/A'}</span>
    </div>
);

const LinkField = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 last:border-0 pb-2 last:pb-0">
        <span className="font-medium text-gray-600">{label}:</span>
        {value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">
                {value}
            </a>
        ) : (
            <span className="text-gray-400">N/A</span>
        )}
    </div>
);

const UserInfoComponent = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userStr = localStorage.getItem("user");
                if (!userStr) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }
                const user = JSON.parse(userStr);
                const userId = user._id;

                const response = await fetch('http://localhost:5050/router1/getqna');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Filter the data for the current user
                // Assuming data is an array of basic info objects
                const currentUserInfo = data.find((info: any) => info.userId === userId);
                
                if (currentUserInfo) {
                    setUserInfo(currentUserInfo);
                } else {
                    setError("No detailed information found for this user.");
                }
            } catch (err: any) {
                console.error("Failed to fetch user data:", err);
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-600">Loading user information...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    if (!userInfo) return <div className="p-8 text-center text-gray-600">No information available.</div>;

    // Helper to format location object
    const formatLocation = (loc: any) => {
        if (!loc) return 'N/A';
        if (typeof loc === 'string') return loc;
        const parts = [loc.city, loc.state, loc.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    };

    // Helper to format salary object
    const formatSalary = (sal: any) => {
        if (!sal) return 'N/A';
        if (typeof sal === 'string') return sal;
        if (sal.min || sal.max) {
             return `${sal.min || 0} - ${sal.max || 'Any'} ${sal.currency || ''}`;
        }
        return 'N/A';
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">User Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Section title="Personal Details">
                    <Field label="Gender" value={userInfo.gender} />
                    <Field label="Date of Birth" value={userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : 'N/A'} />
                    <Field label="Nationality" value={userInfo.nationality} />
                    <Field label="Languages" value={Array.isArray(userInfo.languages) ? userInfo.languages.join(', ') : userInfo.languages} />
                    <Field label="Current Location" value={formatLocation(userInfo.currentLocation)} />
                </Section>

                <Section title="Professional Info">
                    <Field label="Work Preference" value={userInfo.workPreference} />
                    <Field label="Employment Type" value={userInfo.employmentType} />
                    <Field label="Expected Salary" value={formatSalary(userInfo.expectedSalary)} />
                    <Field label="Notice Period" value={userInfo.noticePeriod} />
                    <Field label="Available Start Date" value={userInfo.availableStartDate ? new Date(userInfo.availableStartDate).toLocaleDateString() : 'N/A'} />
                </Section>

                <Section title="Education">
                    <Field label="Highest Education" value={userInfo.highestEducation} />
                    <Field label="Field of Study" value={userInfo.fieldOfStudy} />
                    <Field label="Graduation Year" value={userInfo.graduationYear} />
                </Section>

                <Section title="Preferences & Status">
                    <Field label="Willing to Relocate" value={userInfo.willingToRelocate ? 'Yes' : 'No'} />
                    <Field label="Willing to Travel" value={userInfo.willingToTravel ? 'Yes' : 'No'} />
                    <Field label="Work Authorization" value={userInfo.workAuthorization} />
                    <Field label="Visa Status" value={userInfo.visaStatus} />
                    <Field label="Requires Sponsorship" value={userInfo.requiresSponsorship ? 'Yes' : 'No'} />
                </Section>

                <Section title="Links">
                    <LinkField label="LinkedIn" value={userInfo.linkedInUrl} />
                    <LinkField label="GitHub" value={userInfo.githubUrl} />
                    <LinkField label="Portfolio" value={userInfo.portfolioUrl} />
                    <LinkField label="Personal Website" value={userInfo.personalWebsite} />
                </Section>
                
                 <Section title="Job Interests">
                     <div className="flex flex-wrap gap-2">
                        {userInfo.jobInterests && Array.isArray(userInfo.jobInterests) ? (
                            userInfo.jobInterests.map((interest: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {interest}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">None listed</span>
                        )}
                    </div>
                </Section>

                <Section title="Other">
                     <Field label="Hobbies" value={userInfo.hobbies} />
                     <Field label="Achievements" value={userInfo.achievements} />
                     <Field label="Additional Info" value={userInfo.additionalInformation} />
                </Section>
            </div>
        </div>
    );
};

export default UserInfoComponent;