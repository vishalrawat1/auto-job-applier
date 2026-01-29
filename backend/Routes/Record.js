import express from "express";
const router = express.Router();
import { getinfo, postinfo } from "../contorllers/Admincontroller.js";

router.route('/getinfo').get(getinfo)
router.route('/signup').post(postinfo)
router.route('/fillinfo').post(postinfo)
export default router;
        