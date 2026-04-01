 import { useState, useEffect } from 'react';

export interface UserInfoType {
    _id?: string;
    userId: string;
    gender?: string;
    dateOfBirth?: string;
    nationality?: string;
    languages?: string[] | string;
    currentLocation?: unknown;
    workPreference?: string;
    employmentType?: string;
    expectedSalary?: unknown;
    noticePeriod?: string;
    availableStartDate?: string;
    highestEducation?: string;
    fieldOfStudy?: string;
    graduationYear?: number;
    willingToRelocate?: boolean;
    willingToTravel?: boolean;
    workAuthorization?: string;
    visaStatus?: string;
    requiresSponsorship?: boolean;
    linkedInUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    personalWebsite?: string;
    jobInterests?: string[];
    hobbies?: string;
    achievements?: string;
    additionalInformation?: string;
}

export function useUserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
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
                const currentUserInfo = data.find((info: UserInfoType) => info.userId === userId);
                
                if (currentUserInfo) {
                    setUserInfo(currentUserInfo);
                } else {
                    setError("No detailed information found for this user.");
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userInfo, loading, error };
}
