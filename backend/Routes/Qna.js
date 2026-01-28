import express from "express";
const router1 = express.Router();
import {getqna , postqna} from "../Contorllers/Basicinfocontrols.js";

router1.route('/getqna').get(getqna);
router1.route('/postqna').post(postqna);
export default router1;