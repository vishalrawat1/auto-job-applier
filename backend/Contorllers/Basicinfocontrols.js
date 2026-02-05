import { defaultMaxListeners } from "node:events";
import Basicinfo from "../Model/Basicinfo.js";
// getqna , postqna , updateqna , deleteqna

const postqna = async (req, res) => {
    try {
        // Destructure all fields from the new schema
        const {
            userId,
            gender,
            dateOfBirth,
            nationality,
            languages,
            currentLocation,
            preferredLocations,
            willingToRelocate,
            willingToTravel,
            workPreference,
            workAuthorization,
            visaStatus,
            requiresSponsorship,
            isArmyVeteran,
            criminalRecord,
            isPhysicallyDisabled,
            disabilityDetails,
            highestEducation,
            fieldOfStudy,
            graduationYear,
            jobInterests,
            employmentType,
            expectedSalary,
            noticePeriod,
            availableStartDate,
            linkedInUrl,
            githubUrl,
            portfolioUrl,
            personalWebsite,
            hobbies,
            achievements,
            additionalInformation,
            dataProcessingConsent,
            informationAccuracyConfirmed
        } = req.body;

        // Basic validation for required fields (Mongoose will also validate)
        if (!userId || !nationality || !workAuthorization || !dataProcessingConsent || !informationAccuracyConfirmed) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const basicInfoData = {
            userId,
            gender,
            dateOfBirth,
            nationality,
            languages,
            currentLocation,
            preferredLocations,
            willingToRelocate,
            willingToTravel,
            workPreference,
            workAuthorization,
            visaStatus,
            requiresSponsorship,
            isArmyVeteran,
            criminalRecord,
            isPhysicallyDisabled,
            disabilityDetails,
            highestEducation,
            fieldOfStudy,
            graduationYear,
            jobInterests,
            employmentType,
            expectedSalary,
            noticePeriod,
            availableStartDate,
            linkedInUrl,
            githubUrl,
            portfolioUrl,
            personalWebsite,
            hobbies,
            achievements,
            additionalInformation,
            dataProcessingConsent,
            informationAccuracyConfirmed
        };

        const basicinfo = new Basicinfo(basicInfoData);
        await basicinfo.save();
        
        return res.status(201).json({ message: "Basic info saved successfully", basicinfo });
    } catch (error) {
        console.error("Error saving basic info:", error);
        return res.status(500).json({ message: error.message });
    }
}

const getqna = async (req ,res) =>{
    try {
        const basicinfo = await Basicinfo.find()
        res.send(basicinfo)
        res.status(200).json(basicinfo);
    } catch (error) {
        res.status(500).json({message:error.mes})
    }
}

export {getqna  , postqna}