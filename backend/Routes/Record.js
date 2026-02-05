import express from "express";
const router = express.Router();
import { getinfo, postinfo, login, updatebasicinfo } from "../contorllers/admincontroller.js";

router.route('/getinfo').get(getinfo)
router.route('/signup').post(postinfo)
router.route('/login').post(login)
router.route('/fillinfo').post(postinfo)
router.route('/updatebasicinfo').patch(updatebasicinfo)
export default router;
        