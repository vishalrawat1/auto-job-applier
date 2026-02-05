import mongoose from "mongoose";

const BasicInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
     gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"]
    },

    dateOfBirth: {
      type: Date
    },

    nationality: {
      type: String,
      required: true
    },

    languages: [
      {
        type: String
      }
    ],
    currentLocation: {
      city: String,
      state: String,
      country: String
    },

    preferredLocations: [
      {
        city: String,
        country: String
      }
    ],

    willingToRelocate: {
      type: Boolean,
      default: false
    },

    willingToTravel: {
      type: Boolean,
      default: false
    },

    workPreference: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"]
    },

    workAuthorization: {
      type: String,
      required: true
    },

    visaStatus: {
      type: String,
      enum: ["Citizen", "PR", "H1B", "F1", "Other"]
    },

    requiresSponsorship: {
      type: Boolean,
      default: false
    },

    isArmyVeteran: {
      type: Boolean,
      default: false
    },

    criminalRecord: {
      type: Boolean,
      default: false
    },

    isPhysicallyDisabled: {
      type: Boolean,
      default: false
    },

    disabilityDetails: {
      type: String,
      required: function () {
        return this.isPhysicallyDisabled === true;
      }
    },

    highestEducation: {
      type: String,
      enum: ["High School", "Diploma", "Bachelor", "Master", "PhD"]
    },

    fieldOfStudy: {
      type: String
    },

    graduationYear: {
      type: Number
    },

    jobInterests: [
      {
        type: String
      }
    ],

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"]
    },

    expectedSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR"
      }
    },

    noticePeriod: {
      type: String,
      enum: ["Immediate", "15 days", "30 days", "60 days", "90 days"]
    },

    availableStartDate: {
      type: Date
    },

    linkedInUrl: {
      type: String
    },

    githubUrl: {
      type: String
    },

    portfolioUrl: {
      type: String
    },

    personalWebsite: {
      type: String
    },

    hobbies: {
      type: String
    },

    achievements: {
      type: String
    },

    additionalInformation: {
      type: String
    },

    dataProcessingConsent: {
      type: Boolean,
      required: true
    },

    informationAccuracyConfirmed: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const BasicInfo = mongoose.model("BasicInfo", BasicInfoSchema);
export default BasicInfo;
