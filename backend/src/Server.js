import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: "./config.env" });
import router from "../routes/record.js";
import router1 from "../Routes/Qna.js"
const app = express();
app.use(express.json());
app.use(cors());
app.use('/router' , router);
app.use('/router1' ,router1)
app.get('/', (req, res) => {
    res.json({ 'message': 'hello there' });
})
app.get("/hello", (req, res) => {
    res.json({ 'message': 'hello there' });
});
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("app connected to mongoDB");
    }).catch((error) => {
        console.log("app failed to connect to mongoDB " + error);
    });

app.listen(port, () => {
    console.log(`server running on port ${port}`);
}); 
