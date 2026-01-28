import { defaultMaxListeners } from "node:events";
import Basicinfo from "../Model/Basicinfo";
// getqna , postqna , updateqna , deleteqna

const postqna = async(req , res)=>{
    try{
        const {hobbies , achievements , isArmyVeteran , isPhysicallyDisabled , disabilityDetails , gender , nationality , workAuthorization , willingToRelocate , criminalRecord , additionalInformation} = req.body;
        if(!disabilityDetails || !nationality || !workAuthorization){
            return res.status(400).json({message:"all fields are required"});
        }
        const basicinfo = new Basicinfo({
            hobbies,
            achievements,
            isArmyVeteran,
            isPhysicallyDisabled,
            disabilityDetails,
            gender,
            nationality,
            workAuthorization,
            willingToRelocate,
            criminalRecord,
            additionalInformation
        });
        await basicinfo.save();
        res.send("hello there")
        res.status(201).json({message:"Basic info saved successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
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