import express from "express";
const router = express.Router();
import { getinfo, postinfo } from "../contorllers/Admincontroller.js";

router.route('/getinfo').get(getinfo)
router.route

router.route('/fillinfo').post(postinfo)
export default router;
        