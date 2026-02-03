import mongoose from "mongoose";

const basicinfo = {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:false,
        unique:false
    },    
    
    hobbies: {
        type: String,
        required: false
    },

    achievements: {
        type: String,
        required: false
    },

    isArmyVeteran: {
        type: Boolean,
        required: false
    },

    isPhysicallyDisabled: {
        type: Boolean,
        required: false
    },

    disabilityDetails: {
        type: String,
        required: function () {
            return this.isPhysicallyDisabled === true;
        }
    },

    gender: {
        type: String,
        required: false,
        enum: ["Male", "Female", "Other", "Prefer not to say"]
    },

    nationality: {
        type: String,
        required: true
    },

    workAuthorization: {
        type: String,
        required: true
    },

    willingToRelocate: {
        type: Boolean,
        required: false
    },

    criminalRecord: {
        type: Boolean,
        required: false
    },

    additionalInformation: {
        type: String,
        required: false
    }
};

const Basicinfo = mongoose.model("basicinfo" , basicinfo);
export default Basicinfo;

