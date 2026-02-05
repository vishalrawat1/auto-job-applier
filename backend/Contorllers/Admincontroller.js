import AdminModel from "../model/adminmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getinfo = async (req, res) => {
  try {
    const admins = await AdminModel.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await AdminModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user info (excluding password)
    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location
    };

    return res.status(200).json({
      message: "Login successful",
      user: userInfo
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postinfo = async (req, res) => {
  try {
    const { name, email, phone, location, password } = req.body;

    if (
      !name || !email || !phone || !location || !password ||
      name.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      location.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const exists = await AdminModel.findOne({ email });
    if (exists) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new AdminModel({
      name,
      email,
      phone,
      location,
      password: hashedPassword
    });

    await admin.save();

    return res.status(201).json({
      message: "Admin added successfully",
      admin
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
const updatebasicinfo = async (req, res) => {
  try {
    const { name, email, phone, location, password ,basicinfo } = req.body;
    //seting basicfor true onyl by calling patch as of now 
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }
    admin.basicinfo = true;
    await admin.save();
    return res.status(200).json({
      message: "Basic info updated successfully",
      admin
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export { getinfo, postinfo, login , updatebasicinfo }
